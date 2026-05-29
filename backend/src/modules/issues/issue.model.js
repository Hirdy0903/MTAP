const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ['todo', 'in-progress', 'done'],
            default: 'todo',
        },

        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },

        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },

        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;