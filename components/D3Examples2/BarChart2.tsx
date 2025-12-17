"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const DUMMY_DATA = [
  { id: "d1", value: 10, region: "USA" },
  { id: "d2", value: 11, region: "India" },
  { id: "d3", value: 12, region: "China" },
  { id: "d4", value: 9, region: "Germany" },
  { id: "d5", value: 15, region: "France" },
];

const width = 900;
const height = 400;
const margin = { top: 10, right: 10, bottom: 50, left: 50 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

export function BarChart2() {
  const svgRef = useRef<SVGSVGElement>(null);
  const dataRef = useRef([...DUMMY_DATA]);

  const updateChart = (data: typeof DUMMY_DATA) => {
    if (!svgRef.current) return;

    // Limpar SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    // Escalas
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.region))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => d.value) || 0) + 3])
      .range([innerHeight, 0]);

    // Container
    const container = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Eixos
    container
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .style("font-size", "12px");

    container
      .append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px");

    // Labels dos eixos
    container
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - innerHeight / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .attr("fill", "red")
      .text("Valor");

    container
      .append("text")
      .attr(
        "transform",
        `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 5})`
      )
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .attr("fill", "red")
      .text("Região");

    // Barras
    container
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - (yScale(d.value) || 0))
      .attr("x", (d) => xScale(d.region) || 0)
      .attr("y", (d) => yScale(d.value) || 0)
      .attr("fill", "steelblue")
      .on("mouseover", function (event, d) {
        d3.select(event.currentTarget as SVGRectElement).attr(
          "fill",
          "#2563eb"
        );

        // Tooltip deve ser adicionado ao container, não ao rect
        const tooltip = container
          .append("g")
          .attr("class", "tooltip")
          .attr(
            "transform",
            `translate(${(xScale(d.region) || 0) + xScale.bandwidth() / 2},${
              yScale(d.value) - 10
            })`
          );

        tooltip
          .append("rect")
          .attr("x", -30)
          .attr("y", -20)
          .attr("width", 60)
          .attr("height", 20)
          .attr("fill", "rgba(0,0,0,0.8)")
          .attr("rx", 4);

        tooltip
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", -5)
          .style("fill", "white")
          .style("font-size", "12px")
          .text(`${d.value}`);
      })
      .on("mouseout", function (event) {
        d3.select(event.currentTarget as SVGRectElement).attr(
          "fill",
          "steelblue"
        );
        container.selectAll(".tooltip").remove();
      });
  };

  useEffect(() => {
    // Renderizar gráfico inicial
    updateChart(dataRef.current);

    // Função para atualizar dados periodicamente
    const updateData = () => {
      // Exemplo: atualizar valores aleatoriamente ou rotacionar dados
      // Opção 1: Atualizar valores aleatoriamente
      dataRef.current = dataRef.current.map((d) => ({
        ...d,
        value: Math.floor(Math.random() * 20) + 5, // Valores entre 5 e 25
      }));

      // Opção 2: Rotacionar dados (usar apenas os 3 primeiros)
      // dataRef.current = DUMMY_DATA.slice(0, 3);

      // Re-renderizar o gráfico com os novos dados
      updateChart(dataRef.current);
    };

    // Atualizar a cada 2 segundos (2000ms)
    // Você pode ajustar o intervalo conforme necessário
    const intervalId = setInterval(updateData, 300000);

    // Cleanup - capturar referência atual
    const currentSvg = svgRef.current;
    return () => {
      clearInterval(intervalId);
      if (currentSvg) {
        d3.select(currentSvg).selectAll("*").remove();
      }
    };
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="mx-auto"></svg>
    </div>
  );
}
