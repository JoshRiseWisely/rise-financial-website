// Role-based permission helpers
export type UserRole = 'admin' | 'advisor' | 'compliance'

export const Permissions = {
  // Check if user can create content
  canCreateContent: (role: UserRole) => ['admin', 'advisor', 'compliance'].includes(role),
  
  // Check if user can edit own content
  canEditOwnContent: (role: UserRole) => ['admin', 'advisor', 'compliance'].includes(role),
  
  // Check if user can edit all content
  canEditAllContent: (role: UserRole) => role === 'admin',
  
  // Check if user can approve content
  canApproveContent: (role: UserRole) => ['admin', 'compliance'].includes(role),
  
  // Check if user can reject content
  canRejectContent: (role: UserRole) => ['admin', 'compliance'].includes(role),
  
  // Check if user can view all audit logs
  canViewAuditLogs: (role: UserRole) => ['admin', 'compliance'].includes(role),
  
  // Check if user can use AI assistant
  canUseAI: (role: UserRole) => ['admin', 'advisor', 'compliance'].includes(role),
  
  // Check if user can manage users
  canManageUsers: (role: UserRole) => role === 'admin',
  
  // Check if user can view compliance queue
  canViewComplianceQueue: (role: UserRole) => ['admin', 'compliance'].includes(role),
}

export function getUserPermissions(role: UserRole) {
  return {
    canCreateContent: Permissions.canCreateContent(role),
    canEditOwnContent: Permissions.canEditOwnContent(role),
    canEditAllContent: Permissions.canEditAllContent(role),
    canApproveContent: Permissions.canApproveContent(role),
    canRejectContent: Permissions.canRejectContent(role),
    canViewAuditLogs: Permissions.canViewAuditLogs(role),
    canUseAI: Permissions.canUseAI(role),
    canManageUsers: Permissions.canManageUsers(role),
    canViewComplianceQueue: Permissions.canViewComplianceQueue(role),
  }
}
