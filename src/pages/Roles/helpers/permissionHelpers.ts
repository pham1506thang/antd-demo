import { DOMAINS } from '@/models/permission';
import type { Permission } from '@/models/permission';

/**
 * Get all permissions for a specific domain
 */
export const getPermissionsByDomain = (permissions: Permission[], domain: string): Permission[] => {
  return permissions.filter(permission => permission.domain === domain);
};

/**
 * Get all permission IDs for a specific domain
 */
export const getPermissionIdsByDomain = (permissions: Permission[], domain: string): string[] => {
  return getPermissionsByDomain(permissions, domain).map(p => p.id);
};

/**
 * Select all permissions for a domain
 */
export const selectAllDomainPermissions = (
  currentSelected: string[],
  permissions: Permission[],
  domain: string
): string[] => {
  const domainPermissionIds = getPermissionIdsByDomain(permissions, domain);
  const otherSelected = currentSelected.filter(id => !domainPermissionIds.includes(id));
  return [...otherSelected, ...domainPermissionIds];
};

/**
 * Deselect all permissions for a domain
 */
export const deselectAllDomainPermissions = (
  currentSelected: string[],
  permissions: Permission[],
  domain: string
): string[] => {
  const domainPermissionIds = getPermissionIdsByDomain(permissions, domain);
  return currentSelected.filter(id => !domainPermissionIds.includes(id));
};

/**
 * Select all available permissions
 */
export const selectAllPermissions = (permissions: Permission[]): string[] => {
  return permissions.map(p => p.id);
};

/**
 * Clear all selected permissions
 */
export const clearAllPermissions = (): string[] => {
  return [];
};

/**
 * Get domain statistics
 */
export const getDomainStats = (permissions: Permission[], selectedPermissions: string[]) => {
  return Object.entries(DOMAINS).map(([key, domain]) => {
    const domainPermissions = getPermissionsByDomain(permissions, domain.value);
    const selectedCount = domainPermissions.filter(p => selectedPermissions.includes(p.id)).length;
    
    return {
      domain: domain.value,
      domainLabel: key,
      total: domainPermissions.length,
      selected: selectedCount,
      percentage: domainPermissions.length > 0 ? Math.round((selectedCount / domainPermissions.length) * 100) : 0,
    };
  }).filter(stat => stat.total > 0);
};

/**
 * Check if all permissions in a domain are selected
 */
export const isDomainFullySelected = (
  permissions: Permission[],
  selectedPermissions: string[],
  domain: string
): boolean => {
  const domainPermissionIds = getPermissionIdsByDomain(permissions, domain);
  return domainPermissionIds.length > 0 && domainPermissionIds.every(id => selectedPermissions.includes(id));
};

/**
 * Check if any permissions in a domain are selected
 */
export const isDomainPartiallySelected = (
  permissions: Permission[],
  selectedPermissions: string[],
  domain: string
): boolean => {
  const domainPermissionIds = getPermissionIdsByDomain(permissions, domain);
  return domainPermissionIds.some(id => selectedPermissions.includes(id));
};
