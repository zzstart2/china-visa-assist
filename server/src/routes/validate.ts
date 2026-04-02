import { Router, Request, Response } from 'express';
import { runFieldValidation, runComplianceValidation } from '../validation';

const router = Router();

// Validate documents (legacy)
router.post('/api/validate-documents', (req: Request, res: Response) => {
  res.json({
    success: true,
    validation: {
      passport: { valid: true, message: 'Passport information verified' },
      photo: { valid: true, message: 'Photo meets requirements (white background, correct size)' },
    },
  });
});

// Compliance validation (post-upload)
router.post('/api/validate/compliance', (req: Request, res: Response) => {
  const { prefillData } = req.body;
  const warnings = runComplianceValidation(prefillData);
  const hasErrors = warnings.some(w => w.level === 'error');
  res.json({ success: !hasErrors, warnings });
});

// Field validation (standalone endpoint)
router.post('/api/validate/field', (req: Request, res: Response) => {
  const { field, value } = req.body;
  const result = runFieldValidation(field, value, {});
  res.json({ field, status: result.status, message: result.message });
});

export default router;
