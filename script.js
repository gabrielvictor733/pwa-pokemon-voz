function pokeBusca() {
    let nome = document.querySelector('#nome').value.toLowerCase();

    fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`)
        .then(response => response.json())
        .then(dados => {
            document.querySelector('#pokeNome').innerHTML = "Nome: " + dados.name.charAt(0).toUpperCase() + dados.name.slice(1);
            document.querySelector('#pokeID').innerHTML = "ID: " + dados.id;
            document.querySelector('#pokeImg').src = dados.sprites.versions['generation-v']['black-white'].animated.front_default;
        })
        .catch(error => console.log('Erro:', error));
}

document.getElementById('nome').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        pokeBusca();
    }
});

// Função para remover o ponto final da string
function removerPontoFinal(texto) {
    return texto.endsWith('.') ? texto.slice(0, -1) : texto;
}

// Função para inicializar o reconhecimento de voz
function iniciarReconhecimentoDeVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR'; // Definir o idioma para português
    recognition.interimResults = false; // Captura apenas resultados finais
    recognition.maxAlternatives = 1; // Usa a melhor alternativa

    recognition.start(); // Iniciar o reconhecimento

    recognition.onstart = () => {
        console.log('Reconhecimento de voz iniciado...');
    };

    recognition.onspeechend = () => {
        recognition.stop(); // Parar o reconhecimento quando a fala terminar
    };

    recognition.onresult = (event) => {
        let resultado = event.results[0][0].transcript;

        // Verifica o texto recebido e remove o ponto final, se presente
        resultado = removerPontoFinal(resultado);

        console.log('Texto reconhecido (sem ponto final):', resultado);

        // Preenche o campo de texto com o resultado do reconhecimento de voz
        document.querySelector('#nome').value = resultado;

        // Chama a função de busca com o nome capturado
        pokeBusca();
    };

    recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
    };
}

// Adicionar evento ao botão de microfone
document.getElementById('mic-btn').addEventListener('click', iniciarReconhecimentoDeVoz);