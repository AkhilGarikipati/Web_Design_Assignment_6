/**
 * Orbit: theme toggle and mobile navigation.
 *
 * Loaded in <head> (no defer) so the saved theme is applied before the page
 * paints. Event listeners are attached once the DOM is ready.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'orbit-theme';
  const root = document.documentElement;

  // Lets CSS hide the mobile menu only when JS can open it again.
  root.classList.add('js');

  function readTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null; // Storage blocked (e.g. privacy mode); fall back to default.
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* Ignore: the theme still switches for this page view. */
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }

  // Dark is the default; only an explicit saved "light" overrides it.
  applyTheme(readTheme() === 'light' ? 'light' : 'dark');

  function initThemeToggle() {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;

    const syncLabel = () => {
      const isLight = root.getAttribute('data-theme') === 'light';
      button.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    };

    syncLabel();

    button.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      saveTheme(next);
      syncLabel();
    });
  }

  function initNavToggle() {
    const button = document.querySelector('[data-nav-toggle]');
    const nav = button && document.getElementById(button.getAttribute('aria-controls'));
    if (!button || !nav) return;

    const setOpen = (open) => {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    };

    button.addEventListener('click', () => {
      setOpen(button.getAttribute('aria-expanded') !== 'true');
    });

    // Close after choosing a link (same-page anchors don't reload the page).
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        button.focus();
      }
    });

    // Reset when resizing up to the desktop layout.
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavToggle();
  });
})();
