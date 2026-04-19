import MetalRateTicker from './MetalRateTicker';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-sm">
      <MetalRateTicker />
      <Navigation />
    </header>
  );
}
