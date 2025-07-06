import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { FilmCard } from '@/components/FilmCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Film = {
  id: string;
  title: string;
  synopsis: string;
  thumbnail_url: string;
  duration_seconds: number;
  category: { name: string };
  created_at: string;
};

type Category = {
  id: string;
  name: string;
};

const Explore = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>();
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('created_at');

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name').eq('is_visible', true).order('name');
      if (data) {
        setCategories(data);
        if (data.length > 0) {
          setActiveCategoryId(data[0].id);
        }
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilms = async () => {
      if (!activeCategoryId) return;
      setLoading(true);
      
      const { data, error } = await supabase
        .from('films')
        .select('id, title, synopsis, thumbnail_url, duration_seconds, created_at, category:categories(name)')
        .eq('category_id', activeCategoryId)
        .eq('status', 'approved')
        .order(sortOrder, { ascending: false });

      if (error) {
        console.error('Error fetching films:', error);
        setFilms([]);
      } else {
        setFilms(data as any);
      }
      setLoading(false);
    };

    fetchFilms();
  }, [activeCategoryId, sortOrder]);

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-center">Explore Films</h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Browse our curated collection of short films from talented student creators around the world.
          </p>
        </div>

        {categories.length > 0 && (
          <Tabs value={activeCategoryId} onValueChange={setActiveCategoryId} className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 w-full max-w-5xl">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        )}
        
        <div className="flex justify-end my-6">
          <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Newest</SelectItem>
              <SelectItem value="views" disabled>Most Viewed (soon)</SelectItem>
              <SelectItem value="rating" disabled>Top Rated (soon)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2"><Skeleton className="h-48 w-full" /><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
              ))}
            </div>
          ) : films.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {films.map((film) => (
                <FilmCard key={film.id} film={film as any} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground mt-16 py-12 bg-card rounded-lg">
              <p className="text-lg font-semibold">No Films Found</p>
              <p>There are currently no films in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;