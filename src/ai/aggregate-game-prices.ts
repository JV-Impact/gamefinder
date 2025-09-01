'use server';

/**
 * @fileOverview A flow to aggregate game prices from major online retailers.
 *
 * - aggregateGamePrices - A function that aggregates prices for a given game.
 * - AggregateGamePricesInput - The input type for the aggregateGamePrices function.
 * - AggregateGamePricesOutput - The return type for the aggregateGamePrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AggregateGamePricesInputSchema = z.object({
  gameName: z.string().describe('Le nom du jeu pour lequel chercher les prix.'),
});
export type AggregateGamePricesInput = z.infer<typeof AggregateGamePricesInputSchema>;

const AggregateGamePricesOutputSchema = z.object({
  prices: z.array(
    z.object({
      retailer: z.string().describe('Le nom du détaillant (ex: Amazon, Steam, etc.).'),
      price: z.number().describe('Le prix du jeu en tant que nombre, sans symbole de devise.'),
      url: z.string().describe("L'URL de la page du jeu sur le site du détaillant."),
    })
  ).describe('Un tableau de prix de différents détaillants.'),
});
export type AggregateGamePricesOutput = z.infer<typeof AggregateGamePricesOutputSchema>;

export async function aggregateGamePrices(input: AggregateGamePricesInput): Promise<AggregateGamePricesOutput> {
  return aggregateGamePricesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aggregateGamePricesPrompt',
  input: {schema: AggregateGamePricesInputSchema},
  output: {schema: AggregateGamePricesOutputSchema},
  prompt: `Vous êtes un service expert d'agrégation de prix pour les jeux vidéo.
Votre tâche est de trouver le prix pour le jeu spécifié sur plusieurs grands détaillants en ligne comme Steam, Amazon, Instant Gaming, et le PlayStation Store.

Jeu: {{{gameName}}}

Veuillez retourner une liste de prix. Pour chaque détaillant, fournissez le nom du détaillant, le prix sous forme de nombre (par exemple, 59.99), et un lien direct vers la page du produit.
Si vous ne trouvez aucun prix, retournez un tableau vide.
`,
});

const aggregateGamePricesFlow = ai.defineFlow(
  {
    name: 'aggregateGamePricesFlow',
    inputSchema: AggregateGamePricesInputSchema,
    outputSchema: AggregateGamePricesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
