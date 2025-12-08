"use client";

import { useActionState, useEffect } from "react";
import {
  enable2FAAction,
  Enable2FAActionState,
} from "@/actions/auth/enable-2fa-action";
import {
  disable2FAAction,
  Disable2FAActionState,
} from "@/actions/auth/disable-2fa-action";
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
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  twoFactorEnabled?: boolean;
};

interface TwoFactorSettingsProps {
  user: User;
}

export function TwoFactorSettings({ user }: TwoFactorSettingsProps) {
  const router = useRouter();

  const enableInitialState: Enable2FAActionState = {
    error: null,
    success: false,
  };

  const disableInitialState: Disable2FAActionState = {
    error: null,
    success: false,
  };

  const [enableState, enableFormAction, enablePending] = useActionState(
    enable2FAAction,
    enableInitialState
  );

  const [disableState, disableFormAction, disablePending] = useActionState(
    disable2FAAction,
    disableInitialState
  );

  useEffect(() => {
    if (enableState.error) {
      toast.error(enableState.error);
    }
  }, [enableState.error]);

  useEffect(() => {
    if (disableState.error) {
      toast.error(disableState.error);
    } else if (disableState.success) {
      toast.success("2FA desabilitado com sucesso");
      router.refresh();
    }
  }, [disableState, router]);

  const isTwoFactorEnabled = user.twoFactorEnabled ?? false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
        <CardDescription>
          Adicione uma camada extra de segurança à sua conta. Quando habilitado,
          você precisará inserir um código enviado por email além da sua senha
          para fazer login.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isTwoFactorEnabled ? (
          <form action={enableFormAction} className="space-y-4">
            {enableState.error && (
              <div className="text-red-500 text-sm">{enableState.error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha para habilitar 2FA"
                required
                disabled={enablePending}
                autoComplete="current-password"
              />
              <p className="text-xs text-gray-500">
                Você precisará confirmar sua senha para habilitar o 2FA
              </p>
            </div>
            <Button type="submit" disabled={enablePending}>
              {enablePending ? "Habilitando..." : "Habilitar 2FA"}
            </Button>
          </form>
        ) : (
          <form action={disableFormAction} className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-semibold text-green-900">2FA Habilitado</p>
                <p className="text-sm text-green-700">
                  Sua conta está protegida com autenticação de dois fatores
                </p>
              </div>
            </div>
            {disableState.error && (
              <div className="text-red-500 text-sm">{disableState.error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="disable-password">Senha</Label>
              <Input
                id="disable-password"
                name="password"
                type="password"
                placeholder="Digite sua senha para desabilitar 2FA"
                required
                disabled={disablePending}
                autoComplete="current-password"
              />
              <p className="text-xs text-gray-500">
                Você precisará confirmar sua senha para desabilitar o 2FA
              </p>
            </div>
            <Button
              type="submit"
              variant="destructive"
              disabled={disablePending}
            >
              {disablePending ? "Desabilitando..." : "Desabilitar 2FA"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
