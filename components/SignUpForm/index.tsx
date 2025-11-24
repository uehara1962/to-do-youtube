// components/SignUpForm.tsx
"use client";

import { useActionState } from "react";
import { signupAction, SignupActionState } from "@/actions/auth/signup-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function SignUpForm() {
  const initialState: SignupActionState = {
    error: null,
  };

  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <form action={formAction} className="w-full space-y-4">
      {state?.error && (
        <div className="text-red-500 text-sm">{state.error}</div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          disabled={pending}
          autoComplete="name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          disabled={pending}
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={pending}
          autoComplete="new-password"
        />
      </div>
      
      <Button type="submit" disabled={pending}>
        {pending ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
}