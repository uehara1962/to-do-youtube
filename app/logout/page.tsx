import LogoutButton from "@/components/LogoutButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logout",
  description: "Logout page",
};


export default function LogoutPage() {
  return (
    <div>
      <h1>Logout</h1>
      <LogoutButton />
    </div>
  );
}