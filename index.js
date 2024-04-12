const express = require("express");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const cors = require("cors"); // Importe o módulo cors
const fs = require("fs");
const path = require("path");
const recive_data = require("./recive_data");
const app = express();
const port = process.env.PORT || 3000;


cron.schedule("0 */8 * * *", () => {
    console.log('executando')
    recive_data()    
});

app.use(bodyParser.json());

// Configuração do CORS
app.use(cors());

const pastaPublica = path.join(__dirname, "public");
app.use(express.static(pastaPublica));

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.post("/coordenadas", async (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "Coordenadas inválidas." });
  }
  console.log(latitude, longitude);
  data = fs.readFileSync(path.join(__dirname + "/data.Json"));
  data = JSON.parse(data);
  for (let i = 0; i < data.length; i++) {
    data[i].distance = haversineDistance(
      latitude,
      longitude,
      data[i].Latitude,
      data[i].Longitude
    );
  }
  data = await data.filter((a) => a.distance <= 50);
  console.log(data);
  return res.json(data);
});

app.listen(port || 3000, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Função para calcular a distância entre dois pontos em latitude e longitude
function haversineDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371; // Raio médio da Terra em quilômetros

  // Converter as coordenadas de graus para radianos
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  // Aplicar a fórmula de Haversine
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(radLat1) *
      Math.cos(radLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusKm * c;

  return distance;
}
