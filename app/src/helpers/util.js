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
    let randomInt = generateRandomIntegerInRange(1, 60);
    if (!integerList.includes(randomInt)) integerList.push(randomInt)
  }

  return integerList;
}

function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}