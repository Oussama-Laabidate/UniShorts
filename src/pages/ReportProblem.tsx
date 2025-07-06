import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showSuccess, showError } from '@/utils/toast';

const ReportProblem = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      const fetchProfile = async () => {
        const { data } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();
        if (data) {
          setName(`${data.first_name} ${data.last_name}`);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType || !description) {
      showError('Please select a report type and provide a description.');
      return;
    }
    setLoading(true);
    // Simulate API call to submit the report
    setTimeout(() => {
      setLoading(false);
      showSuccess('Your report has been submitted. Our team will review it shortly.');
      // Reset form
      setReportType('');
      setDescription('');
      setLink('');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Header />
      <main className="flex-1 container py-12 md:py-24">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Report a Problem</CardTitle>
              <CardDescription>
                Help us improve by reporting bugs, inappropriate content, or other issues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Type of Issue</Label>
                  <Select onValueChange={setReportType} value={reportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select the type of issue..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="content-issue">Inappropriate Content</SelectItem>
                      <SelectItem value="harassment">Harassment or Abuse</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide as much detail as possible..."
                    required
                    className="min-h-[150px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link to Content (optional)</Label>
                  <Input
                    id="link"
                    type="url"
                    placeholder="https://..."
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Upload Screenshot (optional)</Label>
                  <Input id="screenshot" type="file" />
                  <p className="text-xs text-muted-foreground">
                    A screenshot can help us understand the issue better.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!!user} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!user} />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Report'}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-6">
                Our team will review your report and may contact you via email if more information is needed. We aim to respond within 48 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportProblem;