"use client";

import { useState } from "react";
import { BarChart } from "./BarChart";
import { LineChart } from "./LineChart";
import { PieChart } from "./PieChart";
import { ScatterPlot } from "./ScatterPlot";
import { AreaChart } from "./AreaChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function D3Examples() {
  return (
    <Tabs defaultValue="bar" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        <TabsTrigger value="line">Line Chart</TabsTrigger>
        <TabsTrigger value="pie">Pie Chart</TabsTrigger>
        <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
        <TabsTrigger value="area">Area Chart</TabsTrigger>
      </TabsList>

      <TabsContent value="bar" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Bar Chart (Gráfico de Barras)</CardTitle>
            <CardDescription>
              Visualização de dados categóricos usando barras verticais. Ideal para comparar valores entre diferentes categorias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="line" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Line Chart (Gráfico de Linhas)</CardTitle>
            <CardDescription>
              Visualização de dados temporais ou sequenciais usando linhas. Perfeito para mostrar tendências ao longo do tempo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pie" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Pie Chart (Gráfico de Pizza)</CardTitle>
            <CardDescription>
              Visualização de proporções usando um gráfico circular. Útil para mostrar a distribuição de partes em relação ao todo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="scatter" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Scatter Plot (Gráfico de Dispersão)</CardTitle>
            <CardDescription>
              Visualização de relações entre duas variáveis usando pontos. Excelente para identificar correlações e padrões.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScatterPlot />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="area" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Area Chart (Gráfico de Área)</CardTitle>
            <CardDescription>
              Visualização de dados temporais com área preenchida. Similar ao gráfico de linhas, mas com área sombreada para maior impacto visual.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

