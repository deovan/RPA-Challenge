const log = require('@deovan/rpa-log').Logger;
const { puppeteer } = require('@deovan/rpa-puppeteer-utils');
const tabletojson = require('tabletojson').Tabletojson;
const actions = require('../../actions/browser.actions');

const ERROR_CRITICAL = "CRITICAL";

var browser, page = null;


/* ******************************************************************** */
/* *******************         INICIO          ************************ */
/* ******************************************************************** */
async function run(options) {

  let configuracao = options.configuracao;
  let ambiente = options.ambiente;
  const start = new Date();

  try {
    log.info("Inicio em " + ambiente);

    await executarRobo(configuracao);

  } catch (error) {
    log.error(`Erro de execução: ${error.message || error.stack || error}`);
    switch (error.name) {
      case ERROR_CRITICAL: {
        process.exit(0);
        break;
      }
      default: {
        process.exit(1);
      }
    }
  } finally {
    log.info(`Tempo decorrido em segundos: ${((new Date() - start) / 1000).toFixed(0)} `);
    log.info(`Fim`);
  }
}

async function executarRobo({ ...configuracao }) {
  try {
    
    await inicializarBrowser(configuracao);

    await tabletojson.convertUrl(
      configuracao.url,
      function (tablesAsJson) {
        console.log(tablesAsJson);
      }
    );

    const elements = await actions.getLinks(page);
    console.log(elements);

    const titles = await actions.getTitles(page);
    console.log(titles);

    const thumbnail = await actions.getThumbnail(page);
    console.log(thumbnail);

    const buttons = await actions.getButtons(page);
    console.log(buttons);

  } catch (error) {
    log.error(error);
  } finally {
    await finalizarBrowser(browser);
  }
}

async function inicializarBrowser(configuracao, tentativas = 30, timeout = 60) {
  if (!page && !browser) {
    ({ browser, page } = await puppeteer.navegador.iniciarNavegacao(
      configuracao.url,
      tentativas,
      timeout,
      configuracao.puppeteer.headless,
      configuracao.puppeteer.devTools,
      configuracao.puppeteer.incognito,
      configuracao.puppeteer.slowMo
    ));
  }
}

async function finalizarBrowser() {
  await puppeteer.navegador.fechar(browser);
  browser = null;
  page = null;
}

module.exports = {
  run
};
