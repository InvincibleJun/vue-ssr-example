export const isEmptyObject = o => {
  return !!Object.keys(o).length;
};

export const isString = o => {
  return typeof o === 'string';
};

export const isBoolean = o => {
  return o === false || o === true;
};

// get module config
export const getModuleConfig = storeModule => {
  // maybe use es6 module
  let { destory, default: defaultModule, module: optionModule } = storeModule;
  let m;
  if (!isBoolean(destory)) {
    destory = true;
    m = defaultModule || storeModule;
  } else {
    m = optionModule.default || optionModule;
  }

  return {
    module: m,
    destory
  };
};