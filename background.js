chrome.contextMenus.create({
   title: 'Generate openApp',
   id: 'DevToolsGenerateOpenApp',
});
chrome.contextMenus.onClicked.addListener((event, tab) => {
   const { menuItemId, frameId } = event;
   console.log('clicked context menu 2', event, tab, frameId)
   if (menuItemId === 'DevToolsGenerateOpenApp') {
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
});

chrome.runtime.onInstalled.addListener(function () {
   chrome.declarativeContent.onPageChanged.removeRules(null, function () {
      chrome.declarativeContent.onPageChanged.addRules([{
         conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'developer.chrome.com' },
         })
         ],
         actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
   });
});