const App = (() => {
  const { $, $$, icons, loadJSON, escapeHtml, debounce, toast, modal } = Utils;

  // ============ DATA CATALOG ============
  const LAWS = {
    constitution: {
      key: 'constitution',
      title: 'ভাৰতীয় সংবিধান',
      subtitle: 'Constitution of India',
      icon: icons.layers,
      types: [
        { key: 'preamble', label: 'প্ৰস্তাৱনা', icon: icons.scroll },
        { key: 'parts', label: 'পাৰ্টছ', icon: icons.layers },
        { key: 'schedules', label: 'অনুসূচী', icon: icons.checklist },
        { key: 'amendments', label: 'সংশোধনী', icon: icons.edit }
      ]
    },
    bns: { key: 'bns', title: 'ভাৰতীয় ন্যায় সংহিতা', subtitle: 'Bharatiya Nyaya Sanhita', icon: icons.scale },
    bnss: { key: 'bnss', title: 'ভাৰতীয় নাগৰিক সুৰক্ষা সংহিতা', subtitle: 'Bharatiya Nagarik Suraksha Sanhita', icon: icons.scale },
    bsa: { key: 'bsa', title: 'ভাৰতীয় সাক্ষ্য অধিনিয়ম', subtitle: 'Bharatiya Sakshya Adhiniyam', icon: icons.scale },
    ipc: { key: 'ipc', title: 'Indian Penal Code', subtitle: 'ঐতিহাসিক আইন', icon: icons.scale, historical: true },
    crpc: { key: 'crpc', title: 'Code of Criminal Procedure', subtitle: 'ঐতিহাসিক আইন', icon: icons.scale, historical: true }
  };

  // ============ VIEWS ============
  const setTitle = (t, showBack = true) => {
    $('#topbarTitle').textContent = t;
    $('#backBtn').hidden = !showBack;
  };

  const viewHome = () => {
    setTitle('ন্যায়সেতু', false);
    const last = Bookmark.getLastRead();
    const view = $('#view');
    view.innerHTML = `
      <div class="home-hero">
        <div class="ashoka">${icons.ashoka}</div>
        <h2>ন্যায়সেতু</h2>
        <p>ভাৰতীয় সংবিধান আৰু আইন — অসমীয়াত</p>
      </div>

      ${last ? `
        <div class="continue-card ripple" id="continueCard">
          <div class="cc-icon">${icons.bookmark}</div>
          <div class="cc-body">
            <div class="cc-label">Continue Reading</div>
            <div class="cc-title">${escapeHtml(last.title || '')}</div>
          </div>
          <div class="cc-arrow">${icons.arrow}</div>
        </div>
      ` : ''}

      <div class="section-label">সংবিধান</div>
      <div class="module-grid" id="constitutionGrid"></div>

      <div class="section-label">আইন</div>
      <div class="law-list" id="lawList"></div>

      <div class="section-label" style="margin-top:24px">অন্যান্য</div>
      <div class="law-list" id="extraList"></div>
    `;

    // Constitution modules
    const cgrid = $('#constitutionGrid');
    LAWS.constitution.types.forEach(t => {
      const b = document.createElement('button');
      b.className = 'module-card ripple';
      b.innerHTML = `
        <div class="mc-icon">${t.icon}</div>
        <div class="mc-title">${t.label}</div>
        <div class="mc-sub">Constitution</div>
      `;
      b.onclick = () => Router.go('list', { law: 'constitution', type: t.key });
      cgrid.appendChild(b);
    });

    // Law list
    const list = $('#lawList');
    ['bns', 'bnss', 'bsa'].forEach(k => list.appendChild(lawRow(LAWS[k])));

    const extra = $('#extraList');
    ['ipc', 'crpc'].forEach(k => extra.appendChild(lawRow(LAWS[k])));

    // Bookmarks + Search + Settings shortcuts could go here
    // Add quick access
    const quick = document.createElement('div');
    quick.className = 'section-label';
    quick.style.marginTop = '24px';
    quick.textContent = 'Quick Access';
    view.insertBefore(quick, view.querySelector('#constitutionGrid').previousElementSibling);

    const qa = document.createElement('div');
    qa.className = 'law-list';
    qa.style.marginBottom = '8px';
    qa.innerHTML = `
      <button class="law-row ripple" id="qaSearch">
        <div class="lr-icon">${icons.search}</div>
        <div class="lr-body"><div class="lr-title">সন্ধান কৰক</div><div class="lr-sub">Search across all laws</div></div>
        <div class="lr-arrow">${icons.arrow}</div>
      </button>
      <button class="law-row ripple" id="qaBookmark">
        <div class="lr-icon">${icons.bookmark}</div>
        <div class="lr-body"><div class="lr-title">বুকমাৰ্ক</div><div class="lr-sub">${Bookmark.all().length} saved</div></div>
        <div class="lr-arrow">${icons.arrow}</div>
      </button>
    `;
    view.insertBefore(qa, view.querySelector('#constitutionGrid').previousElementSibling.previousElementSibling);
    $('#qaSearch').onclick = () => Router.go('search');
    $('#qaBookmark').onclick = () => Router.go('bookmarks');

    if (last) {
      $('#continueCard').onclick = () => Router.go('reader', {
        law: last.law, type: last.type, id: last.id
      });
    }
  };

  const lawRow = (law) => {
    const b = document.createElement('button');
    b.className = 'law-row ripple';
    b.innerHTML = `
      <div class="lr-icon">${law.icon}</div>
      <div class="lr-body">
        <div class="lr-title">${law.title}${law.historical ? '<span class="tag-historical">Historical</span>' : ''}</div>
        <div class="lr-sub">${law.subtitle}</div>
      </div>
      <div class="lr-arrow">${icons.arrow}</div>
    `;
    b.onclick = () => Router.go('list', { law: law.key });
    return b;
  };

  // ============ LIST VIEW ============
  const viewList = async ({ law, type }) => {
    const lawMeta = LAWS[law];
    if (!lawMeta) { Router.go('home'); return; }
    setTitle(lawMeta.title);

    const data = await loadJSON(`data/${law}.json`);
    let items = data.items || [];
    let activeType = type || (law === 'constitution' ? 'parts' : 'all');

    if (law === 'constitution') {
      items = items.filter(i => i.type === activeType);
    }

    const renderItems = (filtered) => {
      $('#listContainer').innerHTML = filtered.length
        ? filtered.map((it, i) => `
            <button class="list-item ripple" data-id="${it.id}">
              <div class="li-num">${escapeHtml(it.number || '')}</div>
              <div class="li-title">${escapeHtml(it.title || '')}</div>
              <div class="li-arrow">${icons.arrow}</div>
            </button>
          `).join('')
        : `<div class="empty">${icons.search}<p>কোনো ফলাফল পোৱা নগ\'ল</p></div>`;

      $('#count').textContent = `Results Found : ${filtered.length}`;

      $$('#listContainer .list-item').forEach(el => {
        el.onclick = () => Router.go('reader', { law, type: activeType, id: el.dataset.id });
      });
    };

    const view = $('#view');
    view.innerHTML = `
      <div class="search-wrap">
        <div class="search-box">
          ${icons.search}
          <input id="searchInput" placeholder="Search here..." autocomplete="off" />
        </div>
      </div>
      <div class="search-count" id="count">Results Found : ${items.length}</div>
      ${law === 'constitution' ? `
        <div class="segmented" id="typeSeg" style="margin-bottom:14px">
          ${LAWS.constitution.types.map(t => `<button data-t="${t.key}" class="${t.key===activeType?'active':''}">${t.label}</button>`).join('')}
        </div>
      ` : ''}
      <div class="list" id="listContainer"></div>
    `;

    renderItems(items);

    const input = $('#searchInput');
    input.oninput = debounce(() => {
      const q = input.value.trim().toLowerCase();
      if (!q) return renderItems(items);
      const rx = new RegExp(Utils.escapeRegex(q), 'i');
      const filtered = items.filter(it => rx.test(it.title || '') || rx.test(it.number || '') || rx.test(it.content || ''));
      renderItems(filtered);
    }, 180);

    if (law === 'constitution') {
      $('#typeSeg').onclick = (e) => {
        const b = e.target.closest('button'); if (!b) return;
        activeType = b.dataset.t;
        $$('#typeSeg button').forEach(x => x.classList.toggle('active', x === b));
        const filtered = (data.items || []).filter(i => i.type === activeType);
        items = filtered;
        input.value = '';
        renderItems(filtered);
      };
    }
  };

  // ============ READER ============
  const viewReader = async ({ law, type, id }) => {
    const data = await loadJSON(`data/${law}.json`);
    let items = data.items || [];
    if (law === 'constitution' && type) items = items.filter(i => i.type === type);
    const idx = items.findIndex(i => i.id === id);
    if (idx < 0) { Router.go('list', { law, type }); return; }

    const lawMeta = LAWS[law];
    setTitle(lawMeta.title);

    Reader.render({
      lawKey: law, type, items, index: idx,
      onNav: (dir) => {
        if (dir === 'back') history.back();
        else if (dir === 'prev') Router.go('reader', { law, type, id: items[idx - 1].id });
        else if (dir === 'next') Router.go('reader', { law, type, id: items[idx + 1].id });
      }
    });
  };

  // ============ SEARCH ============
  const viewSearch = () => {
    setTitle('সন্ধান');
    $('#view').innerHTML = `
      <div class="search-wrap">
        <div class="search-box">
          ${icons.search}
          <input id="gSearch" placeholder="Search any law, article, section..." autocomplete="off" autofocus />
        </div>
      </div>
      <div class="search-count" id="gCount">Type to search across all laws</div>
      <div id="gResults"></div>
    `;
    $('#gSearch').oninput = debounce(async (e) => {
      const q = e.target.value.trim();
      if (!q) { $('#gResults').innerHTML = ''; $('#gCount').textContent = 'Type to search across all laws'; return; }
      const results = await Search.global(q);
      $('#gCount').textContent = `Results Found : ${results.length}`;
      $('#gResults').innerHTML = results.length
        ? results.map(r => {
            const rx = new RegExp(Utils.escapeRegex(q), 'gi');
            const snippet = (r.content || '').slice(0, 180).replace(rx, m => `<mark>${m}</mark>`);
            return `
              <button class="search-result ripple" data-law="${r._law}" data-type="${r.type}" data-id="${r.id}">
                <div class="sr-law">${LAWS[r._law]?.title || r._law}</div>
                <div class="sr-title">${escapeHtml(r.number || '')} · ${escapeHtml(r.title || '')}</div>
                <div class="sr-snippet">${snippet || '<em>No preview</em>'}</div>
              </button>
            `;
          }).join('')
        : `<div class="empty">${icons.search}<p>No matches</p></div>`;
      $$('#gResults .search-result').forEach(el => {
        el.onclick = () => Router.go('reader', { law: el.dataset.law, type: el.dataset.type, id: el.dataset.id });
      });
    }, 250);
  };

  // ============ BOOKMARKS ============
  const viewBookmarks = () => {
    setTitle('বুকমাৰ্ক');
    const all = Bookmark.all();
    const grouped = {};
    all.forEach(b => { (grouped[b.law] ||= []).push(b); });
    const view = $('#view');

    if (!all.length) {
      view.innerHTML = `<div class="empty">${icons.bookmark}<p>কোনো বুকমাৰ্ক নাই</p></div>`;
      return;
    }

    view.innerHTML = Object.entries(grouped).map(([law, items]) => `
      <div class="bm-group">
        <h3>${LAWS[law]?.title || law}</h3>
        ${items.map(b => `
          <div class="bm-item">
            <div class="bm-text">
              <div class="bm-title">${escapeHtml(b.title || '')}</div>
              <div class="bm-sub">${escapeHtml(b.sub || '')}</div>
            </div>
            <button class="bm-remove" data-id="${b.id}" aria-label="Remove">${icons.bookmark}</button>
          </div>
        `).join('')}
      </div>
    `).join('');

    $$('.bm-item').forEach(el => {
      const title = el.querySelector('.bm-title').textContent;
      const sub = el.querySelector('.bm-sub').textContent;
      const item = all.find(b => b.title === title && b.sub === sub);
      if (!item) return;
      el.querySelector('.bm-text').onclick = () => Router.go('reader', { law: item.law, type: item.type, id: item.id });
      el.querySelector('.bm-text').style.cursor = 'pointer';
    });
    $$('.bm-remove').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        Bookmark.remove(b.dataset.id);
        toast('আঁতৰোৱা হ\'ল');
        viewBookmarks();
      };
    });
  };

  // ============ ROUTER ============
  Router.onChange((route) => {
    const { path, params } = route;
    $('#view').scrollTop = 0;
    window.scrollTo(0, 0);
    switch (path) {
      case 'home': viewHome(); break;
      case 'list': viewList(params); break;
      case 'reader': viewReader(params); break;
      case 'search': viewSearch(); break;
      case 'bookmarks': viewBookmarks(); break;
      case 'settings': Settings.render(); break;
      default: Router.go('home');
    }
  });

  // ============ INIT ============
  const boot = async () => {
    Theme.apply();
    Router.init();

    $('#backBtn').onclick = () => {
      if (history.length > 1) history.back();
      else Router.go('home');
    };
    $('#settingsBtn').onclick = () => Router.go('settings');

    // Register SW
    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.register('./sw.js'); }
      catch (e) { console.warn('SW failed', e); }
    }

    // Hide splash
    setTimeout(() => {
      $('#splash').classList.add('hide');
      $('#app').hidden = false;
      setTimeout(() => $('#splash').remove(), 500);
      // Trigger initial route
      Router.go(Router.currentRoute().path || 'home', Router.currentRoute().params);
    }, 700);
  };

  return { boot };
})();

document.addEventListener('DOMContentLoaded', App.boot);
