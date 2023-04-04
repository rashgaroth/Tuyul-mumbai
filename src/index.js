const puppeteer = require("puppeteer");
const { getDataset, sleep } = require("./utils");
const { startListening } = require("./web3");
const url = "https://faucet.polygon.technology/";

const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while (checkCounts++ <= maxChecks) {
    let html = await page.content();
    let currentHTMLSize = html.length;

    let bodyHTMLSize = await page.evaluate(
      () => document.body.innerHTML.length
    );

    console.log(
      "last: ",
      lastHTMLSize,
      " <> curr: ",
      currentHTMLSize,
      " body html size: ",
      bodyHTMLSize
    );

    if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
      countStableSizeIterations++;
    else countStableSizeIterations = 0; //reset the counter

    if (countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitForTimeout(checkDurationMsecs);
  }
};

const main = async () => {
  try {
    const datasets = getDataset();
    const browser = await puppeteer.launch({
      headless: true,
      timeout: 20000000,
      args: [
        "--disable-web-security",
        "--disable-features=IsolateOrigins",
        "--disable-site-isolation-trials",
        "--disable-features=BlockInsecurePrivateNetworkRequests",
      ],
      // devtools: true
    });
    for (let i = 0; i < datasets.length; i++) {
      const data = datasets[i];
      const { address, private_key } = data;
      console.log(`${i + 1}. requesting`);
      const page = await browser.newPage();
      // await page.waitForNavigation()
      await page.goto(url, { waitUntil: "networkidle2" });

      console.log("input the form");
      const input = await page.waitForSelector('input[type="text"]');

      console.log(`type: ${datasets[i].address}`);

      await input.type(datasets[i].address);
      const btn = await page.$(".btn-block");
      await sleep(2000);

      console.log(`Clicking`);
      await btn.click();
      await sleep(2000);

      const [button] = await page.$x("//button[contains(., 'Confirm')]");
      await button.click();
      const val = await page.$eval(".modal-body .ps-t-8", (el) => el.innerText);
      console.log(`The result: '${val}'`);

      await sleep(5000);

      await page.close();
      console.log(`Done `, { address: address, private_key: private_key });
    }
    console.log(`Start listening...`);
    await startListening(datasets);
    await browser.close();
  } catch (error) {
    throw new Error(error);
  }
};

main().catch(console.error);
