/**
 * Optional server-side push (e.g. FCM) can be added here.
 * Client uses the Browser Notification API + reminderService.
 */
export function getNotificationCapabilities(_req, res) {
  return res.json({
    serverPush: false,
    clientBrowserNotifications: true,
    message: "Enable notifications in Settings; reminders run in the browser."
  });
}
