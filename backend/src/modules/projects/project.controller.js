const Project = require('./project.model');

const asyncHandler = require('../../utils/asyncHandler');

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    const { organizationId } = req.params;

    const project = await Project.create({
        name,
        description,
        organization: organizationId,
        createdBy: req.user.id,
    });

    res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project,
    });
});
const getOrganizationProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({
        organization: req.params.organizationId,
    }).populate('createdBy', 'name email');

    res.status(200).json({
        success: true,
        count: projects.length,
        projects,
    });
});
const getSingleProject = asyncHandler(async (req, res) => {
    const { organizationId, projectId } = req.params;

    const project = await Project.findOne({
        _id: projectId,
        organization: organizationId,
    }).populate('createdBy', 'name email');

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    res.status(200).json({
        success: true,
        project,
    });
});
const updateProject = asyncHandler(async (req, res) => {
    const { organizationId, projectId } = req.params;

    const { name, description } = req.body;

    const project = await Project.findOneAndUpdate(
        {
            _id: projectId,
            organization: organizationId,
        },
        {
            name,
            description,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        project,
    });
});
const deleteProject = asyncHandler(async (req, res) => {
    const { organizationId, projectId } = req.params;

    const project = await Project.findOneAndDelete({
        _id: projectId,
        organization: organizationId,
    });

    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Project deleted successfully',
    });
});
module.exports = {
    createProject,
    getOrganizationProjects,
    getSingleProject,
    updateProject,
    deleteProject
};