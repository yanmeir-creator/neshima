/* Neshima (working name) — deploy-time configuration.
   Everything here is safe to leave empty for local review. */
window.NESHIMA_CONFIG = {
  // Public address of the app, used on the share card and in calendar reminders.
  // Leave empty to use the address the page is opened from.
  siteUrl: '',
  // Where optional feedback goes. Empty = the app only prepares a message
  // the person sends themselves (share sheet or clipboard). Nothing is ever sent automatically.
  feedbackEmail: '',
  // The contemporary 8-4-6-5 proportion (see DECISIONS.md, "Breathing cadence").
  // Set to false to remove that rhythm entirely and keep only the plain ones.
  offerHadvaRhythm: true
};
