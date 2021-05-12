const { routineNameVerify } = require("./modules/healthRegister");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom
let header
let body

describe('index.html', () => {
  beforeEach(() => {
    dom = new JSDOM(html)
    header = dom.window.document.head
    body = dom.window.document.body
  })

  it('renders a heading element', () => {
    expect(header.querySelector('title')).not.toBeNull()
  })

  it('renders a content element', () => {
    expect(body.querySelector('#content-app')).not.toBeNull()
  })

})

test('handleGameStart Test', () => {
  expect(routineNameVerify("3분 운동 루틴")).toBe(true);
  expect(routineNameVerify("")).toBe(false);
})
