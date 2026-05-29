import React, { useState } from 'react';
import useOrg from '../hooks/useOrg';
import Modal from '../components/Modal';
import { Building2, Plus, Check } from 'lucide-react';

export default function Organizations() {
  const { organizations, activeOrg, setActiveOrg, createOrganization, loadingOrgs } = useOrg();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    setOrgName(nameVal);
    const generatedSlug = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    setOrgSlug(generatedSlug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orgName || !orgSlug) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const res = await createOrganization(orgName, orgSlug);
    if (res.success) {
      setIsModalOpen(false);
      setOrgName('');
      setOrgSlug('');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Organizations</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and switch between your tenant workspaces.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-center flex items-center space-x-2 py-2 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-650/15"
        >
          <Plus size={14} />
          <span>New Organization</span>
        </button>
      </div>

      {loadingOrgs ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin" />
          </div>
          <p className="text-slate-500 text-xs font-medium">Fetching organizations...</p>
        </div>
      ) : organizations.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center max-w-lg mx-auto mt-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Building2 size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">No organizations found</h3>
            <p className="text-sm text-slate-400">You need an organization workspace before you can manage projects and issues.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-5 rounded-xl bg-indigo-650 hover:bg-indigo-500 font-semibold text-sm transition-all shadow-lg shadow-indigo-600/15"
          >
            Create your first organization
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizations.map((org) => {
            const isActive = activeOrg?._id === org._id;
            return (
              <div 
                key={org._id}
                className={`p-6 rounded-xl bg-slate-900 border transition-all ${
                  isActive 
                    ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/5' 
                    : 'border-slate-800 hover:border-slate-700'
                } flex flex-col justify-between space-y-4`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base">{org.name}</h3>
                    <p className="text-xs text-slate-450 font-mono">Slug: {org.slug}</p>
                  </div>
                  {isActive ? (
                    <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-650/15 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                      <Check size={10} />
                      <span>Active</span>
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-805/30">
                  <span className="text-[10px] text-slate-500">ID: {org._id}</span>
                  {!isActive ? (
                    <button
                      onClick={() => setActiveOrg(org)}
                      className="py-1.5 px-3 rounded-lg border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                    >
                      Switch Workspace
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-indigo-400">Current Workspace</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Org Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setOrgName('');
          setOrgSlug('');
          setError('');
        }}
        title="Create New Organization"
      >
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Organization Name</label>
            <input
              type="text"
              value={orgName}
              onChange={handleNameChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
              placeholder="e.g. Acme Corp"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Workspace Slug</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-800 bg-slate-950 text-slate-500 text-xs font-medium">
                /orgs/
              </span>
              <input
                type="text"
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="flex-1 min-w-0 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-r-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-sm"
                placeholder="acme-corp"
                required
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">Used as a unique identifier for URL navigation and tenant routing.</p>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-850">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="py-2 px-4 rounded-xl border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-650/10"
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
