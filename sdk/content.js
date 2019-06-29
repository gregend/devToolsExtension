/**
 * Communicates with current windows injected sdk script
 */
chrome.runtime.onMessage.addListener(
   async function (request, sender, sendResponse) {
      console.log('request', request, window.PulseSDK);
      if (request.type == "SDK") {
         window.postMessage(request);
      }
   });

const injectSdkScript = () => {
   console.info('Injecting script');
   const script = document.createElement('script');
   script.src = chrome.runtime.getURL('./sdk/frame.js');
   (document.head || document.documentElement).appendChild(script);
   script.remove();
};

injectSdkScript();