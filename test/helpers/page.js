const puppeteer = require('puppeteer')

module.exports = class CustomPage {

  constructor(page) {
    this.page = page
  }
  static async build() {
    const browser = await puppeteer.launch({
      headless: false
    })

    const page = await browser.newPage()
    const customPage = new CustomPage(page)

    return new Proxy(customPage, {
      get: function (target, property) {
        return customPage[property] || page[property] || browser[property]
      }
    })
  }

}