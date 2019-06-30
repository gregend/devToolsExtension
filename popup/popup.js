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
      if (data && data[key]) {
         resolve(data[key]);
      }
      resolve(null);
   });
});

const getElement = id => document.getElementById(id);
const generateStorageKeyFromSelector = selector => selector.split('-')
   .map((word, index) => index
      ? word.split('').map((char, index) => !index
         ? char.toUpperCase() : char).join('')
      : word).join('');

const createDOMHydration = (valueProperty) => 
    elements => elements.forEach(([selector, data]) => {
      const element = getElement(selector);
      element[valueProperty] = data;
   });

const hydrateInputs = createDOMHydration('value');
const getInputsInitialData = async inputs => {
   const inputsStorageKeys = inputs
      .reduce((acc, input)  => {
         acc[input] = generateStorageKeyFromSelector(input);
         return acc;
      }, {});
   const inputsData = await getFromStorage(Object.values(inputsStorageKeys));
   const populationArray = inputs.map(selector => [selector, inputsData[inputsStorageKeys[selector]]]);
   return hydrateInputs(populationArray)
};

/**
 * 
 * @param {Array} inputs array of input selectors which values shou
 */
const saveInputsData = inputs => async () => {
   const dataToSave = inputs.reduce((acc, inputSelector) => {
      const storageKey = generateStorageKeyFromSelector(inputSelector);
      const input = getElement(inputSelector);
      acc[storageKey] = input.value;
      return acc;
   }, {});
   return setInStorage(dataToSave);
};

const button = getElement('scripts-save-button');
const inputs = ['scripts-frame-input', 'scripts-source-input'];
button.onclick = saveInputsData(inputs);
getInputsInitialData(inputs);