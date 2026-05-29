const express = require('express');

const authRoutes = require('./modules/auth/auth.routes');

const organizationRoutes = require('./modules/organizations/organization.routes');

const issueRoutes = require('./modules/issues/issue.routes');

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

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