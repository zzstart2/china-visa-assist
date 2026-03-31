# China Visa Assist Demo

## Project Overview
AI-assisted visa application system for Manila CVASC (China Visa Application Service Center).
Demo scope: M visa (Business) + G visa (Transit).

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js (mock only - returns fake data)
- **No database** - all mock data, no persistence

## Architecture
- `client/` - React frontend (Vite)
- `server/` - Express mock backend
- `docs/` - Spec documents

## Key Constraint
We only build frontend + mock backend shell. Real OCR, AI dialog engine, validation engine are handled by another team. Our mock backend returns plausible fake data for all endpoints.

## 5-Step Flow
1. **Step 1**: Visa type routing (fixed decision tree, no AI)
2. **Step 2**: Document upload + compliance check (mock OCR)
3. **Step 3**: Dialog-based form filling (mock AI conversation)
4. **Step 4**: Summary confirmation (9-section form display matching CCNA)
5. **Step 5**: Structured data export (JSON/CSV)

## CCNA Form Structure (9 Sections)
See `docs/visa-ccna-form-prd.md` for complete field definitions.
1. Personal Information
2. Type of Visa
3. Work Information
4. Education
5. Family Information
6. Information on Your Travel
7. Information on Previous Travel
8. Other Information
9. Declaration
