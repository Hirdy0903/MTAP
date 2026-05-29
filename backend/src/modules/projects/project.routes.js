const express = require('express');

const router = express.Router({ mergeParams: true });

const {
    createProject,
    getOrganizationProjects,
    getSingleProject,
    updateProject,
    deleteProject
} = require('./project.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

const organizationMiddleware = require('../../middlewares/organization.middleware');

const roleMiddleware = require('../../middlewares/role.middleware');

router.post(
    '/',
    authMiddleware,
    organizationMiddleware,
    roleMiddleware('admin'),
    createProject
);
router.get(
    '/',
    authMiddleware,
    organizationMiddleware,
    getOrganizationProjects
);
router.get(
    '/:projectId',
    authMiddleware,
    organizationMiddleware,
    getSingleProject
);
router.patch(
    '/:projectId',
    authMiddleware,
    organizationMiddleware,
    roleMiddleware('admin'),
    updateProject
);
router.delete(
    '/:projectId',
    authMiddleware,
    organizationMiddleware,
    roleMiddleware('admin'),
    deleteProject
);

module.exports = router;