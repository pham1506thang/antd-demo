import React from 'react';
import { Tooltip } from 'antd';
import { usePermissionCheck } from '@/hooks/usePermissionCheck';
import type { DomainKey, ActionKeyForDomain } from '@/models/permission';
import { DOMAINS } from '@/models/permission';

// Generic interface for type-safe props using domain keys
interface RestrictedActionProps<T extends DomainKey> {
  domain: T;
  action: ActionKeyForDomain<T>;
  children: React.ReactElement;
  disabledTooltipTitle?: string;
}

/**
 * Type-safe component that wraps action elements with permission checking
 * Shows tooltip and disables the element if user doesn't have permission
 * 
 * @example
 * // TypeScript will suggest available actions for 'USERS' domain
 * <RestrictedAction domain="USERS" action="CREATE">
 *   <Button>Create User</Button>
 * </RestrictedAction>
 */
export function RestrictedAction<T extends DomainKey>({
  domain,
  action,
  children,
  disabledTooltipTitle = 'Bạn không có quyền thực hiện hành động này',
}: RestrictedActionProps<T>): React.ReactElement {
  const checkPermission = usePermissionCheck();
  
  // Get the actual domain value and action value for permission checking
  const domainValue = DOMAINS[domain].value;
  const actionValue = (DOMAINS[domain].actions as any)[action] as string;
  
  const hasPermission = checkPermission(domainValue, actionValue);

  // If user has permission, render children normally
  if (hasPermission) {
    return children;
  }

  // If user doesn't have permission, wrap with tooltip and disable
  return (
    <Tooltip title={disabledTooltipTitle}>
      {React.cloneElement(children, {
        disabled: true,
        style: {
          ...children.props.style,
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      })}
    </Tooltip>
  );
}

