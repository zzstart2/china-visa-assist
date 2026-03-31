# China Visa Application Mock Server

Express.js mock backend for the China visa application system.

## Quick Start

```bash
cd server
npm install
npm run dev
```

Server runs on **http://localhost:3001**

## API Endpoints

### Step 1: Visa Type Determination
- `POST /api/visa-type` - Determine visa type (M or G) based on user answers
  - Body: `{ purpose, duration, transit }`
  - Returns: `{ visaType, requiredDocs }`

### Step 2: Document Upload & OCR
- `POST /api/upload` - Upload passport/photo, returns mock OCR results
  - Body: Form data with file + `visaType`
  - Returns: `{ passport: {...}, photo: {...} }`

- `POST /api/validate-documents` - Validate uploaded documents
  - Returns: `{ validation: { passport: { valid: true }, photo: { valid: true } } }`

### Step 3: Chat-based Form Filling
- `POST /api/chat/start` - Start conversation
  - Body: `{ visaType: 'M' | 'G' }`
  - Returns: First question with type, progress

- `POST /api/chat/reply` - Submit answer, get next question
  - Body: `{ sessionId, answer }`
  - Returns: Next question or `{ complete: true }`

### Step 4: Summary
- `GET /api/summary` - Get full 9-section form data

### Step 5: Export
- `GET /api/export/json` - Download JSON
- `GET /api/export/csv` - Download CSV

## Mock Data

- **M Visa**: Juan Dela Cruz (Philippines), business visit Shanghai
- **G Visa**: Maria Santos (Philippines), transit Beijing to Tokyo

## CORS

Allowed origins: `http://localhost:5173` (Vite dev server)