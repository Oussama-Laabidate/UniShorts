import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';

type SettingsData = {
  language: string;
  notifications_new_film: boolean;
  notifications_comment_replies: boolean;
  notifications_platform_announcements: boolean;
  profile_public: boolean;
  allow_comments: boolean;
};

const settingLabels: Record<string, string> = {
  language: 'Language preference',
  notifications_new_film: 'New film notifications',
  notifications_comment_replies: 'Comment reply notifications',
  notifications_platform_announcements: 'Platform announcements',
  profile_public: 'Profile visibility',
  allow_comments: 'Comment permissions',
};

const Settings = () => {
  const { user, session, signOut, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Partial<SettingsData>>({});
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchSettings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('language, notifications_new_film, notifications_comment_replies, notifications_platform_announcements, profile_public, allow_comments')
      .eq('id', user.id)
      .single();

    if (error) {
      showError('Failed to load settings.');
    } else if (data) {
      setSettings(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      fetchSettings();
    }
  }, [user, authLoading, navigate, fetchSettings]);

  const handleSettingChange = async (update: Partial<SettingsData>) => {
    if (!user) return;

    const key = Object.keys(update)[0];
    const settingName = settingLabels[key] || 'Setting';
    const toastId = showLoading('Saving...');

    setSettings(s => ({ ...s, ...update }));

    const { error } = await supabase.from('profiles').update(update).eq('id', user.id);
    
    dismissToast(toastId);

    if (error) {
      showError(`Failed to update ${settingName.toLowerCase()}.`);
      fetchSettings(); // Revert UI on error
    } else {
      showSuccess(`${settingName} updated.`);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail) return;
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) showError(error.message);
    else showSuccess('Confirmation email sent to your new address.');
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }
    if (!newPassword) {
      showError('Password cannot be empty.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) showError(error.message);
    else showSuccess('Password updated successfully.');
  };

  const handleDeleteAccount = async () => {
    if (!session) return;
    try {
      const response = await supabase.functions.invoke('delete-user', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (response.error) throw response.error;
      showSuccess('Account deleted successfully.');
      await signOut();
      navigate('/');
    } catch (error: any) {
      showError(`Failed to delete account: ${error.message}`);
    }
  };

  if (loading || authLoading) return <SkeletonLayout />;

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          
          <Card>
            <CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Customize the look and feel of the platform.</CardDescription></CardHeader>
            <CardContent>
              <RadioGroup value={theme} onValueChange={setTheme} className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="light" id="theme-light" /><Label htmlFor="theme-light">Light</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="dark" id="theme-dark" /><Label htmlFor="theme-dark">Dark</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="system" id="theme-system" /><Label htmlFor="theme-system">System</Label></div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Language</CardTitle><CardDescription>Choose your preferred language.</CardDescription></CardHeader>
            <CardContent>
              <RadioGroup value={settings.language} onValueChange={(value) => handleSettingChange({ language: value })} className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="en" id="lang-en" /><Label htmlFor="lang-en">English</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="fr" id="lang-fr" /><Label htmlFor="lang-fr">French</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="ar" id="lang-ar" /><Label htmlFor="lang-ar">Arabic</Label></div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Manage how you receive notifications.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between"><Label htmlFor="notif-new-film">New film uploads</Label><Switch id="notif-new-film" checked={settings.notifications_new_film} onCheckedChange={(c) => handleSettingChange({ notifications_new_film: c })} /></div>
              <div className="flex items-center justify-between"><Label htmlFor="notif-replies">Replies to comments</Label><Switch id="notif-replies" checked={settings.notifications_comment_replies} onCheckedChange={(c) => handleSettingChange({ notifications_comment_replies: c })} /></div>
              <div className="flex items-center justify-between"><Label htmlFor="notif-announcements">Platform announcements</Label><Switch id="notif-announcements" checked={settings.notifications_platform_announcements} onCheckedChange={(c) => handleSettingChange({ notifications_platform_announcements: c })} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Privacy Control</CardTitle><CardDescription>Manage your account's privacy.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between"><Label htmlFor="privacy-public-profile">Public Profile</Label><Switch id="privacy-public-profile" checked={settings.profile_public} onCheckedChange={(c) => handleSettingChange({ profile_public: c })} /></div>
              <div className="flex items-center justify-between"><Label htmlFor="privacy-allow-comments">Allow comments on my films</Label><Switch id="privacy-allow-comments" checked={settings.allow_comments} onCheckedChange={(c) => handleSettingChange({ allow_comments: c })} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Account Management</CardTitle><CardDescription>Update your account details.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2"><Label htmlFor="email">Change Email</Label><div className="flex gap-2"><Input id="email" type="email" placeholder="New email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /><Button onClick={handleUpdateEmail}>Update Email</Button></div></div>
              <div className="space-y-2"><Label>Change Password</Label><div className="flex gap-2"><Input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /><Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div><Button onClick={handleUpdatePassword} className="mt-2">Update Password</Button></div>
              <div className="space-y-2"><Label>Delete Account</Label>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="destructive">Delete Account</Button></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const SkeletonLayout = () => (
  <div className="flex flex-col min-h-dvh">
    <Header />
    <main className="flex-1 container py-8 md:py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <Skeleton className="h-8 w-48" />
        <Card><CardHeader><Skeleton className="h-6 w-32" /><Skeleton className="h-4 w-full mt-2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-32" /><Skeleton className="h-4 w-full mt-2" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></CardContent></Card>
      </div>
    </main>
    <Footer />
  </div>
);

export default Settings;