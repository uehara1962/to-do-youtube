"use client";

import { BarChart } from "./BarChart";
import { ScatterPlot } from "./ScatterPlot";
import { AreaChart } from "./AreaChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart2 } from "./BarChart2";
import { BarChart3 } from "./BarChart3";

export function D3Examples2() {
  return (
    <Tabs defaultValue="pie" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="bar">Bar Chart</TabsTrigger>
        <TabsTrigger value="line">Line Chart</TabsTrigger>
        <TabsTrigger value="pie">Pie Chart</TabsTrigger>
        <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
        <TabsTrigger value="area">Area Chart</TabsTrigger>
      </TabsList>

      <TabsContent value="bar" className="mt-6">
        <BarChart />
      </TabsContent>

      <TabsContent value="line" className="mt-6">
        <BarChart2 />
      </TabsContent>

      <TabsContent value="pie" className="mt-6">
        <BarChart3 />
      </TabsContent>

      <TabsContent value="scatter" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Scatter Plot (Gráfico de Dispersão)</CardTitle>
            <CardDescription>
              Visualização de relações entre duas variáveis usando pontos.
              Excelente para identificar correlações e padrões.
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
              Visualização de dados temporais com área preenchida. Similar ao
              gráfico de linhas, mas com área sombreada para maior impacto
              visual.
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
