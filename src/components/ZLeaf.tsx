import React from 'react';
import zLeafBlack from '../assets/z_leaf_black.png';
import zLeafGreen from '../assets/z_leaf_green.png';

interface ZLeafProps {
  color?: 'green' | 'black' | 'white';
  className?: string;
}

export function ZLeaf({ color = 'green', className = '' }: ZLeafProps) {
  // If white is needed, we take the black leaf and invert it
  const src = color === 'green' ? zLeafGreen : zLeafBlack;
  const style: React.CSSProperties = {
    display: 'inline-block',
    objectFit: 'contain',
    transform: 'scale(1.5)',
  };

  if (color === 'white') {
    style.filter = 'brightness(0) invert(1)';
  } else if (color === 'black') {
    // just use black directly
  }

  return (
    <img
      src={src}
      alt="Leaf"
      className={className}
      style={style}
    />
  );
}
