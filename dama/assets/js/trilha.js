
document.addEventListener("DOMContentLoaded", function () {
  const macrotemas = [
    {
      id: "numeros",
      numero: "01",
      icone: "∑",
      nome: "Números, aritmética e matemática financeira",
      descricao: "Operações, porcentagens, juros, sequências e medidas.",
      quantidade: 8
    },
    {
      id: "algebra",
      numero: "02",
      icone: "ƒ",
      nome: "Álgebra, funções e modelagem",
      descricao: "Equações, funções, gráficos e modelagem matemática.",
      quantidade: 7
    },
    {
      id: "geometria",
      numero: "03",
      icone: "△",
      nome: "Geometria, grandezas e medidas",
      descricao: "Figuras, áreas, volumes e transformações geométricas.",
      quantidade: 9
    },
    {
      id: "probabilidade",
      numero: "04",
      icone: "◇",
      nome: "Probabilidade e combinatória",
      descricao: "Contagem, agrupamentos e eventos aleatórios.",
      quantidade: 5
    },
    {
      id: "estatistica",
      numero: "05",
      icone: "▥",
      nome: "Estatística e análise de dados",
      descricao: "Pesquisas, gráficos, médias e dispersão.",
      quantidade: 4
    }
  ];

  if (!document.querySelector('[data-list="trilha.macrotemas"]')) {
    return;
  }

  if (!window.Mathema) {
    console.error("Mathema UI não foi carregada.");
    return;
  }

  Mathema.renderList("trilha.macrotemas", macrotemas);
});
1