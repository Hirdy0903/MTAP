import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useOrg from '../hooks/useOrg';
import { getOrganizationProjectsApi, createProjectApi, updateProjectApi, deleteProjectApi } from '../api/projects';
import { inviteMemberApi } from '../api/organizations';
import Modal from '../components/Modal';
import { Plus, FolderKanban, Edit2, Trash2, ExternalLink, UserPlus } from 'lucide-react';

export default function Dashboard() {
  const { activeOrg } = useOrg();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const [currentProject, setCurrentProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchProjects = async () => {
    if (!activeOrg) return;
    setLoading(true);
    try {
      const data = await getOrganizationProjectsApi(activeOrg._id);
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeOrg]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName) {
      setModalError('Project name is required');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      const res = await createProjectApi(activeOrg._id, projectName, projectDescription);
      if (res.success) {
        setIsCreateModalOpen(false);
        setProjectName('');
        setProjectDescription('');
        fetchProjects();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    if (!projectName) {
      setModalError('Project name is required');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      const res = await updateProjectApi(activeOrg._id, currentProject._id, projectName, projectDescription);
      if (res.success) {
        setIsEditModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    setModalLoading(true);
    setModalError('');
    try {
      const res = await deleteProjectApi(activeOrg._id, currentProject._id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        fetchProjects();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to delete project');
    } finally {
      setModalLoading(false);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail) {
      setModalError('Email is required');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      const res = await inviteMemberApi(activeOrg._id, inviteEmail);
      if (res.success) {
        setIsInviteModalOpen(false);
        setInviteEmail('');
        // You could add a success toast here
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to invite member');
    } finally {
      setModalLoading(false);
    }
  };

  const openEditModal = (project) => {
    setCurrentProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description || '');
    setModalError('');
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (project) => {
    setCurrentProject(project);
    setModalError('');
    setIsDeleteModalOpen(true);
  };

  if (!activeOrg) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-xl text-slate-300">No Organization Selected</h2>
        <p className="text-sm text-slate-500">Please select or create an organization to view projects.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your projects and track progress for {activeOrg.name}.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setInviteEmail('');
              setModalError('');
              setIsInviteModalOpen(true);
            }}
            className="flex items-center space-x-2 py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-semibold text-xs transition-all shadow-md"
          >
            <UserPlus size={14} />
            <span>Invite Member</span>
          </button>
          <button
            onClick={() => {
              setProjectName('');
              setProjectDescription('');
              setModalError('');
              setIsCreateModalOpen(true);
            }}
            className="flex items-center space-x-2 py-2 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
          >
            <Plus size={14} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium mb-1">Total Projects</p>
            <h3 className="text-2xl font-bold text-white">{projects.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <FolderKanban size={24} />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium mb-1">Active Members</p>
            <h3 className="text-2xl font-bold text-white">1</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium mb-1">Workspace Plan</p>
            <h3 className="text-lg font-bold text-white mt-1">Free Tier</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <h2 className="text-lg font-bold text-white">Recent Projects</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-rose-400 text-center py-10">{error}</div>
      ) : projects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center max-w-lg mx-auto mt-8">
          <FolderKanban size={32} className="mx-auto text-indigo-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-sm text-slate-400 mb-4">Create your first project to start tracking issues.</p>
          <button
             onClick={() => setIsCreateModalOpen(true)}
             className="py-2 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition-all text-sm"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/50 transition-colors flex flex-col h-48">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white truncate pr-2" title={project.name}>{project.name}</h3>
                <div className="flex space-x-1 shrink-0">
                  <button onClick={() => openEditModal(project)} className="p-1.5 text-slate-400 hover:text-indigo-400 rounded-md hover:bg-slate-800">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => openDeleteModal(project)} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 flex-grow">
                {project.description || 'No description provided.'}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <Link
                  to={`/dashboard/projects/${project._id}`}
                  className="flex items-center justify-center space-x-2 w-full py-2 bg-indigo-600/10 text-indigo-400 rounded-lg hover:bg-indigo-600/20 transition-colors text-sm font-semibold"
                >
                  <span>View Board</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Project">
        {modalError && <div className="mb-4 text-rose-400 text-sm">{modalError}</div>}
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white min-h-[100px]"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={modalLoading} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50">
              {modalLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Project">
        {modalError && <div className="mb-4 text-rose-400 text-sm">{modalError}</div>}
        <form onSubmit={handleEditProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white min-h-[100px]"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={modalLoading} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50">
              {modalLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Project Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Project">
        {modalError && <div className="mb-4 text-rose-400 text-sm">{modalError}</div>}
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Are you sure you want to delete <strong className="text-white">{currentProject?.name}</strong>? This action cannot be undone and will delete all associated issues.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button onClick={handleDeleteProject} disabled={modalLoading} className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-500 text-white rounded-lg disabled:opacity-50">
              {modalLoading ? 'Deleting...' : 'Delete Project'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Invite Member Modal */}
      <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Invite Member">
        {modalError && <div className="mb-4 text-rose-400 text-sm">{modalError}</div>}
        <form onSubmit={handleInviteMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white"
              required
            />
            <p className="text-xs text-slate-500 mt-2">The user must already be registered on TEAMORG with this email address.</p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsInviteModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={modalLoading} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50">
              {modalLoading ? 'Inviting...' : 'Invite Member'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
