const inputForm = require('./src/robot/input-form/robo');
const stockMarket = require('./src/robot/stock-market/robo');

const packageJson = require("./package.json");
const commander = require("commander");

const AMBIENTES = ['DESENVOLVIMENTO', 'HOMOLOGACAO', 'PRODUCAO'];
const INPUT_FORMS = 'INPUT_FORMS';
const STOCK_MARKET = 'STOCK_MARKET';

commander
  .version(packageJson.version)
  .command(`start <${INPUT_FORMS | STOCK_MARKET}>`)
  .option(`-a, --ambiente <${AMBIENTES.join("|")}>`, 'Ambiente que o robô será executado', 'DESENVOLVIMENTO')
  .description('Iniciar robô')
  .action(async (type, options) => {

    const ambiente = options.ambiente;

    if (!ambiente || (ambiente && (!AMBIENTES.includes(ambiente.toUpperCase())))) {
      throw new Error(`Ambiente deve ser ${AMBIENTES.join("|")}, Valor inválido: ${ambiente}`);
    }

    switch (type.toUpperCase()) {
      case INPUT_FORMS: {
        const ambienteConfig = require(`./src/robot/input-form/${ambiente.toLowerCase()}.json`);
        options.configuracao = ambienteConfig;
        await inputForm.run(options);
        break;
      }
      case STOCK_MARKET: {
        const ambienteConfig = require(`./src/robot/stock-market/${ambiente.toLowerCase()}.json`);
        options.configuracao = ambienteConfig;
        await stockMarket.run(options);
        break;
      }
      default:
        throw new Error(`Robo indefinido ${type}`);
    }
    process.exit();
  });

// parse commands
commander.parse(process.argv);
// Check if called without command
if (process.argv.length < 3) {
  commander.help();
}
