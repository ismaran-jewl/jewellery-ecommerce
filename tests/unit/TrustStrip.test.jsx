import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TrustStrip from '@/components/layout/home/TrustStrip';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('TrustStrip Component', () => {
  it('renders all trust items', () => {
    render(<TrustStrip />);
    
    expect(screen.getByText('BIS Hallmarked')).toBeInTheDocument();
    expect(screen.getByText('Lifetime Exchange')).toBeInTheDocument();
    expect(screen.getByText('Insured Shipping')).toBeInTheDocument();
    expect(screen.getByText('Heritage Craft')).toBeInTheDocument();
  });

  it('renders descriptions correctly', () => {
    render(<TrustStrip />);
    
    expect(screen.getByText('100% Certified Gold')).toBeInTheDocument();
    expect(screen.getByText('Easy upgrades')).toBeInTheDocument();
  });
});
