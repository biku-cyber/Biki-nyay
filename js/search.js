const Search = (() => {
  // index built lazily per law
  const cache = new Map();

  const buildIndex = async (lawKey) => {
    if (cache.has(lawKey)) return cache.get(lawKey);
    const data = await Utils.loadJSON(`data/${lawKey}.json`);
    const items = [];
    (data.items || []).forEach(it => {
      const text = [it.title, it.subtitle, it.content, it.number]
        .filter(Boolean).join(' ').toLowerCase();
      items.push({ ...it, _text: text, _law: lawKey, _meta: data.meta });
    });
    cache.set(lawKey, items);
    return items;
  };

  const inLaw = async (lawKey, query) => {
    const items = await buildIndex(lawKey);
    const q = query.trim().toLowerCase();
    if (!q) return items;
    const rx = new RegExp(Utils.escapeRegex(q), 'gi');
    return items.filter(it => rx.test(it._text) || rx.test(it.number || ''));
  };

  const global = async (query) => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const laws = ['constitution', 'bns', 'bnss', 'bsa', 'ipc', 'crpc'];
    const out = [];
    for (const law of laws) {
      const items = await buildIndex(law);
      const rx = new RegExp(Utils.escapeRegex(q), 'gi');
      items.forEach(it => {
        if (rx.test(it._text) || rx.test(it.number || '')) {
          out.push({ ...it, _law: law });
        }
      });
    }
    return out.slice(0, 60);
  };

  return { inLaw, global, buildIndex };
})();
