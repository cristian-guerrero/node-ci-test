
const Page = require('./helpers/page')

let page

beforeEach(async () =>{
  page = await Page.build()
  page.getContentsOf('localhost:3000')
})

acfterEach(async () =>{
  await page.close()
})

