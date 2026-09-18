import { getStore } from "@netlify/blobs";

const empty = { rosters: {}, submissions: [], items: {} };

export default async (req: Request) => {
  const store = getStore({ name: "iglesia", consistency: "strong" });

  if (req.method === "GET") {
    const data = (await store.get("state", { type: "json" })) || empty;
    return Response.json(data);
  }

  if (req.method === "PUT" || req.method === "POST") {
    const body = await req.json();
    await store.setJSON("state", {
      rosters: body.rosters || {},
      submissions: body.submissions || [],
      items: body.items || {},
      rev: body.rev || Date.now()
    });
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/state" };
