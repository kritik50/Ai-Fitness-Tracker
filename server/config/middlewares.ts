const parseOrigins = (value?: string) =>
  (value || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
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
  const clientUrl = env("CLIENT_URL");
  const configuredOrigins = Array.from(new Set([
    clientUrl ? clientUrl.replace(/\/$/, "") : "",
    "https://ai-fitness-trackers.vercel.app",
    "https://ai-fitness-tracker.vercel.app",
    ...parseOrigins(env("CORS_ORIGINS")),
    ...LOCAL_DEV_ORIGINS,
  ].filter(Boolean)));

  const origin = configuredOrigins;

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

