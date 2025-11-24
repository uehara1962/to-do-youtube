import { auth } from "@/lib/auth";

const userData = [
  {
    email: "ca_uehara@hotmail.com",
    name: "Carlos Uehara",
    password: "Generico!754",
  },
];

export async function seed() {
  for (const user of userData) {
    await auth.api.signUpEmail({
      body: {
        email: user.email,
        password: user.password,
        name: user.name,
      },
    });
    console.log(`User ${user.email} created`);
  }
}

seed();

// ca_uehara@hotmail.com
// Generico!754