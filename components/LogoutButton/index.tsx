"use client";

import { logoutAction } from "@/actions/auth/logout-action";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline">
        Sair
      </Button>
    </form>
  );
}