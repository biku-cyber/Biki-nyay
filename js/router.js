const Router = (() => {
  const { $ } = Utils;
  let current = { path: 'home', params: {} };
  const listeners = [];

  const parseHash = () => {
    const h = location.hash.replace(/^#\/?/, '');
    if (!h) return { path: 'home', params: {} };
    const [path, qs = ''] = h.split('?');
    const params = {};
    qs.split('&').filter(Boolean).forEach(p => {
      const [k, v] = p.split('='); params[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return { path, params };
  };

  const go = (path, params = {}) => {
    const qs = Object.entries(params).map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    location.hash = qs ? `${path}?${qs}` : path;
  };

  const onChange = (fn) => listeners.push(fn);

  const init = () => {
    window.addEventListener('hashchange', () => {
      current = parseHash();
      Speech.stop();
      listeners.forEach(fn => fn(current));
    });
    current = parseHash();
  };

  const currentRoute = () => current;

  return { go, onChange, init, currentRoute };
})();
