import React from 'react';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import { Forbidden } from '@/pages/Forbidden';
import type { DomainKey, ActionKeyForDomain } from '@/models/permission';
import { DOMAINS } from '@/models/permission';

// Union type for all possible props
type RouteGuardProps<T extends DomainKey> = {
  domain: T;
  action: ActionKeyForDomain<T>;
  children: React.ReactNode;
  fallback?: React.ReactNode;
} | {
  domain?: never;
  action?: never;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Type-safe component that checks permissions before rendering children
 * If user doesn't have permission, shows Forbidden page or custom fallback
 * 
 * @example
 * // TypeScript will suggest available actions for 'USERS' domain
 * <RouteGuard domain="USERS" action="CREATE">
 *   <CreateUserPage />
 * </RouteGuard>
 * 
 * // For routes without permission requirement
 * <RouteGuard>
 *   <Dashboard />
 * </RouteGuard>
 */
export function RouteGuard<T extends DomainKey>({
  domain,
  action,
  children,
  fallback = <Forbidden />,
}: RouteGuardProps<T>): React.ReactElement {
  const checkPermission = usePermissionCheck();

  // If no domain specified, always allow access
  if (!domain || !action) {
    return <>{children}</>;
  }

  // Get the actual domain value and action value for permission checking
  const domainValue = DOMAINS[domain].value;
  const actionValue = (DOMAINS[domain].actions as any)[action] as string;
  
  // Check permission for the specified domain and action
  const hasPermission = checkPermission(domainValue, actionValue);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}