export {
  customlocaleString,
};


function customlocaleString(value) {
  if (typeof value === 'string') {
    value = Number(value);
  }

  return value.toLocaleString('pt-br');
}