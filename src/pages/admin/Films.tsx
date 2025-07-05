import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Film } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

type FilmWithDirector = {
  id: string;
  created_at: string;
  title: string;
  duration_seconds: number;
  genre: string;
  status: 'pending' | 'approved' | 'rejected';
  director: {
    first_name: string;
    last_name: string;
  } | null;
};

const Films = () => {
  const [films, setFilms] = useState<FilmWithDirector[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('films')
        .select('id, created_at, title, duration_seconds, genre, status, director:profiles(first_name, last_name)');
      
      if (error) throw error;
      setFilms(data as any);
    } catch (error: any) {
      showError(`Failed to fetch films: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const filteredFilms = useMemo(() => {
    return films
      .filter(film => statusFilter === 'all' || film.status === statusFilter)
      .filter(film => {
        const directorName = film.director ? `${film.director.first_name} ${film.director.last_name}` : '';
        return film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               directorName.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [films, searchTerm, statusFilter]);

  const updateFilmStatus = async (filmId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase.from('films').update({ status }).eq('id', filmId);
    if (error) {
      showError('Failed to update film status.');
    } else {
      showSuccess(`Film has been ${status}.`);
      fetchFilms();
    }
  };

  const deleteFilm = async (filmId: string) => {
    const { error } = await supabase.from('films').delete().eq('id', filmId);
    if (error) {
      showError('Failed to delete film.');
    } else {
      showSuccess('Film deleted successfully.');
      fetchFilms();
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    return `${Math.floor(seconds / 60)} min`;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-secondary/40">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Films</h1>
            <Button disabled><Film className="mr-2 h-4 w-4" /> Add Film</Button>
          </div>

          <div className="bg-card p-4 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-4">
              <Input
                placeholder="Search by title or director..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : filteredFilms.length > 0 ? (
                  filteredFilms.map((film) => (
                    <TableRow key={film.id}>
                      <TableCell className="font-medium">{film.title}</TableCell>
                      <TableCell>{film.director ? `${film.director.first_name} ${film.director.last_name}` : 'N/A'}</TableCell>
                      <TableCell>{film.genre}</TableCell>
                      <TableCell>{formatDuration(film.duration_seconds)}</TableCell>
                      <TableCell><Badge variant={getStatusBadgeVariant(film.status)}>{film.status}</Badge></TableCell>
                      <TableCell>{new Date(film.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateFilmStatus(film.id, 'approved')}>Approve</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateFilmStatus(film.id, 'rejected')}>Reject</DropdownMenuItem>
                            <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteFilm(film.id)} className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={7} className="text-center">No films found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Films;