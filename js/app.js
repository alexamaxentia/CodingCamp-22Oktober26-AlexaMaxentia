/**
 * app.js — To-Do List Life Dashboard
 *
 * All application logic lives here. Modules are structured as plain object
 * literals wired together by the top-level init() function below.
 *
 * Modules (implemented in subsequent tasks):
 *   - StorageService   (Task 3)
 *   - ThemeController  (Task 4)
 *   - GreetingModule   (Task 5)
 *   - NameConfigurator (Task 6)
 *   - FocusTimer       (Task 8)
 *   - TaskManager      (Task 9)
 *   - QuickLinks       (Task 10)
 */

// ---------------------------------------------------------------------------
// StorageService — central abstraction over localStorage (Task 3)
// ---------------------------------------------------------------------------
const StorageService = {
  /** Storage keys used by all modules. */
  KEYS: {
    TASKS:    'tld_tasks',
    NAME:     'tld_name',
    DURATION: 'tld_duration',
    THEME:    'tld_theme',
    LINKS:    'tld_links',
  },

  /**
   * Returns true if localStorage is available and writable.
   * Performs a write / read / delete sentinel test inside a try/catch.
   */
  isAvailable() {
    const sentinel = '__tld_test__';
    try {
      localStorage.setItem(sentinel, '1');
      localStorage.getItem(sentinel);
      localStorage.removeItem(sentinel);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Reads and JSON-parses the value stored under `key`.
   * Returns null if the key is absent, the value is null, or parsing fails.
   * Never throws.
   *
   * @param {string} key
   * @returns {*} parsed value or null
   */
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  /**
   * JSON-serialises `value` and writes it under `key`.
   * Returns true on success, false on any failure (e.g. quota exceeded).
   *
   * @param {string} key
   * @param {*} value
   * @returns {boolean}
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Removes the entry stored under `key`.
   * Returns true on success, false on any failure.
   *
   * @param {string} key
   * @returns {boolean}
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },
};

// ---------------------------------------------------------------------------
// ThemeController — light / dark mode toggle with Storage persistence (Task 4)
// ---------------------------------------------------------------------------
const ThemeController = {
  /**
   * Applies the given theme to the document and updates the toggle button's
   * accessible state and visible icon.
   *
   * @param {'light'|'dark'} theme
   */
  _apply(theme) {
    // Set data-theme on <html> — CSS custom properties respond immediately.
    document.documentElement.setAttribute('data-theme', theme);

    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;

    const isDark = theme === 'dark';

    // aria-pressed reflects whether dark mode is the *current* active state.
    btn.setAttribute('aria-pressed', String(isDark));

    // Update aria-label so screen readers announce the *action* (what will
    // happen on next click), not the current state.
    btn.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );

    // Update the visible icon.  The CSS ::before pseudo-element already
    // swaps to ☀️ in dark mode, but we keep the text-node content in sync
    // for browsers that do not support CSS content swapping and for clarity.
    const icon = btn.querySelector('.theme-toggle__icon');
    if (icon) {
      icon.textContent = isDark ? '☀️' : '🌙';
    }
  },

  /**
   * Reads the current theme from the document, switches to the opposite,
   * persists it to Storage, and applies it — all synchronously so the
   * transition completes well within the 100 ms requirement.
   */
  toggle() {
    const current = document.documentElement.dataset.theme || 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    // Persist first; if storage fails we still apply the theme in memory.
    const saved = StorageService.set(StorageService.KEYS.THEME, next);
    if (!saved) {
      // Requirement 6.8 — show error banner if write fails.
      const banner = document.getElementById('storage-banner');
      if (banner) {
        banner.textContent =
          '⚠️ Theme preference could not be saved. Changes may be lost after reload.';
        banner.hidden = false;
      }
    }

    this._apply(next);
  },

  /**
   * Reads the saved theme from StorageService, applies it, and wires the
   * toggle button's click event.  Defaults to 'light' if nothing is saved
   * or Storage is unavailable (Requirements 8.3, 8.4, 8.5).
   */
  init() {
    const saved = StorageService.get(StorageService.KEYS.THEME);
    // Accept only recognised values; anything else falls back to 'light'.
    const theme = saved === 'dark' ? 'dark' : 'light';
    this._apply(theme);

    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  },
};

// ---------------------------------------------------------------------------
// Top-level init — wires all modules together (fully implemented in Task 12)
// ---------------------------------------------------------------------------
function init() {
  // Module initialisations are added as each module is implemented.
  ThemeController.init();
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', init);
