import { chromium } from 'playwright';

export async function getToken(username, password){
    const browser = await chromium.launch();  // Or 'firefox' or 'webkit'.
    const page = await browser.newPage();
    await page.goto('https://twoblade.com/login');
    await page.fill('#username', username);
    await page.fill('#password', password);
    await page.click('button:has-text("Sign in")');
    await page.getByText('Chat').click();
    await page.waitForTimeout(5000);

    await page.screenshot({ path: `./captures/capture-${Date.now()}.png`, fullPage: true });

    let cookies = await page.context().cookies();
    for (let cookie in cookies){
        let cookieObj = cookies[cookie];
        if (cookieObj.name == "auth_token") return cookieObj.value;
        await browser.close();
    }

    await browser.close();
    return "NO_COOKIE";
}