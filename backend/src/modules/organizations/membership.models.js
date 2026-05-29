const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },

        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member',
        },
    },
    {
        timestamps: true,
    }
);

membershipSchema.index(
    {
        user: 1,
        organization: 1,
    },
    {
        unique: true,
    }
);

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;