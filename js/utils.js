const Utils = (() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const debounce = (fn, wait = 200) => {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
  };

  const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const toast = (msg, ms = 2200) => {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), ms);
  };

  const modal = ({ title, body, okText, onOk }) => {
    const m = $('#modal');
    $('#modalTitle').textContent = title;
    $('#modalBody').textContent = body;
    const ok = $('#modalOk');
    if (okText) { ok.hidden = false; ok.textContent = okText; }
    else ok.hidden = true;
    m.hidden = false;
    return new Promise(resolve => {
      const close = (v) => { m.hidden = true; ok.onclick = null; resolve(v); };
      ok.onclick = () => close(true);
      m.querySelectorAll('[data-close]').forEach(b => b.onclick = () => close(false));
      if (onOk) ok.onclick = async () => { await onOk(); close(true); };
    });
  };

  const loadJSON = async (path) => {
    const res = await fetch(path, { cache: 'force-cache' });
    if (!res.ok) throw new Error('Failed to load ' + path);
    return res.json();
  };

  const icons = {
    scroll: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h10a2 2 0 0 1 2 2v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="M8 3v14a2 2 0 0 0 2 2"/></svg>',
    layers: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/><path d="M3 17l9 5 9-5"/></svg>',
    checklist: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 10l2 2 4-4"/><path d="M8 16h8"/></svg>',
    edit: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
    gavel: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9l-5 5"/><path d="M5 14l4 4-2 2-4-4 2-2z"/><path d="M15 4l5 5-3 3-5-5 3-3z"/><path d="M3 21h18"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
    scale: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7l7-2 7 2"/><path d="M3 13l2-6 2 6a2 2 0 0 1-4 0z"/><path d="M17 13l2-6 2 6a2 2 0 0 1-4 0z"/><path d="M8 21h8"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    translate: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h10"/><path d="M10 4v4"/><path d="M7 8c0 4 2 7 6 9"/><path d="M14 10l4 8 4-8"/><path d="M15 16h6"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15 9a3 3 0 0 1 0 6"/><path d="M18 6a7 7 0 0 1 0 12"/></svg>',
    screen: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2"/></svg>',
    ashoka: '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="60" cy="60" r="6" fill="currentColor"/><g stroke="currentColor" stroke-width="1.5"><line x1="60" y1="10" x2="60" y2="110"/><line x1="10" y1="60" x2="110" y2="60"/><line x1="24" y1="24" x2="96" y2="96"/><line x1="96" y1="24" x2="24" y2="96"/></g><g fill="currentColor"><circle cx="60" cy="12" r="2.5"/><circle cx="60" cy="108" r="2.5"/><circle cx="12" cy="60" r="2.5"/><circle cx="108" cy="60" r="2.5"/><circle cx="26" cy="26" r="2.5"/><circle cx="94" cy="94" r="2.5"/><circle cx="94" cy="26" r="2.5"/><circle cx="26" cy="94" r="2.5"/></g></svg>'
  };

  return { $, $$, debounce, escapeHtml, escapeRegex, toast, modal, loadJSON, icons };
})();
