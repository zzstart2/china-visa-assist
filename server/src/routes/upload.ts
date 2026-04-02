import { Router, Request, Response } from 'express';
import multer from 'multer';
import { mockMData, mockGData, mockBatchPrefill } from '../data/mockData';

const router = Router();
const upload = multer({ dest: 'uploads/' });
const uploadBatch = multer({ dest: 'uploads/' });

function guessDocType(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.includes('passport')) return 'passport';
  if (lower.includes('photo')) return 'photo';
  if (lower.includes('invit')) return 'invitation';
  if (lower.includes('employ')) return 'employment';
  return 'other';
}

// Single file upload (legacy)
router.post('/api/upload', upload.single('file'), (req: Request, res: Response) => {
  const { visaType } = req.body;
  const mockData = visaType === 'G' ? mockGData : mockMData;

  res.json({
    success: true,
    ocrResult: {
      passport: mockData.passport,
      photo: mockData.photo,
    },
    extractedFields: [
      'familyName', 'givenName', 'passportNo',
      'nationality', 'birthDate', 'expiryDate', 'gender',
    ],
  });
});

// Batch upload with mock OCR
router.post('/api/upload/batch', uploadBatch.array('files', 20), (req: Request, res: Response) => {
  const files = (req as any).files || [];

  const classified = files.map((f: any) => ({
    filename: f.originalname,
    type: guessDocType(f.originalname),
    status: 'processed',
  }));

  res.json({
    success: true,
    files: classified,
    prefillData: mockBatchPrefill,
    pendingFields: [
      'section5.currentAddress', 'section5.phone', 'section5.mobilePhone', 'section5.email',
      'section6.inviter.name', 'section6.inviter.phone', 'section6.inviter.relationship',
      'section6.emergencyContact.familyName', 'section6.emergencyContact.phone',
      'section6.emergencyContact.relationship', 'section6.travelPayBy',
      'section4.entries',
    ],
  });
});

export default router;
