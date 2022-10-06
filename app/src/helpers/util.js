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
  const integers = [];
  while (integers.length < num) {
    let randomInt = generateRandomIntegerInRange(1, 60);
    if (!integers.includes(randomInt)) integers.push(randomInt)
  }
  return integers.sort();
}

function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}