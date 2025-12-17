import { Metadata } from "next";
import { D3Examples } from "@/components/D3Examples";

export const metadata: Metadata = {
  title: "D3.js Examples",
  description: "Exemplos práticos de visualizações com D3.js",
};

export default function D3ExamplesPage() {
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">D3.js Examples</h1>
        <p className="text-gray-600 text-lg">
          Exemplos práticos de visualizações de dados usando a biblioteca D3.js.
          Explore diferentes tipos de gráficos e técnicas de visualização.
        </p>
      </div>
      <D3Examples />
    </div>
  );
}

