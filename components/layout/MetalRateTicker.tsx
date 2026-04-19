'use client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useLiveRates } from '@/hooks/use-live-rates';
interface RateItem {
  label: string;
  value: string;
  unit: string;
  change: 'up' | 'down' | 'neutral';
}

const METAL_RATES: RateItem[] = [
  { label: 'Gold 24K', value: '₹7,250', unit: '/g', change: 'up' },
  { label: 'Gold 22K', value: '₹6,645', unit: '/g', change: 'up' },
  { label: 'Gold 18K', value: '₹5,440', unit: '/g', change: 'neutral' },
  { label: 'Silver', value: '₹85', unit: '/g', change: 'down' },
  { label: 'Platinum', value: '₹3,120', unit: '/g', change: 'up' },
  { label: 'Diamond (1ct)', value: '₹38,500', unit: '', change: 'up' },
];

const SEPARATOR = '◆';

function RateEntry({ item }: { item: RateItem }) {
  const Icon =
    item.change === 'up' ? TrendingUp : item.change === 'down' ? TrendingDown : Minus;
  const changeColor =
    item.change === 'up'
      ? 'text-emerald-600'
      : item.change === 'down'
      ? 'text-red-500'
      : 'text-[#4A4A4A]';

  return (
    <span className="inline-flex items-center gap-1.5 px-5">
      <span className="text-[#4A4A4A] font-medium text-[0.68rem] tracking-wider uppercase">
        {item.label}
      </span>
      <span className="text-[#C5A059] font-semibold text-[0.7rem] tracking-wide">
        {item.value}
        <span className="text-[#8A7A60] font-normal">{item.unit}</span>
      </span>
      <Icon className={`w-2.5 h-2.5 ${changeColor}`} strokeWidth={2.5} />
    </span>
  );
}

export default function MetalRateTicker() {
  const { rates } = useLiveRates();

  const mappedRates = rates.map(rate => ({
    label: `${rate.metal} ${rate.purity || ''}`.trim(),
    value: `₹${rate.price.toLocaleString('en-IN')}`,
    unit: rate.metal.toLowerCase().includes('diamond') ? '' : '/g',
    change: rate.trend,
  }));

  const displayRates = mappedRates.length > 0 ? mappedRates : METAL_RATES;
  const items = [...displayRates, ...displayRates];

  return (
    <div
      className="w-full overflow-hidden"
      style={{ backgroundColor: '#F5F0E8', borderBottom: '1px solid #E8D5A3' }}
    >
      <div className="flex items-center h-8">
        <div
          className="hidden md:flex items-center justify-center px-4 h-full shrink-0"
          style={{
            backgroundColor: '#C5A059',
            minWidth: '120px',
          }}
        >
          <span
            className="text-white font-semibold tracking-widest uppercase"
            style={{ fontSize: '0.58rem', letterSpacing: '0.2em' }}
          >
            Live Rates
          </span>
        </div>

        <div className="overflow-hidden flex-1">
          <div className="ticker-track">
            {items.map((item, idx) => (
              <span key={idx} className="inline-flex items-center">
                <RateEntry item={item} />
                <span
                  className="text-[#C5A059] opacity-40"
                  style={{ fontSize: '0.4rem' }}
                >
                  {SEPARATOR}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
