import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatCard } from '../../components/admin/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Film, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: undefined,
    films: undefined,
    comments: undefined,
    pendingFilms: undefined,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: films } = await supabase.from('films').select('*', { count: 'exact', head: true });
      const { count: comments } = await supabase.from('comments').select('*', { count: 'exact', head: true });
      const { count: pendingFilms } = await supabase.from('films').select('*', { count: 'exact', head: true }).eq('status', 'pending');
      
      setStats({
        users: users ?? 0,
        films: films ?? 0,
        comments: comments ?? 0,
        pendingFilms: pendingFilms ?? 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-dvh bg-secondary/40">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard title="Total Users" value={stats.users} icon={<Users className="h-4 w-4 text-muted-foreground" />} loading={loading} />
            <StatCard title="Total Films" value={stats.films} icon={<Film className="h-4 w-4 text-muted-foreground" />} loading={loading} />
            <StatCard title="Total Comments" value={stats.comments} icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} loading={loading} />
            <StatCard title="Films Awaiting Approval" value={stats.pendingFilms} icon={<Clock className="h-4 w-4 text-muted-foreground" />} loading={loading} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Shortcuts to common administrative tasks.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button asChild><Link to="/admin/films">Manage Films</Link></Button>
                  <Button asChild variant="secondary"><Link to="#">Moderate Comments</Link></Button>
                  <Button asChild variant="secondary"><Link to="/admin/users">Manage Users</Link></Button>
                  <Button asChild variant="secondary"><Link to="#">View Analytics</Link></Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>A log of recent platform events.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Recent activity feed coming soon.</p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>Visual overview of platform data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Graphs and charts coming soon.</p>
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

export default AdminDashboard;