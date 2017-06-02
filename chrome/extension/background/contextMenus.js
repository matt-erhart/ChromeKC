let windowId = 0;
const CONTEXT_MENU_ID = 'example_context_menu';

function closeIfExist() {
  if (windowId > 0) {
    chrome.windows.remove(windowId);
    windowId = chrome.windows.WINDOW_ID_NONE;
  }
}

function popWindow(type) {
  closeIfExist();
  const options = {
    type: 'popup',
    left: 100,
    top: 100,
    width: 800,
    height: 475  };
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (type === 'open') {
      options.url = 'popup.html';

      chrome.windows.create(options, (win) => {
        windowId = win.id;
        console.log('made window')
        chrome.runtime.sendMessage({type: 'parentWindow'}, resp => {
            console.log('response in bg',resp)
          });
      });
    }
  });
  
}

chrome.contextMenus.create({
  id: CONTEXT_MENU_ID,
  title: 'Knowledge Collider',
  contexts: ['all'],
  documentUrlPatterns: [
    'https://*/*', 'http://*/*', "<all_urls>"
  ]
});

chrome.contextMenus.onClicked.addListener((event) => {
  if (event.menuItemId === CONTEXT_MENU_ID) {
    popWindow('open');
  }
});
