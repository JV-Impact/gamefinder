import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'GameFinder',
  description: 'Recherchez et découvrez vos jeux préférés.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background flex flex-col" suppressHydrationWarning>
        <div className="flex-1">
          {children}
        </div>
        <Toaster />
        <footer className="py-4 px-4 sm:px-6 md:px-8 border-t mt-auto">
            <div className="container mx-auto text-center text-sm text-muted-foreground">
                Copyright©️2025 GameFinder est un service JV Impact, Tous droits réservés. Merci à IGDB pour l'API :)
            </div>
        </footer>
      </body>
    </html>
  );
}
