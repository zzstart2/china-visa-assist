import { Router, Request, Response } from 'express';
import { mockMData } from '../data/mockData';

const router = Router();

// Export JSON
router.get('/api/export/json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=visa-application.json');
  res.json(mockMData.sections);
});

// Export CSV
router.get('/api/export/csv', (req: Request, res: Response) => {
  const sections = mockMData.sections;
  let csv = 'Section,Field,Value\n';

  Object.entries(sections).forEach(([sectionName, sectionData]) => {
    Object.entries(sectionData as Record<string, string>).forEach(([field, value]) => {
      csv += `${sectionName},${field},"${value}"\n`;
    });
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=visa-application.csv');
  res.send(csv);
});

export default router;
