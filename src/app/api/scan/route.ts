export async function POST(req: Request) {
  const { url } = await req.json();

  const result: any = {};

  try {
    const res = await fetch(url);
    result.status = res.status;
    result.headers = Object.fromEntries(res.headers.entries());
    result.ok = res.ok;
  } catch (e) {
    result.error = e.message;
  }

  try {
    const robots = await fetch(url + "/robots.txt");
    result.robots = await robots.text();
  } catch {
    result.robots = "Not found";
  }

  try {
    const sitemap = await fetch(url + "/sitemap.xml");
    result.sitemap = await sitemap.text();
  } catch {
    result.sitemap = "Not found";
  }

  return Response.json(result);
}
