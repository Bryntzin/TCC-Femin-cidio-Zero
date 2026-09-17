// Seleciona o botão e a seção de destino
const botao = document.querySelector('#meu-botao');
const secaoDestino = document.querySelector('#SOBRE');

// Adiciona o evento de clique
botao.addEventListener('click', () => {
  secaoDestino.scrollIntoView({ 
    behavior: 'smooth', // Define a rolagem suave
    block: 'start'      // Alinha o topo da seção ao topo da tela
  });
});
