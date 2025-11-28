# FrontFrEND

## Agentic AI Frontend Architect 🚀

**FrontFrEND** is an advanced **Agentic AI** system designed to autonomously analyze, refactor, and elevate the frontend quality of GitHub repositories. Unlike simple code assistants, FrontFrEND employs a **multi-agent orchestration** strategy to understand your codebase, detect UI frameworks, and deploy specialized AI crews to implement modern design patterns.

----
[![Watch the video](https://markdown-videos-api.jorgenkh.no/url?url=https%3A%2F%2Fyoutu.be%2FoGVMxunVoQ8)](https://youtu.be/oGVMxunVoQ8)
----
## 🤖 Agentic Architecture

FrontFrEND operates as a pipeline of autonomous agents, each with a specific role in the frontend engineering lifecycle:

### 1. 🕵️‍♂️ **Reconnaissance Agent (Git & UI Detector)**
- **Phase 1 & 2**: Deeply scans the target repository to build a comprehensive file tree.
- **Intelligence**: Automatically identifies the underlying tech stack (React, Vue, Vanilla JS, etc.) and locates key UI entry points.

### 2. 🎨 **UI Advisor Crew**
- **Phase 3**: A specialized agent crew that acts as a Senior Frontend Architect.
- **Role**: Critiques existing UI files against modern UX/UI best practices (accessibility, responsiveness, aesthetics).
- **Action**: Generates high-fidelity code improvements, leveraging modern libraries like **Tailwind CSS** and **Shadcn UI**.

### 3. ⚙️ **Backend Integration Crew**
- **Phase 4**: Ensures that frontend changes don't break application logic.
- **Role**: Analyzes the relationship between UI components and backend logic.
- **Action**: Refactors backend code (if necessary) to support new frontend features, ensuring a seamless full-stack evolution.

### 4. 🛡️ **Design Validator & Aggregator**
- **Phase 5**: The final gatekeeper.
- **Role**: Validates the integrity of the generated code.
- **Action**: Aggregates all changes into a structured result set, ready for live preview or pull request submission.

---

## ✨ Key Features

- **Autonomous Repo Analysis**: Just provide a GitHub URL; the agents handle the cloning, scanning, and context building.
- **Intelligent Refactoring**: Goes beyond linting—rewrites entire components for better performance and maintainability.
- **Live Preview Engine**: Instantly visualize the "Before" vs. "After" states of your application in a sandboxed environment.
- **Self-Healing Workflows**: The agentic workflow includes retry mechanisms and error handling to ensure robust code generation.

---

## 🛠️ Tech Stack

### **Core AI & Backend**
- **Orchestration**: Python, [CrewAI]
- **LLM Interface**: [LiteLLM] & [Gemini]
- **API Server**: Flask
- **Package Management**: `uv`

### **Frontend Dashboard**
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: TanStack Query
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- `uv` package manager

### 1. Backend Setup
```bash
cd backend
# Install dependencies
uv sync

# Run the Agentic Backend
uv run app.py
```

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install

# Start the Dashboard
npm run dev
```

### 3. Run the Agent
Open your browser to `http://localhost:5173` (or the port shown in your terminal), enter a GitHub repository URL, and watch the agents get to work!

---

## 🤝 Contributing
We welcome contributions to make our agents smarter! Please see `CONTRIBUTING.md` for details on how to train or modify the agent crews.

---








