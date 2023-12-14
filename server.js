const express = require("express");
const readlineSync = require("readline-sync");

const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/realizar-sorteio", (req, res) => {
  const numerosASortear = parseInt(req.query.numerosASortear);
  const numeroDeSorteios = parseInt(req.query.numeroDeSorteios);

  const resultados = [];
  for (let i = 0; i < numeroDeSorteios; i++) {
    const resultado = realizarSorteio(numerosASortear);
    resultados.push(resultado);
  }

  res.json(resultados);
});

function realizarSorteio(numerosASortear) {
  const arquivoCSV = "mega.csv";
  const fs = require("fs");
  const fileContents = fs.readFileSync(arquivoCSV, "utf-8");

  // Extrai todos os números sorteados em sorteios anteriores
  const numerosAnteriores = fileContents
    .split("\n")
    .map((line) => line.split(";").slice(1).map(Number))
    .flat();

  // Calcula a frequência de cada número
  const frequenciaNumeros = {};
  numerosAnteriores.forEach((num) => {
    frequenciaNumeros[num] = (frequenciaNumeros[num] || 0) + 1;
  });

  // Atribui pesos aos números com base na frequência
  const pesos = {};
  Object.keys(frequenciaNumeros).forEach((num) => {
    pesos[num] = frequenciaNumeros[num] / numerosAnteriores.length;
  });

  // Garante que não há repetição de números no sorteio
  const sorteio = [];
  Object.keys(pesos).forEach((num) => {
    sorteio.push(Number(num));
  });

  // Se o número de elementos a serem sorteados for maior que o número de pesos disponíveis, ajusta o valor
  const numerosASortearAjustado = Math.min(numerosASortear, sorteio.length);

  const numerosSorteados = [];
  for (let i = 0; i < numerosASortearAjustado; i++) {
    const indexSorteado = Math.floor(Math.random() * sorteio.length);
    const numeroSorteado = sorteio.splice(indexSorteado, 1)[0];
    numerosSorteados.push(numeroSorteado);
  }

  return numerosSorteados.sort((a, b) => a - b);
}

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
