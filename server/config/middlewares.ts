const parseOrigins = (value?: string) =>
  (value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Vite dev server auto-increments ports (5173, 5174, 5175...) — list them all
const LOCAL_DEV_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
];

export default ({ env }) => {
  const configuredOrigins = [
    env("CLIENT_URL"),
    ...parseOrigins(env("CORS_ORIGINS")),
  ].filter(Boolean);

  // Use configured origins in production, all local dev origins otherwise
  const origin = configuredOrigins.length > 0 ? configuredOrigins : LOCAL_DEV_ORIGINS;

  return [
    "strapi::logger",
    "strapi::errors",
    "strapi::security",
    {
      name: "strapi::cors",
      config: {
        origin,
        headers: ["Content-Type", "Authorization", "Origin", "Accept"],
        credentials: true,
      },
    },
    "strapi::poweredBy",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
  ];
};

