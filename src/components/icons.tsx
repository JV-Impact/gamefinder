import type { LucideProps } from 'lucide-react';
import { Gamepad2, PcCase, Apple, Smartphone } from 'lucide-react';
import type { PlatformName } from '@/lib/types';

export const platformIcons: { [key in PlatformName]: React.ElementType<LucideProps> } = {
  'PC': PcCase,
  'PlayStation': Gamepad2,
  'Xbox': Gamepad2,
  'Nintendo Switch': Smartphone, // Using Smartphone as a stand-in for Switch
  'macOS': Apple,
};

export function PlatformIcon({ platform, ...props }: { platform: PlatformName } & LucideProps) {
  const Icon = platformIcons[platform] || Gamepad2;
  return <Icon {...props} />;
}
