const Organization = require('./organization.models');
const Membership = require('./membership.models');
const User = require('../auth/auth.model'); // Added by AI: Import User model to find users by email

const asyncHandler = require('../../utils/asyncHandler');

const createOrganization = asyncHandler(async (req, res) => {
    const { name, slug } = req.body;

    const existingOrganization = await Organization.findOne({ slug });

    if (existingOrganization) {
        return res.status(400).json({
            success: false,
            message: 'Organization slug already exists',
        });
    }

    const organization = await Organization.create({
        name,
        slug,
        createdBy: req.user.id,
    });

console.log(req.user);

await Membership.create({
    user: req.user.id,
    organization: organization.id,
    role: 'admin',
});

    res.status(201).json({
        success: true,
        message: 'Organization created successfully',
        organization,
    });
});

const getUserOrganizations = asyncHandler(async (req, res) => {
    const memberships = await Membership.find({
        user: req.user.id,
    }).populate('organization');

    const organizations = memberships.map(
        (membership) => membership.organization
    );

    res.status(200).json({
        success: true,
        organizations,
    });
});

// Added by AI: Controller function to invite a new member to an organization by their email
const addMember = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { organizationId } = req.params;

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
        return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    const existingMembership = await Membership.findOne({ user: userToAdd._id, organization: organizationId });
    if (existingMembership) {
        return res.status(400).json({ success: false, message: 'User is already a member of this organization' });
    }

    const membership = await Membership.create({
        user: userToAdd._id,
        organization: organizationId,
        role: 'member'
    });

    res.status(201).json({ success: true, message: 'Member invited successfully', membership });
});

module.exports = {
    createOrganization,
    getUserOrganizations,
    addMember // Added by AI: Export the new addMember function
};