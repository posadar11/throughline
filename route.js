export const runtime = "nodejs";
export const maxDuration = 60;

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

async function call(system, messages, max_tokens) {
  return fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens, system, messages }),
  });
}

function extractText(data) {
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

function cleanToJSON(t) {
  let s = t.replace(/```json/gi, "").replace(/```/g, "").trim();
  const starts = ["{", "["].map((c) => s.indexOf(c)).filter((i) => i !== -1);
  const first = starts.length ? Math.min(...starts) : -1;
  const last = Math.max(s.lastIndexOf("}"), s.lastIndexOf("]"));
  if (first !== -1 && last > first) s = s.slice(first, last + 1);
  return s;
}

export async function POST(req) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ content: [{ type: "text", text: '{"error":"ANTHROPIC_API_KEY is not set"}' }] }, { status: 200 });
    }
    const { system, messages } = await req.json();

    const r = await call(system, messages, 3000);
    const data = await r.json();

    if (!r.ok) {
      // Surface Anthropic's error in a shape the client can read without crashing.
      return Response.json({ content: [{ type: "text", text: JSON.stringify({ error: data.error || data }) }] }, { status: 200 });
    }

    let text = cleanToJSON(extractText(data));

    let valid = true;
    try { JSON.parse(text); } catch (e) { valid = false; }

    if (!valid) {
      const rep = await call(
        "You are a JSON repair tool. The user gives text meant to be a single JSON object that may have errors: unescaped quotes inside string values, trailing commas, missing braces, or surrounding prose. Return ONLY the corrected, valid JSON object. No prose, no markdown, no code fences.",
        [{ role: "user", content: text }],
        3000
      );
      if (rep.ok) {
        const repData = await rep.json();
        const repaired = cleanToJSON(extractText(repData));
        try { JSON.parse(repaired); text = repaired; } catch (e2) {}
      }
    }

    return Response.json({ content: [{ type: "text", text }] }, { status: 200 });
  } catch (e) {
    return Response.json({ content: [{ type: "text", text: JSON.stringify({ error: String(e) }) }] }, { status: 200 });
  }
}
