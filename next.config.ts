import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents: true, // Esta opção também pode ter mudado dependendo da versão exata, mas o foco é a imagem
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
