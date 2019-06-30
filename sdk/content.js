/**
 * Responsible for communication between background scripts and content scripts
 * contextMenu -> thisListener
 */
chrome.runtime.onMessage.addListener(
   async function (request, sender, sendResponse) {
      if (request.type == "SDK") {
         window.postMessage(request);
      }
   });
 /**
  * Injects script which can use PulseSDK and is responsible
  */
const injectSdkScript = () => {
   const script = document.createElement('script');
   script.src = chrome.runtime.getURL('./sdk/frame.js');
   (document.head || document.documentElement).appendChild(script);
   script.remove();
};

const injectSdkStyles = () => {
   const link = document.createElement('link');
   link.href = chrome.runtime.getURL('./sdk/sdk.css');
   link.rel = 'stylesheet';
   (document.head || document.documentElement).appendChild(link);
};

const setInStorage = data => new Promise(resolve => {
   chrome.storage.sync.set(data, () => {
      console.info('Data set', data);
      resolve('Data set');
   });
});

const getFromStorage = keys => new Promise(resolve => {
   chrome.storage.sync.get(keys, (data) => {
      resolve(data);
   });
});

window.addEventListener("message", event => {
   if (event.source != window) {
      return;
   }
   if (event.data.type && event.data.type === "SDK") {
      const { type, action, payload } = event.data;
   }
})

injectSdkScript();
injectSdkStyles();