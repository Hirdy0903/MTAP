import React, { createContext, useState, useEffect } from 'react';
import { getUserOrganizationsApi, createOrganizationApi } from '../api/organizations';
import useAuth from '../hooks/useAuth';

export const OrgContext = createContext(null);

export function OrgProvider({ children }) {
  const { token } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  const fetchOrganizations = async () => {
    if (!token) return;
    setLoadingOrgs(true);
    try {
      const data = await getUserOrganizationsApi();
      if (data.success && data.organizations) {
        setOrganizations(data.organizations);
        
        // Resolve active organization
        const cachedOrgId = localStorage.getItem('activeOrgId');
        const foundCached = data.organizations.find(org => org._id === cachedOrgId);
        
        if (foundCached) {
          setActiveOrg(foundCached);
        } else if (data.organizations.length > 0) {
          setActiveOrg(data.organizations[0]);
          localStorage.setItem('activeOrgId', data.organizations[0]._id);
        } else {
          setActiveOrg(null);
        }
      }
    } catch (err) {
      console.error('Error fetching organizations:', err);
    } finally {
      setLoadingOrgs(false);
    }
  };

  // Fetch organizations whenever token changes
  useEffect(() => {
    if (token) {
      fetchOrganizations();
    } else {
      setOrganizations([]);
      setActiveOrg(null);
      localStorage.removeItem('activeOrgId');
    }
  }, [token]);

  const selectActiveOrg = (org) => {
    setActiveOrg(org);
    if (org) {
      localStorage.setItem('activeOrgId', org._id);
    } else {
      localStorage.removeItem('activeOrgId');
    }
  };

  const createOrganization = async (name, slug) => {
    try {
      const data = await createOrganizationApi(name, slug);
      if (data.success && data.organization) {
        // Add to state and set active
        setOrganizations(prev => [...prev, data.organization]);
        selectActiveOrg(data.organization);
        return { success: true };
      }
      return { success: false, message: data.message || 'Creation failed' };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create organization. Slug might be taken.',
      };
    }
  };

  const value = {
    organizations,
    activeOrg,
    loadingOrgs,
    setActiveOrg: selectActiveOrg,
    createOrganization,
    refreshOrgs: fetchOrganizations,
  };

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}
