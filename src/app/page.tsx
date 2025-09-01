
'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import { Gamepad } from 'lucide-react';
import { GameCard, GameCardSkeleton } from '@/components/game-card';
import { getGames, getPlatforms } from '@/lib/igdb-api';
import type { Game, Platform } from '@/lib/types';
import { useDebounce } from '@/hooks/use-debounce';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import dynamic from 'next/dynamic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GameFilters = dynamic(() => import('@/components/game-filters').then(mod => mod.GameFilters), {
  ssr: false,
  loading: () => <div className="h-[88px] w-full" suppressHydrationWarning></div>
});


export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('total_rating_count desc');
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage, setGamesPerPage] = useState(100);
  const [totalGames, setTotalGames] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isPending, startTransition] = useTransition();

  const loadGames = useCallback(() => {
    setIsLoading(true);
    startTransition(async () => {
        const { games: newGames, totalCount } = await getGames({
            search: debouncedSearchQuery,
            platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
            page: currentPage,
            limit: gamesPerPage,
            sortBy: sortBy,
        });
        setGames(newGames);
        setTotalGames(totalCount);
        setIsLoading(false);
    });
  }, [debouncedSearchQuery, selectedPlatform, currentPage, gamesPerPage, sortBy]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      const platformsData = await getPlatforms();
      setPlatforms(platformsData);
    };
    fetchPlatforms();
  }, []);
  
  useEffect(() => {
    loadGames();
  }, [loadGames]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedPlatform, gamesPerPage, sortBy]);

  const totalPages = Math.ceil(totalGames / gamesPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    if (currentPage - halfMaxPages < 1) {
        endPage = Math.min(totalPages, endPage + (halfMaxPages - (currentPage - 1)));
    }
    if (currentPage + halfMaxPages > totalPages) {
        startPage = Math.max(1, startPage - (currentPage + halfMaxPages - totalPages));
    }

    if (startPage > 1) {
        pageNumbers.push(
            <PaginationItem key="1">
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>1</PaginationLink>
            </PaginationItem>
        );
        if (startPage > 2) {
            pageNumbers.push(<PaginationItem key="start-ellipsis"><PaginationEllipsis /></PaginationItem>);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <PaginationItem key={i}>
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i); }} isActive={i === currentPage}>
                    {i}
                </PaginationLink>
            </PaginationItem>
        );
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push(<PaginationItem key="end-ellipsis"><PaginationEllipsis /></PaginationItem>);
        }
        pageNumbers.push(
            <PaginationItem key={totalPages}>
                <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}>{totalPages}</PaginationLink>
            </PaginationItem>
        );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="py-6 px-4 sm:px-6 md:px-8 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">GameFinder</h1>
          </Link>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 sm:px-6 md:px-8 py-8">
        <GameFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedPlatform={selectedPlatform}
          setSelectedPlatform={setSelectedPlatform}
          sortBy={sortBy}
          setSortBy={setSortBy}
          platforms={platforms}
        />
        
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6">
             {Array.from({ length: 20 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {games.map(game => (
                <GameCard key={game.id} game={game} />
            ))}
            </div>
        )}

        {!isLoading && games.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-2">Aucun jeu trouvé</h2>
            <p className="text-muted-foreground">Essayez d'ajuster votre recherche ou vos filtres.</p>
          </div>
        )}
      </main>

      {!isLoading && totalPages > 1 && (
        <footer className="py-6 px-4 sm:px-6 md:px-8 border-t">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Jeux par page:</span>
              <Select value={String(gamesPerPage)} onValueChange={(value) => setGamesPerPage(Number(value))}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} />
                </PaginationItem>
                {renderPagination()}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} sur {totalPages} ({totalGames} jeux)
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
