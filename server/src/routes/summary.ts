import { Router, Request, Response } from 'express';
import { mockMData } from '../data/mockData';

const router = Router();

router.get('/api/summary', (req: Request, res: Response) => {
  res.json(mockMData.sections);
});

export default router;
