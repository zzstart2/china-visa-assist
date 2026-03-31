# China Visa Application Assistant (Demo)

AI-assisted visa application system for Manila CVASC.

## Demo Scope
- **M Visa** (Business/Commercial)
- **G Visa** (Transit)

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js (mock responses only)

## Quick Start

```bash
# Backend (port 3001)
cd server && npm install && npm run dev

# Frontend (port 5173)
cd client && npm install && npm run dev
```

Open http://localhost:5173

## 5-Step Flow
1. Visa type routing (fixed decision tree)
2. Document upload + compliance check (mock OCR)
3. Dialog-based form filling (mock AI conversation)
4. Summary confirmation (9-section CCNA form)
5. Structured data export (JSON/CSV)

## Project Structure
```
client/          React frontend
server/          Express mock backend
docs/            Spec documents
```
