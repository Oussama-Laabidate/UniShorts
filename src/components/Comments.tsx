import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { showError, showSuccess } from '@/utils/toast';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
  filmId: string;
}

type CommentWithProfile = {
  id: string;
  created_at: string;
  content: string;
  profiles: {
    first_name: string;
    last_name: string;
    profile_picture_url: string;
  } | null;
};

export const Comments = ({ filmId }: CommentProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithProfile[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('id, created_at, content, profiles(first_name, last_name, profile_picture_url)')
      .eq('film_id', filmId)
      .order('created_at', { ascending: false });

    if (error) {
      showError('Failed to load comments.');
    } else {
      setComments(data as any);
    }
  }, [filmId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async () => {
    if (!user || !newComment.trim()) return;
    setLoading(true);
    const { error } = await supabase
      .from('comments')
      .insert({ film_id: filmId, user_id: user.id, content: newComment.trim() });

    if (error) {
      showError('Failed to post comment.');
    } else {
      showSuccess('Comment posted!');
      setNewComment('');
      fetchComments();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {user && (
        <div className="space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handlePostComment} disabled={loading || !newComment.trim()}>
            {loading ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment.profiles?.profile_picture_url} />
              <AvatarFallback>
                {comment.profiles?.first_name?.[0]}{comment.profiles?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{comment.profiles?.first_name} {comment.profiles?.last_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </p>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="text-muted-foreground text-center py-4">Be the first to comment.</p>}
      </div>
    </div>
  );
};