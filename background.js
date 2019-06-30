chrome.contextMenus.create({
   title: 'Generate openApp',
   id: 'DevToolsGenerateOpenApp',
});
chrome.contextMenus.create({
   title: 'Inject script into this frame',
   id: 'DevToolsInjectScript',
});
const setInStorage = data => new Promise(resolve => {
   chrome.storage.sync.set(data, () => {
      resolve('Data set');
   });
});
/**
 * Sends events to the frame where context menu option was clicked in
 */
chrome.contextMenus.onClicked.addListener((event, tab) => {
   const { menuItemId, frameId } = event;
   switch (menuItemId) {
      case 'DevToolsGenerateOpenApp': {
         chrome.tabs.sendMessage(tab.id, {
            type: 'SDK',
            action: 'getFrameParameters',
            payload: {
               data: event
            }
         }, {
            frameId
         });
      }
      case 'DevToolsInjectScript': {
         setInStorage({ scriptsFrameInput: event.frameUrl });
         break;
      }
      default:
         break;
   }
});

/**
 * Responsible for enabling
 */
chrome.runtime.onInstalled.addListener(function () {
   chrome.declarativeContent.onPageChanged.removeRules(null, function () {
      chrome.declarativeContent.onPageChanged.addRules([{
         conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'pulse2' },
         })
         ],
         actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
   });
});