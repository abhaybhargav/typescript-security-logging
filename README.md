# Security Logging Demo Application

This TypeScript application demonstrates security logging for developers, focusing on user authentication processes.

## Features

- User signup with input validation
- User login with authentication
- User logout
- Security logging for various authentication events
- Log viewer for authorized users
- Containerized application using Docker

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/security-logging-demo.git
   cd security-logging-demo
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the TypeScript code:
   ```
   npm run build
   ```

4. Start the application:
   ```
   npm start
   ```

The application will be available at `http://localhost:8880`.

## Docker Deployment

To run the application in a Docker container:

1. Build the Docker image:
   ```
   docker build -t security-logging-demo .
   ```

2. Run the container:
   ```
   docker run -p 8880:8880 security-logging-demo
   ```

## Application Structure

- `src/app.ts`: Main application file
- `src/routes/`: Route handlers for different parts of the application
- `src/models/`: Database models
- `src/views/`: EJS templates for rendering pages
- `src/utils/`: Utility functions, including the security logger
- `src/config/`: Configuration files, including database setup

## Security Logging

The application uses a custom `SecurityLogger` class to log security events. Here's an example of how security logging is implemented:

```typescript
import { SecurityLogger } from './utils/securityLogger';

const securityLogger = new SecurityLogger();

// Logging a security event
securityLogger.log('USER_LOGIN_SUCCESS', { userId: user.id, email: user.email });
```

Security logs are stored in a file and can be viewed by authorized users through the application's log viewer.

## Interacting with the Application

1. Sign up for a new account at `/signup`
2. Log in with your credentials at `/login`
3. Once logged in, you'll be redirected to the dashboard
4. From the dashboard, you can:
   - View your user information
   - Access the log viewer
   - Log out

## Security Logging Examples

### User Signup

```typescript
router.post('/signup', async (req: Request, res: Response) => {
  // ... (input validation)
  try {
    const user = await User.create({ email, name, password: hashedPassword });
    securityLogger.log('USER_SIGNUP_SUCCESS', { userId: user.id, email });
    res.redirect('/login');
  } catch (error) {
    securityLogger.log('USER_SIGNUP_ERROR', { error: errorMessage, email });
    res.status(500).send('Error during signup');
  }
});
```

### User Login

```typescript
router.post('/login', async (req: Request, res: Response) => {
  // ... (authentication logic)
  if (!user) {
    securityLogger.log('LOGIN_ATTEMPT_UNKNOWN_USER', { email });
    return res.status(400).send('Invalid credentials');
  }
  if (!isValidPassword) {
    securityLogger.log('LOGIN_ATTEMPT_INVALID_PASSWORD', { userId: user.id, email });
    return res.status(400).send('Invalid credentials');
  }
  securityLogger.log('USER_LOGIN_SUCCESS', { userId: user.id, email });
  res.redirect('/dashboard');
});
```

### User Logout

```typescript
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
```

## Negative Test Cases to Trigger Security Logs

1. Attempt to sign up with missing fields:
   ```
   POST /signup
   Body: { "email": "user@example.com", "name": "Test User" }
   ```
   This will trigger a 'SIGNUP_VALIDATION_ERROR' log.

2. Attempt to log in with an unknown user:
   ```
   POST /login
   Body: { "email": "nonexistent@example.com", "password": "password123" }
   ```
   This will trigger a 'LOGIN_ATTEMPT_UNKNOWN_USER' log.

3. Attempt to log in with an incorrect password:
   ```
   POST /login
   Body: { "email": "existinguser@example.com", "password": "wrongpassword" }
   ```
   This will trigger a 'LOGIN_ATTEMPT_INVALID_PASSWORD' log.

4. Attempt to access a protected route without authentication:
   ```
   GET /dashboard
   ```
   This will trigger an 'UNAUTHORIZED_ACCESS_ATTEMPT' log.

To view the security logs, log in as an authorized user and navigate to the log viewer page.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.