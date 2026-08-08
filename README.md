# Throughline

**Reasoning assessment for team builds.**

An adaptive interview instrument for the KPMG AI Builder (Manager) seat. A candidate reasons through a realistic enterprise scenario; the system probes their thinking with follow-up questions generated from their own answers, then produces a structured reasoning profile for a human hiring panel. It assesses how people think, not how they perform, and it never makes the hiring decision.

Live demo: https://throughline-seven.vercel.app

## What it does

- Derives the seat's seven reasoning dimensions from the firm's goal, rather than from a generic posting.
- Runs an adaptive interview: each follow-up question is generated from what the candidate actually said, not from a fixed script.
- Reads each candidate against a team bench of already-filled seats: where they complement the team, and where they duplicate existing strength.
- Produces a profile with per-dimension evidence, a verbatim quote behind each read, a trajectory of how the candidate's reasoning evolved under probing, and an explicit list of decisions handed back to the human panel.
- Never scores, ranks, or recommends.

## Design principle

Built behind Rawls's veil of ignorance: every judgment the engine makes must hold regardless of who the candidate turns out to be. The engine reasons only from what a person said, never from who they seem to be, and is instructed to ignore grammar, tone, and polish. This protects strong thinkers who interview or write unconventionally.

## Stack

- React with the Next.js App Router
- GPT-4o (OpenAI API), accessed through a server-side route so no API key is ever exposed in the browser
- Deployed on Vercel
- Synthetic data only

## Run locally

1. `npm install`
2. Create a file named `.env.local` and add your key:
   `OPENAI_API_KEY=your-key-here`
3. `npm run dev`
4. Open `http://localhost:3000`

## Project structure

- `app/page.jsx` — the interface and the reasoning logic (dimensions, bench, adaptive loop, profile)
- `app/api/assess/route.js` — server-side proxy to the OpenAI API; validates and repairs the model's JSON
- `app/layout.jsx` — root layout

Built for the KPMG AI Builder case study. Assessment use only; synthetic candidates throughout.
