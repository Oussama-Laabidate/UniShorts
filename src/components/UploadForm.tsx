import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

type Category = {
  id: string;
  name: string;
};

export const UploadForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [duration, setDuration] = useState('');
  const [language, setLanguage] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [tags, setTags] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('id, name');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !videoFile || !thumbnailFile) {
      showError('Please fill out all fields and select both a video and thumbnail file.');
      return;
    }

    setLoading(true);
    const toastId = showLoading('Starting upload...');

    try {
      // 1. Upload thumbnail
      const thumbExt = thumbnailFile.name.split('.').pop();
      const thumbPath = `${user.id}/${Date.now()}.${thumbExt}`;
      const { error: thumbError } = await supabase.storage.from('film-thumbnails').upload(thumbPath, thumbnailFile);
      if (thumbError) throw new Error(`Thumbnail upload failed: ${thumbError.message}`);
      const { data: { publicUrl: thumbnailUrl } } = supabase.storage.from('film-thumbnails').getPublicUrl(thumbPath);
      
      dismissToast(toastId);
      showLoading('Uploading video file...');

      // 2. Upload video
      const videoExt = videoFile.name.split('.').pop();
      const videoPath = `${user.id}/${Date.now()}.${videoExt}`;
      const { error: videoError } = await supabase.storage.from('film-videos').upload(videoPath, videoFile);
      if (videoError) throw new Error(`Video upload failed: ${videoError.message}`);
      const { data: { publicUrl: videoUrl } } = supabase.storage.from('film-videos').getPublicUrl(videoPath);

      dismissToast(toastId);
      showLoading('Saving film details...');

      // 3. Insert into database
      const { error: dbError } = await supabase.from('films').insert({
        title,
        synopsis,
        category_id: categoryId,
        duration_seconds: parseInt(duration, 10) * 60,
        language,
        release_date: releaseDate,
        tags: tags.split(',').map(tag => tag.trim()),
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        director_id: user.id, // إعادة إضافة director_id هنا
        status: 'pending',
      });

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      dismissToast(toastId);
      showSuccess('Film submitted successfully! It is now pending review.');
      navigate('/profile');

    } catch (error: any) {
      dismissToast(toastId);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleUpload} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">Film Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="synopsis">Synopsis</Label>
            <Textarea id="synopsis" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={setCategoryId} required>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (in minutes)</Label>
              <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" value={language} onChange={(e) => setLanguage(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="release-date">Release Date</Label>
              <Input id="release-date" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., sci-fi, student film, drama" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image</Label>
              <Input id="thumbnail" type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video">Video File</Label>
              <Input id="video" type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} required />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Film for Review'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};