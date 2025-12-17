"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const data = [
  { label: "JavaScript", value: 35 },
  { label: "Python", value: 25 },
  { label: "Java", value: 20 },
  { label: "TypeScript", value: 15 },
  { label: "Outros", value: 5 },
];

const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function PieChart() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Gerador de arco
    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    const pie = d3
      .pie<{ label: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    // Criar arcos
    const arcs = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => colors[i % colors.length])
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.8);
        // Tooltip
        const [x, y] = arc.centroid(d);
        const tooltip = svg
          .append("g")
          .attr("class", "tooltip")
          .attr("transform", `translate(${x},${y})`);

        tooltip
          .append("rect")
          .attr("x", -40)
          .attr("y", -15)
          .attr("width", 80)
          .attr("height", 30)
          .attr("fill", "rgba(0,0,0,0.8)")
          .attr("rx", 4);

        tooltip
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", 5)
          .style("fill", "white")
          .style("font-size", "12px")
          .text(`${d.data.label}: ${d.data.value}%`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        svg.selectAll(".tooltip").remove();
      });

    // Labels
    arcs
      .append("text")
      .attr("transform", (d) => {
        const [x, y] = arc.centroid(d);
        return `translate(${x},${y})`;
      })
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text((d) => `${d.data.value}%`);

    // Legenda
    const legend = svg
      .append("g")
      .attr("transform", `translate(${radius + 20},${-radius})`);

    data.forEach((d, i) => {
      const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 25})`);

      legendRow
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colors[i]);

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "12px")
        .text(d.label);
    });

    return () => {
      d3.select(svgRef.current).selectAll("*").remove();
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <svg ref={svgRef}></svg>
    </div>
  );
}

