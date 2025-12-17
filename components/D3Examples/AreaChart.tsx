"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const data = [
  { date: "2024-01", value: 30 },
  { date: "2024-02", value: 45 },
  { date: "2024-03", value: 60 },
  { date: "2024-04", value: 40 },
  { date: "2024-05", value: 70 },
  { date: "2024-06", value: 55 },
  { date: "2024-07", value: 80 },
  { date: "2024-08", value: 65 },
];

export function AreaChart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Escalas
    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.date))
      .range([0, innerWidth])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Gerador de área
    const area = d3
      .area<{ date: string; value: number }>()
      .x((d) => xScale(d.date) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Eixos
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "11px")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(yScale));

    // Labels
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - innerHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Valor");

    // Área
    svg
      .append("path")
      .datum(data)
      .attr("fill", "#3b82f6")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", area);

    // Linha
    const line = d3
      .line<{ date: string; value: number }>()
      .x((d) => xScale(d.date) || 0)
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Pontos
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date) || 0)
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 4)
      .attr("fill", "#3b82f6")
      .on("mouseover", function () {
        d3.select(this).attr("r", 6).attr("fill", "#2563eb");
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 4).attr("fill", "#3b82f6");
      });

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="mx-auto"></svg>
    </div>
  );
}

