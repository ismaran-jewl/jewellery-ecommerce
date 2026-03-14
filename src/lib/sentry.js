// src/lib/sentry.js

export const initSentry = () => {
  if (typeof window === "undefined") {
    // Server-side initialization would go here
    return;
  }

  // Client-side initialization
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import("@sentry/nextjs").then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        integrations: [
          new Sentry.Replay({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
    });
  }
};

export const captureException = (error, context = {}) => {
  if (typeof window === "undefined") return;

  import("@sentry/nextjs").then((Sentry) => {
    Sentry.captureException(error, { contexts: { custom: context } });
  });
};

export const captureMessage = (message, level = "info") => {
  if (typeof window === "undefined") return;

  import("@sentry/nextjs").then((Sentry) => {
    Sentry.captureMessage(message, level);
  });
};

export const setUser = (user) => {
  if (typeof window === "undefined") return;

  import("@sentry/nextjs").then((Sentry) => {
    Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  });
};

export const clearUser = () => {
  if (typeof window === "undefined") return;

  import("@sentry/nextjs").then((Sentry) => {
    Sentry.setUser(null);
  });
};
