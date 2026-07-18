const Storage = (() => {
  const KEY = 'nyaysetu.v1';
  const defaults = {
    theme: 'dark',
    readerTheme: 'day',
    fontFamily: 'system',
    fontSize: 18,
    lineHeight: 1.85,
    paragraphSpacing: 1,
    keepScreenOn: false,
    speechRate: 1,
    speechPitch: 1,
    speechLang: 'as-IN',
    translateLang: 'en',
    bookmarks: [],   // {id, law, type, title, sub, ts}
    lastRead: null,  // {law, type, id, title, ts}
    settings: {}
  };

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
    } catch { return { ...defaults }; }
  };

  const save = (state) => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Storage save failed', e); }
  };

  let state = load();

  return {
    get: (k) => state[k],
    set: (k, v) => { state[k] = v; save(state); },
    update: (patch) => { state = { ...state, ...patch }; save(state); },
    all: () => ({ ...state })
  };
})();
