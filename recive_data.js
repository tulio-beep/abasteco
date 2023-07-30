const axios = require("axios");
const res = require("express/lib/response");
const fs = require("fs");
const csv = require("csv-parser");
const { stringify } = require("querystring");
const { Readable } = require("stream");

urls = [];

date = new Date();
data = [];

m = date.getMonth() + 1;
y = date.getFullYear();

for (i = 1; i < 13; i++) {
  m_ = String(i);
  if (m_.length < 2) {
    m_ = String("0" + m_);
  } else {
    m_ = String(m_);
  }
  if (i > m - 2) {
    y_ = y - 1;
  } else {
    1;
    y_ = y;
  }
  urls.push(
    `https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/pmqc/${y_}/pmqc-${m_}.csv`
  );
  urls.push(
    `https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/pmqc/${y_}/pmqc_${y_}_${m_}.csv`
  );
  urls.push(
    `https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/pmqc/${y_}/${y_}-${m_}-pmqc.csv`
  );
}

function getJsonFromUrl(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Erro na solicitação da URL ${url}. Código de status: ${response.status}`
        );
      }
      return response;
    })
    .catch((error) => {
      console.error(`Erro ao acessar a URL ${url}: ${error}`);
      return null;
    });
}

// Função para fazer uma requisição HTTP usando axios e retornar a resposta como JSON
function getJsonFromUrl(url) {
  return axios
    .get(url)
    .then((response) => response.data)
    .catch((error) => {
      return null; // Ou algum valor padrão em caso de erro
    });
}

// Função para realizar várias consultas assíncronas e armazenar os resultados em um vetor
async function obterJsonsEmParalelo() {
  try {
    const promessasJson = urls.map(getJsonFromUrl);
    // Promise.all aguarda todas as promessas serem resolvidas e retorna um vetor com os resultados
    const resultados = await Promise.all(promessasJson);

    data = await concatCSVData(resultados);

    data = await data.filter((a) => a.Ensaio == "Teor de Etanol");
    data = await data.sort((a, b) => b.DataColeta.localeCompare(a.DataColeta));
    data = await onlyUnique(data);
    data = data.filter((a) => validaAlcool(a.Resultado));
    fs.writeFileSync("data.Json", JSON.stringify(data));
    // Agora você pode fazer o que quiser com o vetor de resultados
  } catch (e) {
    console.log(e);
  }
}

// Chamando a função para obter os JSONs em paralelo
obterJsonsEmParalelo();

async function concatCSVData(resultados) {
  let data = [];

  for (let i = 0; i < resultados.length; i++) {
    if (resultados[i] != null) {
      const processedData = await processCSVData(resultados[i]);
      data = data.concat(processedData);
    }
  }

  return data;
}

function responseToReadable(responseData) {
  const readableStream = new Readable();
  readableStream._read = () => {}; // A função vazia é necessária para que o stream funcione corretamente
  readableStream.push(responseData);
  readableStream.push(null);
  return readableStream;
}

// Função para processar os dados do CSV e retornar como uma resposta (Promise)
function processCSVData(csvData) {
  return new Promise((resolve, reject) => {
    const results = [];

    responseToReadable(csvData) // Transformar a resposta em um stream
      .pipe(csv({ separator: ";" }))
      .on("data", (data) => results.push(data))
      .on("end", () => {
        // Aqui, a leitura do CSV foi concluída, e os dados estão armazenados em "results"
        resolve(results); // Resolvendo a Promise com os dados do CSV
      })
      .on("error", (error) => {
        reject(error); // Rejeitando a Promise em caso de erro
      });
  });
}

function onlyUnique(arr) {
  // Verifica se a entrada é uma array válida
  if (!Array.isArray(arr)) {
    throw new TypeError("A entrada deve ser uma array.");
  }

  // Cria um objeto para rastrear a contagem de cada "CnpjPosto" na array
  const cnpjCount = {};

  // Loop para contar a ocorrência de cada "CnpjPosto" na array
  for (const obj of arr) {
    if (!obj || typeof obj !== "object" || !obj.hasOwnProperty("CnpjPosto")) {
      throw new TypeError(
        'A entrada deve ser uma array de objetos com a propriedade "CnpjPosto".'
      );
    }

    const cnpj = obj.CnpjPosto;
    cnpjCount[cnpj] = (cnpjCount[cnpj] || 0) + 1;
  }

  // Filtra a array original, incluindo apenas os objetos com "CnpjPosto" único
  const uniqueArr = arr.filter((obj) => cnpjCount[obj.CnpjPosto] === 1);

  return uniqueArr;
}

function validaAlcool(alcool) {
  return alcool >= 26 && alcool <= 28;
}
