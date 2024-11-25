
import { expect } from "chai"
import { Browser, Builder, By, until } from "selenium-webdriver";

import { Options } from "selenium-webdriver/chrome.js";

import { rmSync, statSync, mkdtempSync } from "node:fs"
import { join } from "node:path";

function rm(file) {
    rmSync(file, {force: true});
}

function stat(file) {
    return statSync(file, {throwIfNoEntry: false});
}

function parseFileSize(size, unit) {
    switch (unit.toLowerCase()) {
        case "kb":
            return parseFloat(size) * 1024;
        case "mb":
            return parseFloat(size) * 1024 * 1024;
        case "gb":
            return parseFloat(size) * 1024 * 1024 * 1024;
        default:
            return parseInt(size)
    }
}

describe('WebUI automation', function () {

    let downloadDirectory
    let driver;

    before(async function() {

        downloadDirectory = mkdtempSync(join("/tmp", "webui"));

        driver = new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(new Options().setUserPreferences({
                "download.default_directory" : downloadDirectory,
                "download.prompt_for_download": false
            }))
            .build();

        await driver.manage().setTimeouts({implicit: 50000});
        await driver.manage().window().setRect({ width: 1600, height: 1028 });
    });

    after(async() => {
        await driver.quit();
        rmSync(downloadDirectory, {force: true, recursive: true})
    });

    it('download page size is less than 100MB', async function () {

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

        const rows = await table.findElements(By.xpath("//tbody/tr"));
        for (const row of rows) {
            const [fileSize, unit] = (await row.findElement(By.css("td:nth-child(2)")).getText()).split(" ");
            const link = await row.findElement(By.xpath("//td[2]/div/a"));

            const url = await link.getAttribute("href");

            console.log("About to download file " + url);

            const fileName = url.split("/").slice(-1)[0]

            const downloadedFile = join(downloadDirectory, fileName);
            const downloadingFile = join(downloadDirectory, fileName + ".crdownload");

            rm(downloadedFile);
            rm(downloadingFile);

            // Click download
            link.click();

            // Wait a bit until download starts
            await driver.sleep(1000);

            // Some files (like RPMs) cannot be downloaded (unless I find preferences)
            // - ignore them

            if (!stat(downloadedFile) && !stat(downloadingFile)) {
                continue;
            }

            while (!stat(downloadedFile)) {
                console.log("Downloading " + downloadedFile + "; " + stat(downloadingFile)?.size);
                await driver.sleep(5000);
            }

            const actualSize = stat(downloadedFile).size;
            const expectedSize = parseFileSize(fileSize, unit);
            console.log(fileSize + " " + unit + " = " + expectedSize)
            expect(actualSize, "File size is too large").to.be.closeTo(expectedSize, 1024*1024);
        }
    });

});

