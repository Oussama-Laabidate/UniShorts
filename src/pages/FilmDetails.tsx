import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Heart, Share2, Clock } from 'lucide-react';

type Profile = {
  first_name: string;
  last_name: string;
  profile_picture_url: string;
};

type Film = {
  id: string;
  title: string;
  duration_seconds: number;
  genre: string;
  language: string;
  release_date: string;
  synopsis: string;
  tags: string[];
  video_url: string;
  thumbnail_url: string;
  director: Profile;
};

const FilmDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilm = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('films')
        .select(`
          id, title, duration_seconds, genre, language, release_date, synopsis, tags, video_url, thumbnail_url,
          director:profiles (
            first_name,
            last_name,
            profile_picture_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching film details:', error);
        setFilm(null);
      } else {
        setFilm(data as any);
      }
      setLoading(false);
    };

    fetchFilm();
  }, [id]);

  if (loading) {
    return <SkeletonLayout />;
  }

  if (!film) {
    return (
      <div className="flex flex-col min-h-dvh">
        <Header />
        <main className="flex-1 container py-12 text-center">
          <h1 className="text-3xl font-bold">Film Not Found</h1>
          <p className="text-muted-foreground mt-4">The film you are looking for does not exist or has been removed.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-black">
          <div className="container mx-auto aspect-video">
            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
              {film.video_url ? <p>Video Player Placeholder</p> : <p>Video not available.</p>}
            </div>
          </div>
        </div>

        <div className="container py-8 md:py-12">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="md:col-span-2 space-y-8">
              <h1 className="text-4xl font-bold tracking-tighter">{film.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{film.release_date ? new Date(film.release_date).getFullYear() : 'N/A'}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                <span>{formatDuration(film.duration_seconds)}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                <span>{film.genre || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-4">
                <Button><Heart className="mr-2 h-4 w-4" /> Favorite</Button>
                <Button variant="secondary"><Clock className="mr-2 h-4 w-4" /> Watch Later</Button>
                <Button variant="secondary"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-3">Synopsis</h2>
                <p className="text-muted-foreground">{film.synopsis || 'No synopsis available.'}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {film.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>

              <Card>
                <CardHeader><CardTitle>Comments</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Comments section coming soon.</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {film.director && (
                <Card>
                  <CardHeader><CardTitle>Director</CardTitle></CardHeader>
                  <CardContent className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={film.director.profile_picture_url} />
                      <AvatarFallback>{film.director.first_name?.[0]}{film.director.last_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{film.director.first_name} {film.director.last_name}</p>
                      <p className="text-sm text-muted-foreground">Institution Name</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader><CardTitle>Rating</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Star className="text-primary" />
                    <Star className="text-primary" />
                    <Star className="text-primary" />
                    <Star className="text-primary" />
                    <Star />
                    <span className="ml-2 text-muted-foreground">(Coming Soon)</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Related Films</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Related films coming soon.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const SkeletonLayout = () => (
  <div className="flex flex-col min-h-dvh">
    <Header />
    <main className="flex-1">
      <div className="bg-slate-900"><div className="container mx-auto aspect-video"><Skeleton className="w-full h-full" /></div></div>
      <div className="container py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex gap-4"><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-16" /></div>
            <div className="flex gap-4"><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-32" /></div>
            <div className="space-y-2"><Skeleton className="h-6 w-48" /><Skeleton className="h-20 w-full" /></div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default FilmDetails;