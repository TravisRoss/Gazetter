// jest.setup.js
const $ = require('jquery')
global.$ = global.jQuery = $
if (typeof window !== 'undefined') {
  window.$ = window.jQuery = $
}
