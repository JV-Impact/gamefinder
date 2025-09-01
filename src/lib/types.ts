export type PlatformName = 
  | 'PC'
  | 'PlayStation'
  | 'Xbox'
  | 'Nintendo Switch'
  | 'macOS';

export type Platform = {
  id: number;
  name: string;
};

export type GameImage = {
  id: number;
  url: string;
}

export type Game = {
  id: number;
  name: string;
  description: string;
  coverUrl: string;
  platforms: Platform[];
  rating: number;
  screenshots: GameImage[];
};

export type Price = {
  retailer: string;
  price: number;
  url: string;
};
