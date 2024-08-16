import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';
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

router.get('/', async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.session.userId);
    if (!user) {
      securityLogger.log('USER_NOT_FOUND', { userId: req.session.userId });
      return res.redirect('/login');
    }

    securityLogger.log('DASHBOARD_ACCESS', { userId: user.id });
    res.render('dashboard', { user });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    securityLogger.log('DASHBOARD_ERROR', { error: errorMessage, userId: req.session.userId });
    res.status(500).send('Error accessing dashboard');
  }
});

export const dashboardRoutes = router;