import { UploadForm } from '@/components/UploadForm';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Clapperboard, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/UserNav';

const UploadFilm = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border p-4 flex-col hidden md:flex">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <Film className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">Studio</span>
        </Link>
        <nav className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start" asChild>
            <Link to="/explore">
              <Clapperboard className="mr-2 h-4 w-4" />
              Videos
            </Link>
          </Button>
          <Button variant="ghost" className="justify-start" asChild>
            <Link to="/profile">
              <User className="mr-2 h-4 w-4" />
              Channel
            </Link>
          </Button>
          <Button variant="secondary" className="justify-start" asChild>
            <Link to="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Uploads
            </Link>
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-lg font-semibold">New Video</h1>
          <UserNav />
        </header>

        {/* Upload Form Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <UploadForm />
        </main>
      </div>
    </div>
  );
};

export default UploadFilm;