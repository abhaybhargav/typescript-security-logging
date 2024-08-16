import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import session from 'express-session';
import { SecurityLogger } from './utils/securityLogger';
import { authRoutes } from './routes/auth';
import { dashboardRoutes } from './routes/dashboard';
import { logViewerRoutes } from './routes/logViewer';
import { db } from './config/database';
import { User } from './models/user';

const app = express();
const port = 8880;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Initialize security logger
const securityLogger = new SecurityLogger();

// Routes
app.use('/', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/logs', logViewerRoutes);

// Initialize models
User.initModel(db);

// Set up associations
User.associate();

// Database initialization
db.sync({ force: true }).then(() => {
  console.log('Database synchronized');
}).catch((error) => {
  console.error('Error synchronizing database:', error);
  console.error(error.stack);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { app, securityLogger };