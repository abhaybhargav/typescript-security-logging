import express, { Request, Response, NextFunction } from 'express';
import { HealthcareInfo } from '../models/healthcareInfo';
import { securityLogger } from '../app';

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    next();
  } else {
    securityLogger.log('UNAUTHORIZED_ACCESS_ATTEMPT', { path: req.path, method: req.method });
    res.redirect('/login');
  }
};

router.use(isAuthenticated);

// Create
router.post('/', async (req: Request, res: Response) => {
  try {
    const { patientName, diagnosis, treatment } = req.body;
    const healthcareInfo = await HealthcareInfo.create({
      patientName,
      diagnosis,
      treatment,
      userId: req.session.userId,
    });
    securityLogger.log('HEALTHCARE_INFO_CREATED', { userId: req.session.userId, healthcareInfoId: healthcareInfo.id });
    res.redirect('/dashboard');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    securityLogger.log('HEALTHCARE_INFO_CREATE_ERROR', { error: errorMessage, userId: req.session.userId });
    res.status(500).send('Error creating healthcare info');
  }
});

// Read
router.get('/', async (req: Request, res: Response) => {
  try {
    const healthcareInfos = await HealthcareInfo.findAll({ where: { userId: req.session.userId } });
    securityLogger.log('HEALTHCARE_INFO_READ', { userId: req.session.userId });
    res.render('healthcare', { healthcareInfos });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    securityLogger.log('HEALTHCARE_INFO_READ_ERROR', { error: errorMessage, userId: req.session.userId });
    res.status(500).send('Error fetching healthcare info');
  }
});

// Update
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { patientName, diagnosis, treatment } = req.body;
    const healthcareInfo = await HealthcareInfo.findOne({ where: { id, userId: req.session.userId } });
    
    if (!healthcareInfo) {
      securityLogger.log('HEALTHCARE_INFO_UPDATE_UNAUTHORIZED', { userId: req.session.userId, healthcareInfoId: id });
      return res.status(404).send('Healthcare info not found');
    }

    await healthcareInfo.update({ patientName, diagnosis, treatment });
    securityLogger.log('HEALTHCARE_INFO_UPDATED', { userId: req.session.userId, healthcareInfoId: id });
    res.redirect('/dashboard');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    securityLogger.log('HEALTHCARE_INFO_UPDATE_ERROR', { error: errorMessage, userId: req.session.userId });
    res.status(500).send('Error updating healthcare info');
  }
});

// Delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const healthcareInfo = await HealthcareInfo.findOne({ where: { id, userId: req.session.userId } });
    
    if (!healthcareInfo) {
      securityLogger.log('HEALTHCARE_INFO_DELETE_UNAUTHORIZED', { userId: req.session.userId, healthcareInfoId: id });
      return res.status(404).send('Healthcare info not found');
    }

    await healthcareInfo.destroy();
    securityLogger.log('HEALTHCARE_INFO_DELETED', { userId: req.session.userId, healthcareInfoId: id });
    res.redirect('/dashboard');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    securityLogger.log('HEALTHCARE_INFO_DELETE_ERROR', { error: errorMessage, userId: req.session.userId });
    res.status(500).send('Error deleting healthcare info');
  }
});

export const healthcareRoutes = router;