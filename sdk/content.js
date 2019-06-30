const setInStorage = data => new Promise(resolve => {
   chrome.storage.sync.set(data, () => {
      resolve('Data set');
   });
});

const getFromStorage = keys => new Promise(resolve => {
   chrome.storage.sync.get(keys, (data) => {
      if (Array.isArray(keys)) {
         return resolve(data);
      }
      if (data && data[keys]) {
         resolve(data[keys]);
      }
      resolve(null);
   });
});

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
const injectScript = url => {
   return async (removeAfter = true) => {
      const script = document.createElement('script');
      script.src = (await url); 
      (document.head || document.documentElement).appendChild(script);
      if (removeAfter) {
         script.remove();
      }
   }
};
 /**
  * Injects script which can use PulseSDK and is responsible
  */
 // 
const injectSdkScript = injectScript(chrome.runtime.getURL('./sdk/frame.js'));
const customScriptInjection = async () => {
   const scriptsFrameInput = await getFromStorage('scriptsFrameInput');
   if (scriptsFrameInput && scriptsFrameInput.includes(window.location.host)) {
      const scriptsSourceInput = await getFromStorage('scriptsSourceInput');
      injectScript(scriptsSourceInput)(false);
   }
}
/**
 * Injects styles for DOM elements created by extension scripts
 */
const injectSdkStyles = () => {
   const link = document.createElement('link');
   link.href = chrome.runtime.getURL('./sdk/sdk.css');
   link.rel = 'stylesheet';
   (document.head || document.documentElement).appendChild(link);
};

injectSdkScript();
injectSdkStyles();
customScriptInjection();