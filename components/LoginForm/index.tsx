// components/LoginForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { loginAction, LoginActionState } from "@/actions/auth/login-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function LoginForm() {
  const initialState: LoginActionState = {
    email: "",
    error: "",
  };

  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  useEffect(() => {
    // Só executar no cliente para evitar problemas de hidratação
    if (typeof window !== "undefined" && state.error) {
      toast.dismiss();
      toast.error(state.error);
    }
  }, [state.error]);

  return (
    <form
      action={formAction}
      className="w-full max-w-md space-y-4"
      suppressHydrationWarning
    >
      {state?.error && (
        <div className="text-red-500 text-sm" suppressHydrationWarning>
          {state.error}
        </div>
      )}

      <div className="space-y-2" suppressHydrationWarning>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          disabled={pending}
          autoComplete="email"
          suppressHydrationWarning
        />
      </div>

      <div className="space-y-2" suppressHydrationWarning>
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          disabled={pending}
          autoComplete="current-password"
          suppressHydrationWarning
        />
      </div>

      <Button type="submit" disabled={pending} suppressHydrationWarning>
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}

// -------------------------

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { redirect } from "next/navigation";
// import { signIn } from "@/server/user";

// export default function LoginForm() {
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     const formData = new FormData(e.currentTarget);
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     const { success, message } = await signIn(email, password);
//     if (!success) {
//       setError(message);
//       setIsLoading(false);
//       return;
//     }

//     redirect("/");

//     // try {
//     //   // Fazer requisição diretamente para a API route do Better Auth
//     //   // Isso garante que os cookies sejam definidos corretamente pelo navegador
//     //   const response = await fetch("/api/auth/sign-in/email", {
//     //     method: "POST",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //     },
//     //     body: JSON.stringify({ email, password }),
//     //     credentials: "include", // Importante: incluir cookies
//     //   });

//     //   const result = await response.json();

//     //   if (!response.ok || result.error) {
//     //     setError(result.error?.message || "Erro ao fazer login");
//     //     setIsLoading(false);
//     //     return;
//     //   }

//     //   // Se o login foi bem-sucedido, redirecionar
//     //   window.location.href = "/";
//     // } catch (err) {
//     //   console.error("Login error:", err);
//     //   setError("Erro ao fazer login. Tente novamente.");
//     //   setIsLoading(false);
//     // }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
//       {error && <div className="text-red-500 text-sm">{error}</div>}
//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <Input
//           id="email"
//           name="email"
//           type="email"
//           required
//           disabled={isLoading}
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="password">Senha</Label>
//         <Input
//           id="password"
//           name="password"
//           type="password"
//           required
//           disabled={isLoading}
//         />
//       </div>
//       <Button type="submit" disabled={isLoading}>
//         {isLoading ? "Entrando..." : "Entrar"}
//       </Button>
//     </form>
//   );
// }

// -------------------------

// // components/LoginForm.tsx
// "use client";

// import { useActionState } from "react";
// import { loginAction, LoginActionState } from "@/actions/auth/login-action";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export default function LoginForm() {
//   const initialState: LoginActionState = {
//     error: null,
//   };

//   const [state, formAction, pending] = useActionState(
//     loginAction,
//     initialState
//   );

//   return (
//     <form action={formAction} className="w-full max-w-md space-y-4">
//       {state?.error && (
//         <div className="text-red-500 text-sm" suppressHydrationWarning>
//           {state.error}
//         </div>
//       )}

//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <Input
//           id="email"
//           name="email"
//           type="email"
//           required
//           disabled={pending}
//           autoComplete="email"
//           suppressHydrationWarning
//         />
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="password">Senha</Label>
//         <Input
//           id="password"
//           name="password"
//           type="password"
//           required
//           disabled={pending}
//           autoComplete="current-password"
//           suppressHydrationWarning
//         />
//       </div>

//       <Button type="submit" disabled={pending}>
//         {pending ? "Entrando..." : "Entrar"}
//       </Button>
//     </form>
//   );
// }

// -------------------------

// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// export function LoginForm() {
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     const formData = new FormData(e.currentTarget);
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     try {
//       // Fazer requisição diretamente para a API route do Better Auth
//       // Isso garante que os cookies sejam definidos corretamente pelo navegador
//       const response = await fetch("/api/auth/sign-in/email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//         credentials: "include", // Importante: incluir cookies
//       });

//       const result = await response.json();

//       if (!response.ok || result.error) {
//         setError(result.error?.message || "Erro ao fazer login");
//         setIsLoading(false);
//         return;
//       }

//       // Se o login foi bem-sucedido, redirecionar
//       window.location.href = "/";
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Erro ao fazer login. Tente novamente.");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
//       {error && <div className="text-red-500 text-sm">{error}</div>}
//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <Input
//           id="email"
//           name="email"
//           type="email"
//           required
//           disabled={isLoading}
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="password">Senha</Label>
//         <Input
//           id="password"
//           name="password"
//           type="password"
//           required
//           disabled={isLoading}
//         />
//       </div>
//       <Button type="submit" disabled={isLoading}>
//         {isLoading ? "Entrando..." : "Entrar"}
//       </Button>
//     </form>
//   );
// }
