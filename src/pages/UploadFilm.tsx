import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { UploadForm } from '@/components/UploadForm';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadFilm = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/login');
    }
  }, [session, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
              Upload Your Film
            </h1>
            <p className="mt-4 text-muted-foreground">
              Share your story with the world. Fill out the details below to submit your film for review.
            </p>
          </div>
          <UploadForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadFilm;