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

const width = 500;
const height = 400;

export function BarChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const dataRef = useRef([...DUMMY_DATA]);

  const updateChart = (data: typeof DUMMY_DATA) => {
    if (!svgRef.current) return;

    // Limpar SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.region))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => d.value) || 0) + 3])
      .range([height, 0]);

    const container = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");

    container
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - (yScale(d.value) || 0))
      .attr("x", (d) => xScale(d.region) || 0)
      .attr("y", (d) => yScale(d.value) || 0)
      .attr("fill", "steelblue");
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
