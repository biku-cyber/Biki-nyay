const Reader = (() => {
  let wakeLock = null;
  const { $ } = Utils;

  const requestWake = async () => {
    if (!('wakeLock' in navigator)) return;
    try { wakeLock = await navigator.wakeLock.request('screen'); }
    catch { /* ignore */ }
  };
  const releaseWake = async () => {
    try { await wakeLock?.release(); } catch {}
    wakeLock = null;
  };

  const render = ({ lawKey, type, items, index, onNav }) => {
    const item = items[index];
    const view = $('#view');
    const isPreamble = type === 'preamble';
    const progressLabel = type === 'article'
      ? `Article ${index + 1} of ${items.length}`
      : type === 'schedule' ? `Schedule ${index + 1} of ${items.length}`
      : type === 'amendment' ? `Amendment ${index + 1} of ${items.length}`
      : `Section ${index + 1} of ${items.length}`;

    view.innerHTML = `
      <div class="reader">
        <div class="reader-toolbar">
          <button class="icon-btn" id="rtBack" aria-label="Back">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div class="rt-title">${Utils.escapeHtml(item.title || '')}</div>
          <button class="icon-btn" id="rtTranslate" aria-label="Translate" title="Translate">${Utils.icons.translate}</button>
          <button class="icon-btn" id="rtSpeak" aria-label="Read aloud" title="Live Read">${Utils.icons.speaker}</button>
          <button class="icon-btn ${Storage.get('keepScreenOn') ? 'active' : ''}" id="rtWake" aria-label="Keep screen on" title="Keep Screen On">${Utils.icons.screen}</button>
          <button class="icon-btn ${Bookmark.has(item.id) ? 'active' : ''}" id="rtBookmark" aria-label="Bookmark" title="Bookmark">${Utils.icons.bookmark}</button>
        </div>

        <div class="reader-progress">${progressLabel}</div>

        ${isPreamble ? `
          <div class="preamble-emblem">${Utils.icons.ashoka}</div>
          <div class="reader-meta"><div class="rm-label">প্ৰস্তাৱনা · Preamble</div><h2>ভাৰতীয় সংবিধান</h2></div>
          <div class="reader-body preamble-text">${item.html || ''}</div>
        ` : `
          <div class="reader-meta">
            <div class="rm-label">${Utils.escapeHtml(item.number || '')}</div>
            <h2>${Utils.escapeHtml(item.title || '')}</h2>
          </div>
          <div class="reader-body">${item.html || ''}</div>
        `}

        <div class="reader-actions">
          <button id="rtReport">⚠️ Report</button>
        </div>

        <div class="reader-nav">
          <button id="rtPrev" ${index === 0 ? 'disabled' : ''}>◀ Previous</button>
          <button id="rtNext" ${index === items.length - 1 ? 'disabled' : ''}>Next ▶</button>
        </div>
      </div>
    `;

    // Track last read
    Bookmark.setLastRead({
      law: lawKey, type, id: item.id,
      title: item.title, sub: item.number, index
    });

    // Bind events
    $('#rtBack').onclick = () => { Speech.stop(); onNav('back'); };
    $('#rtPrev').onclick = () => {
      if (index === 0) Utils.modal({ title: 'সীমা', body: 'আপুনি ইতিমধ্যে প্ৰথম Article-ত আছে।' });
      else onNav('prev');
    };
    $('#rtNext').onclick = () => {
      if (index === items.length - 1) Utils.modal({ title: 'সীমা', body: 'এইটো শেষ Article।' });
      else onNav('next');
    };
    $('#rtSpeak').onclick = (e) => {
      const plain = view.querySelector('.reader-body').innerText;
      const active = Speech.toggle(plain, e.currentTarget);
      if (!active) e.currentTarget.classList.remove('active');
    };
    $('#rtTranslate').onclick = () => {
      Utils.modal({
        title: 'অনুবাদ',
        body: 'এই সংস্কৰণত অসমীয়া মূল পাঠ উপলব্ধ। ভৱিষ্যতৰ সংস্কৰণত ইংৰাজী / হিন্দী / বাংলা যোগ কৰা হ\'ব।',
        okText: 'ঠিক আছে'
      });
    };
    $('#rtWake').onclick = async (e) => {
      const cur = Storage.get('keepScreenOn');
      if (cur) { await releaseWake(); Storage.set('keepScreenOn', false); e.currentTarget.classList.remove('active'); Utils.toast('Screen sleep সক্ৰিয়'); }
      else { await requestWake(); Storage.set('keepScreenOn', true); e.currentTarget.classList.add('active'); Utils.toast('Screen awake ৰ\'ল'); }
    };
    $('#rtBookmark').onclick = (e) => {
      if (Bookmark.has(item.id)) {
        Bookmark.remove(item.id);
        e.currentTarget.classList.remove('active');
        Utils.toast('বুকমাৰ্ক আঁতৰোৱা হ\'ল');
      } else {
        Bookmark.add({
          id: item.id, law: lawKey, type,
          title: item.title, sub: item.number
        });
        e.currentTarget.classList.add('active');
      }
    };
    $('#rtReport').onclick = () => {
      const subj = encodeURIComponent('NyaySetu Content Report');
      const body = encodeURIComponent(
        `Law: ${lawKey}\n` +
        `${type === 'article' ? 'Article' : 'Section'}: ${item.number || item.title}\n` +
        `Problem: \n\n(বৰ্ণনা কৰক / Describe the issue)`
      );
      window.location.href = `mailto:support@nyaysetu.app?subject=${subj}&body=${body}`;
    };

    // Auto wake if setting on
    if (Storage.get('keepScreenOn')) requestWake();
    window.addEventListener('pagehide', releaseWake);
  };

  return { render, releaseWake };
})();
