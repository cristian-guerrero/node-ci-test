
// const puppeteer = require('puppeteer')
const sessionFactory = require('./factories/session.factory')
const userFactory = require('./factories/user.factory')
const Page = require('./helpers/page')

// let browser, page
let page
// se ejecuta antes de cada test
beforeEach(async () => {

  page = await Page.build()
  await page.goto('localhost:3000')
})

// se ejecuta despues de cada test
afterEach(async () => {
  // await browser.close()
  await page.close()
})


test('The header has the correct test', async () => {
  // const text = await page.$eval('a.brand-logo', el => el.innerHTML)
  const text = await page.getContentsOf('a.brand-logo')
  expect(text).toEqual('Blogster')
})

test('Clicking login starts oauth flow', async () => {
  await page.click('.right a')
  const url = await page.url()
  expect(url).toMatch(/accounts\.google\.com/)
})

// test.only('Signet in, show logout button', async () => {
test('Signet in, show logout button', async () => {
  await page.login()
  // const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML)
  const text = await page.getContentsOf('a[href="/auth/logout"]')

  expect(text).toEqual('Logout')
})
