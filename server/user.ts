"use server";

import { db } from "@/db/drizzle";
import { users } from "@/db/drizzle/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!currentUser) {
    redirect("/login");
  }

  return {
    ...session,
    currentUser,
  };
};

export const signIn = async (email: string, password: string) => {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    console.log("signIn result:", result);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
};

export const signUp = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: username,
      },
    });

    return {
      success: true,
      message: "Signed up successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
};

// export const getUsers = async (organizationId: string) => {
//     try {
//         const members = await db.query.member.findMany({
//             where: eq(member.organizationId, organizationId),
//         });

//         const users = await db.query.user.findMany({
//             where: not(inArray(user.id, members.map((member) => member.userId))),
//         });

//         return users;
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// }

// -------------------------
// "use server";

// import { db } from "@/db/drizzle";
// import {
//   UserTableInsertModel,
//   UserTableSelectModel,
//   users as usersTable,
// } from "@/db/drizzle/schema";
// import { desc, eq } from "drizzle-orm";

// export async function createUser(
//   user: UserTableInsertModel
// ): Promise<UserTableSelectModel[]> {
//   try {
//     const newUser = await db.insert(usersTable).values(user).returning();
//     return newUser;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to create user");
//   }
// }

// export async function getUserById(id: string): Promise<UserTableSelectModel[]> {
//   try {
//     const user = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.id, id));
//     return user;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to get user by id");
//   }
// }

// export async function getUserByEmail(
//   email: string
// ): Promise<UserTableSelectModel[]> {
//   try {
//     const user = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.email, email));
//     return user;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to get user by email");
//   }
// }

// export async function updateUser(
//   id: string,
//   user: UserTableInsertModel
// ): Promise<UserTableSelectModel[]> {
//   try {
//     const updatedUser = await db
//       .update(usersTable)
//       .set(user)
//       .where(eq(usersTable.id, id))
//       .returning();
//     return updatedUser;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to update user");
//   }
// }

// export async function deleteUser(id: string): Promise<UserTableSelectModel[]> {
//   try {
//     const deletedUser = await db
//       .delete(usersTable)
//       .where(eq(usersTable.id, id))
//       .returning();
//     return deletedUser;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to delete user");
//   }
// }

// export async function getAllUsers(): Promise<UserTableSelectModel[]> {
//   try {
//     const users: UserTableSelectModel[] = (await db
//       .select()
//       .from(usersTable)
//       .orderBy(desc(usersTable.createdAt))) as UserTableSelectModel[];
//     return users;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Failed to get all users");
//   }
// }
