console.info('frame script');
window.addEventListener("message", async event => {
   if (event.source != window)
      return;
   if (event.data && event.data.type === 'SDK') {
      const { type, action, payload } = event.data;
      switch (action) {
         case 'getFrameParameters': {
            try {
               const regex = /([a-z]+)?:\/\/([a-z0-9-]+)-([a-z]+)([\.a-z0-9]+)?\/?([\/a-z\.]+)?(\?.+)?/;
               const initialData = await PulseSDK.api.apps.getInitialData();
               const frameUrl = payload.data.frameUrl.replace('-proxy', '');
               const [url, protocol, namespace, app, domain, path] = regex.exec(frameUrl);
               const openAppOptions = {
                  path,
                  initialData
               };
               const openAppParams = [app, app, openAppOptions];
               const openApp = `PulseSDK.api.apps.openApp('${app}', '${app}', ${JSON.stringify(openAppOptions)})`
               console.log(openApp);
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
