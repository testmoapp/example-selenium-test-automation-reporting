import { Builder, By, Key, until } from 'selenium-webdriver';

// We connect to our 'selenium' service
const server = 'http://selenium:4444';

// Set up a new browser session and launch Chrome
let driver = await new Builder()
    .usingServer(server)
    .forBrowser('chrome')
    .build();

try {
    // Automate DuckDuckGo search
    await driver.get('https://duckduckgo.com/');

    // Search for 'Selenium dev'
    const searchBox = await driver.findElement(By.id('searchbox_input'));
    await searchBox.sendKeys('Selenium dev', Key.ENTER);

    // Wait until the result page is loaded
    await driver.wait(until.elementLocated(By.css('#more-results')));
} finally {
    // Close the browser
    await driver.quit();
}

