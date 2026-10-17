// src/services/logout_coordinator.ts
//
// Central place to trigger the "Confirm Logout?" dialog.
// Screens call confirmLogout(). The dialog is rendered once in app/_layout.tsx.

type PendingResolver = (ok: boolean) => void;

let showDialogFn: ((onResolve: PendingResolver) => void) | null = null;

/**
 * Called once from app/_layout.tsx to install the dialog handler.
 */
export function installLogoutDialog(fn: (onResolve: PendingResolver) => void) {
  showDialogFn = fn;
}

/**
 * Called from screens when the user taps Logout.
 * Resolves to true if the user confirmed, false if they cancelled.
 */
export function confirmLogout(): Promise<boolean> {
  if (!showDialogFn) {
    // No dialog installed — default to allowed (shouldn't happen)
    return Promise.resolve(true);
  }
  return new Promise<boolean>((resolve) => {
    showDialogFn!(resolve);
  });
}