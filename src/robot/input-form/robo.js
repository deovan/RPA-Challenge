const log = require('@deovan/rpa-log').Logger;
const { utilsExcel } = require('@deovan/rpa-excel-utils');
const formAction = require('./../../actions/form.actions');
const { puppeteer } = require('@deovan/rpa-puppeteer-utils');

const ERROR_CRITICAL = "CRITICAL";

var browser, page = null;


/* ******************************************************************** */
/* *******************         INICIO          ************************ */
/* ******************************************************************** */
async function run(options) {

  let configuracao = options.configuracao;
  let ambiente = options.ambiente;
  const start = new Date();
  let quantidade = 0;

  try {
    log.info("Inicio em " + ambiente);

    let lista = await utilsExcel.fileToJsonArray(configuracao.input.nomeArquivo);

    log.info(`Encontrado ${lista.length} registros`);

    quantidade = lista.length;

    await executarRobo(lista, configuracao);

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
    log.info(`Tempo medio: ${((new Date() - start) / 1000 / quantidade).toFixed(0)} `);
    log.info(`Fim`);
  }
}

async function executarRobo([...lista], { ...configuracao }) {
  try {
    await inicializarBrowser(configuracao);
    await formAction.clickStart(page);
    for (let index = 0; index < lista.length; index++) {
      const registro = lista[index];
      await formAction.fillForm(page, registro);
      await formAction.submitForm(page);
      if (index < lista.length - 1)
        await formAction.waitSubmit(page, index + 2);
    }
    const message = await formAction.validateMessage(page);
    log.info(message);
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
