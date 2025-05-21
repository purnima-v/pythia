import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { type Mode } from './Layout'; // Assuming Mode type is exported from Layout

interface InputPoint {
  x: string | number;
  y: number;
}

interface NumericPoint {
  x: number;
  y: number;
}

export interface DistributionChartProps {
  data: InputPoint[];
  mode: Mode;
  // Old props, to be replaced or adapted
  // selectionMinX?: string | null;
  // selectionMaxX?: string | null;
  // pointEstimateX?: string | null;
  q1Value?: number | null;
  medianValue?: number | null;
  q3Value?: number | null;
  showCDF?: boolean;
  height?: number;
  meanValue?: number | null;
  stdDevValue?: number | null;
  showOutcome?: boolean;
  outcome?: number;
}

// Error function implementation
const erf = (x: number): number => {
  // Constants
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  // Save the sign of x
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  // A&S formula 7.1.26
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
};

// Normal distribution functions
const normalPDF = (x: number, mean: number, stdDev: number): number => {
  const variance = stdDev * stdDev;
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
};

const normalCDF = (x: number, mean: number, stdDev: number): number => {
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
};

// Generate points for normal distribution curve
const generateNormalCurve = (mean: number, stdDev: number, min: number, max: number, points: number = 100): NumericPoint[] => {
  const step = (max - min) / (points - 1);
  return Array.from({ length: points }, (_, i) => {
    const x = min + i * step;
    return { x, y: normalPDF(x, mean, stdDev) };
  });
};

// Add skew-normal distribution functions
const skewNormalPDF = (x: number, mean: number, stdDev: number, skew: number): number => {
  const z = (x - mean) / stdDev;
  const normal = normalPDF(x, mean, stdDev);
  const cdf = normalCDF(skew * z, 0, 1);
  return 2 * normal * cdf;
};

const DistributionChart: React.FC<DistributionChartProps> = ({
  data,
  mode,
  q1Value,
  medianValue,
  q3Value,
  showCDF = false,
  height,
  meanValue,
  stdDevValue,
  showOutcome,
  outcome,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const uniqueId = useMemo(() => "dist-chart-gradient-" + Math.random().toString(36).substr(2, 9), []);
  const normalGradientId = useMemo(() => "normal-dist-gradient-" + Math.random().toString(36).substr(2, 9), []);

  // Memoize and process data: convert x to number and sort
  const numericData = useMemo(() => {
    if (!data) return [];
    return data
      .map(d => ({ ...d, x: +d.x })) // Convert x to number
      .sort((a, b) => a.x - b.x);    // Sort by numeric x value
  }, [data]);

  // Calculate distribution parameters from Q1, Median, Q3
  const distributionParams = useMemo(() => {
    if (
      q1Value == null ||
      medianValue == null ||
      q3Value == null ||
      isNaN(q1Value) ||
      isNaN(medianValue) ||
      isNaN(q3Value)
    ) return null;

    // Calculate base parameters
    const mean = medianValue;
    const stdDev = (q3Value - q1Value) / 1.35;

    // Calculate skew based on how far Q3 is from the median compared to Q1
    const leftSpread = medianValue - q1Value;
    const rightSpread = q3Value - medianValue;
    const skew = (rightSpread - leftSpread) / (rightSpread + leftSpread);

    return { mean, stdDev, skew };
  }, [q1Value, medianValue, q3Value]);

  // Generate normal distribution curve
  const normalCurve = useMemo(() => {
    if (!meanValue || !stdDevValue || numericData.length === 0) return [];
    const min = numericData[0].x;
    const max = numericData[numericData.length - 1].x;
    const points = 100;
    const step = (max - min) / (points - 1);

    if (!showCDF) {
      return Array.from({ length: points }, (_, i) => {
        const x = min + i * step;
        const y = normalPDF(x, meanValue, stdDevValue);
        return { x, y };
      });
    } else {
      return Array.from({ length: points }, (_, i) => {
        const x = min + i * step;
        const y = normalCDF(x, meanValue, stdDevValue);
        return { x, y };
      });
    }
  }, [meanValue, stdDevValue, numericData, showCDF]);

  // Generate distribution curve
  const distributionCurve = useMemo(() => {
    if (!distributionParams || numericData.length === 0) return [];
    const min = numericData[0].x;
    const max = numericData[numericData.length - 1].x;
      const points = 100;
      const step = (max - min) / (points - 1);

    if (!showCDF) {
      return Array.from({ length: points }, (_, i) => {
        const x = min + i * step;
        const y = skewNormalPDF(x, distributionParams.mean, distributionParams.stdDev, distributionParams.skew);
        return { x, y };
      });
    } else {
      // For CDF, we'll use numerical integration of the PDF
      let runningSum = 0;
      const pdfPoints = Array.from({ length: points }, (_, i) => {
        const x = min + i * step;
        const y = skewNormalPDF(x, distributionParams.mean, distributionParams.stdDev, distributionParams.skew);
        return { x, y };
      });
      
      // Normalize the PDF
      const totalArea = pdfPoints.reduce((sum, p) => sum + p.y * step, 0);
      const normalizedPoints = pdfPoints.map(p => ({ x: p.x, y: p.y / totalArea }));
      
      // Calculate CDF
      return normalizedPoints.map((p, i) => {
        if (i === 0) return { x: p.x, y: 0 };
        runningSum += (normalizedPoints[i-1].y + p.y) * step / 2;
        return { x: p.x, y: runningSum };
      });
    }
  }, [distributionParams, numericData, showCDF]);

  // Optionally, generate market CDF curve
  const marketCDFCurve = useMemo(() => {
    if (!showCDF || numericData.length === 0) return [];
    // Compute cumulative sum of y values, normalize to 1
    let total = numericData.reduce((sum, d) => sum + d.y, 0);
    let running = 0;
    return numericData.map(d => {
      running += d.y;
      return { x: d.x, y: running / total };
    });
  }, [numericData, showCDF]);

  // Chart dimensions and padding
  const chartHeight = typeof height === 'number' ? height : 420;
  const topPadding = 20;
  const bottomPadding = 30;
  const yAxisLabelWidth = 35;
  const leftPaddingForYAxis = yAxisLabelWidth + 5;
  const rightPadding = 15;

  // Helper function to format x-axis labels based on market type
  const formatXAxisLabel = (value: number) => {
    const maxValue = Math.max(...numericData.map(d => d.x));
    const minValue = Math.min(...numericData.map(d => d.x));
    if (minValue >= 0 && maxValue <= 5 && numericData.some(d => d.x.toString().includes('.'))) {
      return `${value.toFixed(1)}°C`;
    }
    if (maxValue <= 100 && numericData.some(d => d.x <= 100)) {
      return `${value.toFixed(0)}%`;
    }
    if (maxValue >= 1000) {
      if (maxValue >= 100000) {
        return `$${(value/1000).toFixed(0)}k`;
      }
      return `$${value.toFixed(0)}`;
    }
    if (maxValue >= 5 && maxValue <= 15) {
      return `${value.toFixed(1)}B`;
    }
    return value.toFixed(1);
  };

  useEffect(() => {
    if (numericData.length === 0 || !svgRef.current) {
      if(svgRef.current) d3.select(svgRef.current).selectAll('*').remove();
      if(tooltipRef.current) d3.select(tooltipRef.current).remove();
      tooltipRef.current = null;
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    const parentWidth = (svgRef.current.parentNode as HTMLElement)?.getBoundingClientRect().width || 300;
    const chartWidth = parentWidth - leftPaddingForYAxis - rightPadding;

    // Calculate community distribution parameters
    const communityMean = d3.mean(numericData, d => d.x) ?? 0;
    const communityStdDev = (d3.deviation(numericData, d => d.x) ?? 1) * 0.4; // Reduce standard deviation to 40% of original

    // Generate community normal distribution curve
    const minX = d3.min(numericData, d => d.x) ?? 0;
    const maxX = d3.max(numericData, d => d.x) ?? 100;
    const communityCurve = showCDF 
      ? generateNormalCurve(communityMean, communityStdDev, minX, maxX).map((point, i, arr) => ({
          x: point.x,
          y: normalCDF(point.x, communityMean, communityStdDev)
        }))
      : generateNormalCurve(communityMean, communityStdDev, minX, maxX);

    // Theme colors
    const axisColor = mode === 'pro' ? '#B0C4DE' : '#A0AEC0';
    const gridColor = mode === 'pro' ? '#2D3748' : '#E2E8F0';
    const textColor = mode === 'pro' ? '#E1F5FE' : '#4A5562';
    const communityLineColor = mode === 'pro' ? '#67E8F9' : '#63B3ED';
    const userLineColor = mode === 'pro' ? '#FBBF24' : '#F59E0B';
    const communityGradientFrom = mode === 'pro' ? '#67E8F9' : '#63B3ED';
    const communityGradientTo = mode === 'pro' ? '#083344' : '#BEE3F8';
    const userGradientFrom = mode === 'pro' ? '#FBBF24' : '#F59E0B';
    const userGradientTo = mode === 'pro' ? '#92400E' : '#B45309';

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([minX, maxX])
      .range([0, chartWidth]);

    // Adjust y-axis scale based on whether we're showing PDF or CDF
    const yScale = d3.scaleLinear()
      .domain([0, showCDF ? 1 : (d3.max(communityCurve, d => d.y) ?? 1)])
      .range([chartHeight - bottomPadding - topPadding, 0]);

    const chartArea = svg.append('g')
      .attr('transform', `translate(${leftPaddingForYAxis}, ${topPadding})`);

    // Add gradients
    const defs = svg.append('defs');
    
    // Community distribution gradient
    const communityGradient = defs.append('linearGradient')
      .attr('id', uniqueId)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    communityGradient.append('stop').attr('offset', '0%').attr('stop-color', communityGradientFrom).attr('stop-opacity', 0.7);
    communityGradient.append('stop').attr('offset', '100%').attr('stop-color', communityGradientTo).attr('stop-opacity', 0.1);

    // User distribution gradient
    const userGradient = defs.append('linearGradient')
      .attr('id', normalGradientId)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    userGradient.append('stop').attr('offset', '0%').attr('stop-color', userGradientFrom).attr('stop-opacity', 0.7);
    userGradient.append('stop').attr('offset', '100%').attr('stop-color', userGradientTo).attr('stop-opacity', 0.1);

    // Line and Area generators
    const lineGenerator = d3.line<NumericPoint>()
      .x(d => xScale(d.x) ?? 0)
      .y(d => yScale(d.y) ?? 0)
      .curve(d3.curveCatmullRom.alpha(0.5));

    const areaGenerator = d3.area<NumericPoint>()
      .x(d => xScale(d.x) ?? 0)
      .y0(yScale(0) ?? 0)
      .y1(d => yScale(d.y) ?? 0)
      .curve(d3.curveCatmullRom.alpha(0.5));

    // Draw Community Distribution
      chartArea.append('path')
      .datum(communityCurve)
        .attr('fill', `url(#${uniqueId})`)
        .attr('d', areaGenerator);

        chartArea.append('path')
      .datum(communityCurve)
          .attr('fill', 'none')
      .attr('stroke', communityLineColor)
          .attr('stroke-width', 2)
          .attr('d', lineGenerator);

    // Draw User's Distribution if provided
    if (typeof meanValue === 'number' && typeof stdDevValue === 'number') {
      const userCurve = showCDF
        ? generateNormalCurve(meanValue, stdDevValue, minX, maxX).map((point, i, arr) => ({
            x: point.x,
            y: normalCDF(point.x, meanValue, stdDevValue)
          }))
        : generateNormalCurve(meanValue, stdDevValue, minX, maxX);

      // Scale the user's curve to match the community curve's height
      const maxCommunityY = d3.max(communityCurve, d => d.y) ?? 1;
      const maxUserY = d3.max(userCurve, d => d.y) ?? 1;
      const scaleFactor = maxCommunityY / maxUserY;
      
      const scaledUserCurve = userCurve.map(d => ({
        x: d.x,
        y: d.y * scaleFactor
      }));

      chartArea.append('path')
        .datum(scaledUserCurve)
        .attr('fill', `url(#${normalGradientId})`)
        .attr('d', areaGenerator);

      chartArea.append('path')
        .datum(scaledUserCurve)
        .attr('fill', 'none')
        .attr('stroke', userLineColor)
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);

      // Add mouse interaction
      svg.on('mousemove', (event) => {
        const [pointerX] = d3.pointer(event, chartArea.node());
        const mouseXValue = xScale.invert(pointerX);

        if (mouseXValue < minX || mouseXValue > maxX) {
          hoverLine.style('opacity', 0);
          hoverCircle.style('opacity', 0);
          tooltip.style('opacity', 0);
          return;
        }

        // Calculate community and user probabilities at mouse position
        const communityProb = showCDF 
          ? normalCDF(mouseXValue, communityMean, communityStdDev)
          : normalPDF(mouseXValue, communityMean, communityStdDev);
        
        let userProb = null;
        if (typeof meanValue === 'number' && typeof stdDevValue === 'number') {
          const userProbRaw = showCDF
            ? normalCDF(mouseXValue, meanValue, stdDevValue)
            : normalPDF(mouseXValue, meanValue, stdDevValue);
          
          // Scale user probability to match community curve height
          const maxCommunityY = d3.max(communityCurve, d => d.y) ?? 1;
          const maxUserY = d3.max(userCurve, d => d.y) ?? 1;
          const scaleFactor = maxCommunityY / maxUserY;
          userProb = userProbRaw * scaleFactor;
        }

        // Update hover elements
        hoverLine
          .attr('x1', pointerX)
          .attr('x2', pointerX)
          .attr('y1', yScale(0))
          .attr('y2', yScale(communityProb))
          .style('opacity', 1);

        hoverCircle
          .attr('cx', pointerX)
          .attr('cy', yScale(communityProb))
          .style('opacity', 1);

        // Update tooltip
        const tooltipWidth = 150;
        const tooltipHeight = 80;
        const padding = 5;
        
        let left = event.clientX + padding;
        let top = event.clientY - tooltipHeight - padding;
        
        if (left + tooltipWidth > window.innerWidth) {
          left = event.clientX - tooltipWidth - padding;
        }
        if (top < 0) {
          top = event.clientY + padding;
        }

        tooltip
          .style('opacity', 0.95)
          .html(`
            <div class="font-medium">${formatXAxisLabel(mouseXValue)}</div>
            <div class="text-sm mt-1">
              Community: ${formatXAxisLabel(communityMean)}
              ${userProb !== null ? `<br/>Your Prediction: ${formatXAxisLabel(meanValue)}` : ''}
            </div>
          `)
          .style('left', `${left}px`)
          .style('top', `${top}px`)
          .style('position', 'fixed');
      }).on('mouseleave', () => {
        hoverLine.style('opacity', 0);
        hoverCircle.style('opacity', 0);
        tooltip.style('opacity', 0);
      });
    }

    // Add axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(chartWidth / 80)
      .tickFormat((d) => formatXAxisLabel(d as number));

    chartArea.append('g')
      .attr('transform', `translate(0, ${chartHeight - bottomPadding - topPadding})`)
      .call(xAxis)
      .selectAll('text')
        .style('text-anchor', 'middle')
        .attr('fill', textColor)
        .style('font-size', '10px');

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d3.format('.2f'));

    chartArea.append('g')
      .call(yAxis)
      .selectAll('text')
        .attr('fill', textColor)
        .style('font-size', '10px');

    // Style axes
    chartArea.selectAll('.domain').attr('stroke', axisColor);
    chartArea.selectAll('.tick line').attr('stroke', axisColor).attr('opacity', 0.3);

    // Add hover effects
    const hoverLine = chartArea.append('line')
      .attr('stroke', textColor)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .style('opacity', 0);

    const hoverCircle = chartArea.append('circle')
      .attr('fill', 'none')
      .attr('stroke', textColor)
      .attr('r', 4)
      .style('opacity', 0);

    // Create tooltip if it doesn't exist
    if (!tooltipRef.current && svgRef.current?.parentNode) {
      const parent = svgRef.current.parentNode as HTMLElement;
      tooltipRef.current = d3.select(parent).append('div')
        .attr('class', 'chart-tooltip')
        .style('position', 'absolute')
        .style('background', mode === 'pro' ? 'rgba(45, 55, 72, 0.9)' : 'rgba(255, 255, 255, 0.9)')
        .style('color', textColor)
        .style('border', `1px solid ${axisColor}`)
        .style('padding', '5px 10px')
        .style('border-radius', '4px')
        .style('pointer-events', 'none')
        .style('opacity', 0)
        .style('font-size', '12px')
        .style('z-index', '1000')
        .node();
    }

    const tooltip = d3.select(tooltipRef.current);

    // Add outcome line if provided
    if (showOutcome && outcome !== undefined) {
      const outcomeX = xScale(outcome);
      if (outcomeX !== undefined) {
        // Add outcome line
        svg.append('line')
          .attr('x1', outcomeX)
          .attr('y1', 0)
          .attr('x2', outcomeX)
          .attr('y2', chartHeight - bottomPadding - topPadding)
          .attr('stroke', mode === 'pro' ? '#00ffff' : '#2563eb')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4,4');

        // Add outcome label
        svg.append('text')
          .attr('x', outcomeX)
          .attr('y', 10)
          .attr('text-anchor', 'middle')
          .attr('fill', mode === 'pro' ? '#00ffff' : '#2563eb')
          .attr('font-size', '12px')
          .text('Outcome');
      }
    }

  }, [data, mode, meanValue, stdDevValue, uniqueId, normalGradientId, showCDF, showOutcome, outcome]);
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      minHeight: typeof height === 'number' ? height + 100 : 520, 
      position: 'relative' 
    }}>
      <svg ref={svgRef} width="100%" height={chartHeight} style={{ minHeight: chartHeight }}>
        {/* D3 renders here */}
      </svg>
    </div>
  );
};

export default DistributionChart; 