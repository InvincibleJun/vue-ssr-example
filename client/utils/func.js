export const isEmptyObject = o => {
  return !!Object.keys(o).length;
};

export const isString = o => {
  return typeof o === 'string';
};

export const isBoolean = o => {
  return o === false || o === true;
};
