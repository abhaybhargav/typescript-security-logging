import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { securityLogger } from '../app';

// Extend Express.Session interface
declare module 'express-session' {
  interface Session {
    userId?: number;
  }
}

const router = express.Router();

router.get('/signup', (req: Request, res: Response) => {
  res.render('signup');
});

router.post('/signup', async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    // Input validation
    if (!email) {
      securityLogger.log('SIGNUP_VALIDATION_ERROR', { error: 'Missing email' });
      return res.status(400).send('Email is required');
    }
    if (!name) {
      securityLogger.log('SIGNUP_VALIDATION_ERROR', { error: 'Missing name' });
      return res.status(400).send('Name is required');
    }
    if (!password) {
      securityLogger.log('SIGNUP_VALIDATION_ERROR', { error: 'Missing password' });
      return res.status(400).send('Password is required');
    }
    if (password.length < 8) {
      securityLogger.log('SIGNUP_VALIDATION_ERROR', { error: 'Password too short' });
      return res.status(400).send('Password must be at least 8 characters long');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, password: hashedPassword });

    securityLogger.log('USER_SIGNUP_SUCCESS', { userId: user.id, email });
    res.redirect('/login');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    securityLogger.log('USER_SIGNUP_ERROR', { error: errorMessage, email });
    res.status(500).send('Error during signup');
  }
});

router.get('/login', (req: Request, res: Response) => {
  res.render('login');
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      securityLogger.log('LOGIN_ATTEMPT_UNKNOWN_USER', { email });
      return res.status(400).send('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      securityLogger.log('LOGIN_ATTEMPT_INVALID_PASSWORD', { userId: user.id, email });
      return res.status(400).send('Invalid credentials');
    }

    req.session.userId = user.id;
    securityLogger.log('USER_LOGIN_SUCCESS', { userId: user.id, email });
    res.redirect('/dashboard');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    securityLogger.log('LOGIN_ERROR', { error: errorMessage, email });
    res.status(500).send('Error during login');
  }
});

router.get('/logout', (req: Request, res: Response) => {
  const userId = req.session.userId;
  req.session.destroy((err) => {
    if (err) {
      securityLogger.log('LOGOUT_ERROR', { error: err.message, userId });
      return res.status(500).send('Error during logout');
    }
    securityLogger.log('USER_LOGOUT_SUCCESS', { userId });
    res.redirect('/login');
  });
});

export const authRoutes = router;