import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (session) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-dvh bg-background">
      <div className="mx-auto max-w-sm w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">
            Welcome back. Sign in to continue.
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            extend: false,
            className: {
              container: 'space-y-4',
              button: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md py-2 px-4 text-sm font-semibold w-full',
              input: 'bg-input rounded-md px-3 py-2 text-sm w-full',
              label: 'text-sm font-medium text-muted-foreground',
              anchor: 'text-sm text-primary hover:underline',
              message: 'text-sm text-destructive',
            }
          }}
          providers={[]}
          view="sign_in"
        />
      </div>
    </div>
  );
};

export default Login;