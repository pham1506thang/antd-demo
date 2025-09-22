import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { permissionsSelector, isAdminSelector, isSuperAdminSelector } from '@/store/slices/authSlice';
import type { DomainType, ActionType } from '@/models/permission';

/**
 * Hook to check if user has permission for specific domain and action
 * Returns a function that takes domain + action and returns true/false
 */
export const usePermissionCheck = () => {
  const permissions = useSelector(permissionsSelector);
  const isAdmin = useSelector(isAdminSelector);
  const isSuperAdmin = useSelector(isSuperAdminSelector);

  // Create permission lookup map for O(1) access
  const permissionMap = useMemo(() => {
    const map = new Set<string>();
    permissions.forEach(permission => {
      const key = `${permission.domain}:${permission.action}`;
      map.add(key);
    });
    return map;
  }, [permissions]);

  // Main permission check function
  const checkPermission = useMemo(() => {
    return (domain: DomainType, action: ActionType): boolean => {
      // Super admin has all permissions
      if (isSuperAdmin) return true;
      
      // Admin has all permissions
      if (isAdmin) return true;

      // Check specific permission
      const key = `${domain}:${action}`;
      return permissionMap.has(key);
    };
  }, [permissionMap, isAdmin, isSuperAdmin]);

  return checkPermission;
};
