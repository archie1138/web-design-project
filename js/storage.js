/**
 * K-Explore Events - Local Storage Manager
 * Handles local persistence of registrations, ticket management, and user preferences.
 */

const STORAGE_KEYS = {
  REGISTRATIONS: 'kx_registrations_v1',
  THEME: 'kx_theme_preference',
  SEATS_OVERRIDE: 'kx_event_seats_v1'
};

export const StorageManager = {
  // --- THEME PREFERENCE ---
  getTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
    // Auto-detect OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn('LocalStorage unavailable for theme storage', e);
    }
  },

  // --- REGISTRATIONS ---
  getRegistrations() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed reading registrations from storage', e);
      return [];
    }
  },

  saveRegistration(data) {
    try {
      const current = this.getRegistrations();
      // Generate unique ticket number & registration timestamp
      const registration = {
        ...data,
        id: 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        timestamp: new Date().toISOString(),
        status: 'CONFIRMED'
      };

      current.unshift(registration);
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(current));

      // Decrement available seat count
      this.reserveSeat(data.eventId);

      return registration;
    } catch (e) {
      console.error('Failed saving registration', e);
      throw e;
    }
  },

  cancelRegistration(registrationId) {
    try {
      const current = this.getRegistrations();
      const target = current.find(r => r.id === registrationId);
      if (!target) return null;

      const filtered = current.filter(r => r.id !== registrationId);
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(filtered));

      // Release seat back to event pool
      this.releaseSeat(target.eventId);

      return target;
    } catch (e) {
      console.error('Failed cancelling registration', e);
      return null;
    }
  },

  isAlreadyRegistered(eventId, email) {
    const current = this.getRegistrations();
    return current.some(
      r => r.eventId === eventId && r.email.trim().toLowerCase() === email.trim().toLowerCase()
    );
  },

  // --- EVENT SEATS REAL-TIME OVERRIDE ---
  getSeatsOverrides() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SEATS_OVERRIDE);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  },

  reserveSeat(eventId) {
    try {
      const overrides = this.getSeatsOverrides();
      overrides[eventId] = (overrides[eventId] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.SEATS_OVERRIDE, JSON.stringify(overrides));
    } catch (e) {
      console.warn('Could not update seat count in storage', e);
    }
  },

  releaseSeat(eventId) {
    try {
      const overrides = this.getSeatsOverrides();
      if (overrides[eventId] && overrides[eventId] > 0) {
        overrides[eventId] -= 1;
        localStorage.setItem(STORAGE_KEYS.SEATS_OVERRIDE, JSON.stringify(overrides));
      }
    } catch (e) {
      console.warn('Could not update seat count in storage', e);
    }
  }
};
