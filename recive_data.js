const axios = require("axios");
const res = require("express/lib/response");

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
    `https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/pmqc/${y_}/pmqc-${m_}.json`
  );
  urls.push(
    `https://www.gov.br/anp/pt-br/centrais-de-conteudo/dados-abertos/arquivos/pmqc/${y_}/pmqc_${y_}_${m_}.json`
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
      return response.json();
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
    m = 0;
    for (i = 0; i < resultados.length; i++) {
      if (resultados[i] != null) {
        data.push(resultados[i]);
      }
    }
    console.log(data);
    // Agora você pode fazer o que quiser com o vetor de resultados
  } catch (error) {}
}

// Chamando a função para obter os JSONs em paralelo
obterJsonsEmParalelo();
