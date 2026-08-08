"use client";
import React, { useState, useRef, useEffect } from "react";
import { Brain, ArrowRight, AlertCircle, Lock, Sparkles, RotateCcw, ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// THROUGHLINE — reasoning assessment for team builds
// Reads HOW a candidate thinks, not how they perform.
// Built for the KPMG AI Builder assessment. Synthetic data only.
// The system never decides. It surfaces evidence; a human panel decides.
// ---------------------------------------------------------------------------

const SEAT = {
  title: "AI Builder · Manager",
  firmGoal:
    "Move KPMG from AI experimentation to real production adoption of agentic AI, inside a complex and regulated enterprise.",
  derivation:
    "These seven dimensions are derived from the firm goal, not lifted from a generic posting. Six are KPMG's own, adopted from the role spec. The seventh, Autonomy Judgment, is added: in agentic systems, deciding where an agent may act and where a human must hold the line is its own reasoning skill, distinct from governance.",
  criteria: [
    { key: "ambiguity", name: "Ambiguity Navigation", def: "Reframes a vague ask into the real problem before reaching for a solution." },
    { key: "builder", name: "Builder Mindset", def: "Moves from concept to a tangible, working thing, not just a described idea." },
    { key: "workflow", name: "Workflow Thinking", def: "Designs the multi-step process and the handoffs, not just the model." },
    { key: "autonomy", name: "Autonomy Judgment", def: "Reasons about where an agent can act and where a human must stay in the loop." },
    { key: "governance", name: "Governance & Trust", def: "Builds risk, regulatory constraint, and trust in from the start, not bolted on after." },
    { key: "stakeholder", name: "Stakeholder Leadership", def: "Navigates competing priorities and brings skeptical stakeholders along, not around them." },
    { key: "enterprise", name: "Enterprise Fluency", def: "Understands how a large, regulated organization actually operates and what truly constrains delivery." },
  ],
};

const DIM_NAMES = "Ambiguity Navigation | Builder Mindset | Workflow Thinking | Autonomy Judgment | Governance & Trust | Stakeholder Leadership | Enterprise Fluency";

// The team so far: four seats already filled, profiled on the same seven
// dimensions. Synthetic. The bench is what turns this from individual
// assessment into team composition: the profile reads each candidate's
// evidence against the cognition already on the team.
const BENCH = [
  {
    name: "Seat 1 · Manager, Platform",
    summary: "Deep builder and workflow designer; ships fast, thinks in systems.",
    strong: ["Builder Mindset", "Workflow Thinking"],
    thin: ["Stakeholder Leadership", "Governance & Trust"],
  },
  {
    name: "Seat 2 · Senior Consultant, Risk",
    summary: "Governance-first thinker from an audit background; rigorous on trust boundaries.",
    strong: ["Governance & Trust", "Autonomy Judgment"],
    thin: ["Builder Mindset", "Ambiguity Navigation"],
  },
  {
    name: "Seat 3 · Senior Consultant, Design",
    summary: "Strong on reframing ambiguous asks and human-AI handoff design.",
    strong: ["Ambiguity Navigation", "Workflow Thinking"],
    thin: ["Enterprise Fluency", "Governance & Trust"],
  },
  {
    name: "Seat 4 · Senior Consultant, Operations",
    summary: "Knows how the firm actually runs; navigates stakeholders and constraints well.",
    strong: ["Enterprise Fluency", "Stakeholder Leadership"],
    thin: ["Builder Mindset", "Autonomy Judgment"],
  },
];

function benchBlock() {
  return BENCH.map(
    (b) => `- ${b.name}: ${b.summary} Strong: ${b.strong.join(", ")}. Thin: ${b.thin.join(", ")}.`
  ).join("\n");
}

const SCENARIOS = {
  audit: {
    label: "Audit quality review",
    blurb: "A bottlenecked manual review step. A sharp test of autonomy and governance.",
    text: `A KPMG audit service line runs a manual quality-review step: a senior reviewer checks junior analysts' working papers against a checklist before sign-off. It has become a bottleneck and leadership wants an agent to help.

You have two weeks in the AI Lab to build a prototype.

How do you approach it? Walk us through your thinking, not just the solution.`,
  },
  triage: {
    label: "Client request triage",
    blurb: "Competing stakeholders, a hard deadline, thin capacity. A test of leadership and tradeoffs.",
    text: `A service line spends roughly 20 hours a week manually triaging incoming client requests. Leadership wants an AI-enabled solution live within 60 days. The risk team is worried about hallucinations and compliance exposure. Cloud engineering has very little spare capacity this quarter.

You have been asked to lead the initiative.

How would you approach it? Walk us through your thinking, not just the solution.`,
  },
};

const CANDIDATES = {
  A: {
    label: "Candidate A",
    note: "Polished, fluent, confident",
    persona:
      "Polished and articulate but reasons at the surface. Jumps to solutions and tools. Writes in clean, confident, well-structured prose. Rarely names risks, failure modes, competing stakeholders, or where the human must stay in the loop unless pushed hard, and even then stays generic. Pleasant to read, thin underneath.",
    initial: {
      audit:
        "I'd build an agent that automates the quality-review step end to end. The approach: ingest the firm's checklist and a corpus of past working papers to ground the model, then have the LLM read each new working paper, evaluate it against every checklist item, and produce a pass/fail with inline comments tied to each item. I'd wrap it in a clean dashboard with status tracking so reviewers get instant results instead of waiting in a queue, which removes the bottleneck completely. In two weeks I can stand up a working prototype on our approved stack, run it against a backlog of historical papers to show accuracy, and demo it to the service line with real time-savings numbers. The win is speed and consistency: we take a slow, variable manual step and make it instant and uniform across every engagement.",
      triage:
        "I'd move fast to hit the 60-day target with a phased rollout. Week one, I'd map the incoming request types and volumes to find the top categories. Then I'd build an AI classifier that auto-routes each request to the right team with a suggested response drafted and ready to send, using our approved LLM stack with retrieval over past resolved requests so the drafts are grounded. To address the risk team's concern I'd add a confidence threshold so low-confidence items get flagged for manual review, and I'd keep engineering's lift minimal by using managed services and existing APIs rather than custom infrastructure. The headline for leadership is a fast, visible win: the service line gets 20 hours a week back, response times drop, and we have a template we can replicate across other service lines afterward.",
    },
  },
  B: {
    label: "Candidate B",
    note: "Unpolished, terse, asks back",
    persona:
      "Reasons deeply but communicates roughly. Short, choppy, lowercase, imperfect grammar, sometimes answers a question with a sharper question. Instinctively names the real problem, the autonomy boundary, the failure mode, the regulatory catch, and the stakeholder tension. Does not perform or polish. Easy to underrate in a conventional interview, strong underneath.",
    initial: {
      audit:
        "first question before any building. is the bottleneck the checking, or the trust in the checking? totally different builds. if seniors are slow because the checklist is long, you assist the checklist. if theyre slow because they dont trust juniors work, an agent makes that worse not better.\n\nsecond thing. in audit you cant have an agent quietly approve working papers. independence + liability + PCAOB. so the agent does not sign off. ever. it drafts flags for the human reviewer with a citation to the checklist line and the passage that triggered it. human still owns the call, and the audit trail shows a human exercised judgment.\n\nreal risk = automation bias. agent misses a material issue, reviewer starts rubber stamping because the tool looks confident, and now you have worse quality with the appearance of more oversight. thats the failure mode that ends up in front of a regulator.\n\ntwo weeks i build the assist not the autopilot. agent surfaces likely issues + cites sources. i run it shadow mode first, measure agreement between agent flags and what reviewers actually catch, and only expand scope where agreement is high. the metric isnt time saved, its missed-issue rate.",
      triage:
        "three groups want different things and theyre in tension. leadership wants speed, risk wants safety, engineering has no capacity. cant fully satisfy all three in 60 days, so job one is naming that tradeoff out loud in the first meeting, not pretending a tool dissolves it.\n\n60 days + no engineering capacity = i am not shipping a production agent with auto-send. scope it down to what survives contact with reality. v1 is a triage assist: suggests a category, drafts a reply, human still routes and sends. nothing leaves the building unread, which is most of what risk is actually scared of when they say hallucinations.\n\nthe drafting part is where hallucination risk actually lives, so maybe v1 drops drafting entirely and just does categorization with the reasoning visible. earn trust with the boring version, expand once the numbers hold.\n\nand i get risk in the room week one, designing the guardrails with me, not reviewing them after. if they co-own the design theyre an ally at deployment instead of a blocker. same with engineering: i ask for review hours, not build hours, which they can actually give.",
    },
  },
};

const MAX_PROBES = 2;

const STRENGTH = {
  strong: { label: "Strong evidence", color: "var(--ok)" },
  partial: { label: "Partial evidence", color: "var(--warm)" },
  insufficient: { label: "Insufficient evidence", color: "var(--cool)" },
};

function criteriaBlock() {
  return SEAT.criteria.map((c) => `- ${c.name}: ${c.def}`).join("\n");
}

async function callModel(system, messages) {
  const res = await fetch("/api/assess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, messages }),
  });
  const data = await res.json();
  const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
  return text;
}

function parseJSON(text) {
  let clean = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const candidates = ["{", "["].map((c) => clean.indexOf(c)).filter((i) => i !== -1);
  const first = candidates.length ? Math.min(...candidates) : -1;
  const last = Math.max(clean.lastIndexOf("}"), clean.lastIndexOf("]"));
  if (first !== -1 && last > first) clean = clean.slice(first, last + 1);
  return JSON.parse(clean);
}

// A candidate answer should be plain prose. If the model returns JSON anyway,
// flatten every string value into readable text so braces never reach the screen.
function toProse(text) {
  const t = (text || "").trim();
  const stripped = t.replace(/```json/gi, "").replace(/```/g, "").trim();
  const looksJSON = stripped.startsWith("{") || stripped.startsWith("[");
  if (!looksJSON) return t;
  let parsed;
  try { parsed = JSON.parse(stripped); } catch (e) { return t.replace(/[{}\[\]"]/g, "").trim(); }
  const parts = [];
  const walk = (v) => {
    if (typeof v === "string") { const s = v.trim(); if (s) parts.push(s); }
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(parsed);
  const cleaned = parts.filter((s) => /\s/.test(s) && s.length >= 8); // real sentences only
  const use = cleaned.length ? cleaned : parts;
  const joined = use
    .map((s) => (/[.!?]$/.test(s) ? s : s + "."))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  return joined || t;
}

function transcriptToText(thread) {
  return thread
    .map((t) => (t.role === "question" ? `INTERVIEWER: ${t.text}` : `CANDIDATE: ${t.text}`))
    .join("\n\n");
}

export default function Throughline() {
  const [phase, setPhase] = useState("scenario"); // scenario | setup | dialogue | profile
  const [scenarioKey, setScenarioKey] = useState(null);
  const [mode, setMode] = useState(null); // 'A' | 'B' | 'self'
  const [thread, setThread] = useState([]);
  const [draft, setDraft] = useState("");
  const [probeCount, setProbeCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState("");
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showHow, setShowHow] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [thread, profile, busy]);

  function reset() {
    setPhase("scenario");
    setScenarioKey(null);
    setMode(null);
    setThread([]);
    setDraft("");
    setProbeCount(0);
    setBusy(false);
    setError(null);
    setProfile(null);
  }

  function pickScenario(k) {
    setScenarioKey(k);
    setPhase("setup");
  }

  function startWith(m) {
    setMode(m);
    setError(null);
    const firstQ = { role: "question", text: SCENARIOS[scenarioKey].text, isCase: true };
    if (m === "self") {
      setThread([firstQ]);
      setDraft("");
    } else {
      setThread([firstQ, { role: "answer", text: CANDIDATES[m].initial[scenarioKey] }]);
    }
    setPhase("dialogue");
  }

  function probeSystem() {
    return `You are the reasoning engine inside Throughline, an assessment instrument for the KPMG AI Builder (Manager) seat.

The seat exists to serve this firm goal: ${SEAT.firmGoal}

You assess a candidate against seven reasoning dimensions:
${criteriaBlock()}

HOW TO READ AN ANSWER (apply all of these):
- Separate claims from reasoning. "I'd add a human checkpoint" is a claim; explaining where, why there, and what happens on disagreement is reasoning. Only reasoning counts as strong evidence.
- Notice what the candidate did NOT address that the scenario demanded: unnamed stakeholders, unexamined risks, unstated assumptions, missing failure modes.
- Track trajectory across turns: is their thinking deepening under pressure, repeating itself, or retreating to generalities?
- Distinguish borrowed vocabulary from owned understanding. Using the words "governance" or "human-in-the-loop" is not evidence; reasoning about a specific governance tradeoff is.

DESIGN RULES YOU MUST FOLLOW:
1. Apply a veil of ignorance: assess as if you do not know, and cannot infer, the candidate's background, education, native language, gender, neurotype, or social fluency. The only admissible evidence is the reasoning visible in the transcript. If a judgment would change based on WHO you imagine the candidate to be rather than WHAT they reasoned, discard that judgment.
2. Assess reasoning depth ONLY. Ignore spelling, grammar, length, tone, formatting, and polish entirely. A terse or messy answer that reasons well beats a fluent answer that reasons shallowly. This protects candidates who think well but interview or write unconventionally, including neurodivergent candidates.
3. Follow the candidate's own thread. If they opened a sharp line of thinking, probe deeper into it rather than forcing them onto a script.
4. Target the dimension where evidence is weakest or most promising. One question at a time.
5. Make the follow-up SPECIFIC: quote or reference their exact words, then push one level deeper. Force a choice, a tradeoff, or a concrete mechanism. Never ask a generic question that could be asked of any answer.
6. Probe to expose thinking, not to trap. The goal is to learn how they reason.
7. Never produce a hire / no-hire signal, a numeric score, or a ranking. You surface evidence. A human panel decides.

Return ONLY valid JSON, no preamble, no markdown fences, in this exact shape:
{
  "trace": [
    {"dimension": "<one of: ${DIM_NAMES}>",
     "read": "<one or two sentences on what their last answer revealed about this dimension, citing what they actually said or failed to say>",
     "strength": "<strong | partial | insufficient>"}
  ],
  "targeting": "<one sentence: why you are asking the next question now, naming the dimension and the gap or thread>",
  "next_question": "<a single, specific follow-up that references their own words and probes one level deeper>"
}
Include 2 to 4 trace items, only for dimensions the last answer actually touched or conspicuously avoided.`;
  }

  function candidateSystem(persona) {
    return `You are role-playing a job candidate in a reasoning interview for the KPMG AI Builder (Manager) seat. Stay fully in character.

Character: ${persona}

Answer the interviewer's latest question in character, consistent with everything you have said so far. Make the answer substantive and realistic: engage with the specific question asked, stay true to the character's depth (or shallowness) of reasoning, and keep the character's distinctive voice and writing style. 3 to 6 sentences.

CRITICAL: You are a human being speaking out loud. Write in plain conversational prose only. Never output JSON, code, key-value structures, bullet lists, markdown, or code fences. No curly braces. Just talk, the way a person answers a question in an interview. Write ONLY the candidate's spoken answer, nothing else.`;
  }

  function profileSystem() {
    return `You are the reasoning engine inside Throughline, producing the final reasoning profile for a KPMG AI Builder (Manager) candidate.

Seat goal: ${SEAT.firmGoal}
Dimensions:
${criteriaBlock()}

THE TEAM SO FAR (four seats already filled, profiled on the same dimensions):
${benchBlock()}

This instrument composes a team, not just an individual hire. After profiling the candidate, read their evidenced reasoning against the bench: where do they fill a dimension the bench is thin on, and where do they duplicate strength that already exists? Complementarity must be judged ONLY on the reasoning evidence in the transcript, never on background or style. Duplication is information, not disqualification; the panel decides what the team needs.

HOW TO BUILD THE PROFILE:
- Read the full transcript as a trajectory, not a set of isolated answers. Did reasoning deepen under probing, hold steady, or thin out?
- For each dimension, weigh the strongest single piece of evidence, for or against. Reasoning about mechanisms, tradeoffs, and failure modes counts. Vocabulary alone does not.
- Be willing to say a dimension is genuinely strong AND that another is genuinely thin in the same profile. Differentiated reads are more useful to a panel than uniform ones.
- Where the candidate avoided something the scenario demanded, say so explicitly as evidence.

RULES:
- Apply a veil of ignorance: produce a profile you would stand behind without knowing which candidate you were, the polished one or the unpolished one. No judgment may rest on inferred background, fluency, neurotype, or style. Only the reasoning in the transcript is admissible evidence.
- Assess reasoning depth only. Ignore polish, grammar, length, and tone.
- Report EVIDENCE, never a verdict. No hire / no-hire, no score, no ranking.
- Ground every dimension in the candidate's actual words: include a short verbatim quote (under 20 words) drawn directly from the transcript. If a dimension was never touched, use an empty quote and mark strength insufficient.
- Where evidence is thin, say so plainly rather than guessing.
- The "for_human_panel" items are the explicit handoff: what a human must check or decide, because the system will not. Make each one concrete and actionable, including suggested interview questions the panel should ask to resolve open evidence.

Return ONLY valid JSON, no markdown fences, in this exact shape:
{
  "dimensions": [
    {"name": "<dimension name>", "strength": "<strong | partial | insufficient>", "evidence": "<2 to 3 sentences on what the transcript shows, including what was avoided if relevant>", "quote": "<short verbatim excerpt from the candidate, or empty string>"}
  ],
  "trajectory": "<2 sentences: how the candidate's reasoning evolved across the interview under adaptive probing>",
  "team_complement": "<2 to 3 sentences: where this candidate's evidenced reasoning fills gaps on the current bench, and where it duplicates existing strength. Name the specific dimensions and seats. Evidence framing only, no recommendation.>",
  "strengths": ["<short specific phrase grounded in the transcript>", "..."],
  "open_questions": ["<what we still don't know about how this person reasons, and why it matters for this seat>", "..."],
  "for_human_panel": ["<a concrete decision, verification, or suggested interview question the human panel must own. Include at least one item about team composition relative to the bench, e.g. whether the team wants redundancy or coverage on a given dimension; that judgment belongs to the panel, never to this system.>", "..."]
}
Include all seven dimensions. Include 3 to 5 items in each list.`;
  }

  async function submitAnswer(answerText) {
    setError(null);
    setBusy(true);
    let working = [...thread];
    if (mode === "self") {
      working = [...thread, { role: "answer", text: answerText }];
      setThread(working);
      setDraft("");
    }
    try {
      setBusyLabel("Reading the answer");
      const text = await callModel(probeSystem(), [
        { role: "user", content: `Transcript so far:\n\n${transcriptToText(working)}\n\nProduce the trace and the next question.` },
      ]);
      const parsed = parseJSON(text);
      const updated = [...working];
      updated[updated.length - 1] = { ...updated[updated.length - 1], trace: parsed.trace };
      updated.push({ role: "question", text: parsed.next_question, targeting: parsed.targeting });
      setThread(updated);
      setProbeCount((p) => p + 1);

      if (mode !== "self") {
        setBusyLabel("Candidate responding");
        const reply = await callModel(candidateSystem(CANDIDATES[mode].persona), [
          { role: "user", content: `Transcript so far:\n\n${transcriptToText(updated)}\n\nAnswer the interviewer's latest question, in character.` },
        ]);
        setThread([...updated, { role: "answer", text: toProse(reply) }]);
      }
    } catch (e) {
      setError("The reasoning engine could not be reached or returned an unexpected response. Try again.");
    } finally {
      setBusy(false);
      setBusyLabel("");
    }
  }

  async function generateProfile() {
    setError(null);
    setBusy(true);
    setBusyLabel("Assembling the reasoning profile");
    try {
      const raw = await callModel(profileSystem(), [
        { role: "user", content: `Full transcript:\n\n${transcriptToText(thread)}\n\nProduce the reasoning profile.` },
      ]);
      setProfile(parseJSON(raw));
      setPhase("profile");
    } catch (e) {
      setError("Could not assemble the profile. Please try again.");
    } finally {
      setBusy(false);
      setBusyLabel("");
    }
  }

  const probesDone = probeCount >= MAX_PROBES;
  const lastIsQuestion = thread[thread.length - 1]?.role === "question";
  const awaitingSelf = mode === "self" && lastIsQuestion && !busy && !probesDone;
  const awaitingSelfFinal = mode === "self" && lastIsQuestion && !busy && probesDone;

  return (
    <div className="tl-root">
      <style>{CSS}</style>

      <header className="tl-header">
        <div className="tl-brand">
          <div className="tl-mark"><Brain size={18} strokeWidth={2.2} /></div>
          <div>
            <h1>Throughline</h1>
            <p className="tl-tag">Reasoning assessment for team builds</p>
          </div>
        </div>
        <div className="tl-badges">
          <span className="tl-badge"><Lock size={11} /> Synthetic data</span>
          <span className="tl-badge"><AlertCircle size={11} /> No automated decision</span>
        </div>
      </header>

      {/* SEAT + CRITERIA */}
      <section className="tl-seat">
        <div className="tl-seat-head">
          <span className="tl-eyebrow">The seat</span>
          <h2>{SEAT.title}</h2>
        </div>
        <p className="tl-goal"><span className="tl-goal-label">Firm goal</span>{SEAT.firmGoal}</p>
        <p className="tl-derivation">{SEAT.derivation}</p>
        <div className="tl-criteria">
          {SEAT.criteria.map((c, i) => {
            const span = i === SEAT.criteria.length - 1 && SEAT.criteria.length % 2 === 1;
            return (
            <div className="tl-crit" key={c.key} style={span ? { gridColumn: "1 / -1" } : undefined}>
              <span className="tl-crit-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{c.name}</h3>
                <p>{c.def}</p>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT'S DESIGNED */}
      {/* THE TEAM SO FAR */}
      <section className="tl-bench">
        <span className="tl-eyebrow">The team so far · 4 of 10 seats filled</span>
        <p className="tl-bench-lead">Each candidate is read against the cognition already on the bench. The profile reports where they complement it and where they duplicate it.</p>
        <div className="tl-bench-grid">
          {BENCH.map((b) => (
            <div className="tl-bench-card" key={b.name}>
              <h3>{b.name}</h3>
              <p>{b.summary}</p>
              <div className="tl-bench-tags">
                {b.strong.map((s) => (
                  <span className="tl-tag tl-tag-strong" key={s}>{s}</span>
                ))}
                {b.thin.map((s) => (
                  <span className="tl-tag tl-tag-thin" key={s}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <button className="tl-how-toggle" onClick={() => setShowHow((s) => !s)}>
        <ChevronDown size={14} style={{ transform: showHow ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        How this instrument is designed
      </button>
      {showHow && (
        <div className="tl-how">
          <p><strong>It is designed behind a veil of ignorance.</strong> The test for every judgment the engine makes: would it hold if you did not know which candidate you were, the polished one or the terse one, the native speaker or not, neurotypical or not? Any read that depends on who the candidate seems to be, rather than what they reasoned, is inadmissible by instruction.</p>
          <p><strong>It assesses reasoning, not polish.</strong> The engine is instructed to ignore spelling, grammar, length, and tone, and to weigh only how a person thinks. This protects strong thinkers who interview or write unconventionally, including neurodivergent candidates, who conventional screens routinely underrate.</p>
          <p><strong>It follows the candidate's own thread.</strong> Each follow-up is generated from what the person actually said, targeting the dimension with the weakest or most promising evidence, rather than marching through a fixed script.</p>
          <p><strong>It never decides.</strong> No score, no ranking, no hire signal. It surfaces evidence, quotes the candidate's own words, and hands an explicit list of judgments back to a human panel. The decision stays with people.</p>
        </div>
      )}

      {/* SCENARIO SELECT */}
      {phase === "scenario" && (
        <section className="tl-setup">
          <span className="tl-eyebrow">Step 1 · Choose a scenario</span>
          <p className="tl-setup-lead">Each scenario is calibrated to surface different dimensions. Pick one to run.</p>
          <div className="tl-cards tl-cards-2">
            {Object.entries(SCENARIOS).map(([k, s]) => (
              <button key={k} className="tl-cand-card" onClick={() => pickScenario(k)}>
                <span className="tl-cand-tag">{s.label}</span>
                <span className="tl-cand-note">{s.blurb}</span>
                <span className="tl-cand-go">Choose <ArrowRight size={14} /></span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* CANDIDATE SELECT */}
      {phase === "setup" && (
        <section className="tl-setup">
          <span className="tl-eyebrow">Step 2 · Run the assessment</span>
          <p className="tl-setup-lead">
            Scenario: <strong>{SCENARIOS[scenarioKey].label}</strong>. Watch a synthetic candidate run end to end, or answer it yourself.
            <button className="tl-link" onClick={() => { setScenarioKey(null); setPhase("scenario"); }}>change scenario</button>
          </p>
          <div className="tl-cards">
            {["A", "B"].map((k) => (
              <button key={k} className="tl-cand-card" onClick={() => startWith(k)}>
                <span className="tl-cand-tag">{CANDIDATES[k].label}</span>
                <span className="tl-cand-note">{CANDIDATES[k].note}</span>
                <span className="tl-cand-go">Run interview <ArrowRight size={14} /></span>
              </button>
            ))}
            <button className="tl-cand-card tl-cand-self" onClick={() => startWith("self")}>
              <span className="tl-cand-tag">Answer it yourself</span>
              <span className="tl-cand-note">Type your own responses</span>
              <span className="tl-cand-go">Begin <ArrowRight size={14} /></span>
            </button>
          </div>
        </section>
      )}

      {/* DIALOGUE */}
      {(phase === "dialogue" || phase === "profile") && (
        <section className="tl-dialogue">
          <div className="tl-dialogue-head">
            <span className="tl-eyebrow">
              {SCENARIOS[scenarioKey].label} · {mode === "self" ? "your interview" : CANDIDATES[mode].label}
            </span>
            <button className="tl-reset" onClick={reset}><RotateCcw size={12} /> Restart</button>
          </div>

          {thread.map((t, i) => (
            <div key={i} className={`tl-turn tl-${t.role}`}>
              {t.role === "question" ? (
                <div className="tl-q">
                  <span className="tl-q-label">{t.isCase ? "Scenario" : "Follow-up"}</span>
                  {t.targeting && <p className="tl-targeting">Targeting: {t.targeting}</p>}
                  <p className="tl-q-text">{t.text}</p>
                </div>
              ) : (
                <div className="tl-a">
                  <span className="tl-a-label">{mode === "self" ? "You" : CANDIDATES[mode].label}</span>
                  <p className="tl-a-text">{t.text}</p>
                  {t.trace && (
                    <div className="tl-trace">
                      <span className="tl-trace-label">System read</span>
                      {t.trace.map((tr, j) => (
                        <div className="tl-trace-row" key={j}>
                          <span className="tl-trace-dim">{tr.dimension}</span>
                          <span className="tl-trace-read">{tr.read}</span>
                          <span className="tl-pill" style={{ "--pill": STRENGTH[tr.strength]?.color || "var(--cool)" }}>
                            {STRENGTH[tr.strength]?.label || tr.strength}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {busy && (
            <div className="tl-busy"><Sparkles size={14} className="tl-spin" /> {busyLabel}…</div>
          )}
          {error && <div className="tl-error"><AlertCircle size={14} /> {error}</div>}

          {awaitingSelf && (
            <div className="tl-input">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your answer. Reason out loud. Polish does not matter here." rows={5} />
              <button className="tl-submit" disabled={!draft.trim()} onClick={() => submitAnswer(draft.trim())}>
                Submit answer <ArrowRight size={15} />
              </button>
            </div>
          )}
          {awaitingSelfFinal && (
            <div className="tl-input">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder="Final answer. Then generate the profile." rows={5} />
              <button className="tl-submit" disabled={!draft.trim()} onClick={() => { const a = draft.trim(); setThread((th)=>[...th,{role:"answer",text:a}]); setDraft(""); }}>
                Submit final answer <ArrowRight size={15} />
              </button>
            </div>
          )}

          {mode !== "self" && !busy && !lastIsQuestion && !probesDone && phase === "dialogue" && (
            <button className="tl-submit tl-continue" onClick={() => submitAnswer(thread[thread.length - 1].text)}>
              Generate next follow-up <ArrowRight size={15} />
            </button>
          )}

          {!busy && phase === "dialogue" && !lastIsQuestion && probesDone && (
            <button className="tl-profile-btn" onClick={generateProfile}>
              Generate reasoning profile <ArrowRight size={15} />
            </button>
          )}

          <div ref={endRef} />
        </section>
      )}

      {/* PROFILE */}
      {phase === "profile" && profile && (
        <section className="tl-profile">
          <span className="tl-eyebrow">Reasoning profile</span>
          <p className="tl-profile-lead">Evidence for a human panel. Not a decision.</p>

          {profile.trajectory && (
            <p className="tl-trajectory"><span className="tl-traj-label">Trajectory</span>{profile.trajectory}</p>
          )}

          {profile.team_complement && (
            <p className="tl-trajectory tl-complement"><span className="tl-traj-label" style={{color:"var(--inkblue)"}}>Team complement</span>{profile.team_complement}</p>
          )}

          <div className="tl-dims">
            {profile.dimensions?.map((d, i) => (
              <div className="tl-dim" key={i}>
                <div className="tl-dim-top">
                  <h3>{d.name}</h3>
                  <span className="tl-pill" style={{ "--pill": STRENGTH[d.strength]?.color || "var(--cool)" }}>
                    {STRENGTH[d.strength]?.label || d.strength}
                  </span>
                </div>
                <p>{d.evidence}</p>
                {d.quote && d.quote.trim() && <blockquote className="tl-dim-quote">“{d.quote}”</blockquote>}
              </div>
            ))}
          </div>

          <div className="tl-cols">
            <div className="tl-col">
              <h4>Strengths observed</h4>
              <ul>{profile.strengths?.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
            <div className="tl-col">
              <h4>Still unknown</h4>
              <ul>{profile.open_questions?.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          </div>

          <div className="tl-handoff">
            <div className="tl-handoff-head"><Lock size={14} /> For the human panel to decide</div>
            <ul>{profile.for_human_panel?.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <p className="tl-handoff-note">Throughline stops here on purpose. It does not score, rank, or recommend. These judgments belong to people.</p>
          </div>

          <button className="tl-reset tl-reset-big" onClick={reset}><RotateCcw size={13} /> Run another</button>
        </section>
      )}

      <footer className="tl-footer">
        Demo instrument · KPMG AI Builder assessment · Synthetic candidates · The system surfaces evidence, people decide
      </footer>
    </div>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');

.tl-root{
  --paper:#F4F2EC; --card:#FCFBF7; --ink:#191A1F; --inkblue:#1F2D45;
  --warm:#C2702C; --cool:#5A6B86; --ok:#2F7A5B; --line:#E4DFD3; --muted:#74726A;
  font-family:'Space Grotesk',system-ui,sans-serif;
  background:var(--paper); color:var(--ink);
  max-width:860px; margin:0 auto; padding:28px 22px 60px;
  -webkit-font-smoothing:antialiased;
}
.tl-root *{box-sizing:border-box;}
.tl-eyebrow{font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--cool);}

.tl-header{display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap; padding-bottom:20px; border-bottom:1px solid var(--line);}
.tl-brand{display:flex; gap:12px; align-items:center;}
.tl-mark{width:38px; height:38px; border-radius:9px; background:var(--inkblue); color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0;}
.tl-header h1{font-size:23px; font-weight:600; margin:0; letter-spacing:-.02em;}
.tl-tag{margin:1px 0 0; font-size:13px; color:var(--muted);}
.tl-badges{display:flex; gap:7px; flex-wrap:wrap;}
.tl-badge{font-family:'IBM Plex Mono',monospace; font-size:10.5px; color:var(--cool); border:1px solid var(--line); border-radius:20px; padding:4px 9px; display:inline-flex; gap:4px; align-items:center; background:var(--card);}

.tl-seat{margin-top:26px;}
.tl-seat-head h2{font-size:20px; font-weight:600; margin:5px 0 0; letter-spacing:-.01em;}
.tl-goal{margin:16px 0 0; font-size:15px; line-height:1.55; background:var(--card); border:1px solid var(--line); border-left:3px solid var(--inkblue); border-radius:8px; padding:13px 15px;}
.tl-goal-label{display:block; font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--inkblue); margin-bottom:5px;}
.tl-derivation{margin:14px 0 0; font-size:14px; line-height:1.6; color:var(--muted);}
.tl-criteria{margin-top:16px; display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--line); border:1px solid var(--line); border-radius:10px; overflow:hidden;}
.tl-crit{background:var(--card); padding:15px 16px; display:flex; gap:12px;}
.tl-crit-num{font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--warm); padding-top:2px;}
.tl-crit h3{margin:0; font-size:14.5px; font-weight:600;}
.tl-crit p{margin:4px 0 0; font-size:13px; line-height:1.5; color:var(--muted);}

.tl-how-toggle{margin-top:18px; background:none; border:none; color:var(--cool); font-family:'IBM Plex Mono',monospace; font-size:11.5px; letter-spacing:.06em; cursor:pointer; display:inline-flex; gap:6px; align-items:center; padding:4px 0;}
.tl-how{margin-top:10px; background:var(--card); border:1px solid var(--line); border-radius:10px; padding:6px 18px;}
.tl-how p{font-size:13.5px; line-height:1.6; color:#2c2d33; margin:13px 0;}
.tl-how strong{color:var(--ink); font-weight:600;}

.tl-setup{margin-top:30px; padding-top:26px; border-top:1px solid var(--line);}
.tl-setup-lead{margin:8px 0 18px; font-size:15px; line-height:1.5; max-width:62ch;}
.tl-link{background:none; border:none; color:var(--warm); font-family:inherit; font-size:13.5px; cursor:pointer; text-decoration:underline; padding:0 0 0 8px;}
.tl-cards{display:grid; grid-template-columns:repeat(3,1fr); gap:12px;}
.tl-cards-2{grid-template-columns:repeat(2,1fr);}
.tl-cand-card{text-align:left; background:var(--card); border:1px solid var(--line); border-radius:12px; padding:16px 15px; cursor:pointer; display:flex; flex-direction:column; gap:5px; transition:border-color .15s, transform .15s; font-family:inherit;}
.tl-cand-card:hover{border-color:var(--inkblue); transform:translateY(-2px);}
.tl-cand-self{border-style:dashed;}
.tl-cand-tag{font-size:15px; font-weight:600;}
.tl-cand-note{font-size:12.5px; color:var(--muted); line-height:1.4;}
.tl-cand-go{margin-top:8px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.06em; color:var(--warm); display:inline-flex; gap:5px; align-items:center;}

.tl-dialogue{margin-top:30px; padding-top:24px; border-top:1px solid var(--line);}
.tl-dialogue-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; gap:12px; flex-wrap:wrap;}
.tl-reset{background:none; border:1px solid var(--line); border-radius:20px; padding:5px 11px; font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--muted); cursor:pointer; display:inline-flex; gap:5px; align-items:center;}
.tl-reset:hover{border-color:var(--warm); color:var(--warm);}

.tl-turn{margin-bottom:18px;}
.tl-q{background:var(--inkblue); color:#EDEFF4; border-radius:12px; padding:16px 18px;}
.tl-q-label{font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:#9fb0cc;}
.tl-targeting{margin:8px 0 0; font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:#b9c6dd; line-height:1.5;}
.tl-q-text{margin:8px 0 0; font-family:'Newsreader',serif; font-size:16.5px; line-height:1.6; white-space:pre-wrap;}

.tl-a{background:var(--card); border:1px solid var(--line); border-radius:12px; padding:16px 18px;}
.tl-a-label{font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--warm);}
.tl-a-text{margin:8px 0 0; font-family:'Newsreader',serif; font-size:16.5px; line-height:1.65; white-space:pre-wrap; color:#23242b;}

.tl-trace{margin-top:15px; padding-top:14px; border-top:1px dashed var(--line);}
.tl-trace-label{font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.14em; text-transform:uppercase; color:var(--cool); display:block; margin-bottom:9px;}
.tl-trace-row{display:grid; grid-template-columns:170px 1fr auto; gap:12px; align-items:start; padding:7px 0;}
.tl-trace-dim{font-family:'IBM Plex Mono',monospace; font-size:11.5px; color:var(--inkblue); font-weight:500;}
.tl-trace-read{font-size:11.5px; color:#4a4c55; line-height:1.5;}
.tl-pill{font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:.04em; color:var(--pill); border:1px solid var(--pill); border-radius:20px; padding:3px 8px; white-space:nowrap; opacity:.92;}

.tl-busy{display:flex; gap:8px; align-items:center; font-family:'IBM Plex Mono',monospace; font-size:12.5px; color:var(--cool); padding:10px 2px;}
.tl-spin{animation:tlspin 1.4s linear infinite;}
@keyframes tlspin{to{transform:rotate(360deg);}}
.tl-error{display:flex; gap:8px; align-items:center; font-size:13px; color:#a23b2e; background:#faf0ee; border:1px solid #eccfc9; border-radius:8px; padding:11px 13px;}

.tl-input{margin-top:6px;}
.tl-input textarea{width:100%; resize:vertical; font-family:'Newsreader',serif; font-size:16px; line-height:1.6; color:var(--ink); background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 16px;}
.tl-input textarea:focus{outline:none; border-color:var(--inkblue);}

.tl-submit,.tl-profile-btn{margin-top:12px; background:var(--inkblue); color:#fff; border:none; border-radius:10px; padding:12px 18px; font-family:'Space Grotesk',sans-serif; font-size:14px; font-weight:500; cursor:pointer; display:inline-flex; gap:8px; align-items:center; transition:opacity .15s;}
.tl-submit:hover,.tl-profile-btn:hover{opacity:.88;}
.tl-submit:disabled{opacity:.4; cursor:not-allowed;}
.tl-continue{background:var(--card); color:var(--inkblue); border:1px solid var(--inkblue);}
.tl-profile-btn{background:var(--warm);}

.tl-profile{margin-top:30px; padding-top:24px; border-top:1px solid var(--line);}
.tl-profile-lead{margin:7px 0 18px; font-family:'Newsreader',serif; font-size:17px; font-style:italic; color:var(--inkblue);}
.tl-trajectory{margin:0 0 16px; font-size:14.5px; line-height:1.6; background:var(--card); border:1px solid var(--line); border-left:3px solid var(--warm); border-radius:8px; padding:12px 15px; color:#34353c;}
.tl-complement{border-left-color:var(--inkblue);}
.tl-traj-label{display:block; font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--warm); margin-bottom:5px;}

.tl-bench{margin-top:24px; padding-top:22px; border-top:1px solid var(--line);}
.tl-bench-lead{margin:8px 0 14px; font-size:13.5px; line-height:1.55; color:var(--muted); max-width:64ch;}
.tl-bench-grid{display:grid; grid-template-columns:1fr 1fr; gap:10px;}
.tl-bench-card{background:var(--card); border:1px solid var(--line); border-radius:11px; padding:13px 15px;}
.tl-bench-card h3{margin:0; font-size:13.5px; font-weight:600;}
.tl-bench-card p{margin:5px 0 9px; font-size:12.5px; line-height:1.5; color:var(--muted);}
.tl-bench-tags{display:flex; flex-wrap:wrap; gap:5px;}
.tl-tag{font-family:'IBM Plex Mono',monospace; font-size:9.5px; letter-spacing:.03em; border-radius:14px; padding:2px 8px; border:1px solid;}
.tl-tag-strong{color:var(--ok); border-color:var(--ok); opacity:.9;}
.tl-tag-thin{color:var(--muted); border-color:var(--line); text-decoration:line-through; opacity:.75;}
.tl-dims{display:flex; flex-direction:column; gap:10px;}
.tl-dim{background:var(--card); border:1px solid var(--line); border-radius:11px; padding:15px 17px;}
.tl-dim-top{display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:7px;}
.tl-dim-top h3{margin:0; font-size:15px; font-weight:600;}
.tl-dim p{margin:0; font-size:14px; line-height:1.6; color:#34353c;}
.tl-dim-quote{margin:11px 0 0; padding:8px 0 8px 14px; border-left:2px solid var(--warm); font-family:'Newsreader',serif; font-style:italic; font-size:14.5px; line-height:1.55; color:#43444c;}

.tl-cols{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px;}
.tl-col{background:var(--card); border:1px solid var(--line); border-radius:11px; padding:14px 16px;}
.tl-col h4{margin:0 0 9px; font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--cool); font-weight:500;}
.tl-col ul{margin:0; padding-left:17px;}
.tl-col li{font-size:13.5px; line-height:1.55; margin-bottom:7px; color:#34353c;}

.tl-handoff{margin-top:14px; background:#1a1c22; color:#e9eaef; border-radius:12px; padding:18px 20px;}
.tl-handoff-head{display:flex; gap:8px; align-items:center; font-family:'IBM Plex Mono',monospace; font-size:11.5px; letter-spacing:.1em; text-transform:uppercase; color:#d8a06a;}
.tl-handoff ul{margin:13px 0 0; padding-left:18px;}
.tl-handoff li{font-size:14px; line-height:1.6; margin-bottom:9px; color:#e9eaef;}
.tl-handoff-note{margin:14px 0 0; font-size:12.5px; line-height:1.55; color:#9a9ca6; font-style:italic;}

.tl-reset-big{margin-top:20px;}
.tl-footer{margin-top:34px; padding-top:18px; border-top:1px solid var(--line); font-family:'IBM Plex Mono',monospace; font-size:10.5px; letter-spacing:.04em; color:var(--cool); line-height:1.6;}

@media (max-width:640px){
  .tl-criteria{grid-template-columns:1fr;}
  .tl-bench-grid{grid-template-columns:1fr;}
  .tl-cards,.tl-cards-2{grid-template-columns:1fr;}
  .tl-cols{grid-template-columns:1fr;}
  .tl-trace-row{grid-template-columns:1fr; gap:3px;}
  .tl-trace-read{margin-bottom:3px;}
}
@media (prefers-reduced-motion:reduce){ .tl-spin{animation:none;} }
`;
