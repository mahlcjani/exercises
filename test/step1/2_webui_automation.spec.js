
import { expect } from "chai"
import { Browser, Builder, By, Capabilities, until } from "selenium-webdriver";

describe('WebUI automation', function () {

    let driver;

    before(async function() {
      driver = new Builder()
        .forBrowser(Browser.CHROME)
        .build();
    });

    after(async() => await driver.quit());

    it('download page size is less than 100MB', async function () {
        await driver.manage().setTimeouts({implicit: 5000});
        await driver.manage().window().setRect({ width: 1600, height: 1028 })

        // Navigate to download page

        // - open oracle.com
        await driver.get("https://www.oracle.com");

        // - decline All cookies
        await driver.switchTo().frame("trustarc_cm");
        await driver.findElement(By.linkText("Decline all")).click();
        await driver.switchTo().defaultContent();

        // - dismiss active country selector
        const acs = await driver.findElement(By.id("acs-wrapper"));
        acs.findElement(By.className("acs-close")).click();

        // - mouse click Resources
        const resources = await driver.findElement(By.id("resources1"));
        await driver.wait(until.elementIsVisible(resources), 2000);
        const actions = driver.actions({async: true});
        await actions.move({origin: resources}).click().perform();

        // - click Java Downloads
        await driver.findElement(By.linkText("Java Downloads")).click();

        // Validate content of download page

        const table = await driver.findElement(By.className("otable-w2"));

        expect(await table.findElement(By.css("thead > tr > th:nth-child(2)")).getText())
            .to.equal("File size");

        const rows = await table.findElements(By.css("tbody > tr"));
        for (const row of rows) {
            const [fileSize, unit] = (await row.findElement(By.css("td:nth-child(2)")).getText()).split(" ");
            switch (unit.toLowerCase()) {
                case "kb":
                    expect(parseInt(fileSize)).to.be.lessThanOrEqual(100000);
                    break;
                case "mb":
                    expect(parseFloat(fileSize)).to.be.lessThanOrEqual(100);
                    break;
                case "gb":
                    expect(parseFloat(fileSize)).to.be.lessThanOrEqual(0.1);
                    break;
            }
        }
    });

});

