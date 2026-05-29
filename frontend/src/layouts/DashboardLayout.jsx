import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useOrg from '../hooks/useOrg';
import Modal from '../components/Modal';
import { 
  LayoutDashboard, 
  Building2, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Plus
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { organizations, activeOrg, setActiveOrg, createOrganization } = useOrg();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);

  // Form states for creating org
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Organizations',
      path: '/organizations',
      icon: Building2,
    }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const nameVal = e.target.value;
    setOrgName(nameVal);
    // Convert to lowercase kebab-case slug
    const generatedSlug = nameVal
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-'); // replace spaces with hyphens
    setOrgSlug(generatedSlug);
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!orgName || !orgSlug) {
      setCreateError('Please fill in all fields');
      return;
    }
    setCreateLoading(true);
    setCreateError('');

    const res = await createOrganization(orgName, orgSlug);
    if (res.success) {
      setIsCreateOrgModalOpen(false);
      setOrgName('');
      setOrgSlug('');
      navigate('/dashboard');
    } else {
      setCreateError(res.message);
    }
    setCreateLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      {/* 1. Mobile Sidebar Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 2. Mobile Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800/80 
        flex flex-col transform transition-transform duration-300 ease-in-out md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-extrabold text-lg tracking-tight">TEAM<span className="text-indigo-400">ORG</span></span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-500/15 to-cyan-500/5 border border-indigo-500/20 text-indigo-400' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'}
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 shadow-inner">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-800 hover:bg-rose-950/20 hover:border-rose-900/40 text-slate-400 hover:text-rose-400 transition-all text-xs font-semibold"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 3. Desktop Sidebar */}
      <aside className="w-64 bg-slate-900/90 backdrop-blur-md border-r border-slate-800/80 flex flex-col hidden md:flex">
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight">TEAM<span className="text-indigo-400">ORG</span></span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-500/10 to-cyan-500/5 border border-indigo-500/20 text-indigo-400 font-bold' 
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'}
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 shadow-inner">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl border border-slate-800 hover:bg-rose-950/15 hover:border-rose-900/30 text-slate-400 hover:text-rose-450 transition-all text-xs font-semibold"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 4. Main Page Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Hamburger Trigger for Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg hover:bg-slate-800 md:hidden text-slate-400 hover:text-white transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Active Organization Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-xs font-semibold text-slate-200 transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="truncate max-w-[140px]">
                  {activeOrg ? activeOrg.name : 'Select Organization'}
                </span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>
              
              {isOrgDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsOrgDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-30">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2">My Organizations</p>
                    
                    <div className="max-h-48 overflow-y-auto space-y-0.5 mb-1.5">
                      {organizations.length === 0 ? (
                        <p className="text-xs text-slate-500 italic px-3 py-2">No organizations found</p>
                      ) : (
                        organizations.map((org) => (
                          <button
                            key={org._id}
                            onClick={() => {
                              setActiveOrg(org);
                              setIsOrgDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-semibold transition-all ${
                              activeOrg?._id === org._id 
                                ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/10' 
                                : 'text-slate-350 hover:bg-slate-800/60 hover:text-white border border-transparent'
                            }`}
                          >
                            <span>{org.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-500">
                              {org.slug}
                            </span>
                          </button>
                        ))
                      )}
                    </div>

                    <div className="border-t border-slate-800/80 pt-1.5 space-y-0.5">
                      <button 
                        onClick={() => {
                          setIsOrgDropdownOpen(false);
                          setIsCreateOrgModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left text-xs font-semibold text-indigo-400 hover:bg-indigo-650/10 transition-colors"
                      >
                        <Plus size={13} />
                        <span>Create Organization</span>
                      </button>
                      <button 
                        onClick={() => {
                          setIsOrgDropdownOpen(false);
                          navigate('/organizations');
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors"
                      >
                        <Building2 size={13} />
                        <span>Manage Organizations</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 hover:border-indigo-500 flex items-center justify-center text-xs font-bold text-indigo-400 transition-colors shadow-inner"
              >
                {getInitials(user?.name)}
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-30">
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-semibold text-slate-200">{user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left text-xs font-semibold text-rose-450 hover:bg-rose-950/20 transition-colors"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950">
          <Outlet />
        </main>
      </div>

      {/* 5. Create Organization Modal */}
      <Modal 
        isOpen={isCreateOrgModalOpen} 
        onClose={() => {
          setIsCreateOrgModalOpen(false);
          setOrgName('');
          setOrgSlug('');
          setCreateError('');
        }}
        title="Create New Organization"
      >
        {createError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
            {createError}
          </div>
        )}
        <form onSubmit={handleCreateOrg} className="space-y-4">
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
              onClick={() => setIsCreateOrgModalOpen(false)}
              className="py-2 px-4 rounded-xl border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading}
              className="py-2 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-650/10 flex items-center space-x-2"
            >
              {createLoading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
