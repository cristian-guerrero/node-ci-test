
const puppeteer = require('puppeteer')
let browser, page
// se ejecuta antes de cada test
beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false // true entra en modo consola, false entra en modo grafico
  })
  page = await browser.newPage()
  await page.goto('localhost:3000')
})

// se ejecuta despues de cada test
afterEach(async () => {
  //  await browser.close()
})


test('The header has the correct test', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML)
  expect(text).toEqual('Blogster')
})

test('Clicking login starts oauth flow', async () => {
  await page.click('.right a')
  const url = await page.url()
  expect(url).toMatch(/accounts\.google\.com/)
})

// test.only('Signet in, show logout button', async () => {
test.only('Signet in, show logout button', async () => {
  const id = '5b80a6c82f32db187b40a25f'
  const sessionObject = {
    passport: { user: id, }
  }
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64')
  const Keygrip = require('keygrip')
  const keys = require('../config/keys')
  const keygrip = new Keygrip([keys.cookieKey])
  const sig = keygrip.sign('session=' + sessionString)

  await page.setCookie({ name: 'session', value: sessionString })
  await page.setCookie({ name: 'session.sig', value: sig })
  await page.goto('localhost:3000')
})