import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { Separator } from '@/components/ui/separator';
import { Film, Star, Clock, Settings, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { showError, showSuccess } from '@/utils/toast';
import { User as AuthUser } from '@supabase/supabase-js';

type Profile = {
  first_name: string;
  last_name: string;
  bio: string;
  field_of_study: string;
  profile_picture_url: string;
};

type Film = {
  id: string;
  title: string;
  synopsis: string;
  thumbnail_url: string;
  duration_seconds: number;
  category: { name: string };
  status: 'pending' | 'approved' | 'rejected'; // إضافة حالة الفيلم
};

type ListItem = {
  created_at: string;
  film: Film;
};

const FilmListItem = ({ item, onRemove, showMarkAsWatched }: { item: ListItem, onRemove: (filmId: string) => void, showMarkAsWatched?: boolean }) => {
  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Link to={`/films/${item.film.id}`} className="block">
          <div className="aspect-video bg-muted">
            <img src={item.film.thumbnail_url || 'https://placehold.co/600x400?text=No+Image'} alt={item.film.title} className="w-full h-full object-cover" />
          </div>
        </Link>
        <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => onRemove(item.film.id)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="truncate text-lg">{item.film.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(item.film.duration_seconds)}</span>
        </div>
        {item.film.status && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            item.film.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
            item.film.status === 'approved' ? 'bg-green-500/20 text-green-500' :
            'bg-red-500/20 text-red-500'
          }`}>
            {item.film.status.charAt(0).toUpperCase() + item.film.status.slice(1)}
          </span>
        )}
      </CardHeader>
      <CardContent>
        {showMarkAsWatched && (
          <Button variant="secondary" className="w-full" onClick={() => onRemove(item.film.id)}>
            Mark as Watched
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const FilmList = ({ user, listType }: { user: AuthUser, listType: 'favorites' | 'watch_later' | 'my_films' }) => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('created_at-desc');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const [sortField, sortDirection] = sort.split('-');
    const isAscending = sortDirection === 'asc';

    let query;
    if (listType === 'my_films') {
      query = supabase
        .from('films')
        .select('id, created_at, title, synopsis, thumbnail_url, duration_seconds, category:categories(name), status')
        .eq('director_id', user.id)
        .order(sortField, { ascending: isAscending });
    } else {
      query = supabase
        .from(listType)
        .select('created_at, film:films!inner(id, title, synopsis, thumbnail_url, duration_seconds, category:categories(name))')
        .eq('user_id', user.id);

      if (sortField.startsWith('films.')) {
        const foreignTable = sortField.split('.')[0];
        const foreignColumn = sortField.split('.')[1];
        query = query.order(foreignColumn, { foreignTable: foreignTable, ascending: isAscending });
      } else {
        query = query.order(sortField, { ascending: isAscending });
      }
    }

    const { data, error } = await query;

    if (error) {
      showError(`Failed to load ${listType.replace('_', ' ')} list.`);
      console.error(error);
    } else {
      // For 'my_films', the data structure is directly films, not nested under 'film'
      setItems(listType === 'my_films' ? data.map((film: any) => ({ created_at: film.created_at, film: film })) : data as any);
    }
    setLoading(false);
  }, [user, listType, sort]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleRemove = async (filmId: string) => {
    const { error } = await supabase
      .from(listType === 'my_films' ? 'films' : listType) // إذا كانت أفلامي، احذف من جدول الأفلام
      .delete()
      .match(listType === 'my_films' ? { id: filmId, director_id: user.id } : { user_id: user.id, film_id: filmId });

    if (error) {
      showError('Failed to remove film from list.');
    } else {
      showSuccess('Film removed from list.');
      fetchItems();
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{items.length} film{items.length !== 1 && 's'}</p>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-desc">Date Added (Newest)</SelectItem>
            <SelectItem value="created_at-asc">Date Added (Oldest)</SelectItem>
            <SelectItem value="films.duration_seconds-desc">Duration (Longest)</SelectItem>
            <SelectItem value="films.duration_seconds-asc">Duration (Shortest)</SelectItem>
            {listType !== 'my_films' && ( // إخفاء خيارات الفرز حسب الفئة لـ 'أفلامي'
              <>
                <SelectItem value="categories.name-asc">Genre (A-Z)</SelectItem>
                <SelectItem value="categories.name-desc">Genre (Z-A)</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(item => (
            <FilmListItem key={item.film.id} item={item} onRemove={handleRemove} showMarkAsWatched={listType === 'watch_later'} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12 bg-card rounded-lg">
          <p className="text-lg font-semibold">This list is empty</p>
          <p>Explore films and add some to your {listType.replace('_', ' ')} list!</p>
        </div>
      )}
    </div>
  );
};

const UserProfile = () => {
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') { // Ignore 'exact one row not found' error
        throw error;
      }
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      showError('Could not load profile.');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/login');
    } else if (session) {
      fetchProfile();
    }
  }, [session, authLoading, navigate, fetchProfile]);

  const getInitials = (firstName: string, lastName: string) => `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

  if (authLoading || loading) {
    return <SkeletonLayout />;
  }

  if (!profile || !user) {
    return (
      <div className="flex flex-col min-h-dvh bg-background">
        <Header />
        <main className="flex-1 container py-8 md:py-12 text-center">
          <h1 className="text-2xl font-bold">Could not load profile</h1>
          <p className="text-muted-foreground mt-2">There was an error fetching your profile data. This can happen if your account is new and the profile hasn't been created yet.</p>
          <Button onClick={fetchProfile} className="mt-4">Try Again</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="grid gap-10 md:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-6 items-center md:items-start">
            <Avatar className="w-32 h-32 border-4 border-primary">
              <AvatarImage src={profile.profile_picture_url} alt={`${profile.first_name} ${profile.last_name}`} />
              <AvatarFallback>{getInitials(profile.first_name, profile.last_name)}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{profile.first_name} {profile.last_name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-primary mt-1">{profile.field_of_study}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">{profile.bio}</p>
            <Button onClick={() => setIsEditDialogOpen(true)} className="w-full">Edit Profile</Button>
          </div>
          <div>
            <Tabs defaultValue="films" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="films"><Film className="w-4 h-4 mr-2" />My Films</TabsTrigger>
                <TabsTrigger value="favorites"><Star className="w-4 h-4 mr-2" />Favorites</TabsTrigger>
                <TabsTrigger value="watch_later"><Clock className="w-4 h-4 mr-2" />Watch Later</TabsTrigger>
              </TabsList>
              <TabsContent value="films" className="mt-6">
                <FilmList user={user} listType="my_films" />
              </TabsContent>
              <TabsContent value="favorites" className="mt-6"><FilmList user={user} listType="favorites" /></TabsContent>
              <TabsContent value="watch_later" className="mt-6"><FilmList user={user} listType="watch_later" /></TabsContent>
            </Tabs>
            <Separator className="my-8" />
            <Card>
              <CardHeader><CardTitle className="flex items-center"><Settings className="w-5 h-5 mr-2" />Settings</CardTitle><CardDescription>Manage your account preferences and more.</CardDescription></CardHeader>
              <CardContent><Button asChild><Link to="/settings">Go to Settings</Link></Button></CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <EditProfileDialog isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} profile={profile} onProfileUpdate={fetchProfile} />
    </div>
  );
};

const SkeletonLayout = () => (
    <div className="flex flex-col min-h-dvh bg-background">
        <Header />
        <main className="flex-1 container py-8 md:py-12">
            <div className="grid gap-10 md:grid-cols-[280px_1fr]">
                <div className="flex flex-col gap-6 items-center md:items-start">
                    <Skeleton className="w-32 h-32 rounded-full" />
                    <div className="space-y-2 text-center md:text-left">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        </main>
        <Footer />
    </div>
);

export default UserProfile;