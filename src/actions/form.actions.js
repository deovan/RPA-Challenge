/* eslint-disable no-undef */
const { formElements } = require('../page/form.objects');
const { puppeteer } = require('@deovan/rpa-puppeteer-utils');

async function clickStart(page) {
  puppeteer.acao.click(page, formElements.buttonStart);
}

async function fillForm(page, registro) {

  await puppeteer.elemento.aguardar(page, formElements.inputFirstName,);

  return await page.evaluate((formElements, registro) => {
    return new Promise((resolve, reject) => {
      try {
        document.querySelector(formElements.inputFirstName).value = registro['First Name'];
        document.querySelector(formElements.inputLastName).value = registro['Last Name '];
        document.querySelector(formElements.inputCompanyName).value = registro['Company Name'];
        document.querySelector(formElements.inputRole).value = registro['Role in Company'];
        document.querySelector(formElements.inputAddress).value = registro['Address'];
        document.querySelector(formElements.inputEmail).value = registro['Email'];
        document.querySelector(formElements.inputPhone).value = registro['Phone Number'];
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }, formElements, registro);
}

async function submitForm(page) {
  await puppeteer.acao.click(page, formElements.buttonSubmit);
}

async function waitSubmit(page, valor) {
  await puppeteer.elemento.waitTextInElement(page, formElements.buttonStart, valor, true);
}

async function validateMessage(page) {
  await puppeteer.elemento.aguardar(page, formElements.messagaEnd);
  return await puppeteer.elemento.innerText(page, formElements.messagaEnd);
}

module.exports = {
  clickStart,
  fillForm,
  submitForm,
  waitSubmit,
  validateMessage
};