import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGameDetails } from '@/lib/igdb-api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/icons';
import { ArrowLeft, Star } from 'lucide-react';
import { PriceFinder } from '@/components/price-finder';

type GameDetailPageProps = {
  params: { id: string };
};

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const gameId = parseInt(params.id, 10);
  const game = await getGameDetails(gameId);

  if (!game) {
    notFound();
  }

  return (
    <div className="animate-in fade-in-50 duration-500">
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <Image
          src={game.screenshots[0].url}
          alt={`Capture d'écran de ${game.name}`}
          fill
          className="object-cover"
          priority
          data-ai-hint="gameplay screenshot"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <Button asChild variant="secondary" size="sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux jeux
            </Link>
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 md:px-8 pb-16 -mt-32 md:-mt-48 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <aside className="md:col-span-1 lg:col-span-1">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden shadow-2xl shadow-primary/20">
              <Image
                src={game.coverUrl}
                alt={game.name}
                fill
                className="object-cover"
                data-ai-hint="game cover"
              />
            </div>
          </aside>

          <div className="md:col-span-2 lg:col-span-3">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-2">{game.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-lg">{game.rating.toFixed(0)}</span>
                <span className="text-muted-foreground text-sm">/ 100 (Metascore)</span>
              </div>
              <div className="flex items-center gap-x-3">
                {game.platforms.map(platform => (
                  <div key={platform.id} className="flex items-center gap-2 text-muted-foreground" title={platform.name}>
                    <PlatformIcon platform={platform.name as any} className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">
              {game.description}
            </p>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Captures d'écran</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {game.screenshots.map((ss) => (
                        <div key={ss.id} className="aspect-video relative rounded-md overflow-hidden">
                            <Image src={ss.url} alt={`Capture d'écran`} fill className="object-cover"/>
                        </div>
                    ))}
                </div>
            </div>

            <PriceFinder gameName={game.name} />
          </div>
        </div>
      </main>
    </div>
  );
}
