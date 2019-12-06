// Load functions.
const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')


// Testing synchronous code
// Test cases
test('Should calculate total with tip', () => {

  const total = calculateTip(10, .3)
  expect(total).toBe(13)

  //if(total != 13) {

    //throw new Erro('Total tip should be 13. Got' + total)

  //}

})

test('Should calculate total with default tip', () => {

  const total = calculateTip(10)
  expect(total).toBe(12.5)

});

test('should convert 32 F to C', () => {

  const temp = fahrenheitToCelsius(32)
  expect(temp).toBe(0)

});

test('Should convert 0 C to 32 F', () => {

  const temp = celsiusToFahrenheit(0)
  expect(temp).toBe(32)

});

// Testing asynchronous code
test('Async test demo', (done) => {

  // Callback function
  setTimeout(() => {

      expect(1).toBe(2)
      done()

  }, 2000)

});


test('Should add two numbers', (done) => {

    add(2, 3).then((sum) => {

      expect(sum).toBe(5)
      done()

    })

});


test('Should add two numbers async/await', async() => {

  const sum = await add(11, 22)
  expect(sum).toBe(32)

})
