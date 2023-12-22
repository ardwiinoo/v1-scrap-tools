const puppeteer = require("puppeteer");

async function scrapeComments(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const navigationPromise = page.waitForNavigation();
  await page.goto(url);
  await page.waitForSelector("#title > h1 > .style-scope");

  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        const replyButtons = document.querySelectorAll(
          "ytd-button-renderer#more-replies"
        );
        replyButtons.forEach(async (button) => {
          button.click();
          await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  await page.waitForTimeout(5000);
  await page.waitForSelector("#comments");
  await navigationPromise;

  const commentData = await page.$$eval("#content-text", (elements) => {
    return elements.map((element) => {
      const usernameElement = element
        .closest("ytd-comment-renderer")
        .querySelector("a#author-text yt-formatted-string");
      const username = usernameElement.innerText.trim();
      const comment = element.innerText.trim();
      return { username, comment };
    });
  });

  await browser.close();

  return commentData;
}

module.exports = {
  scrapeComments,
};
