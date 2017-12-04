const Server = require('../server/server');
const puppeteer = require('puppeteer');

let server;

beforeAll(() => {
  server = new Server(4000);
  server.start();
});

afterAll(() => {
  server.stop();
});

test('smoke', async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4000/');
  await page.waitForFunction('document.getElementById("done") != null');
  await browser.close();
});
