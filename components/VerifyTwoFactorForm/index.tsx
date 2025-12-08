"use client";

import { useActionState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  verify2FAAction,
  Verify2FAActionState,
} from "@/actions/auth/verify-2fa-action";

export function VerifyTwoFactorForm() {
  const router = useRouter();

  const initialState: Verify2FAActionState = {
    error: null,
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    verify2FAAction,
    initialState
  );

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    } else if (state.success) {
      toast.success("Verificação bem-sucedida!");
      router.refresh();
    }
  }, [state, router]);

  const handleResend = async () => {
    try {
      await authClient.twoFactor.sendOtp();
      toast.success("Código reenviado para seu email");
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Erro ao reenviar código. Tente novamente.");
    }
  };

  return (
    <form action={formAction} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2 bg-gray-700">
          <Label htmlFor="code">Código de Verificação</Label>
          <Input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            placeholder="000000"
            required
            disabled={isPending}
            className="text-center text-2xl tracking-widest"
            autoComplete="one-time-code"
            autoFocus
          />
          <p className="text-xs text-gray-500">
            Digite o código de 6 dígitos enviado para seu email
          </p>
        </div>
      </div>

      <div className="space-y-3 bg-gray-700">
        <Button
          type="submit"
          className="w-full bg-gray-400"
          disabled={isPending}
        >
          {isPending ? "Verificando..." : "Verificar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-gray-400"
          onClick={handleResend}
          disabled={isPending}
        >
          Reenviar Código
        </Button>
      </div>
    </form>
  );
}
