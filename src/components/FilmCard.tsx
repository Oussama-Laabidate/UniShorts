import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

type Film = {
  id: string;
  title: string;
  synopsis: string;
  thumbnail_url: string;
  duration_seconds: number;
  category: { name: string };
};

const formatDuration = (seconds: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
};

export const FilmCard = ({ film }: { film: Film }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <Link to={`/films/${film.id}`} className="block">
        <div className="aspect-video bg-muted">
          <img
            src={film.thumbnail_url || 'https://placehold.co/600x400?text=No+Image'}
            alt={film.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <CardHeader>
        <CardTitle className="truncate text-lg">{film.title}</CardTitle>
        {film.category && <Badge variant="outline" className="w-fit">{film.category.name}</Badge>}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {film.synopsis || "No synopsis available."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-auto pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(film.duration_seconds)}</span>
        </div>
        <Button asChild size="sm">
          <Link to={`/films/${film.id}`}>Watch</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};