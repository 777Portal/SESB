import { chromium } from 'playwright';

const userAgentStrings = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.118 Safari/537.36',
    'Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.60 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.118 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.60 Safari/537.36',
];  

export async function getSummarizationOfQuery(query){
    const browser = await chromium.launch();  // Or 'firefox' or 'webkit'.
    const context = await browser.newContext({
        userAgent: userAgentStrings[Math.floor(Math.random() * userAgentStrings.length)],
    });
    await context.addInitScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

    const page = await browser.newPage();
    await page.goto('https://www.bing.com/search?q='+query+'&PC=U316&FORM=CHROMN');
    await page.waitForTimeout(5000);

    // console.log(await page.content())    
    const content =  (await page.getByRole('link').allTextContents()).toString();
    // const content = page.innerText('div');
    console.log( content )

    await page.screenshot({ path: `./captures/search/capture-${Date.now()}.png`, fullPage: true });

    await browser.close();
    return content;
}
// getSummarizationOfQuery("Query")