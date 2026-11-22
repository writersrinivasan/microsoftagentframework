# MAF Academy — Microsoft Agent Framework workshop

Interactive learning site + live sandbox for the 60-minute Microsoft Agent Framework (Python) workshop.

## Run the web app
```bash
npm install
npm run dev          # http://localhost:3000
```
Participants click **Add Groq key** (top-right) and paste their own key from https://console.groq.com/keys.
The key stays in their browser's localStorage and is forwarded per request through `/api/groq/*` — never stored or logged on the server.

## What's inside
| Area | Path | What it does |
|---|---|---|
| Learn | `/learn/[module]` | 8 modules with infographics, verified code, takeaways, hands-on activity, quiz |
| Capstone | `/project` | Business Operations Assistant architecture, exercise roadmap, full code |
| Agent Playground | `/sandbox?tab=playground` | Real Groq tool-calling agent: 7 business tools, session memory, context provider, middleware, execution trace, live "Python equivalent" |
| Multi-Agent Studio | `/sandbox?tab=studio` | Sequential / concurrent / coordinator orchestration, live graph, human-approval pause, timeline |
| Code Lab | `/sandbox?tab=code` | 7 exercises with starters, AI hint & review, reference solutions |
| AI Tutor | floating button | Page-aware tutor grounded on the current MAF API |

## Python labs (`labs/`)
The site renders these files verbatim — edit them and the site updates.
```bash
cd labs
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env     # add GROQ_API_KEY
python ex1_first_agent.py
pytest ex7_testing_monitoring.py -q
python capstone_business_ops.py
```
Verified against **agent-framework-core 1.26.0**. Switch provider by editing `labs/common.py` only.
Content lives in `src/content/modules.ts`; the tutor's API grounding is `src/lib/maf-cheatsheet.ts`.
