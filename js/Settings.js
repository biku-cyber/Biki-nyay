const Settings = (() => {
  const { $ } = Utils;

  const render = () => {
    const s = Storage.all();
    const view = $('#view');
    view.innerHTML = `
      <div class="settings-section">
        <h3>Appearance</h3>
        <div class="settings-row">
          <span class="sr-label">App Theme</span>
          <div class="segmented" id="segTheme">
            <button data-v="dark" class="${s.theme==='dark'?'active':''}">Dark</button>
            <button data-v="light" class="${s.theme==='light'?'active':''}">Light</button>
          </div>
        </div>
        <div class="settings-row">
          <span class="sr-label">Reading Theme</span>
          <div class="segmented" id="segReader">
            <button data-v="day" class="${s.readerTheme==='day'?'active':''}">Day</button>
            <button data-v="night" class="${s.readerTheme==='night'?'active':''}">Night</button>
            <button data-v="light" class="${s.readerTheme==='light'?'active':''}">Light</button>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h3>Reading</h3>
        <div class="settings-row">
          <span class="sr-label">Font Size</span>
          <input type="range" min="14" max="26" step="1" id="fontSize" value="${s.fontSize}" />
        </div>
        <div class="settings-row">
          <span class="sr-label">Line Height</span>
          <input type="range" min="1.4" max="2.4" step="0.05" id="lineHeight" value="${s.lineHeight}" />
        </div>
      </div>

      <div class="settings-section">
        <h3>Speech</h3>
        <div class="settings-row">
          <span class="sr-label">Speed</span>
          <input type="range" min="0.5" max="2" step="0.1" id="speechRate" value="${s.speechRate}" />
        </div>
        <div class="settings-row">
          <span class="sr-label">Pitch</span>
          <input type="range" min="0.5" max="2" step="0.1" id="speechPitch" value="${s.speechPitch}" />
        </div>
      </div>

      <div class="settings-section">
        <h3>Accessibility</h3>
        <div class="settings-row">
          <span class="sr-label">Keep Screen On (default)</span>
          <label><input type="checkbox" id="keepWake" ${s.keepScreenOn?'checked':''} /></label>
        </div>
      </div>

      <div class="settings-section">
        <h3>About</h3>
        <div class="settings-row"><span class="sr-label">Version</span><span class="sr-value">1.0.0</span></div>
        <div class="settings-row"><span class="sr-label">Language</span><span class="sr-value">অসমীয়া</span></div>
        <div class="settings-row" id="rowDisclaimer" style="cursor:pointer"><span class="sr-label">Disclaimer</span><span class="sr-value">›</span></div>
        <div class="settings-row" id="rowPrivacy" style="cursor:pointer"><span class="sr-label">Privacy</span><span class="sr-value">›</span></div>
      </div>
    `;

    $('#segTheme').onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      Storage.set('theme', b.dataset.v);
      Theme.apply();
      render();
    };
    $('#segReader').onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      Storage.set('readerTheme', b.dataset.v);
      Theme.apply();
      render();
    };
    $('#fontSize').oninput = (e) => { Storage.set('fontSize', +e.target.value); Theme.apply(); };
    $('#lineHeight').oninput = (e) => { Storage.set('lineHeight', +e.target.value); Theme.apply(); };
    $('#speechRate').oninput = (e) => Storage.set('speechRate', +e.target.value);
    $('#speechPitch').oninput = (e) => Storage.set('speechPitch', +e.target.value);
    $('#keepWake').onchange = (e) => Storage.set('keepScreenOn', e.target.checked);
    $('#rowDisclaimer').onclick = () => Utils.modal({
      title: 'Disclaimer',
      body: 'ন্যায়সেতু কেৱল শিক্ষামূলক তথ্যৰ বাবে। ই আইনী পৰামৰ্শ নহয়। সঠিক আইনী সহায়ৰ বাবে যোগ্য অধিবক্তাৰ পৰামৰ্শ লওক।'
    });
    $('#rowPrivacy').onclick = () => Utils.modal({
      title: 'Privacy',
      body: 'আপোনাৰ সকলো তথ্য (বুকমাৰ্ক, ছেটিংছ) কেৱল আপোনাৰ ডিভাইচত সংৰক্ষিত হয়। কোনো ডাটা বাহিৰলৈ পঠিওৱা নহয়।'
    });
  };

  return { render };
})();
