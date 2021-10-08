
async function getLinks(page) {
  return await page.evaluate(() => {
    const allTitles = document.querySelectorAll("a", { waitUntil: 'networkidle2' });
    return Array.from(allTitles)
      .slice(0, 10)
      .map(title => {
        let res = {
          title: title.textContent,
          link: title["href"]
        };

        return res;

      });
  });
}

async function getTitles(page) {
  return await page.evaluate(() => {
    const allTitles = document.querySelectorAll("h1", { waitUntil: 'networkidle2' });
    return Array.from(allTitles)
      .slice(0, 10)
      .map(title => {
        let res = {
          title: title.textContent,
          link: title["href"]
        };

        return res;

      });
  });
}

async function getButtons(page) {
  return await page.evaluate(() => {
    const allTitles = document.querySelectorAll("button", { waitUntil: 'networkidle2' });
    return Array.from(allTitles)
      .slice(0, 10)
      .map(title => {
        let res = {
          title: title.textContent,
        };

        return res;

      });
  });
}

async function getThumbnail(page) {
  return await page.evaluate(() => {
    const allTitles = document.querySelectorAll("div.thumbnail", { waitUntil: 'networkidle2' });
    return Array.from(allTitles)
      .slice(0, 10)
      .map(title => {
        let res = {
          text: title.textContent.trim(),
          link: title.querySelector('img').src
        };

        return res;

      });
  });
}

module.exports = {
  getLinks,
  getTitles,
  getButtons,
  getThumbnail
};
