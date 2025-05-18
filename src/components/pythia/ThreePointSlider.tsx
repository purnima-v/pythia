import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';

interface ThreePointSliderProps {
  xValues: string[];
  lowerBoundX: string | null;
  pointEstimateX: string | null;
  upperBoundX: string | null;
  onLowerBoundChange: (value: string) => void;
  onPointEstimateChange: (value: string) => void;
  onUpperBoundChange: (value: string) => void;
  mode: 'pro' | 'novice';
  predictionType: 'pdf' | 'cdf';
  // disabled?: boolean; // Consider if overall disable is needed later
}

// Define a type for the data associated with each handle
interface HandleData {
  type: 'lower' | 'point' | 'upper';
  value: string | null;
  action: (value: string) => void;
  id: string;
}

const ThreePointSlider: React.FC<ThreePointSliderProps> = ({
  xValues,
  lowerBoundX,
  pointEstimateX,
  upperBoundX,
  onLowerBoundChange,
  onPointEstimateChange,
  onUpperBoundChange,
  mode,
  predictionType,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const trackHeight = 8;
  const handleRadius = 8;
  const svgHeight = handleRadius * 2 + trackHeight * 2; // Enough space for handles above/below track
  const svgWidthRef = useRef<number>(300); // Initial width, will be updated by parent
  const margin = { top: handleRadius + 2, right: handleRadius + 5, bottom: handleRadius + 2, left: handleRadius + 5 };


  // Memoize xScale to prevent re-computation if xValues and width haven't changed
  const xScale = useMemo(() => {
    const width = svgWidthRef.current - margin.left - margin.right;
    return d3.scalePoint<string>()
      .domain(xValues)
      .range([0, width])
      .padding(0.1); // Padding so points are not exactly at the edges
  }, [xValues, margin.left, margin.right]);


  // Theming
  const trackColor = mode === 'pro' ? '#2E4A7C' : '#D1D5DB'; // poseidon-border or gray-300
  const handleStrokeColor = mode === 'pro' ? '#A5F3FC' : '#60A5FA'; // lighter cyan/blue
  const getHandleFillColor = (handleType: 'lower' | 'point' | 'upper') => {
    if (mode === 'pro') {
      if (predictionType === 'pdf' && (handleType === 'lower' || handleType === 'upper')) return '#4A6A9C'; // Muted for range in PDF
      if (predictionType === 'cdf' && handleType === 'point') return '#4A6A9C'; // Muted for point in CDF
      return '#67E8F9'; // poseidon-accent-cyan
    } else {
      if (predictionType === 'pdf' && (handleType === 'lower' || handleType === 'upper')) return '#9CA3AF'; // Muted gray for range in PDF
      if (predictionType === 'cdf' && handleType === 'point') return '#9CA3AF'; // Muted gray for point in CDF
      return '#3B82F6'; // blue-500
    }
  };

  useEffect(() => {
    if (!svgRef.current || xValues.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const parentWidth = (svgRef.current.parentNode as HTMLElement)?.clientWidth || svgWidthRef.current;
    svgWidthRef.current = parentWidth;
    
    const chartWidth = parentWidth - margin.left - margin.right;
    xScale.range([0, chartWidth]); // Update scale range with actual width

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Draw track
    g.append('line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', trackHeight / 2)
      .attr('y2', trackHeight / 2)
      .attr('stroke', trackColor)
      .attr('stroke-width', trackHeight)
      .attr('stroke-linecap', 'round');

    // Data for handles
    const handlesData: HandleData[] = [
      { type: 'lower' as const, value: lowerBoundX, action: onLowerBoundChange, id: 'handle-lower' },
      { type: 'point' as const, value: pointEstimateX, action: onPointEstimateChange, id: 'handle-point' },
      { type: 'upper' as const, value: upperBoundX, action: onUpperBoundChange, id: 'handle-upper' },
    ];

    // --- DRAG BEHAVIOR ---
    const dragBehavior = d3.drag<SVGCircleElement, HandleData, HandleData | d3.SubjectPosition>()
      .on('start', function(event: d3.D3DragEvent<SVGCircleElement, HandleData, HandleData | d3.SubjectPosition>, d: HandleData) {
        d3.select(this).raise().attr('stroke-width', 3);
      })
      .on('drag', function(event: d3.D3DragEvent<SVGCircleElement, HandleData, HandleData | d3.SubjectPosition>, d: HandleData) {
        const mouseX = event.x; // event.x is relative to the <g> element's coordinate system
        
        // Find the closest xValue to mouseX
        let closestXValue = xValues[0];
        let minDistance = Infinity;
        xValues.forEach(val => {
          const posX = xScale(val);
          if (posX === undefined) return;
          const distance = Math.abs(mouseX - posX);
          if (distance < minDistance) {
            minDistance = distance;
            closestXValue = val;
          }
        });

        // Constraint logic
        let newLower = d.type === 'lower' ? closestXValue : lowerBoundX;
        let newPoint = d.type === 'point' ? closestXValue : pointEstimateX;
        let newUpper = d.type === 'upper' ? closestXValue : upperBoundX;

        const lowerIndex = xValues.indexOf(newLower!);
        const pointIndex = xValues.indexOf(newPoint!);
        const upperIndex = xValues.indexOf(newUpper!);

        if (d.type === 'lower') {
          if (pointIndex !== -1 && lowerIndex > pointIndex) newLower = xValues[pointIndex];
          if (upperIndex !== -1 && newLower && xValues.indexOf(newLower) > upperIndex) newLower = xValues[upperIndex];
        } else if (d.type === 'point') {
          if (lowerIndex !== -1 && pointIndex < lowerIndex) newPoint = xValues[lowerIndex];
          if (upperIndex !== -1 && pointIndex > upperIndex) newPoint = xValues[upperIndex];
        } else if (d.type === 'upper') {
          if (pointIndex !== -1 && upperIndex < pointIndex) newUpper = xValues[pointIndex];
          if (lowerIndex !== -1 && newUpper && xValues.indexOf(newUpper) < lowerIndex) newUpper = xValues[lowerIndex];
        }
        
        // Call action if value changed and update position
        if (closestXValue !== d.value) {
          if (d.type === 'lower' && newLower && newLower !== lowerBoundX) d.action(newLower);
          else if (d.type === 'point' && newPoint && newPoint !== pointEstimateX) d.action(newPoint);
          else if (d.type === 'upper' && newUpper && newUpper !== upperBoundX) d.action(newUpper);
        }
         // Position is updated in the main draw anway based on props, so drag only calls action
      })
      .on('end', function(event, d) {
        d3.select(this).attr('stroke-width', 2);
        // Final update is triggered by prop change from parent
      });

    // Draw handles
    const handles = g.selectAll<SVGCircleElement, HandleData>('.slider-handle')
      .data(handlesData.filter(h => h.value !== null && xScale(h.value) !== undefined), (d: HandleData): string => d.id)
      .join('circle')
        .attr('class', 'slider-handle')
        .attr('id', d => d.id)
        .attr('cy', trackHeight / 2)
        .attr('r', handleRadius)
        .attr('stroke', handleStrokeColor)
        .attr('stroke-width', 2)
        .style('cursor', 'grab')
        .attr('fill', d => getHandleFillColor(d.type))
        .attr('cx', d => xScale(d.value!)!) // xScale(d.value!) should not be undefined due to filter
        .call(dragBehavior);


    // Add labels below handles (optional, can be styled better)
    handles.each(function(d: HandleData) {
        const currentCircle = this as SVGCircleElement;
        // Ensure parentNode exists and is an SVGGElement before selecting
        if (currentCircle.parentNode && currentCircle.parentNode instanceof SVGGElement) {
            const handleGroup = d3.select(currentCircle.parentNode as SVGGElement);
            handleGroup.append('text')
                .attr('class', 'handle-label')
                .attr('x', xScale(d.value!)!)
                .attr('y', trackHeight + handleRadius + 5) // Position below handle
                .attr('text-anchor', 'middle')
                .style('font-size', '10px')
                .style('fill', mode === 'pro' ? '#E1F5FE' : '#4B5563')
                .text(d.value);
        }
    });


  }, [xValues, lowerBoundX, pointEstimateX, upperBoundX, mode, predictionType, xScale, onLowerBoundChange, onPointEstimateChange, onUpperBoundChange, margin.left, margin.right, margin.top]); // Re-run when these change

  // Resize observer for parent width
  useEffect(() => {
    const currentSvg = svgRef.current;
    if (!currentSvg?.parentNode) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        if (newWidth > 0 && newWidth !== svgWidthRef.current) {
          svgWidthRef.current = newWidth;
          // Force a re-render if needed by updating scale or a state (not ideal, D3 usually handles this)
          // For now, the main useEffect will pick up the new svgWidthRef.current when data/props change.
          // A more robust way might involve a state variable for width if direct re-triggering is needed.
        }
      }
    });
    resizeObserver.observe(currentSvg.parentNode as Element);
    return () => resizeObserver.disconnect();
  }, []);


  return (
    <div style={{ width: '100%', userSelect: 'none' }}>
      <svg ref={svgRef} width="100%" height={svgHeight} style={{ display: 'block' }}>
        {/* D3 will render here */}
      </svg>
    </div>
  );
};

export default ThreePointSlider; 