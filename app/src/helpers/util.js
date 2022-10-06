export {
  customlocaleString,
  generateRandomIntegerList,
  generateRandomIntegerInRange,
};


function customlocaleString(value) {
  if (typeof value === 'string') {
    value = Number(value);
  }

  return value.toLocaleString('pt-br');
}


function generateRandomIntegerList(num) {
  const integerList = [];
  while (integerList.length < num) {
    let randomInt = generateRandomIntegerInRange(60);
    if (!integerList.includes(randomInt)) integerList.push(randomInt)
  }

  return integerList;
}

function generateRandomIntegerInRange(max) {
  let integerList = new Uint32Array(1);
  self.crypto.getRandomValues(integerList);

  return (integerList[0] % max) + 1
}