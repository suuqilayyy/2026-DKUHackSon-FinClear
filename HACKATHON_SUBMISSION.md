## Inspiration
Predatory lending and complex financial jargon often trap vulnerable consumers in cycles of debt. Financial literacy shouldn't be a privilege of the elite. We were inspired to build FinClear to bridge the gap between "legalese" and "layman's terms," democratizing financial protection and ensuring that every borrower understands the fine print before they sign their future away.

## What it does
FinClear is an AI-powered financial guardian designed to empower consumers. It decodes complex loan contracts to identify hidden fees, predatory clauses, and potential debt traps. Users can upload contract images (with manual on-device redaction) or paste text. The platform features:
- **Agent Arena:** Watch a "Public Counsel" agent debate a "Lender" agent over your contract's fairness.
- **Privacy Receipt:** A transparent system ensuring you know exactly what is shared with the AI.
- **Jargon Scanner:** Instant translation of complex terms (APR, Amortization, etc.) into plain language.
- **Revision Report:** Generates a professional document with suggested changes to take back to lenders.
- **Inclusive Design:** High Clarity Mode and bilingual support (English/中文) for broad accessibility.

## How we built it
We built FinClear using **React 18** and **Vite** for a sleek, fast UI. The design system uses **Tailwind CSS** and **Shadcn UI** for a premium look and feel. The intelligence layer is powered by **LLMs** with a custom **RAG (Retrieval-Augmented Generation)** system that references a database of consumer protection laws. We also implemented on-device **Privacy Protection** using canvas-based image redaction and regex-based text masking to ensure sensitive identity data never leaves the user's browser.

## Challenges we ran into
Balancing deep legal analysis with user privacy was our toughest challenge. We had to ensure that redacting personal info (like names or account numbers) didn't break the AI's ability to understand the contract structure. Additionally, making the "Multi-Agent Arena" feel intuitive required significant UI/UX iteration to ensure the debate between AI agents was educational rather than overwhelming.

## Accomplishments that we're proud of
- **Transparent Multi-Agent Debate:** Successfully implementing a system where different AI personas (Lender, Counsel, Arbitrator) provide cross-checked reasoning.
- **On-Device Privacy First:** Building a robust consent-based workflow where users manually redact sensitive image areas on the client side.
- **Accessibility Integration:** Realizing a "High Clarity" mode that significantly improves readability for visually impaired users.

## What we learned
We gained deep insights into the ethical implications of AI in finance. We learned that transparency isn't just about showing the result—it's about showing the *process* of how the AI reached its conclusion. We also realized the immense power of combining RAG with multi-agent systems to minimize hallucinations in high-stakes fields like law and finance.

## What's next for FinClear
- **Mobile Vision Scanning:** A native mobile experience for real-time OCR and analysis of physical paper contracts.
- **Global Regulation Library:** Expanding the RAG database to include specific financial laws for different regions and countries.
- **Community Threat Database:** A crowdsourced (yet privacy-preserving) database of known "predatory patterns" to alert users in real-time.
