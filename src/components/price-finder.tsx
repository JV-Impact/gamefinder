'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { findPricesAction } from '@/app/actions';
import type { Price } from '@/lib/types';
import { Loader2, Tag, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export function PriceFinder({ gameName }: { gameName: string }) {
  const [prices, setPrices] = useState<Price[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFindPrices = async () => {
    setIsLoading(true);
    setPrices(null);
    try {
      const result = await findPricesAction(gameName);
      setPrices(result.prices);
      if (result.prices.length === 0) {
        toast({
          title: 'Aucun prix trouvé',
          description: `Notre IA n'a trouvé aucun prix actuel pour ${gameName}.`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Une erreur est survenue',
        description: 'Impossible de récupérer les prix. Veuillez réessayer plus tard.',
      });
      setPrices([]); // To hide the loading state and show the 'not found' message if needed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-8 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="text-primary" />
            <span>Vérificateur de prix</span>
          </div>
          <span className="text-xs font-normal text-muted-foreground">Propulsé par Gemini 2.5 Flash</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Cliquez sur le bouton ci-dessous pour utiliser notre IA pour rechercher les meilleurs prix pour ce jeu auprès des principaux détaillants.
        </p>
        <Button onClick={handleFindPrices} disabled={isLoading} size="lg" className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recherche en cours...
            </>
          ) : (
            'Trouver les meilleurs prix'
          )}
        </Button>

        {isLoading && (
          <div className="mt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Notre IA est à la recherche...</p>
          </div>
        )}

        {prices && prices.length > 0 && (
          <div className="mt-6 animate-in fade-in-50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Détaillant</TableHead>
                  <TableHead className="text-right">Prix</TableHead>
                  <TableHead className="text-right">Lien</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prices.map((price, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{price.retailer}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price.price)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon">
                        <a href={price.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {prices && prices.length === 0 && (
          <div className="mt-6 text-center py-8 bg-muted/50 rounded-lg">
            <p className="font-semibold">Aucun prix trouvé</p>
            <p className="text-sm text-muted-foreground">Réessayez plus tard ou consultez directement vos magasins préférés.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
