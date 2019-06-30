const copyToClipboard = (str, displayElement, elementClass, timeAlive = 0) => {
   const element = document.createElement('textarea');
   element.classList = elementClass;
   element.value = str;
   document.body.appendChild(element);
   const selected =
      document.getSelection().rangeCount > 0
         ? document.getSelection().getRangeAt(0)
         : false;
   element.select();
   document.execCommand('copy');
   if (!displayElement || timeAlive) {
      setTimeout(() => document.body.removeChild(element), timeAlive);
   }
   document.getSelection().removeAllRanges();
   if (selected) {
      document.getSelection().addRange(selected);
   }
};

const saveOpenAppInClipboard = data => copyToClipboard(data, true, 'open-app-textarea', 5000);

window.addEventListener("message", async event => {
   if (event.source != window)
      return;
   if (event.data && event.data.type === 'SDK') {
      const { type, action, payload } = event.data;
      switch (action) {
         case 'getFrameParameters': {
            try {
               const regex = /([a-z]+)?:\/\/([a-z0-9-]+)-([a-z]+)([\.a-z0-9]+)?\/?([\/a-z1-9-\.]+)?(\?.+)?/;
               const initialData = PulseSDK ? await PulseSDK.api.apps.getInitialData() : {};
               const frameUrl = payload.data.frameUrl.replace('-proxy', '');
               const [url, protocol, namespace, app, domain, path] = regex.exec(frameUrl);
               const openAppOptions = {
                  path,
                  initialData
               };
               const title = app.split('').map((s, i) => i === 0 ? s.toUpperCase() : s).join('')
               const openApp = 'PulseSDK.api.apps.openApp(\n' +
                  `  '${app}',\n` +
                  `  '${title}',\n` +
                   `  ${JSON.stringify(openAppOptions, null, 2)})`;
               saveOpenAppInClipboard(openApp);
            } catch (error) {
               console.error(error);
            }
            break;
         }
         default: {
            break;
         }
      }

   }
});
