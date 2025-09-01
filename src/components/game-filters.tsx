
'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Platform } from '@/lib/types';

interface GameFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedPlatform: string;
    setSelectedPlatform: (platform: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    platforms: Platform[];
}

export function GameFilters({
    searchQuery,
    setSearchQuery,
    selectedPlatform,
    setSelectedPlatform,
    sortBy,
    setSortBy,
    platforms,
}: GameFiltersProps) {
    return (
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-end" suppressHydrationWarning>
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 bottom-3 h-5 w-5 text-muted-foreground" />
            <Input
              id="search-game"
              type="search"
              placeholder="Rechercher un jeu..."
              className="pl-10 h-12 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Label htmlFor="platform-select" className="mb-2 block text-sm font-medium text-muted-foreground">PLATEFORME</Label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger id="platform-select" className="w-full h-12 text-lg">
                <SelectValue placeholder="Filtrer par plateforme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes plateformes</SelectItem>
                {platforms.map(platform => (
                  <SelectItem key={platform.id} value={platform.name}>
                    {platform.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-[240px]">
            <Label htmlFor="sort-by-select" className="mb-2 block text-sm font-medium text-muted-foreground">TRIER PAR</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort-by-select" className="w-full h-12 text-lg">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="total_rating_count desc">Popularité</SelectItem>
                  <SelectItem value="first_release_date desc">Date de sortie (plus récent)</SelectItem>
                  <SelectItem value="first_release_date asc">Date de sortie (plus ancien)</SelectItem>
                  <SelectItem value="name asc">Nom (A-Z)</SelectItem>
                  <SelectItem value="name desc">Nom (Z-A)</SelectItem>
                  <SelectItem value="total_rating desc">Note (plus élevée)</SelectItem>
                  <SelectItem value="total_rating asc">Note (plus basse)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
    )
}
