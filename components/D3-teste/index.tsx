"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3Test() {
  const divRef1 = useRef<HTMLDivElement>(null);
  const divRef2 = useRef<HTMLDivElement>(null);
  const svgContainerRef1 = useRef<HTMLDivElement>(null);
  const svgContainerRef2 = useRef<HTMLDivElement>(null);
  const svgRef2 = useRef<SVGSVGElement>(null);
  const svgRef1 = useRef<SVGSVGElement>(null);

  function div1() {
    if (!divRef1.current) return;

    // Limpar SVG anterior
    d3.select(divRef1.current).selectAll("*").remove();

    const dummyData = [
      { name: "John", age: 25 },
      { name: "Jane", age: 30 },
      { name: "Jim", age: 35 },
    ];
    d3.select(divRef1.current)
      .selectAll("p")
      .data(dummyData)
      .enter()
      .append("p")
      .text((dta) => dta.name)
      .style("color", "white")
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .style("text-align", "center");
  }

  function div2() {
    if (!divRef1.current) return;

    // Limpar SVG anterior
    d3.select(divRef2.current).selectAll("*").remove();

    const dummyData = [
      { name: "John", age: 25 },
      { name: "Jane", age: 30 },
      { name: "Jim", age: 35 },
    ];

    const container = d3
      .select(divRef2.current)
      .style("border", "1px solid black");

    container.append("svg");
  }

  function svg1() {
    if (!svgRef2.current || !svgContainerRef1.current) return;

    // Limpar SVG anterior
    d3.select(svgRef2.current).selectAll("*").remove();

    // Pegar o tamanho da div container
    const containerRect = svgContainerRef1.current.getBoundingClientRect();
    const width = containerRect.width || svgContainerRef1.current.offsetWidth;
    const height = containerRect.height || svgContainerRef1.current.offsetHeight;

    // Configurações
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = [130, 15, 70, 190, 210, 23, 250, 270, 90, 31];

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 0])
      .range([0, innerWidth * 0.9]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 0])
      .range([innerHeight, 0]);

    // Criar SVG
    const svg = d3
      .select(svgRef2.current)
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * 30;
      })
      .attr("width", function (d) {
        return xScale(d);
      })
      .attr("height", 30)
      .attr("fill", "white")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("stroke", "#000");
  }
  function svg2() {
    if (!svgRef2.current || !svgContainerRef2.current) return;

    // Limpar SVG anterior
    d3.select(svgRef2.current).selectAll("*").remove();

    // Pegar o tamanho da div container
    const containerRect = svgContainerRef2.current.getBoundingClientRect();
    const width = containerRect.width || svgContainerRef2.current.offsetWidth;
    const height = containerRect.height || svgContainerRef2.current.offsetHeight;

    // Configurações
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const data = [130, 15, 70, 190, 210, 23, 250, 270, 90, 31];

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 0])
      .range([0, innerWidth * 0.9]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 0])
      .range([innerHeight, 0]);

    // Criar SVG
    const svg = d3
      .select(svgRef2.current)
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)

    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * 30;
      })
      .attr("width", function (d) {
        return xScale(d);
      })
      .attr("height", 30)
      .attr("fill", "white")
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("stroke", "#000");
  }

  useEffect(() => {
    div1();
    div2();
    svg1();
    svg2();

    // Função para recalcular quando a janela redimensionar
    const handleResize = () => {
      svg1();
      svg2();
    };

    window.addEventListener("resize", handleResize);

    // Cleanup - capturar referência atual
    const currentSvg = svgRef1.current;
    const currentSvg1 = svgRef2.current;
    const currentDiv1 = divRef1.current;
    const currentDiv2 = divRef2.current;
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentSvg) {
        d3.select(currentSvg).selectAll("*").remove();
          }
      if (currentDiv1) {
        d3.select(currentDiv1).selectAll("*").remove();
      }
      if (currentDiv2) {
        d3.select(currentDiv2).selectAll("*").remove();
      }
    };
  }, []);

  return (
    <div className="w-full h-full gap-4 flex flex-col">
      <div className="grid grid-cols-2 grid-rows-1 gap-4 w-full h-full">
        <div
          ref={divRef1}
          className="w-full h-full bg-gray-500 border border-gray-300"
        ></div>
        <div
          ref={divRef2}
          className="w-full h-full overflow-x-auto bg-gray-500 border border-gray-300"
        ></div>
      </div>
      <div ref={svgContainerRef1} className="w-full h-[400px] bg-gray-500 border border-gray-300">
        <svg
          ref={svgRef1}
          className="mx-auto bg-gray-500 border border-gray-300"
        ></svg>
      </div>
      <div ref={svgContainerRef2} className="w-full h-[400px] bg-gray-500 border border-gray-300">
        <svg
          ref={svgRef2}
          className="mx-auto bg-gray-500 border border-gray-300"
        ></svg>
      </div>
    </div>
  );
}

// -------------------------------------------
// "use client";

// import { useEffect, useRef } from "react";
// import * as d3 from "d3";

// const data = [130, 150, 170, 190, 210, 230, 250, 270, 290, 310];

// export default function D3Test() {
//   const svgRef = useRef<SVGSVGElement>(null);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     // Limpar SVG anterior
//     d3.select(svgRef.current).selectAll("*").remove();

//     // Configurações
//     const width = 600;
//     const height = 400;
//     const margin = { top: 20, right: 20, bottom: 40, left: 60 };
//     const innerWidth = width - margin.left - margin.right;
//     const innerHeight = height - margin.top - margin.bottom;

//     // Criar SVG
//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform", `translate(${margin.left},${margin.top})`);

//     // Escalas
//     const xScale = d3
//       .scaleBand()
//       .domain(data.map((_, i) => `Item ${i + 1}`))
//       .range([0, innerWidth])
//       .padding(0.2);

//     const yScale = d3
//       .scaleLinear()
//       .domain([0, d3.max(data) || 0])
//       .nice()
//       .range([innerHeight, 0]);

//     // Eixos
//     svg
//       .append("g")
//       .attr("transform", `translate(0,${innerHeight})`)
//       .call(d3.axisBottom(xScale))
//       .selectAll("text")
//       .style("font-size", "12px")
//       .attr("transform", "rotate(-45)")
//       .style("text-anchor", "end");

//     svg
//       .append("g")
//       .call(d3.axisLeft(yScale))
//       .selectAll("text")
//       .style("font-size", "12px");

//     // Labels dos eixos
//     svg
//       .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left)
//       .attr("x", 0 - innerHeight / 2)
//       .attr("dy", "1em")
//       .style("text-anchor", "middle")
//       .style("font-size", "14px")
//       .text("Valor");

//     svg
//       .append("text")
//       .attr(
//         "transform",
//         `translate(${innerWidth / 2}, ${innerHeight + margin.bottom - 5})`
//       )
//       .style("text-anchor", "middle")
//       .style("font-size", "14px")
//       .text("Item");

//     // Barras
//     svg
//       .selectAll(".bar")
//       .data(data)
//       .enter()
//       .append("rect")
//       .attr("class", "bar")
//       .attr("x", (_, i) => xScale(`Item ${i + 1}`) || 0)
//       .attr("y", (d) => yScale(d))
//       .attr("width", xScale.bandwidth())
//       .attr("height", (d) => innerHeight - yScale(d))
//       .attr("fill", "#3b82f6")
//       .attr("rx", 4)
//       .on("mouseover", function () {
//         d3.select(this).attr("fill", "#2563eb");
//       })
//       .on("mouseout", function () {
//         d3.select(this).attr("fill", "#3b82f6");
//       });

//     // Cleanup - capturar referência atual
//     const currentSvg = svgRef.current;
//     return () => {
//       if (currentSvg) {
//         d3.select(currentSvg).selectAll("*").remove();
//       }
//     };
//   }, []);

//   return (
//     <div className="w-full overflow-x-auto">
//       <svg ref={svgRef} className="mx-auto"></svg>
//     </div>
//   );
// }
