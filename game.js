const canvas = document.getElementById("canvas");
const contextCanvas = canvas.getContext("2d");
const quadrosPacman = document.getElementById("animacao");
const quadrosFantasma = document.getElementById("fantasma");
const musicaDeFundo = document.getElementById("musicaDeFundo");
musicaDeFundo.volume = 0.5;
musicaDeFundo.loop = true;

let faseAtual = 0;

const DIRECAO_DIREITA = 4;
const DIRECAO_CIMA = 3;
const DIRECAO_ESQUERDA = 2;
const DIRECAO_BAIXO = 1;
let vidas = 70;
let quantidadeFantasmas = 4;

const locaisImagemFantasmas = [
    { x: 0, y: 0 }, { x: 176, y: 0 }, { x: 0, y: 121 }, { x: 176, y: 121 }
];

let fps = 30;
let pacman;
let tamanhoDeUmBloco = 20;
let pontuacao = 0;
let fantasmas = [];
let larguraEspacoParede = tamanhoDeUmBloco / 1.6;
let deslocamentoParede = (tamanhoDeUmBloco - larguraEspacoParede) / 2;
let corInternaParede = "black";

// é parede, 0 não é parede
// 21 colunas // 23 linhas

const fases = [
    [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    
        [1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1],
        [1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1],
        [1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1],
    
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1],
        [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1],
        [1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1],
        [1, 2, 2, 2, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1],
    
        [1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
];
let mapa = fases[faseAtual];

let criarRetangulo = (x, y, largura, altura, cor) => {
    contextCanvas.fillStyle = cor;
    contextCanvas.fillRect(x, y, largura, altura);
};

const alvosAleatoriosParaFantasmas = [
    { x: 1 * tamanhoDeUmBloco, y: 1 * tamanhoDeUmBloco },
    { x: 1 * tamanhoDeUmBloco, y: (mapa.length - 2) * tamanhoDeUmBloco },
    { x: (mapa[0].length - 2) * tamanhoDeUmBloco, y: tamanhoDeUmBloco },
    { x: (mapa[0].length - 2) * tamanhoDeUmBloco, y: (mapa.length - 2) * tamanhoDeUmBloco },
];

const criarNovoPacman = () => {
    pacman = new Pacman(tamanhoDeUmBloco, tamanhoDeUmBloco, tamanhoDeUmBloco, tamanhoDeUmBloco, tamanhoDeUmBloco / 5);
};

let loopDoJogo = () => {
    atualizar();
    desenhar();  
};

let intervaloJogo = setInterval(loopDoJogo, 1000 / fps);
if (musicaDeFundo.paused) {
    musicaDeFundo.play();
}

let reiniciarPacmanEFantasmas = () => {
    criarNovoPacman();
    criarFantasmas();
};

let aoColidirComFantasma = () => {
    vidas--;
    if (vidas <= 0) {
        reiniciarJogo();
    } else {
        reiniciarPacmanEFantasmas();
    }
};

const reiniciarJogo = () => {
    vidas = 70;
    pontuacao = 0;
    reiniciarPacmanEFantasmas();
    mapa.forEach(linha => linha.forEach((celula, j) => { if (celula != 1) linha[j] = 2; }));
    desenharComidas();
};

let verificarFaseCompleta = () => {
    for (let i = 0; i < mapa.length; i++) {
        for (let j = 0; j < mapa[0].length; j++) {
            if (mapa[i][j] === 2) {
                return false; 
            }
        }
    }
    return true; 
};


var modal = document.getElementById("modal");
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function exibirModalVitoria() {
  modal.style.display = "block";
}

let iniciarProximaFase = () => {
    faseAtual++;
    if (faseAtual < fases.length) {
        mapa = fases[faseAtual];
        reiniciarJogo();
    } else {
        exibirModalVitoria(); 
        reiniciarJogo(); 
    }
};

mapa = fases[faseAtual];


// loop
let atualizar = () => {
    pacman.processoDeMovimento();
    pacman.comer();
    atualizarFantasmas();
    if (pacman.verificarColisaoComFantasmas(fantasmas)) {
        aoColidirComFantasma();
    }
    if (verificarFaseCompleta()) {
        iniciarProximaFase();
    }
};

const desenharComidas = () => {
    mapa.forEach((linha, i) => linha.forEach((celula, j) => {
        if (celula === 2) {
            criarRetangulo(j * tamanhoDeUmBloco + tamanhoDeUmBloco / 3, i * tamanhoDeUmBloco + tamanhoDeUmBloco / 3, tamanhoDeUmBloco / 3, tamanhoDeUmBloco / 3, "#FEB897");
        }
    }));
};

const desenharVidasRestantes = () => {
    contextCanvas.font = "20px Emulogic";
    contextCanvas.fillStyle = "white";
    contextCanvas.fillText("Vidas: ", 220, tamanhoDeUmBloco * (mapa.length + 1));
    for (let i = 0; i < vidas; i++) {
        contextCanvas.drawImage(quadrosPacman, 1 * tamanhoDeUmBloco, 0, tamanhoDeUmBloco, tamanhoDeUmBloco, 280 + i * tamanhoDeUmBloco, tamanhoDeUmBloco * mapa.length + 2, tamanhoDeUmBloco, tamanhoDeUmBloco);
    }
};

let desenharPontuacao = () => {
    contextCanvas.font = "20px Emulogic";
    contextCanvas.fillStyle = "white";
    contextCanvas.fillText(
        "Pontuação: " + pontuacao,
        0,
        tamanhoDeUmBloco * (mapa.length + 1)
    );
};

let desenhar = () => {
    contextCanvas.clearRect(0, 0, canvas.width, canvas.height);
    criarRetangulo(0, 0, canvas.width, canvas.height, "black");
    desenharParedes();
    desenharComidas();
    desenharFantasmas();
    pacman.desenhar();
    desenharPontuacao();
    desenharVidasRestantes();
};

const desenharParedes = () => {
    mapa.forEach((linha, i) => linha.forEach((celula, j) => {
        if (celula == 1) {
            criarRetangulo(j * tamanhoDeUmBloco, i * tamanhoDeUmBloco, tamanhoDeUmBloco, tamanhoDeUmBloco, "#342DCA");
            if (j > 0 && mapa[i][j - 1] == 1) {
                criarRetangulo(j * tamanhoDeUmBloco, i * tamanhoDeUmBloco + deslocamentoParede, larguraEspacoParede + deslocamentoParede, larguraEspacoParede, corInternaParede);
            }
            if (j < mapa[0].length - 1 && mapa[i][j + 1] == 1) {
                criarRetangulo(j * tamanhoDeUmBloco + deslocamentoParede, i * tamanhoDeUmBloco + deslocamentoParede, larguraEspacoParede + deslocamentoParede, larguraEspacoParede, corInternaParede);
            }
            if (i < mapa.length - 1 && mapa[i + 1][j] == 1) {
                criarRetangulo(j * tamanhoDeUmBloco + deslocamentoParede, i * tamanhoDeUmBloco + deslocamentoParede, larguraEspacoParede, larguraEspacoParede + deslocamentoParede, corInternaParede);
            }
            if (i > 0 && mapa[i - 1][j] == 1) {
                criarRetangulo(j * tamanhoDeUmBloco + deslocamentoParede, i * tamanhoDeUmBloco, larguraEspacoParede, larguraEspacoParede + deslocamentoParede, corInternaParede);
            }
        }
    }));
};

let criarFantasmas = () => {
    fantasmas = [];
    for (let i = 0; i < quantidadeFantasmas * 2; i++) {
        let novoFantasma = new Fantasma(
            9 * tamanhoDeUmBloco + (i % 2 == 0 ? 0 : 1) * tamanhoDeUmBloco,
            10 * tamanhoDeUmBloco + (i % 2 == 0 ? 0 : 1) * tamanhoDeUmBloco,
            tamanhoDeUmBloco,
            tamanhoDeUmBloco,
            pacman.velocidade / 2,
            locaisImagemFantasmas[i % 4].x,
            locaisImagemFantasmas[i % 4].y,
            124,
            116,
            6 + i
        );
        fantasmas.push(novoFantasma);
    }
};

criarNovoPacman();
criarFantasmas();
loopDoJogo();

window.addEventListener("keydown", (evento) => {
    let k = evento.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) {
            pacman.proximaDirecao = DIRECAO_ESQUERDA;
        } else if (k == 38 || k == 87) {
            pacman.proximaDirecao = DIRECAO_CIMA;
        } else if (k == 39 || k == 68) {
            pacman.proximaDirecao = DIRECAO_DIREITA;
        } else if (k == 40 || k == 83) {
            pacman.proximaDirecao = DIRECAO_BAIXO;
        }
    }, 1);
});
