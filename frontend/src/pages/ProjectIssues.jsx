import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOrg from '../hooks/useOrg';
import useAuth from '../hooks/useAuth';
import { getProjectIssuesApi, createIssueApi, updateIssueApi, deleteIssueApi } from '../api/issues';
import { getSingleProjectApi } from '../api/projects';
import Modal from '../components/Modal';
import { Plus, ArrowLeft, MoreVertical, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function ProjectIssues() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { activeOrg } = useOrg();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [currentIssue, setCurrentIssue] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [assignee, setAssignee] = useState('');
  
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchData = async () => {
    if (!activeOrg || !projectId) return;
    setLoading(true);
    try {
      const projData = await getSingleProjectApi(activeOrg._id, projectId);
      if (projData.success) {
        setProject(projData.project);
      }
      
      const issuesData = await getProjectIssuesApi(activeOrg._id, projectId);
      if (issuesData.success) {
        setIssues(issuesData.issues);
      }
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Failed to load project details or issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeOrg, projectId]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!title) {
      setModalError('Title is required');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      const data = { 
        title, 
        description, 
        priority, 
        status: 'todo',
        assignee: assignee || null 
      };
      const res = await createIssueApi(activeOrg._id, projectId, data);
      if (res.success) {
        setIsCreateModalOpen(false);
        resetForm();
        fetchData();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to create issue');
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditIssue = async (e) => {
    e.preventDefault();
    if (!title) {
      setModalError('Title is required');
      return;
    }
    setModalLoading(true);
    setModalError('');
    try {
      const data = { 
        title, 
        description, 
        priority, 
        status,
        assignee: assignee || null 
      };
      const res = await updateIssueApi(activeOrg._id, projectId, currentIssue._id, data);
      if (res.success) {
        setIsEditModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to update issue');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteIssue = async () => {
    setModalLoading(true);
    setModalError('');
    try {
      const res = await deleteIssueApi(activeOrg._id, projectId, currentIssue._id);
      if (res.success) {
        setIsDeleteModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to delete issue');
    } finally {
      setModalLoading(false);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (issue) => {
    setCurrentIssue(issue);
    setTitle(issue.title);
    setDescription(issue.description || '');
    setStatus(issue.status);
    setPriority(issue.priority);
    setAssignee(issue.assignee ? issue.assignee._id : '');
    setModalError('');
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (issue) => {
    setCurrentIssue(issue);
    setModalError('');
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setPriority('medium');
    setAssignee('');
    setModalError('');
  };

  const quickStatusUpdate = async (issue, newStatus) => {
    try {
      await updateIssueApi(activeOrg._id, projectId, issue._id, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const renderColumn = (colStatus, colTitle) => {
    const colIssues = issues.filter(i => i.status === colStatus);
    
    return (
      <div className="flex flex-col w-full min-w-[300px] max-w-sm shrink-0 bg-slate-900/50 rounded-xl border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-200 capitalize">{colTitle}</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {colIssues.length}
          </span>
        </div>
        
        <div className="flex flex-col space-y-3 overflow-y-auto min-h-[100px]">
          {colIssues.map(issue => (
            <div key={issue._id} className="bg-slate-900 p-4 rounded-lg border border-slate-700 hover:border-indigo-500/50 transition-colors cursor-pointer group shadow-sm" onClick={() => openEditModal(issue)}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                  issue.priority === 'high' ? 'bg-rose-500/10 text-rose-400' :
                  issue.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {issue.priority}
                </span>
                <button onClick={(e) => { e.stopPropagation(); openDeleteModal(issue); }} className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity">
                  <Trash2 size={14} />
                </button>
              </div>
              <h4 className="font-semibold text-sm text-slate-100 mb-1 leading-tight">{issue.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{issue.description || 'No description'}</p>
              
              <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-600/20 flex items-center justify-center text-[9px] font-bold text-indigo-400 border border-indigo-500/20" title={issue.assignee ? issue.assignee.name : 'Unassigned'}>
                    {issue.assignee ? issue.assignee.name.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                
                <select 
                  className="text-xs bg-slate-800 text-slate-300 border-none rounded py-1 px-2 outline-none cursor-pointer"
                  value={issue.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => quickStatusUpdate(issue, e.target.value)}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
          ))}
          {colIssues.length === 0 && (
            <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-slate-800 rounded-lg">
              No issues here
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!activeOrg || !projectId) return null;

  return (
    <div className="space-y-6 flex flex-col h-full overflow-hidden">
      <div className="flex items-center space-x-4 mb-2">
        <button onClick={() => navigate('/dashboard')} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{project ? project.name : 'Loading Project...'}</h1>
          <p className="text-sm text-slate-400">Kanban Board</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 py-2 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
          >
            <Plus size={14} />
            <span>New Issue</span>
          </button>
        </div>
      </div>

      {loading && !project ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-rose-400 p-4 bg-rose-500/10 rounded-xl">{error}</div>
      ) : (
        <div className="flex-1 flex overflow-x-auto space-x-6 pb-4">
          {renderColumn('todo', 'Todo')}
          {renderColumn('in-progress', 'In Progress')}
          {renderColumn('done', 'Done')}
        </div>
      )}

      {/* Create Issue Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Issue">
        {modalError && <div className="mb-4 text-rose-400 text-sm">{modalError}</div>}
        <form onSubmit={handleCreateIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white min-h-[80px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Assignee</label>
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white">
                <option value="">Unassigned</option>
                <option value={user?._id}>Assign to Me ({user?.name})</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={modalLoading} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50">
              {modalLoading ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Issue Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Issue">
        {modalError && <div className="mb-4 text-rose-400 text-sm">{modalError}</div>}
        <form onSubmit={handleEditIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Issue Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white min-h-[80px]" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white">
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Assignee</label>
              <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:border-indigo-500 outline-none text-sm text-white">
                <option value="">Unassigned</option>
                <option value={user?._id}>Me ({user?.name})</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button type="submit" disabled={modalLoading} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50">
              {modalLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Issue Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Issue">
        {modalError && <div className="mb-4 text-rose-400 text-sm">{modalError}</div>}
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Are you sure you want to delete <strong className="text-white">{currentIssue?.title}</strong>? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
            <button onClick={handleDeleteIssue} disabled={modalLoading} className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-500 text-white rounded-lg disabled:opacity-50">
              {modalLoading ? 'Deleting...' : 'Delete Issue'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
