document.addEventListener("DOMContentLoaded", function () {
  const botao = document.getElementById("botao-acessibilidade");
  const painel = document.getElementById("painel-acessibilidade");
  const valorFonte = document.getElementById("valor-fonte");
  const aumentar = document.getElementById("aumentar-fonte");
  const diminuir = document.getElementById("diminuir-fonte");
  const alternarClaro = document.getElementById("alternar-claro");
  const alternarContraste = document.getElementById("alternar-contraste");
  const estadoClaro = document.getElementById("estado-claro");
  const estadoContraste = document.getElementById("estado-contraste");

  if (!botao || !painel) {
    console.error("Botão ou painel de acessibilidade não encontrado.");
    return;
  }

  // Abrir/fechar o painel.
  botao.addEventListener("click", function () {
    const vaiAbrir = painel.hidden;
    painel.hidden = !vaiAbrir;
    botao.setAttribute("aria-expanded", String(vaiAbrir));
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
      painel.hidden = true;
      botao.setAttribute("aria-expanded", "false");
    }
  });

  // A fonte é aplicada proporcionalmente para manter a hierarquia visual
  // (títulos continuam maiores que parágrafos). A captura dos tamanhos
  // originais acontece ANTES de alterar qualquer elemento, evitando que
  // textos dentro de títulos sejam escalados duas vezes.
  const tamanhoInicial = 18;
  let tamanhoFonte = tamanhoInicial;
  const seletorTexto = [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "li",
    "span", "strong", "em", "b", "i", "label", "button", "small",
    "blockquote", "figcaption", "td", "th", "dt", "dd", "legend", "summary"
  ].join(",");

  function aplicarTamanhoFonte() {
    const escala = tamanhoFonte / tamanhoInicial;
    const elementos = Array.from(document.querySelectorAll(seletorTexto)).filter(function (elemento) {
      return !painel.contains(elemento) && !botao.contains(elemento) &&
        !elemento.classList.contains("footer-icone") &&
        !elemento.closest(".icone-acessibilidade");
    });

    // Primeiro salva todos os tamanhos originais sem modificar o layout.
    elementos.forEach(function (elemento) {
      if (!elemento.dataset.tamanhoFonteOriginal) {
        elemento.dataset.tamanhoFonteOriginal = getComputedStyle(elemento).fontSize;
      }
    });

    // Depois aplica o fator com prioridade para vencer regras CSS conflitantes.
    elementos.forEach(function (elemento) {
      const original = parseFloat(elemento.dataset.tamanhoFonteOriginal);
      if (Number.isFinite(original)) {
        elemento.style.setProperty("font-size", (original * escala) + "px", "important");
      }
    });

    if (valorFonte) valorFonte.textContent = tamanhoFonte + "px";
    if (diminuir) diminuir.disabled = tamanhoFonte <= 12;
    if (aumentar) aumentar.disabled = tamanhoFonte >= 32;
  }

  if (valorFonte) valorFonte.textContent = tamanhoFonte + "px";
  if (diminuir) diminuir.disabled = true;

  if (aumentar) {
    aumentar.addEventListener("click", function (evento) {
      evento.preventDefault();
      tamanhoFonte = Math.min(32, tamanhoFonte + 2);
      aplicarTamanhoFonte();
    });
  }

  if (diminuir) {
    diminuir.addEventListener("click", function (evento) {
      evento.preventDefault();
      tamanhoFonte = Math.max(12, tamanhoFonte - 2);
      aplicarTamanhoFonte();
    });
  }

  if (alternarClaro) {
    alternarClaro.addEventListener("click", function () {
      document.body.classList.toggle("modo-claro");
      const ativo = document.body.classList.contains("modo-claro");
      if (estadoClaro) estadoClaro.textContent = ativo ? "ON" : "OFF";
      alternarClaro.setAttribute("aria-pressed", String(ativo));
    });
  }

  if (alternarContraste) {
    alternarContraste.addEventListener("click", function () {
      document.body.classList.toggle("alto-contraste");
      const ativo = document.body.classList.contains("alto-contraste");
      if (estadoContraste) estadoContraste.textContent = ativo ? "ON" : "OFF";
      alternarContraste.setAttribute("aria-pressed", String(ativo));
    });
  }
});
