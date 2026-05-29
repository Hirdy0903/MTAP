const Issue = require('./issue.model');

const Project = require('../projects/project.model');

const asyncHandler = require('../../utils/asyncHandler');

const createIssue = asyncHandler(async (req, res) => {
    const { title, description, priority, assignee } = req.body;

    const { organizationId, projectId } = req.params;

    const project = await Project.findOne({
        _id: projectId,
        organization: organizationId,
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    const issue = await Issue.create({
        title,
        description,
        priority,
        assignee,
        project: projectId,
        organization: organizationId,
        createdBy: req.user.id,
    });

    res.status(201).json({
        success: true,
        message: 'Issue created successfully',
        issue,
    });
});

const getProjectIssues = asyncHandler(async (req, res) => {
    const { organizationId, projectId } = req.params;

    const issues = await Issue.find({
        organization: organizationId,
        project: projectId,
    })
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email');

    res.status(200).json({
        success: true,
        count: issues.length,
        issues,
    });
});

const getSingleIssue = asyncHandler(async (req, res) => {
    const { organizationId, projectId, issueId } = req.params;

    const issue = await Issue.findOne({
        _id: issueId,
        organization: organizationId,
        project: projectId,
    })
        .populate('assignee', 'name email')
        .populate('createdBy', 'name email');

    if (!issue) {
        return res.status(404).json({
            success: false,
            message: 'Issue not found',
        });
    }

    res.status(200).json({
        success: true,
        issue,
    });
});

const updateIssue = asyncHandler(async (req, res) => {
    const { organizationId, projectId, issueId } = req.params;

    const issue = await Issue.findOneAndUpdate(
        {
            _id: issueId,
            organization: organizationId,
            project: projectId,
        },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!issue) {
        return res.status(404).json({
            success: false,
            message: 'Issue not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Issue updated successfully',
        issue,
    });
});

const deleteIssue = asyncHandler(async (req, res) => {
    const { organizationId, projectId, issueId } = req.params;

    const issue = await Issue.findOneAndDelete({
        _id: issueId,
        organization: organizationId,
        project: projectId,
    });

    if (!issue) {
        return res.status(404).json({
            success: false,
            message: 'Issue not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Issue deleted successfully',
    });
});

module.exports = {
    createIssue,
    getProjectIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};