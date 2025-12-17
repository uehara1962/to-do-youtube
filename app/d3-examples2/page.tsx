import { Metadata } from "next";
import { D3Examples2 } from "@/components/D3Examples2";

export const metadata: Metadata = {
  title: "D3.js Examples 2",
  description: "Exemplos práticos de visualizações com D3.js",
};

export default function D3Examples2Page() {
  return (
    <div className="container mx-auto max-w-7xl px-4">
      <D3Examples2 />
    </div>
  );
}

