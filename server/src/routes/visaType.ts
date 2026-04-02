import { Router, Request, Response } from 'express';

const router = Router();

router.post('/api/visa-type', (req: Request, res: Response) => {
  const { transit } = req.body;

  let visaType = 'M';
  let requiredDocs = [
    'Passport (original + copy)',
    'Visa application form',
    'Photo (white background)',
    'Invitation letter (for business)',
    'Hotel reservation',
    'Flight itinerary',
  ];

  if (transit === true || transit === 'true') {
    visaType = 'G';
    requiredDocs = [
      'Passport (original + copy)',
      'Visa application form',
      'Photo (white background)',
      'Onward ticket to third country',
      'Hotel reservation near airport',
    ];
  }

  res.json({
    visaType,
    requiredDocs,
    note: visaType === 'M'
      ? 'Business visa - requires invitation from Chinese company'
      : 'Transit visa - for transit through China to third country',
  });
});

export default router;
