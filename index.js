const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.port;

// Configuração para analisar o corpo das requisições como JSON
app.use(bodyParser.json());

// Rota para receber as coordenadas do usuário
app.post("/coordenadas", (req, res) => {
  const { latitude, longitude } = req.body;
  // Verifique se as coordenadas foram fornecidas corretamente
  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "Coordenadas inválidas." });
  }
  console.log(latitude, longitude);
  // Aqui, você pode fazer o que quiser com as coordenadas.
  // Por exemplo, pode retornar uma mensagem com base nas coordenadas recebidas.
  // Neste exemplo, vamos apenas devolver as coordenadas recebidas.
  return res.json({ latitude, longitude });
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
