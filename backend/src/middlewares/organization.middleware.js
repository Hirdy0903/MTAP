const Membership = require('../modules/organizations/membership.models');

const asyncHandler = require('../utils/asyncHandler');

const organizationMiddleware = asyncHandler(async (req, res, next) => {
    const { organizationId } = req.params;

    const membership = await Membership.findOne({
        user: req.user.id,
        organization: organizationId,
    });

    if (!membership) {
        return res.status(403).json({
            success: false,
            message: 'Access denied to this organization',
        });
    }

    req.membership = membership;

    next();
});

module.exports = organizationMiddleware;