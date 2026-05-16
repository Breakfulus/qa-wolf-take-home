// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");
    const posts = [];

  //Run as long as less than 100 posts have been scraped
  while (posts.length < 100) {

    //Get all post titles and ages on the current page
    const titles = await page.locator('.titleline').allInnerTexts();
    const ages = await page.locator('.age').allInnerTexts();

    //Store post titles and ages in posts array
    for (let i = 0; i < titles.length; i++) {
    posts.push({
        title: titles[i],
        ageMinutes: convertToMinutes(ages[i])
      });
    }

    //Stop once atleast 100 posts have been collected
    if (posts.length >= 100) break;

    //Find where the "More" button leads to and grab it
    const nextUrl = await page.locator('a.morelink[rel="next"]:has-text("More")').getAttribute('href');

    //Go to the more button url to find the next posts
    await page.goto(`https://news.ycombinator.com/${nextUrl}`);
  }

  //Check if the first 100 posts are sorted from newest to oldest correctly
  let isSorted = true;

  for (let i = 1; i < 100; i++) {
    if (posts[i].ageMinutes < posts[i-1].ageMinutes) {
      isSorted = false
      console.log("ERROR: Posts are not sorted correctly!");
      break;
    }
  }

    if (isSorted) {
      console.log("SUCCESS: Posts are sorted correctly!");
    }

  //Log the amount of posts scraped after
  console.log('Posts scraped:', posts.length)

  //Close browser
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
