# FinClear (ClearPath Finance)

> **Tackling Ethical Dilemmas in AI-Powered Finance: Fairness, Bias, and Inclusive Access**

FinClear is an AI-powered financial guardian designed to democratize financial literacy and protect vulnerable consumers from predatory lending. By prioritizing transparency, inclusivity, and privacy, FinClear bridges the gap between complex financial jargon and everyday consumers.

## 🌟 Core Features

- **📄 Contract Decoder:** Upload or paste any financial contract. Our AI scans for predatory clauses, hidden fees, and debt traps, translating them into simple, plain language with actionable red flags.
- **📊 Chart Explainer:** Demystifies complex financial charts and terms, making financial data accessible to everyone, regardless of their background.
- **🔍 Jargon Scanner:** Instantly translates complicated financial terminology (e.g., APR, Rollover Fees, Amortization) into easy-to-understand concepts.
- **❓ Question Generator:** Empowers users by generating smart, targeted questions they should ask lenders before signing any agreement.
- **🛡️ Predatory Lending Simulator:** Educates users on the dangers of debt traps and demonstrates how unfair clauses can snowball into uncontrollable debt.
- **♿ Inclusive & Accessible Design:** Features a built-in "High Clarity" mode for visually impaired users (adjustable font scaling), full Dark/Light mode support, and bilingual support (English/中文) to ensure broad access.

## 🛠️ Technical Architecture

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI
- **State & Data:** TanStack React Query, React Context
- **AI Integration:** LLMs used for intelligent contract analysis, terminology extraction, and question generation.
- **Routing:** React Router v6

## 🚀 How to Use (Getting Started)

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, bun, or pnpm

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd FinClear
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or run 'bun install' since bun.lock is present
   ```

3. **Environment Setup:**
   Ensure your `.env` file is configured with the necessary API keys for your AI provider.
   ```env
   # Example
   VITE_AI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Navigate to `http://localhost:xxxx` in your browser. 
   - Experience the landing page.
   - Enter the **Dashboard** to try out the Contract Decoder, Jargon Scanner, and Chart Explainer.
   - Toggle the **Language (English/中文)** and **High Clarity** accessibility settings on the right panel to test its inclusive design features.

## 🤝 The Hackathon Mission

Built for the Hackathon challenge: **Tackling ethical dilemmas in AI-powered finance**. 

FinClear directly addresses:
- **Fairness:** Exposing predatory behavior and hidden contract traps before users sign.
- **Inclusive Access:** Multi-language support and visual accessibility tools ensure the platform serves diverse, often-marginalized communities who are most at risk of predatory lending.
- **Empowerment:** Shifting the power dynamic from institutions to the consumer through knowledge, simplified explanations, and actionable questions.

## 📄 License
This project is licensed under the MIT License.
