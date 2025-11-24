import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Perfil</h1>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}