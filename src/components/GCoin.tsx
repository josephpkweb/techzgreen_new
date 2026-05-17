import gcoinLogo from '../assets/z_coin.png';

interface GCoinProps {
  /** Icon size in pixels — maps to both width and height */
  size?: number;
  className?: string;
}

/**
 * GCoin icon — drop-in replacement for the Star icon in all reward contexts.
 */
export function GCoinIcon({ size = 24, className = '' }: GCoinProps) {
  return (
    <img
      src={gcoinLogo}
      alt="Z Coin"
      width={size}
      height={size}
      className={className}
      style={{ display: 'inline-block', objectFit: 'contain', transform: 'scale(1.5)' }}
    />
  );
}

