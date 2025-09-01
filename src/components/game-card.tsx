import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlatformIcon } from '@/components/icons';
import type { Game } from '@/lib/types';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="aspect-[3/4] relative">
            <Image
              src={game.coverUrl}
              alt={game.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              data-ai-hint="game cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg leading-tight truncate">{game.name}</CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            {game.platforms?.slice(0, 3).map(p => (
              <PlatformIcon key={p.id} platform={p.name as any} className="h-4 w-4" />
            ))}
          </div>
          <Badge variant="secondary">{game.rating.toFixed(0)}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[3/4] rounded-lg" />
      <Skeleton className="h-6 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  );
}
