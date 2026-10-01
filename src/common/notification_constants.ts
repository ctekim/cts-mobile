// src/common/notification_constants.ts

// ---------- Notification severity ----------
export const NOTIFICATION_INFORMATION = 'I';
export const NOTIFICATION_CRITICAL    = 'C';
export const NOTIFICATION_ADMIN       = 'A';
export const NOTIFICATION_WARNING     = 'W';
export const NOTIFICATION_UNKNOWN     = 'U';
export const NOTIFICATION_ERROR       = 'E';
export const NOTIFICATION_FATAL       = 'F';

export const NOTIFICATION_NAME_INFORMATION = 'Information';
export const NOTIFICATION_NAME_WARNING     = 'Warning';
export const NOTIFICATION_NAME_CRITICAL    = 'Critical';
export const NOTIFICATION_NAME_ADMIN       = 'Admin';
export const NOTIFICATION_NAME_UNKNOWN     = 'Unknown';
export const NOTIFICATION_NAME_ERROR       = 'Error';
export const NOTIFICATION_NAME_FATAL       = 'Fatal';
export const NOTIFICATION_NAME_SERVER      = 'Server';
export const NOTIFICATION_NAME_WORKSTATION = 'Workstation';

export function convertSeverity(severity: any): string {
  switch (severity) {
    case NOTIFICATION_INFORMATION: return NOTIFICATION_NAME_INFORMATION;
    case NOTIFICATION_WARNING:     return NOTIFICATION_NAME_WARNING;
    case NOTIFICATION_UNKNOWN:     return NOTIFICATION_NAME_WARNING;
    case NOTIFICATION_ERROR:       return NOTIFICATION_NAME_ERROR;
    case NOTIFICATION_FATAL:       return NOTIFICATION_NAME_FATAL;
    case NOTIFICATION_CRITICAL:    return NOTIFICATION_NAME_CRITICAL;
    case NOTIFICATION_ADMIN:       return NOTIFICATION_NAME_ADMIN;
    default:                       return NOTIFICATION_NAME_UNKNOWN;
  }
}

// Returns a color hint for the severity
export function severityKey(severity: any): 'info' | 'warning' | 'error' | 'critical' | 'admin' | 'unknown' {
  switch (severity) {
    case NOTIFICATION_INFORMATION: return 'info';
    case NOTIFICATION_WARNING:     return 'warning';
    case NOTIFICATION_UNKNOWN:     return 'warning';
    case NOTIFICATION_ERROR:       return 'error';
    case NOTIFICATION_FATAL:       return 'critical';
    case NOTIFICATION_CRITICAL:    return 'critical';
    case NOTIFICATION_ADMIN:       return 'admin';
    default:                       return 'unknown';
  }
}