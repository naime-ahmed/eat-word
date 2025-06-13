// Handle extension installation and context menu setup
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    'eatword_settings': {
      autoSave: false,
      soundEnabled: true,
      theme: 'dark',
      language: 'auto'
    }
  });

  // Create a context menu item for text selection
  chrome.contextMenus.create({
    id: 'eatword-lookup',
    title: 'Translate "%s" with EatWord',
    contexts: ['selection']
  });
});


function storeTextAndOpenPopup(text) {
  chrome.storage.local.set({ 'selectedText': text }, () => {
    chrome.action.openPopup();
  });
}

// Handle Context Menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'eatword-lookup' && info.selectionText) {
    // Send a message to the content script in the active tab to show the UI
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_INPAGE_POPUP',
      text: info.selectionText,
      position: { x: 200, y: 200 }
    });
  }
});

// Handle Keyboard Shortcut commands
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'open-eatword') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text) {
          const rect = selection.getRangeAt(0).getBoundingClientRect();
          return {
            text: text,
            position: {
              x: rect.left + window.scrollX + (rect.width / 2) - 210,
              y: rect.bottom + window.scrollY + 10
            }
          };
        }
        return { text: '', position: { x: 200, y: 200 }};
      }
    }, (results) => {
      if (results && results[0] && results[0].result.text) {
        const { text, position } = results[0].result;
        chrome.tabs.sendMessage(tab.id, {
          type: 'SHOW_INPAGE_POPUP',
          text: text,
          position: position
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LOOKUP_TEXT_AND_OPEN_POPUP') {
    storeTextAndOpenPopup(message.text);
    sendResponse({ status: 'success, popup opened' });
    return true;
  }
});