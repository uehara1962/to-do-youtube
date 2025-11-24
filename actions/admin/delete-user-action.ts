// "use server";

// import { verifySession } from "@/lib/dal";

// export async function deleteUserAction(userId: string) {
//   const session = await verifySession();

//   // Verificar se o usuário é admin
//   // Assumindo que você adicionou um campo 'role' ao schema
//   if (session.user.role !== "admin") {
//     throw new Error("Não autorizado");
//   }

//   // Proceder com a exclusão
//   // ...
// }