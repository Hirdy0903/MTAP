const express = require('express');
const cors = require('cors');

const authRoutes = require('./modules/auth/auth.routes');

const organizationRoutes = require('./modules/organizations/organization.routes');

const issueRoutes = require('./modules/issues/issue.routes');

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:5174'],
//   credentials: true
// }));

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174',
    'https://multitenant-airij8yk6-hirdyproject.vercel.app' // Your live Vercel frontend
  ],
  credentials: true
}));


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