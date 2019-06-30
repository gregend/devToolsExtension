chrome.contextMenus.create({
   title: 'Generate openApp',
   id: 'DevToolsGenerateOpenApp',
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
         }, function (response) {
            console.log(response);
         });
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