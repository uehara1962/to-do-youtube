"use client";

import { useActionState, useEffect } from "react";
import {
  changePasswordAction,
  ChangePasswordActionState,
} from "@/actions/auth/change-password-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const initialState: ChangePasswordActionState = {
    error: null,
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    changePasswordAction,
    initialState
  );

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    } else if (state.success) {
      toast.success("Senha alterada com sucesso!");
      // Reset form
      const form = document.getElementById("change-password-form") as HTMLFormElement;
      if (form) {
        form.reset();
      }
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>
          Altere sua senha para manter sua conta segura. Use uma senha forte com
          pelo menos 8 caracteres.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="change-password-form" action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Digite sua senha atual"
              required
              disabled={isPending}
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Digite sua nova senha"
              required
              disabled={isPending}
              autoComplete="new-password"
              minLength={8}
            />
            <p className="text-xs text-gray-500">
              A senha deve ter pelo menos 8 caracteres
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirme sua nova senha"
              required
              disabled={isPending}
              autoComplete="new-password"
              minLength={8}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Alterando..." : "Alterar Senha"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

