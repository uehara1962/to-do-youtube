"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function BarChart3() {
  const countryListRef = useRef<HTMLUListElement>(null);

  const countryData = {
    items: ["China", "India", "USA"],
    addItem(item: string) {
      this.items.push(item);
    },
    removeItem(index: number) {
      this.items.splice(index, 1);
    },
    updateItem(index: number, newItem: string) {
      this.items[index] = newItem;
    },
  };

  const updateChart = () => {
    if (!countryListRef.current) return;

    d3.select(countryListRef.current).selectAll("*").remove();

    d3.select(countryListRef.current)
      .selectAll("li")
      .data(countryData.items)
      .enter()
      .append("li")
      .attr("box-shadow", "0 2px 8px rgba(0, 0, 0, 0.26)")
      .attr("padding", "0.5rem")
      .attr("margin", "1rem 0")
      .text((d) => d);
  };

  const addCountry = () => {
    if (!countryListRef.current) return;

    countryData.addItem("Germany");
    d3.select(countryListRef.current)
      .selectAll("li")
      .data(countryData.items, (d) => d as string)
      .enter()
      .append("li")
      .style("background-color", "green")
      .text((d) => d);
  };

  const removeCountry = () => {
    if (!countryListRef.current) return;

    countryData.removeItem(0);
    d3.select(countryListRef.current)
      .selectAll("li")
      .data(countryData.items, (d) => d as string)
      .exit()
      .style("background-color", "coral")
      .text((d) => d as string);
  };

  const updateCountry = () => {
    if (!countryListRef.current) return;

    countryData.updateItem(1, "Russia");
    d3.select(countryListRef.current)
      .selectAll("li")
      .data(countryData.items, (d) => d as string)
      .exit()
      .style("background-color", "orange")
      .text((d) => d as string);
  };

  useEffect(() => {
    // Renderizar gráfico inicial
    updateChart();

    const timeoutId = setTimeout(() => {
      addCountry();
    }, 2000);

    const timeoutId2 = setTimeout(() => {
      removeCountry();
    }, 4000);

    const timeoutId3 = setTimeout(() => {
      updateCountry();
    }, 6000);

    const currentCountryList = countryListRef.current;
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      if (currentCountryList) {
        d3.select(currentCountryList).selectAll("*").remove();
      }
    };
  }, []);

  return (
    <div className="w-full overflow-x-auto">
      <ul ref={countryListRef} className="mx-auto list-none p-0 m-0"></ul>
    </div>
  );
}
