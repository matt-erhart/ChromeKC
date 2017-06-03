let windowId = 0;
const CONTEXT_MENU_ID = 'example_context_menu';
let text = '';

function closeIfExist() {
  if (windowId > 0) {
    chrome.windows.remove(windowId, () => {
      const err = chrome.runtime.lastError;
      if (err) {
        console.warn('Window delete error ignored:', err);
      }
    });
    windowId = chrome.windows.WINDOW_ID_NONE;
  }
}

function popWindow(type, selectedText) {
  text = selectedText
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
      localStorage.selectedText = selectedText;
      chrome.windows.create(options, (win) => {
        windowId = win.id;
        console.log('made window')
        // chrome.runtime.sendMessage({type: 'parentWindow', selectedText}, resp => {
        //     console.log('response in bg',resp)
        //   });
        chrome.runtime.onMessage.addListener(
          (request, sender, sendResponse) => {
            //  if (sender.tab) this.setState({ url: sender.tab.url, title: sender.tab.title })
            console.log('request', request)
            switch (request.type) {
              case 'dragSelect': sendResponse('got it');
              case 'getText': sendResponse(selectedText)
            }
        });
      });
    }
  });
}
// chrome.contextMenus.create({
//   id: CONTEXT_MENU_ID,
//   title: 'Knowledge Collider',
//   contexts: ["all"],
//   documentUrlPatterns: [
//     'https://*/*', 'http://*/*', "<all_urls>"
//   ],
//   onclick: function () { popWindow('open') }
// }, () => {
//   const err = chrome.runtime.lastError;
//   if (err) {
//     console.warn('Context menu error ignored:', err);
//   }
// });

chrome.contextMenus.create({
  id: 'selected text',
  title: 'Create snippet from %s',
  contexts: ["selection"],
  documentUrlPatterns: [
    'https://*/*', 'http://*/*', "<all_urls>"
  ],
  onclick: function(info, tab) {
    popWindow('open',info.selectionText);
}
}, () => {
  const err = chrome.runtime.lastError;
  if (err) {
    console.warn('Context menu error ignored:', err);
  }
});

// chrome.contextMenus.onClicked.addListener((event) => {
//   if (event.menuItemId === CONTEXT_MENU_ID) {
//     popWindow('open');
//   }
// });
