import { Builder, By, Key, until } from 'selenium-webdriver';
import { assert } from 'chai';
import * as fs from 'fs';

describe('search', async function () {
    this.timeout(10000);
    let driver;

    if (!fs.existsSync('./screenshots')){
        fs.mkdirSync('./screenshots');
    }

    // A helper function to start a web search
    const search = async (term) => {
        // Automate DuckDuckGo search
        await driver.get('https://duckduckgo.com/');
        const searchBox = await driver.findElement(
            By.id('search_form_input_homepage'));
        await searchBox.sendKeys(term, Key.ENTER);

        // Wait until the result page is loaded
        await driver.wait(until.elementLocated(By.id('links')));

        // Return page content
        const body = await driver.findElement(By.tagName('body'));
        return await body.getText();
    };

    // Before each test, initialize Selenium and launch Chrome
    beforeEach(async function() {
        const server = 'http://selenium:4444';
        driver = await new Builder()
            .usingServer(server)
            .forBrowser('chrome')
            .build();
    });

    // After each test, take a screenshot and close the browser
    afterEach(async function () {
        if (driver) {
            // Take a screenshot of the result page
            const filename = this.currentTest.fullTitle()
                .replace(/['"]+/g, '')
                .replace(/[^a-z0-9]/gi, '_')
                .toLowerCase();;
            const encodedString = await driver.takeScreenshot();
            await fs.writeFileSync(`./screenshots/${filename}.png`,
                encodedString, 'base64');

            // Close the browser
            await driver.quit();
        }
    });

    // Our test definitions
    it('should search for "Selenium"', async function () {
        const content = await search('Selenium');
        assert.isTrue(content.includes('www.selenium.dev'));
    });

    it('should search for "Appium"', async function () {
        const content = await search('Appium');
        assert.isTrue(content.includes('appium.io'));
    });

    it('should search for "Mozilla"', async function () {
        const content = await search('Mozilla');
        assert.isTrue(content.includes('mozilla.org'));
    });

    it('should search for "GitHub"', async function () {
        const content = await search('GitHub');
        assert.isTrue(content.includes('github.com'));
    });

    it('should search for "GitLab"', async function () {
        const content = await search('GitLab');
        assert.isTrue(content.includes('gitlab.com'));
    });
});
