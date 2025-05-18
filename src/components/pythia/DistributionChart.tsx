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
}

// Normal distribution PDF function
const normalPDF = (x: number, mean: number, stdDev: number): number => {
  const variance = stdDev * stdDev;
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
         Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
};

// Normal CDF function
const normalCDF = (x: number, mean: number, stdDev: number): number => {
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
};

// Error function approximation for CDF
function erf(x: number): number {
  // Abramowitz and Stegun formula 7.1.26
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  const t = 1.0/(1.0 + p*x);
  const y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);
  return sign*y;
}

// Generate points for normal distribution curve
const generateNormalCurve = (mean: number, stdDev: number, min: number, max: number, points: number = 100): NumericPoint[] => {
  const step = (max - min) / (points - 1);
  return Array.from({ length: points }, (_, i) => {
    const x = min + i * step;
    return { x, y: normalPDF(x, mean, stdDev) };
  });
};

const DistributionChart: React.FC<DistributionChartProps> = ({
  data,
  mode,
  q1Value,
  medianValue,
  q3Value,
  showCDF = false,
  height,
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

  // Calculate normal distribution parameters from Q1, Median, Q3
  const normalParams = useMemo(() => {
    if (
      q1Value == null ||
      medianValue == null ||
      q3Value == null ||
      isNaN(q1Value) ||
      isNaN(medianValue) ||
      isNaN(q3Value)
    ) return null;
    const stdDev = (q3Value - q1Value) / 1.35;
    const mean = medianValue;
    return { mean, stdDev };
  }, [q1Value, medianValue, q3Value]);

  // Generate normal distribution curve
  const normalCurve = useMemo(() => {
    if (!normalParams || numericData.length === 0) return [];
    const min = numericData[0].x;
    const max = numericData[numericData.length - 1].x;
    if (!showCDF) {
      return generateNormalCurve(normalParams.mean, normalParams.stdDev, min, max);
    } else {
      // Generate CDF points
      const points = 100;
      const step = (max - min) / (points - 1);
      return Array.from({ length: points }, (_, i) => {
        const x = min + i * step;
        return { x, y: normalCDF(x, normalParams.mean, normalParams.stdDev) };
      });
    }
  }, [normalParams, numericData, showCDF]);

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
    // Theme colors
    const axisColor = mode === 'pro' ? '#B0C4DE' : '#A0AEC0';
    const gridColor = mode === 'pro' ? '#2D3748' : '#E2E8F0';
    const textColor = mode === 'pro' ? '#E1F5FE' : '#4A5562';
    const lineStrokeColor = mode === 'pro' ? '#67E8F9' : '#63B3ED';
    const gradientFrom = mode === 'pro' ? '#67E8F9' : '#63B3ED';
    const gradientTo = mode === 'pro' ? '#083344' : '#BEE3F8';
    const q1q3RangeFillColor = mode === 'pro' ? 'rgba(103, 232, 249, 0.25)' : 'rgba(99, 179, 237, 0.25)';
    const medianLineColor = mode === 'pro' ? '#FBBF24' : '#F59E0B';
    const normalGradientFrom = mode === 'pro' ? '#FBBF24' : '#F59E0B';
    const normalGradientTo = mode === 'pro' ? '#92400E' : '#B45309';
    const dataMinX = numericData[0].x;
    const dataMaxX = numericData[numericData.length - 1].x;
    const xScale = d3.scaleLinear()
      .domain([dataMinX, dataMaxX])
      .range([0, chartWidth]);
    // For CDF, y domain is [0, 1]. For PDF, use max y.
    const yMax = showCDF ? 1 : (d3.max(numericData, d => d.y) || 0);
    const yScale = d3.scaleLinear()
      .domain([0, yMax > 0 ? yMax * 1.1 : 1])
      .range([chartHeight - bottomPadding - topPadding, 0]);
    const chartArea = svg.append('g')
      .attr('transform', `translate(${leftPaddingForYAxis}, ${topPadding})`);
    // Add gradients
    const defs = svg.append('defs');
    // Market distribution gradient
    const gradient = defs.append('linearGradient')
      .attr('id', uniqueId)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', gradientFrom).attr('stop-opacity', 0.7);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', gradientTo).attr('stop-opacity', 0.1);
    // Normal distribution gradient
    const normalGradient = defs.append('linearGradient')
      .attr('id', normalGradientId)
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    normalGradient.append('stop').attr('offset', '0%').attr('stop-color', normalGradientFrom).attr('stop-opacity', 0.7);
    normalGradient.append('stop').attr('offset', '100%').attr('stop-color', normalGradientTo).attr('stop-opacity', 0.1);
    // Line and Area generators
    const lineGenerator: d3.Line<NumericPoint> = d3.line<NumericPoint>()
      .x(d => xScale(d.x)!)
      .y(d => yScale(d.y)!)
      .curve(d3.curveCatmullRom.alpha(0.5));
    const areaGenerator: d3.Area<NumericPoint> = d3.area<NumericPoint>()
      .x(d => xScale(d.x)!)
      .y0(yScale(0)!)
      .y1(d => yScale(d.y)!)
      .curve(d3.curveCatmullRom.alpha(0.5));
    // Draw Market Distribution Area (PDF only)
    if (!showCDF) {
      chartArea.append('path')
        .datum(numericData)
        .attr('fill', `url(#${uniqueId})`)
        .attr('d', areaGenerator);
    }
    // Draw Q1-Q3 Range Highlight if values are present (PDF only)
    if (!showCDF && q1Value != null && q3Value != null && q1Value <= q3Value) {
      const q1q3Subset = numericData.filter(d => d.x >= q1Value && d.x <= q3Value);
      let boundaryPoints: NumericPoint[] = [];
      const firstPoint = numericData[0];
      const lastPoint = numericData[numericData.length-1];
      const addBoundary = (val: number, isLeft: boolean) => {
        if (val < firstPoint.x || val > lastPoint.x) return;
        const existing = numericData.find(p => p.x === val);
        if (existing) {
          boundaryPoints.push(existing);
          return;
        }
        const bisect = d3.bisector((d: NumericPoint) => d.x).left;
        const index = bisect(numericData, val);
        const p0 = numericData[index - 1];
        const p1 = numericData[index];
        if (p0 && p1) {
          const t = (val - p0.x) / (p1.x - p0.x);
          boundaryPoints.push({x: val, y: p0.y * (1-t) + p1.y * t });
        } else if (isLeft && p1) {
          boundaryPoints.push({x: val, y: p1.y });
        } else if (!isLeft && p0) {
          boundaryPoints.push({x: val, y: p0.y });
        }
      };
      addBoundary(q1Value, true);
      addBoundary(q3Value, false);
      const finalQ1Q3Data = [...boundaryPoints, ...q1q3Subset]
        .filter((p, i, self) => i === self.findIndex(t => t.x === p.x))
        .sort((a,b) => a.x - b.x);
      if (finalQ1Q3Data.length >= 2) {
        chartArea.append('path')
          .datum(finalQ1Q3Data)
          .attr('fill', q1q3RangeFillColor)
          .attr('stroke', 'none')
          .attr('d', areaGenerator); 
      }
    }
    // Draw Normal Distribution or CDF overlay
    if (normalCurve.length > 0) {
      if (!showCDF) {
        // PDF overlay as before
        const maxNormalY = d3.max(normalCurve, d => d.y) || 0;
        const yMax = d3.max(numericData, d => d.y) || 0;
        const scaleFactor = yMax / maxNormalY;
        const scaledNormalCurve = normalCurve.map(d => ({ x: d.x, y: d.y * scaleFactor }));
        chartArea.append('path')
          .datum(scaledNormalCurve)
          .attr('fill', `url(#${normalGradientId})`)
          .attr('d', areaGenerator);
        chartArea.append('path')
          .datum(scaledNormalCurve)
          .attr('fill', 'none')
          .attr('stroke', normalGradientFrom)
          .attr('stroke-width', 2)
          .attr('d', lineGenerator);
      } else {
        // CDF overlay: just a line, no area
        chartArea.append('path')
          .datum(normalCurve)
          .attr('fill', 'none')
          .attr('stroke', normalGradientFrom)
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '4,2')
          .attr('d', lineGenerator);
      }
    }
    // Optionally, draw market CDF as a secondary curve
    if (showCDF && marketCDFCurve.length > 0) {
      chartArea.append('path')
        .datum(marketCDFCurve)
        .attr('fill', 'none')
        .attr('stroke', lineStrokeColor)
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);
    }
    // Draw Market Distribution Line (PDF only)
    if (!showCDF) {
      chartArea.append('path')
        .datum(numericData)
        .attr('fill', 'none')
        .attr('stroke', lineStrokeColor)
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);
    }
    // X Axis
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
    chartArea.selectAll('.domain').attr('stroke', axisColor);
    chartArea.selectAll('.tick line').attr('stroke', axisColor).attr('opacity', 0.3);
    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(showCDF ? d3.format(".0%") : d3.format(".2~"));
    chartArea.append('g')
      .call(yAxis)
      .selectAll('text')
        .attr('fill', textColor)
        .style('font-size', '10px');
    chartArea.selectAll('.domain').attr('stroke', axisColor);
    chartArea.selectAll('.tick line').attr('stroke', axisColor).attr('opacity', 0.3);
    // Hover effects
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
        .node();
    }
    const tooltip = d3.select(tooltipRef.current);
    const pathNode = chartArea.select<SVGPathElement>('path[fill^="url(#"] + path').node();
    svg.on('mousemove', (event) => {
      if (!pathNode || numericData.length === 0) return;
      const [pointerX] = d3.pointer(event, chartArea.node());
      const mouseXValue = xScale.invert(pointerX);
      if (mouseXValue < numericData[0].x || mouseXValue > numericData[numericData.length - 1].x) {
        hoverLine.style('opacity', 0);
        hoverCircle.style('opacity', 0);
        if (tooltip) tooltip.style('opacity', 0);
        return;
      }
      const bisect = d3.bisector((d: NumericPoint) => d.x).left;
      const index = bisect(numericData, mouseXValue, 1);
      const p0 = numericData[index - 1];
      const p1 = numericData[index];
      let closestDataPoint: NumericPoint;
      if (!p0) {
        closestDataPoint = p1;
      } else if (!p1) {
        closestDataPoint = p0;
      } else {
        closestDataPoint = (mouseXValue - p0.x > p1.x - mouseXValue) ? p1 : p0;
      }
      let normalY = 0;
      if (normalParams) {
        if (!showCDF) {
          normalY = normalPDF(mouseXValue, normalParams.mean, normalParams.stdDev);
          const maxNormalY = d3.max(normalCurve, d => d.y) || 0;
          const yMax = d3.max(numericData, d => d.y) || 0;
          const scaleFactor = yMax / maxNormalY;
          normalY *= scaleFactor;
        } else {
          normalY = normalCDF(mouseXValue, normalParams.mean, normalParams.stdDev);
        }
      }
      hoverLine
        .attr('x1', xScale(mouseXValue))
        .attr('x2', xScale(mouseXValue))
        .attr('y1', yScale(0)!)
        .attr('y2', yScale(closestDataPoint.y))
        .style('opacity', 1);
      hoverCircle
        .attr('cx', xScale(mouseXValue))
        .attr('cy', yScale(closestDataPoint.y))
        .style('opacity', 1);
      if (tooltip) {
        tooltip
          .style('opacity', 0.95)
          .html(`
            Market: ${formatXAxisLabel(mouseXValue)}<br/>
            ${showCDF ? 'Cumulative Probability' : 'Probability'}: ${d3.format(showCDF ? ".2%" : ".2f")(closestDataPoint.y)}<br/>
            ${normalParams ? `Your Prediction: ${d3.format(showCDF ? ".2%" : ".2f")(normalY)}` : ''}
          `)
          .style('left', `${event.pageX + 15}px`)
          .style('top', `${event.pageY - 15}px`);
      }
    }).on('mouseleave', () => {
      hoverLine.style('opacity', 0);
      hoverCircle.style('opacity', 0);
      tooltip.style('opacity', 0);
    });
  }, [data, mode, q1Value, medianValue, q3Value, uniqueId, normalGradientId, normalCurve, normalParams, showCDF, marketCDFCurve]);
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