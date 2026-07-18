const Speech = (() => {
  let utter = null;
  const supported = 'speechSynthesis' in window;

  const speak = (text) => {
    if (!supported) { Utils.toast('TTS সমৰ্থিত নহয়'); return; }
    stop();
    utter = new SpeechSynthesisUtterance(text);
    utter.lang = Storage.get('speechLang') || 'as-IN';
    utter.rate = Storage.get('speechRate') || 1;
    utter.pitch = Storage.get('speechPitch') || 1;
    speechSynthesis.speak(utter);
  };
  const stop = () => {
    if (supported) speechSynthesis.cancel();
    utter = null;
  };
  const toggle = (text, btn) => {
    if (supported && speechSynthesis.speaking) {
      stop(); btn?.classList.remove('active'); return false;
    }
    speak(text); btn?.classList.add('active'); return true;
  };
  return { speak, stop, toggle, supported };
})();
