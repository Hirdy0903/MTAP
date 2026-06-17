const express = require('express');
const cors = require('cors');

const authRoutes = require('./modules/auth/auth.routes');

const organizationRoutes = require('./modules/organizations/organization.routes');

const issueRoutes = require('./modules/issues/issue.routes');

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();



// app.use(cors({
//   origin: [
//     'http://localhost:5173', 
//     'http://localhost:5174',
//     'https://multitenant-airij8yk6-hirdyproject.vercel.app' // Your live Vercel frontend
//   ],
//   credentials: true
// }));


const allowedOrigins = [
  "https://multitenant-theta.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

if (process.env.FRONTEND_URL) {
  // Extract just the origin in case a full URL with path is provided
  try {
    const url = new URL(process.env.FRONTEND_URL);
    allowedOrigins.push(url.origin);
  } catch (error) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API is running');
});

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/organizations', organizationRoutes);

app.use(
    '/api/v1/organizations/:organizationId/projects/:projectId/issues',
    issueRoutes
);

app.use(errorMiddleware);

module.exports = app;