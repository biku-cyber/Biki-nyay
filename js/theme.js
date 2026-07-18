const Theme = (() => {
  const apply = () => {
    document.body.dataset.theme = Storage.get('theme');
    document.body.dataset.reader = Storage.get('readerTheme');
    document.documentElement.style.setProperty('--r-fs', Storage.get('fontSize') + 'px');
    document.documentElement.style.setProperty('--r-lh', Storage.get('lineHeight'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = Storage.get('theme') === 'light' ? '#f6f4ef' : '#0f0f10';
  };
  return { apply };
})();
