import * as puppeteer from "puppeteer";
import delay from "./utils/delay.js";
import { findCity } from "./repositories/CitiesRepository.js";
import {
  createHoliday,
  findHoliday,
} from "./repositories/HolidaysRepository.js";
import fs from "fs/promises";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://feriadosbancarios.febraban.org.br/Municipais/Listar"
  );

  await page.setViewport({ width: 1080, height: 1024 });
  await page.waitForSelector(".botao");

  const ufList = await page.$$eval("#Uf > option", (options) => {
    return options.map((option) => option.textContent);
  });

  const filePath = "./files/ufs_processadas.txt";
  const csvFilePath = "./files/feriados.csv";
  const ufsProcessadas = await lerArquivo(filePath);

  // Write CSV header
  await fs.writeFile(csvFilePath, "Dia,Mês,Ano,Nome,Estado,Município,Tipo\n", "utf8");

  for (let uf of ufList) {
    if (uf === "UF" || ufsProcessadas.includes(uf)) continue;

    await page.select("#Uf", uf);
    await delay(2500);

    await page.click(".botao");
    await delay(10000);

    const feriadosRows = await page.$$eval("#tbodyMunicipais > tr", (trs) => {
      return trs.map((tr) => {
        const tds = tr.querySelectorAll("td");
        return Array.from(tds).map((td) => td.textContent.trim());
      });
    });

    const feriados = feriadosRows.map((row) => ({
      dia: +row[0].split("/")[0],
      mes: +row[0].split("/")[1],
      ano: +row[0].split("/")[2].substring(0, 4),
      nome: `${row[0]} - ${row[2]}/${row[1]}`,
      estado: row[1],
      municipio: row[2],
      tipo: row[3],
    }));

    for (const feriado of feriados) {
      const { dia, mes, ano, nome, estado, municipio, tipo } = feriado;

      // Append data to CSV file
      const csvRow = `${dia},${mes},${ano},"${nome}",${estado},${municipio},${tipo}\n`;
      await fs.appendFile(csvFilePath, csvRow, "utf8");
    }

    await fs.appendFile(filePath, `${uf}\n`, "utf8");
  }

  process.exit();
})();

const lerArquivo = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.mkdir("./files", { recursive: true });
      await fs.writeFile(filePath, "", "utf8");
      return "";
    } else {
      throw err;
    }
  }
};
