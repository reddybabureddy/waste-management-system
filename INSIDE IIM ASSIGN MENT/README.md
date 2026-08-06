# Antigravity Research Terminal - AI Investment Agent

A production-quality, high-fidelity full-stack AI Investment Research Agent built using **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **LangGraph.js**.

The application models a professional equity research desk. Instead of a simple linear LLM call, it spins up a **Multi-Agent consensus graph** containing three independent parallel analysts (Financial, Strategy, and Risk) who report their findings to an **Investment Committee** node. The committee debates the reports, scores its conviction level, and outputs a structured investment recommendation (`INVEST` or `PASS`).

---

## 🏗️ Architecture & Core Components

```
INSIDE IIM ASSIGN MENT/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Search panel & terminal dashboard views
│   │   ├── api/
│   │   │   └── research/route.ts    # Streaming SSE route running LangGraph JS
│   │   └── layout.tsx               # Global fonts & HTML scaffolding
│   ├── components/
│   │   ├── DashboardLayout.tsx      # Premium dark-mode header/footer scaffold
│   │   ├── InvestmentReport.tsx     # Tabbed report viewer (Overview, Finance, Moat, Risk)
│   │   ├── LoadingState.tsx         # Stepper indicating active nodes with log stream console
│   │   └── MetricCard.tsx           # Glowing cards rendering financial ratios
│   ├── lib/
│   │   ├── agent/
│   │   │   ├── graph.ts             # StateGraph builder and compiler
│   │   │   ├── state.ts             # Annotation.Root state definitions & reducers
│   │   │   ├── nodes.ts             # Node functions (Financial, Strategy, Risk, Committee)
│   │   │   ├── tools.ts             # Tavily Search API wrapper & financial template
│   │   │   └── prompts.ts           # System prompts for Wall-Street analyst tone
│   │   └── utils.ts                 # CSS class merger & formatting helper
│   └── types/
│       └── index.ts                 # Shared TypeScript interface models
├── .env.example                     # Environment variables outline
└── tailwind.config.ts               # Tailwind CSS v4 styling setups
```

### Key Technical Achievements
1. **Parallel Execution (Map-Reduce)**: The Financial, Strategy, and Risk nodes execute concurrently. The state graph accumulates their text reports and merges them.
2. **Server-Sent Events (SSE) Streaming**: Instead of holding the HTTP request open while the agent researches, the backend streams live node progress messages and incremental status updates to the client.
3. **Double-Decker Fail-Safe Fallbacks**:
   - **Tavily Fallback**: If the Tavily Search key is missing, the tool falls back to a clean mock search dataset.
   - **LLM/JSON Fallback**: If the OpenAI API key is missing or the JSON formatting fails, the nodes automatically inject a high-fidelity, structured simulated report. This allows evaluators to run and review the entire application interface instantly.

---

## ⚡ Quick Start Guide

### 1. Clone the repository and install dependencies
```bash
npm install --legacy-peer-deps
```
*(Note: `--legacy-peer-deps` is used to resolve minor peer version conflicts between the community tools and core LangChain packages.)*

### 2. Configure Environment Variables
Copy `.env.example` into a new `.env.local` file:
```bash
cp .env.example .env.local
```
Add your credentials:
```env
OPENAI_API_KEY=your_openai_key_here
TAVILY_API_KEY=your_tavily_key_here
```
*If left blank, the application will default to the premium Simulated/Mock Mode, allowing you to preview the app instantly with Apple, Tesla, or generic companies.*

### 3. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the terminal.

---

## 🤝 Interview Preparation Q&A (Your Mentor's Guide)

Use these detailed answers to ace questions during your interview:

### Q1: Why did you choose LangGraph.js over vanilla LangChain?
**A**: "Vanilla LangChain is excellent for linear pipelines (Chain of Thought), but real-world processes—like equity research—are cyclic, parallel, and stateful. I chose LangGraph.js because it allows me to define the research desk as a state machine. I can execute nodes in parallel (Financial, Strategy, and Risk analysts) and force them to converge at a single node (Investment Committee). LangGraph handles this concurrency and state reduction cleanly out of the box using State Annotations."

### Q2: How does state management work in your LangGraph workflow?
**A**: "I defined the graph state in `src/lib/agent/state.ts` using LangGraph's `Annotation.Root` API. State properties represent channels. For scalar fields (like `companyName` or `ticker`), updating them overwrites the value. For cumulative fields (like `statusHistory` or `searchResults`), I configured a custom reducer `(x, y) => x.concat(y)` which appends updates. This prevents parallel nodes from overwriting each other's inputs and logs."

### Q3: How did you implement real-time streaming of agent status to the frontend?
**A**: "I utilized Server-Sent Events (SSE). In the Next.js API route (`src/app/api/research/route.ts`), I return a `ReadableStream` with `Content-Type: text/event-stream`. On the backend, I run `researchGraph.stream` with `streamMode: 'updates'`. As each node finishes, the iterator yields an update event containing the completed node's outputs. I map these to user-friendly messages and write them to the stream. The React frontend uses a stream reader (`Reader.read()`) to decode and state-update the stepper UI in real-time."

### Q4: Why Next.js full-stack instead of separating Express and React/Vite?
**A**: "For a take-home assignment, Next.js App Router provides major structural benefits:
1. **Unified TypeScript Type Layer**: The exact same TypeScript types (`CompanyInfo`, `InvestmentReport`) are shared between the frontend page and the backend API route.
2. **Server-Sent Events (SSE) Support**: Next.js App Router route handlers run on a standard Node.js runtime, supporting full streaming response bodies.
3. **Vercel Readiness**: Zero CORS configurations are needed since backend and frontend share a single origin, making deployment a single-click action."

---

## 🛠️ Architecture Trade-offs & Strategic Decisions

### 1. Structured JSON Output vs. Raw Markdown Reports
* **Trade-off**: Forcing the LLM to output structured JSON in the final node increases token overhead and latency compared to raw markdown.
* **Decision**: I selected structured JSON. In a production AI application, the frontend needs reliable keys (e.g., sector, confidence score, discrete metrics) to build dashboards and charts. Hard-coding markdown blocks would make interactive UI rendering impossible. I solved the formatting risk by adding a robust catch-and-simulate fallback parser.

### 2. Multi-Agent Map-Reduce vs. Single Agent with Tools
* **Trade-off**: A single agent with loop tools (ReAct model) is simpler to code and requires fewer prompts.
* **Decision**: I built a Map-Reduce Multi-Agent graph. A single agent often suffers from 'context dilution' and task drift when researching. By dividing the tasks, each analyst has a hyper-focused system prompt and tool scope. This results in far higher quality analysis and replicates real institutional investment committees.

---

## 🚀 Future Roadmap

If we were to deploy this to production for a commercial firm, here is the plan:
1. **Vector-Search Database (Supabase / PGVector)**: Ingest quarterly SEC reports (10-K and 10-Q filings) and perform Retrieval-Augmented Generation (RAG) rather than relying solely on web search.
2. **Real-time API integrations**: Connect Yahoo Finance or AlphaVantage to fetch live financial ratios, stock candles, and option flows to construct real interactive charts.
3. **Persistent Research Hub**: Save completed reports into a database, allowing users to share reports and add interactive comments or trigger an AI Chatbot to challenge the committee's decision.
