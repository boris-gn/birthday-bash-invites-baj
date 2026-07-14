import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

// Social scrapers (Facebook, iMessage, etc.) require an ABSOLUTE image URL.
// Derive the live origin from the incoming request at SSR time so it is always
// correct regardless of which domain the site is served from. Falls back to a
// relative path if the origin can't be determined.
const OG_IMAGE_PATH = "/assets/small.jpeg";

const getOrigin = createServerFn({ method: "GET" }).handler(() => {
  try {
    return getRequestUrl({ xForwardedHost: true, xForwardedProto: true }).origin;
  } catch {
    return "";
  }
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: () => getOrigin(),
  head: ({ loaderData }) => {
    const origin = loaderData ?? "";
    const ogImage = `${origin}${OG_IMAGE_PATH}`;
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Սամվելի 35-ամյակը · 29.07.2026" },
        {
          name: "description",
          content: "Հոբելյարի կողմից\nՀոբելյարի կնոջ կողմից",
        },
        { name: "author", content: "Samvel" },
        { property: "og:title", content: "Սամվելի 35-ամյակը · 29.07.2026" },
        {
          property: "og:description",
          content: "Հոբելյարի կողմից\nՀոբելյարի կնոջ կողմից",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Սամվելի 35-ամյակը" },
        { property: "og:locale", content: "hy_AM" },
        { property: "og:locale:alternate", content: "en_US" },
        { property: "og:image", content: ogImage },
        { property: "og:image:secure_url", content: ogImage },
        { property: "og:image:type", content: "image/jpeg" },
        { property: "og:image:width", content: "1365" },
        { property: "og:image:height", content: "840" },
        { property: "og:image:alt", content: "Սամվելի 35-ամյակը · 29.07.2026" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Սամվելի 35-ամյակը · 29.07.2026" },
        { name: "twitter:description", content: "Հոբելյարի կողմից\nՀոբելյարի կնոջ կողմից" },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:image:alt", content: "Սամվելի 35-ամյակը · 29.07.2026" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter+Tight:wght@300;400;500;600&display=swap",
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
