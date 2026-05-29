const projectRoutes = require('../projects/project.routes');
const express = require('express');


const router = express.Router();

const {
    createOrganization,getUserOrganizations, addMember // Added by AI: Import addMember controller
} = require('./organization.controller');

const authMiddleware = require('../../middlewares/auth.middleware');
const organizationMiddleware = require('../../middlewares/organization.middleware'); // Added by AI: Import organizationMiddleware
const roleMiddleware = require('../../middlewares/role.middleware'); // Added by AI: Import roleMiddleware

router.post('/', authMiddleware, createOrganization);
router.get('/', authMiddleware, getUserOrganizations);

// Added by AI: Route to invite a member. Requires auth, must be in the org, and must be admin.
router.post('/:organizationId/members', authMiddleware, organizationMiddleware, roleMiddleware('admin'), addMember); 

router.use('/:organizationId/projects', projectRoutes);
module.exports = router;