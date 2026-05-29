const express = require('express');

const router = express.Router({ mergeParams: true });

const authMiddleware = require('../../middlewares/auth.middleware');

const organizationMiddleware = require('../../middlewares/organization.middleware');

const {
    createIssue,
    getProjectIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
} = require('./issue.controller');

router.post(
    '/',
    authMiddleware,
    organizationMiddleware,
    createIssue
);

router.get(
    '/',
    authMiddleware,
    organizationMiddleware,
    getProjectIssues
);

router.get(
    '/:issueId',
    authMiddleware,
    organizationMiddleware,
    getSingleIssue
);

router.patch(
    '/:issueId',
    authMiddleware,
    organizationMiddleware,
    updateIssue
);

router.delete(
    '/:issueId',
    authMiddleware,
    organizationMiddleware,
    deleteIssue
);

module.exports = router;