/** @type {import('next').NextConfig} */
const nextConfig = {
  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.jsの開発モードに必要
              "style-src 'self' 'unsafe-inline'", // Tailwind CSSに必要
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self' https://api.openai.com https://api.anthropic.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // 本番環境でのログ最適化
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
};

module.exports = nextConfig;
