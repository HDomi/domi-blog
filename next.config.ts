import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  sassOptions: {
    // 모듈에서 상대 경로 대신 `@use "abstracts" as *;` 로 쓸 수 있게 한다.
    loadPaths: [path.join(process.cwd(), "src/styles")],
  },
};

export default nextConfig;
