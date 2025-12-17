"use client";

import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { useSession } from "@/lib/auth-client";
import { logoutAction } from "@/actions/auth/logout-action";

export const Header = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const [isPendingLogout, startTransition] = useTransition();

  console.log("session", session);
  console.log("isPending", isPending);

  // Base menu items
  const baseMenuItems = [
    { href: "/", label: "Home" },
    { href: "/learn", label: "Aprender" },
    { href: "/todo", label: "Todo" },
    { href: "/gallery", label: "Galeria" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/cloudinary", label: "Cloudinary" },
    { href: "/blog", label: "Blog" },
    { href: "/blog/new", label: "Novo Post" },
    { href: "/d3-examples", label: "D3.js" },
    { href: "/d3-examples2", label: "D3.js Examples 2" },
    { href: "/d3-teste", label: "D3.js Teste" },
  ];

  // Add auth-related items based on session status
  const menuItems = [
    ...baseMenuItems,
    // Show Profile when logged in
    ...(!isPending && session ? [{ href: "/profile", label: "Perfil" }] : []),
    // Show Login/Signup only when NOT logged in
    ...(!isPending && !session
      ? [
          { href: "/login", label: "Login" },
          { href: "/signup", label: "Signup" },
        ]
      : []),
  ];

  const currentItem = menuItems.find((item) => pathname === item.href);

  return (
    <header className="w-full flex items-center justify-between py-2">
      <Link href="/">
        <span
          className={clsx(
            "text-2xl/normal",
            "font-extrabold",
            "sm:py-3",
            "sm:text-3xl/normal",
            "md:py-4",
            "md:text-4xl/normal",
            "lg:py-5",
            "lg:text-5xl/normal",
            "text-amber-500"
          )}
        >
          The blog
        </span>
      </Link>

      {/* Desktop Menu */}
      {/* <nav className="hidden md:flex items-center gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "text-blue-400",
              "underline",
              "hover:text-blue-200",
              pathname === item.href && "text-emerald-500 font-extrabold",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav> */}

      {/* Mobile Dropdown Menu */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={clsx(
            "flex items-center gap-2",
            "px-4 py-2",
            "text-blue-400",
            "hover:text-blue-200",
            "transition-colors"
          )}
        >
          <span>{currentItem?.label || "Menu"}</span>
          <svg
            className={clsx(
              "w-5 h-5",
              "transition-transform",
              isDropdownOpen && "rotate-180"
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <>
            {/* Overlay para fechar ao clicar fora */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Menu Dropdown */}
            <div
              className={clsx(
                "absolute right-0 top-full mt-2",
                "w-48",
                "bg-gray-800",
                "border border-gray-700",
                "rounded-lg",
                "shadow-lg",
                "z-20"
              )}
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsDropdownOpen(false)}
                  className={clsx(
                    "block px-4 py-2",
                    "text-blue-400",
                    "hover:bg-gray-700",
                    "transition-colors",
                    pathname === item.href &&
                      "bg-gray-700 text-emerald-500 font-bold"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              {/* Logout option - only shown when user is logged in */}
              {!isPending && session && (
                <div className="border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      startTransition(async () => {
                        await logoutAction();
                      });
                    }}
                    disabled={isPendingLogout}
                    className={clsx(
                      "w-full text-left px-4 py-2",
                      "text-red-400",
                      "hover:bg-gray-700",
                      "transition-colors",
                      isPendingLogout && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isPendingLogout ? "Saindo..." : "Sair"}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

// -------------
// 'use client';

// import Link from "next/link";
// import clsx from "clsx";
// import { usePathname } from "next/navigation";
// import { useState } from "react";

// export const HeaderExe = () => {
//   const pathname = usePathname();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const menuItems = [
//     { href: "/exemplo", label: "Exemplo" },
//     { href: "/exemplo/exemplo2", label: "Exemplo 2" },
//     { href: "/exemplo/post_exe", label: "Post Exemplo" },
//     { href: "/exemplo/exemplo2/exemplo2a", label: "Exemplo 2a" },
//     { href: "/exemplo/exemplo3", label: "Exemplo 3" },
//   ];

//   const currentItem = menuItems.find(item => pathname === item.href);

//   return (
//     <header className="flex items-center justify-between py-4">
//       <Link href="/">
//         <span
//           className={clsx(
//             "text-2xl/normal",
//             "font-extrabold",
//             "sm:py-3",
//             "sm:text-3xl/normal",
//             "md:py-4",
//             "md:text-4xl/normal",
//             "lg:py-5",
//             "lg:text-5xl/normal",
//             "text-amber-500",
//           )}
//         >
//           The blog
//         </span>
//       </Link>

//       {/* Desktop Menu */}
//       <nav className="hidden md:flex items-center gap-4">
//         {menuItems.map((item) => (
//           <Link
//             key={item.href}
//             href={item.href}
//             className={clsx(
//               "text-blue-400",
//               "underline",
//               "hover:text-blue-200",
//               pathname === item.href && "text-emerald-500 font-extrabold",
//             )}
//           >
//             {item.label}
//           </Link>
//         ))}
//       </nav>

//       {/* Mobile Dropdown Menu */}
//       <div className="relative md:hidden">
//         <button
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//           className={clsx(
//             "flex items-center gap-2",
//             "px-4 py-2",
//             "text-blue-400",
//             "hover:text-blue-200",
//             "transition-colors"
//           )}
//         >
//           <span>{currentItem?.label || "Menu"}</span>
//           <svg
//             className={clsx(
//               "w-5 h-5",
//               "transition-transform",
//               isDropdownOpen && "rotate-180"
//             )}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </button>

//         {/* Dropdown */}
//         {isDropdownOpen && (
//           <>
//             {/* Overlay para fechar ao clicar fora */}
//             <div
//               className="fixed inset-0 z-10"
//               onClick={() => setIsDropdownOpen(false)}
//             />

//             {/* Menu Dropdown */}
//             <div
//               className={clsx(
//                 "absolute right-0 top-full mt-2",
//                 "w-48",
//                 "bg-gray-800",
//                 "border border-gray-700",
//                 "rounded-lg",
//                 "shadow-lg",
//                 "z-20"
//               )}
//             >
//               {menuItems.map((item) => (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={() => setIsDropdownOpen(false)}
//                   className={clsx(
//                     "block px-4 py-2",
//                     "text-blue-400",
//                     "hover:bg-gray-700",
//                     "transition-colors",
//                     pathname === item.href && "bg-gray-700 text-emerald-500 font-bold"
//                   )}
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </header>
//   );
// };

// -------------
// 'use client';

// import Link from "next/link";
// import clsx from "clsx";
// import { usePathname } from "next/navigation";

// export const HeaderExe = () => {
//   const pathname = usePathname();

//   return (
//     <header className="flex items-center justify-between py-4">
//       <Link href="/">
//         <span
//           className={clsx(
//             // "py-3", // padding vertical para todos os screens
//             "text-2xl/normal", // tamanho do texto para todos os screens
//             "font-extrabold", // fonte extra bold para todos os screens
//             "sm:py-3", // padding vertical para small screens
//             "sm:text-3xl/normal", // tamanho do texto para small screens
//             "md:py-4", // padding vertical para medium screens
//             "md:text-4xl/normal", // tamanho do texto para medium screens
//             "lg:py-5", // padding vertical para large screens
//             "lg:text-5xl/normal", // tamanho do texto para large screens
//             "text-amber-500",
//           )}
//         >
//           The blog
//         </span>
//       </Link>
//       <Link
//         href="/exemplo"
//         className={clsx(
//           "text-blue-400",
//           "underline",
//           "hover:text-blue-200",
//           pathname === "/exemplo" && "text-emerald-500 font-extrabold",
//         )}
//       >
//         Exemplo
//       </Link>
//       <Link
//         href="/exemplo/exemplo2"
//         className={clsx(
//           "text-blue-400",
//           "underline",
//           "hover:text-blue-200",
//           pathname === "/exemplo/exemplo2" && "text-emerald-500 font-extrabold",
//         )}
//       >
//         Exemplo 2
//       </Link>
//       <Link
//         href="/exemplo/post_exe"
//         className={clsx(
//           "text-blue-400",
//           "underline",
//           "hover:text-blue-200",
//           pathname === "/exemplo/post_exe" && "text-emerald-500 font-extrabold",
//         )}
//       >
//         Post Exemplo
//       </Link>
//       <Link
//         href="/exemplo/exemplo2/exemplo2a"
//         className={clsx(
//           "text-blue-400",
//           "underline",
//           "hover:text-blue-200",
//           pathname === "/exemplo/exemplo2/exemplo2a" && "text-emerald-500 font-extrabold",
//         )}
//       >
//         Exemplo 2a
//       </Link>
//       <Link
//         href="/exemplo/exemplo3"
//         className={clsx(
//           "text-blue-400",
//           "underline",
//           "hover:text-blue-200",
//           pathname === "/exemplo/exemplo3" && "text-emerald-500 font-extrabold",
//         )}
//       >
//         Exemplo 3
//       </Link>
//     </header>
//   );
// };
