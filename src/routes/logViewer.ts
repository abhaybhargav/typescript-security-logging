import express, { Request, Response, NextFunction } from 'express';
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

router.get('/', (req: Request, res: Response) => {
  try {
    const logEntries = securityLogger.getLogEntries();
    securityLogger.log('LOG_VIEW_ACCESS', { userId: req.session.userId });
    res.render('logViewer', { logEntries });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    securityLogger.log('LOG_VIEW_ERROR', { error: errorMessage, userId: req.session.userId });
    res.status(500).send('Error viewing logs');
  }
});

export const logViewerRoutes = router;