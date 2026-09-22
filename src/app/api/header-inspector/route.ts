export async function POST(req: Request) {
  const { url } = await req.json();

  const output: any = {
    headers: {},
    security: {},
    caching: {},
    compression: {},
    cookies: {},
    cors: {},
    redirectChain: []
  };

  try {
    let currentUrl = url;
    let redirectCount = 0;

    while (redirectCount < 10) {
      const res = await fetch(currentUrl, { redirect: "manual" });

      const headers = Object.fromEntries(res.headers.entries());
      output.headers[currentUrl] = headers;

      // Security headers
      output.security[currentUrl] = {
        hasHSTS: !!headers["strict-transport-security"],
        hasXFrame: !!headers["x-frame-options"],
        hasXSS: !!headers["x-xss-protection"],
        hasContentType: !!headers["content-type"],
        hasCSP: !!headers["content-security-policy"]
      };

      // Caching
      output.caching[currentUrl] = {
        cacheControl: headers["cache-control"] || "missing",
        expires: headers["expires"] || "missing"
      };

      // Compression
      output.compression[currentUrl] = {
        encoding: headers["content-encoding"] || "none"
      };

      // Cookies
      output.cookies[currentUrl] = headers["set-cookie"] || "none";

      // CORS
      output.cors[currentUrl] = {
        origin: headers["access-control-allow-origin"] || "none",
        methods: headers["access-control-allow-methods"] || "none"
      };

      // Redirect handling
      if (res.status >= 300 && res.status < 400) {
        const location = headers["location"];
        if (!location) break;

        output.redirectChain.push({
          from: currentUrl,
          to: location,
          status: res.status
        });

        currentUrl = location;
        redirectCount++;
      } else {
        break;
      }
    }
  } catch (e) {
    output.error = e.message;
  }

  return Response.json(output);
}
