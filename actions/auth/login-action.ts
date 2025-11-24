"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export type LoginActionState = {
  email: string;
  error: string | null;
};

export async function loginAction(
  state: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { email: "", error: "Email e senha são obrigatórios" };
  }

  console.log("email:", email);
  console.log("password:", password);

  try {
    const headersList = await headers();
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: headersList,
    });

    console.log("result:", result);

    if (result.user) {
      console.log("user:", result.user);
      redirect("/");
    } else {
      return { email: "", error: "Credenciais inválidas" };
    }
  } catch (error: unknown) {
    // redirect() lança uma exceção especial NEXT_REDIRECT
    if (error instanceof Error) {
      const errorWithDigest = error as Error & { digest?: string };
      if (
        error.message === "NEXT_REDIRECT" ||
        errorWithDigest.digest?.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
    }

    console.error("Login error:", error);
    return {
      email: "",
      error: error instanceof Error ? error.message : "Erro ao fazer login",
    };
  }
}

// -------------------------

// "use server";

// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import { headers } from "next/headers";

// export type LoginActionState = {
//   error: string | null;
// };

// export async function loginAction(state: LoginActionState, formData: FormData) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   if (!email || !password) {
//     return { error: "Email e senha são obrigatórios" };
//   }

//   console.log("email:", email);
//   console.log("password:", password);

//   try {
//       const response = await fetch("/api/auth/sign-in/email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//         credentials: "include", // Importante: incluir cookies
//       });

//     console.log("response:", response);

//     const result = await response.json();

//     if (result.user) {
//       console.log("user:", result.user);
//       redirect("/");
//     } else {
//       return { error: "Credenciais inválidas" };
//     }
//   } catch (error: unknown) {
//     // redirect() lança uma exceção especial NEXT_REDIRECT
//     if (error instanceof Error) {
//       const errorWithDigest = error as Error & { digest?: string };
//       if (
//         error.message === "NEXT_REDIRECT" ||
//         errorWithDigest.digest?.startsWith("NEXT_REDIRECT")
//       ) {
//         throw error;
//       }
//     }

//     console.error("Login error:", error);
//     return {
//       error: error instanceof Error ? error.message : "Erro ao fazer login",
//     };
//   }
// }

// "use server";

// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
// import { cookies, headers } from "next/headers";

// export async function loginAction(formData: FormData) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   if (!email || !password) {
//     return { error: "Email e senha são obrigatórios" };
//   }

//   try {
//     const headersList = await headers();
//     const result = await auth.api.signInEmail({
//       body: {
//         email,
//         password,
//       },
//       headers: headersList,
//     });

//     console.log("result", result);
//     console.log("result keys:", Object.keys(result));

//     // Se o login foi bem-sucedido
//     if (result.user) {
//       // O Better Auth pode retornar o token ou podemos precisar obter da sessão
//       // Vamos verificar se há token na resposta ou obter da sessão criada
//       const cookieStore = await cookies();

//       // O nome do cookie segue o padrão: ${cookiePrefix}.session_token
//       // Como configuramos cookiePrefix: "better-auth", o nome será:
//       const cookieName = "better-auth.session_token";

//       // Se houver token na resposta, usar ele
//       // Caso contrário, precisamos obter da sessão
//       if (result.token) {
//         cookieStore.set(cookieName, result.token, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "lax",
//           maxAge: 60 * 60 * 24 * 7, // 7 dias
//           path: "/",
//         });
//         console.log("Cookie definido com token da resposta:", cookieName);
//       } else {
//         // Se não houver token, obter a sessão para pegar o token
//         const session = await auth.api.getSession({
//           headers: headersList,
//         });

//         if (session?.session?.token) {
//           cookieStore.set(cookieName, session.session.token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "lax",
//             maxAge: 60 * 60 * 24 * 7, // 7 dias
//             path: "/",
//           });
//           console.log("Cookie definido com token da sessão:", cookieName);
//         } else {
//           console.error("Token não encontrado na resposta nem na sessão");
//           return { error: "Erro ao obter token de sessão" };
//         }
//       }

//       redirect("/");
//     } else {
//       return { error: "Erro ao fazer login" };
//     }
//   } catch (error: unknown) {
//     // redirect() do Next.js lança uma exceção especial NEXT_REDIRECT
//     // Precisamos re-lançá-la em vez de tratá-la como erro
//     if (error instanceof Error) {
//       const errorWithDigest = error as Error & { digest?: string };
//       if (
//         error.message === "NEXT_REDIRECT" ||
//         errorWithDigest.digest?.startsWith("NEXT_REDIRECT")
//       ) {
//         throw error;
//       }
//     }

//     console.error("Login error:", error);
//     const errorMessage =
//       error instanceof Error
//         ? error.message
//         : "Erro ao fazer login. Verifique suas credenciais.";
//     return { error: errorMessage };
//   }
// }
