import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NoviceHistogram from '../NoviceHistogram';

const mockBuckets = [
  { id: '1', rangeLabel: '0-20%', communityProb: 0.3 },
  { id: '2', rangeLabel: '20-40%', communityProb: 0.5 },
  { id: '3', rangeLabel: '40-60%', communityProb: 0.2 },
];

describe('NoviceHistogram', () => {
  it('renders correct number of bars', () => {
    render(<NoviceHistogram buckets={mockBuckets} selected={[]} />);
    const bars = screen.getAllByRole('button');
    expect(bars).toHaveLength(mockBuckets.length);
  });

  it('applies accent color to selected bar', () => {
    render(
      <NoviceHistogram
        buckets={mockBuckets}
        selected={[{ id: '2', weight: 1 }]}
        accentColor="#ff0000"
      />
    );
    const bars = screen.getAllByRole('button');
    expect(bars[1]).toHaveAttribute('fill', '#ff0000');
  });

  it('updates mean badge position when props change', () => {
    const { rerender } = render(
      <NoviceHistogram
        buckets={mockBuckets}
        selected={[]}
      />
    );

    const meanBadge = screen.getByRole('presentation');
    const initialPosition = meanBadge.style.left;

    // Update with new probabilities
    const newBuckets = [
      { id: '1', rangeLabel: '0-20%', communityProb: 0.1 },
      { id: '2', rangeLabel: '20-40%', communityProb: 0.8 },
      { id: '3', rangeLabel: '40-60%', communityProb: 0.1 },
    ];

    rerender(
      <NoviceHistogram
        buckets={newBuckets}
        selected={[]}
      />
    );

    expect(meanBadge.style.left).not.toBe(initialPosition);
  });

  it('handles hover events', () => {
    const onHover = jest.fn();
    render(
      <NoviceHistogram
        buckets={mockBuckets}
        selected={[]}
        onHover={onHover}
      />
    );

    const bars = screen.getAllByRole('button');
    fireEvent.mouseEnter(bars[1]);
    expect(onHover).toHaveBeenCalledWith('2');

    fireEvent.mouseLeave(bars[1]);
    expect(onHover).toHaveBeenCalledWith(null);
  });
}); 