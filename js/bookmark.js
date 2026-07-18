const Bookmark = (() => {
  const add = (entry) => {
    const list = Storage.get('bookmarks') || [];
    if (list.some(b => b.id === entry.id)) {
      Utils.toast('ইতিমধ্যে বুকমাৰ্ক কৰা হৈছে');
      return false;
    }
    list.unshift({ ...entry, ts: Date.now() });
    Storage.set('bookmarks', list);
    Utils.toast('বুকমাৰ্ক সংৰক্ষণ হ\'ল');
    return true;
  };
  const remove = (id) => {
    const list = (Storage.get('bookmarks') || []).filter(b => b.id !== id);
    Storage.set('bookmarks', list);
  };
  const has = (id) => (Storage.get('bookmarks') || []).some(b => b.id === id);
  const all = () => Storage.get('bookmarks') || [];
  const setLastRead = (entry) => Storage.set('lastRead', { ...entry, ts: Date.now() });
  const getLastRead = () => Storage.get('lastRead');
  return { add, remove, has, all, setLastRead, getLastRead };
})();
