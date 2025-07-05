import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { showSuccess, showError } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';

type SettingsData = {
  language: string;
  notifications_new_film: boolean;
  notifications_comment_replies: boolean;
  notifications_platform_announcements: boolean;
};

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Partial<SettingsData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('language, notifications_new_film, notifications_comment_replies, notifications_platform_announcements')
        .eq('id', user.id)
        .single();

      if (error) {
        showError('Failed to load settings.');
        console.error(error);
      } else if (data) {
        setSettings(data);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update(settings)
      .eq('id', user.id);

    if (error) {
      showError('Failed to save settings.');
    } else {
      showSuccess('Settings saved successfully!');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-dvh">
        <Header />
        <main className="flex-1 container py-8 md:py-12">
          <div className="mx-auto max-w-3xl space-y-8">
            <Skeleton className="h-8 w-48" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>Choose your preferred language for the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.language}
                onValueChange={(value) => setSettings(s => ({ ...s, language: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="lang-en" />
                  <Label htmlFor="lang-en">English</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fr" id="lang-fr" />
                  <Label htmlFor="lang-fr">French</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ar" id="lang-ar" />
                  <Label htmlFor="lang-ar">Arabic</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage how you receive notifications from us.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-new-film" className="flex-1">New film uploads</Label>
                <Switch
                  id="notif-new-film"
                  checked={settings.notifications_new_film}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, notifications_new_film: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-replies" className="flex-1">Replies to comments</Label>
                <Switch
                  id="notif-replies"
                  checked={settings.notifications_comment_replies}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, notifications_comment_replies: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-announcements" className="flex-1">Platform announcements</Label>
                <Switch
                  id="notif-announcements"
                  checked={settings.notifications_platform_announcements}
                  onCheckedChange={(checked) => setSettings(s => ({ ...s, notifications_platform_announcements: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;