import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Outlet, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const AdminLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const checkAdminRole = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || data?.role !== 'admin') {
        navigate('/'); // Redirect non-admins to the homepage
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    };

    checkAdminRole();
  }, [user, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-1/4 mb-8" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return isAdmin ? <Outlet /> : null;
};

export default AdminLayout;