"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

// Gerar dados aleatórios
const generateData = () => {
  return Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    value: Math.random() * 50,
  }));
};

const data = generateData();

export function ScatterPlot() {
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
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x) || 0])
      .nice()
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) || 0])
      .nice()
      .range([innerHeight, 0]);

    const sizeScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([3, 15]);

    const colorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain([0, d3.max(data, (d) => d.value) || 0]);

    // Eixos
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

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
      .text("Valor Y");

    svg
      .append("text")
      .attr("transform", `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 5})`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text("Valor X");

    // Pontos
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", (d) => sizeScale(d.value))
      .attr("fill", (d) => colorScale(d.value))
      .attr("opacity", 0.7)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 1).attr("stroke", "#000").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.7).attr("stroke", "none");
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

