import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

type Category = {
  id: string;
  name: string;
  description: string | null;
  is_visible: boolean;
  films: { count: number }[];
};

const CategoryDialog = ({ category, onSave, children }: { category?: Partial<Category>, onSave: () => void, children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [isVisible, setIsVisible] = useState(category?.is_visible ?? true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const upsertData = { id: category?.id, name, description, is_visible: isVisible };
    const { error } = await supabase.from('categories').upsert(upsertData);
    if (error) {
      showError(error.message);
    } else {
      showSuccess(`Category ${category?.id ? 'updated' : 'created'} successfully.`);
      onSave();
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category?.id ? 'Edit' : 'Add'} Category</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="flex items-center space-x-2"><Switch id="is_visible" checked={isVisible} onCheckedChange={setIsVisible} /><Label htmlFor="is_visible">Visible to users</Label></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*, films(count)');
    if (error) {
      showError('Failed to fetch categories.');
    } else {
      setCategories(data as any);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId);
    if (error) {
      showError('Failed to delete category. Make sure no films are using it.');
    } else {
      showSuccess('Category deleted.');
      fetchCategories();
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-secondary/40">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Categories</h1>
            <CategoryDialog onSave={fetchCategories}>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Category</Button>
            </CategoryDialog>
          </div>
          <div className="bg-card p-4 rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Films</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell></TableRow>)
                ) : categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>{cat.films[0].count}</TableCell>
                    <TableCell>{cat.is_visible ? 'Visible' : 'Hidden'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <CategoryDialog category={cat} onSave={fetchCategories}><DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem></CategoryDialog>
                          <DropdownMenuItem onClick={() => handleDelete(cat.id)} className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;