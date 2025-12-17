import { getCurrentUser } from "@/lib/auth-server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import D3Test from "@/components/D3-teste";

export const metadata: Metadata = {
  title: "D3 Teste",
  description: "D3 Teste page",
};

export default async function D3TestPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }


  return (
    <D3Test />
  );
}