import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileVideo, Image as ImageIcon } from 'lucide-react';

type Category = {
  id: string;
  name: string;
};

export const UploadForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form state
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [language, setLanguage] = useState('');
  
  // File state
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('id, name');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      showError("Please drop a valid video file.");
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      showError("Please select a valid video file.");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !videoFile || !thumbnailFile || !title || !categoryId || !language) {
      showError('Please fill out all required fields and select both a video and thumbnail file.');
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
      const toastId2 = showLoading('Uploading video file... This may take a while.');

      // 2. Upload video
      const videoExt = videoFile.name.split('.').pop();
      const videoPath = `${user.id}/${Date.now()}.${videoExt}`;
      const { error: videoError } = await supabase.storage.from('film-videos').upload(videoPath, videoFile);
      if (videoError) throw new Error(`Video upload failed: ${videoError.message}`);
      const { data: { publicUrl: videoUrl } } = supabase.storage.from('film-videos').getPublicUrl(videoPath);

      dismissToast(toastId2);
      const toastId3 = showLoading('Saving film details...');

      // 3. Insert into database
      const { error: dbError } = await supabase.from('films').insert({
        title,
        synopsis,
        category_id: categoryId,
        language,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        director_id: user.id,
        status: 'pending',
      });

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      dismissToast(toastId3);
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
    <form onSubmit={handleUpload}>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: File Uploads */}
        <div className="space-y-6">
          {!videoFile ? (
            <div 
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card/50 border-border hover:bg-card"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('video-upload-input')?.click()}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">MP4, WEBM, or OGG (MAX. 1GB)</p>
              </div>
              <Input id="video-upload-input" type="file" className="hidden" accept="video/*" onChange={handleVideoFileChange} />
            </div>
          ) : (
            <div className="p-4 border rounded-lg bg-card/50 border-border">
              <div className="flex items-center gap-4">
                <FileVideo className="w-10 h-10 text-primary" />
                <div>
                  <p className="font-semibold">{videoFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Thumbnail</Label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-lg bg-card border flex items-center justify-center overflow-hidden">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="object-cover w-full h-full" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <Input id="thumbnail-upload" type="file" accept="image/*" onChange={handleThumbnailChange} className="flex-1" required/>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter video title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="synopsis">Description (optional)</Label>
            <Textarea id="synopsis" placeholder="Add video description" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} className="min-h-[120px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategoryId} value={categoryId} required>
              <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select onValueChange={setLanguage} value={language} required>
              <SelectTrigger><SelectValue placeholder="Choose language" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Arabic">Arabic</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Footer/Action Bar */}
      <div className="flex justify-end items-center mt-8 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mr-4 hidden sm:block">Drafts are saved automatically.</p>
        <Button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </form>
  );
};