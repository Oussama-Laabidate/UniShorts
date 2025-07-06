import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FilmCard } from '@/components/FilmCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Film = {
  id: string;
  title: string;
  synopsis: string;
  thumbnail_url: string;
  duration_seconds: number;
  category: { name: string };
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      // Note: Searching on category name is complex and will be added later.
      // For now, search works on title and synopsis.
      const { data, error } = await supabase
        .from('films')
        .select('id, title, synopsis, thumbnail_url, duration_seconds, category:categories(name)')
        .or(`title.ilike.%${query}%,synopsis.ilike.%${query}%`);

      if (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } else {
        setResults(data as any[]);
      }
      setLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="flex flex-col min-h-dvh">
      <Header />
      <main className="flex-1 container py-8">
        <div className="grid md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select disabled>
                    <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select disabled>
                    <SelectTrigger><SelectValue placeholder="All Languages" /></SelectTrigger>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select defaultValue="relevance" disabled>
                    <SelectTrigger><SelectValue placeholder="Relevance" /></SelectTrigger>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>
          <div className="md:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Search Results</h1>
              {query && <p className="text-muted-foreground">Showing results for "{query}"</p>}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((film) => (
                  <FilmCard key={film.id} film={film} />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground mt-16 py-12 bg-card rounded-lg">
                <p className="text-lg font-semibold">No Films Found</p>
                <p>Your search for "{query}" did not return any results. Try different keywords.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResults;