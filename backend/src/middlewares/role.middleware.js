const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.membership.role;

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission',
            });
        }

        next();
    };
};

module.exports = roleMiddleware;