import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EditProfileDialog } from '@/components/EditProfileDialog';
import { Separator } from '@/components/ui/separator';
import { User, Film, History, Star, Settings, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Profile = {
  first_name: string;
  last_name: string;
  bio: string;
  field_of_study: string;
  profile_picture_url: string;
};

const UserProfile = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile || !user) {
    return <div>Could not load profile.</div>;
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
                <TabsTrigger value="history"><History className="w-4 h-4 mr-2" />Watch History</TabsTrigger>
                <TabsTrigger value="favorites"><Star className="w-4 h-4 mr-2" />Favorites</TabsTrigger>
              </TabsList>
              <TabsContent value="films" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Films</CardTitle>
                    <CardDescription>A collection of your uploaded short films.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground py-12">
                    <p>You haven't uploaded any films yet.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                 <Card>
                  <CardHeader>
                    <CardTitle>Watch History</CardTitle>
                    <CardDescription>Films you've recently watched.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground py-12">
                    <p>Your watch history is empty.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="favorites" className="mt-6">
                 <Card>
                  <CardHeader>
                    <CardTitle>Favorites</CardTitle>
                    <CardDescription>Films you've saved to watch later.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground py-12">
                    <p>You haven't favorited any films yet.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Separator className="my-8" />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Settings className="w-5 h-5 mr-2" />Settings</CardTitle>
                <CardDescription>Manage your account settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dark mode toggle can be implemented here */}
                <Button variant="destructive" className="w-full md:w-auto">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        profile={profile}
        onProfileUpdate={fetchProfile}
      />
    </div>
  );
};

export default UserProfile;