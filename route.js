export const runtime = "nodejs";
export const maxDuration = 60;

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

async function call(system, messages, max_tokens) {
  return fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
}

function extractText(data) {
  return data.choices?.[0]?.message?.content ?? "";
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
    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ content: [{ type: "text", text: '{"error":"OPENAI_API_KEY is not set"}' }] }, { status: 200 });
    }
    const { system, messages } = await req.json();

    const r = await call(system, messages, 3000);
    const data = await r.json();

    if (!r.ok) {
      // Surface OpenAI's error in a shape the client can read without crashing.
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
