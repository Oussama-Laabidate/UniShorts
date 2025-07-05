import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { showError, showSuccess } from '@/utils/toast';

type Profile = {
  first_name: string;
  last_name: string;
  bio: string;
  field_of_study: string;
  profile_picture_url: string;
};

interface EditProfileDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  profile: Profile;
  onProfileUpdate: () => void;
}

export const EditProfileDialog = ({ isOpen, setIsOpen, profile, onProfileUpdate }: EditProfileDialogProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(profile);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);

    // Update password if provided
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        showError('Passwords do not match.');
        setLoading(false);
        return;
      }
      const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });
      if (passwordError) {
        showError(`Password update failed: ${passwordError.message}`);
        setLoading(false);
        return;
      }
      showSuccess('Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
    }

    // Upload profile picture if selected
    let newProfilePictureUrl = formData.profile_picture_url;
    if (profileImageFile) {
      const fileExt = profileImageFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, profileImageFile);

      if (uploadError) {
        showError(`Upload failed: ${uploadError.message}`);
        setLoading(false);
        return;
      }
      
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(uploadData.path);
      newProfilePictureUrl = urlData.publicUrl;
    }

    // Update profile information
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ ...formData, profile_picture_url: newProfilePictureUrl })
      .eq('id', user.id);

    if (profileError) {
      showError(`Profile update failed: ${profileError.message}`);
    } else {
      showSuccess('Profile updated successfully!');
      onProfileUpdate();
      setIsOpen(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile-picture" className="text-right">
              Picture
            </Label>
            <Input id="profile-picture" type="file" onChange={handleFileChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="first_name" className="text-right">
              First Name
            </Label>
            <Input id="first_name" value={formData.first_name} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="last_name" className="text-right">
              Last Name
            </Label>
            <Input id="last_name" value={formData.last_name} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="field_of_study" className="text-right">
              Field of Study
            </Label>
            <Input id="field_of_study" value={formData.field_of_study} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Bio
            </Label>
            <Textarea id="bio" value={formData.bio} onChange={handleInputChange} className="col-span-3" />
          </div>
          <hr className="my-2" />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              New Password
            </Label>
            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">
              Confirm
            </Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};