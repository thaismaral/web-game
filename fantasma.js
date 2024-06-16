class Fantasma {
    constructor(
        x,
        y,
        largura,
        altura,
        velocidade,
        imagemX,
        imagemY,
        imagemLargura,
        imagemAltura,
        alcance
    ) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.velocidade = velocidade;
        this.direcao = DIRECAO_DIREITA;
        this.imagemX = imagemX;
        this.imagemY = imagemY;
        this.imagemAltura = imagemAltura;
        this.imagemLargura = imagemLargura;
        this.alcance = alcance;
        this.indiceAlvoAleatorio = parseInt(Math.random() * 4);
        this.alvo = alvosAleatoriosParaFantasmas[this.indiceAlvoAleatorio];
        setInterval(() => {
            this.mudarDirecaoAleatoria();
        }, 10000);
    }

    estaNoAlcance() {
        let distanciaX = Math.abs(pacman.MapaX() - this.MapaX());
        let distanciaY = Math.abs(pacman.MapaY() - this.MapaY());
        if (
            Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY) <=
            this.alcance
        ) {
            return true;
        }
        return false;
    }

    mudarDirecaoAleatoria() {
        let adicao = 1;
        this.indiceAlvoAleatorio += adicao;
        this.indiceAlvoAleatorio = this.indiceAlvoAleatorio % 4;
    }

    processoDeMovimento() {
        if (this.estaNoAlcance()) {
            this.alvo = pacman;
        } else {
            this.alvo = alvosAleatoriosParaFantasmas[this.indiceAlvoAleatorio];
        }
        this.mudarDirecaoSePossivel();
        this.moverParaFrente();
        if (this.verificarColisoes()) {
            this.moverParaTras();
            return;
        }
    }

    moverParaTras() {
        switch (this.direcao) {
            case 4: // Direita
                this.x -= this.velocidade;
                break;
            case 3: // Cima
                this.y += this.velocidade;
                break;
            case 2: // Esquerda
                this.x += this.velocidade;
                break;
            case 1: // Baixo
                this.y -= this.velocidade;
                break;
        }
    }

    moverParaFrente() {
        switch (this.direcao) {
            case 4: // Direita
                this.x += this.velocidade;
                break;
            case 3: // Cima
                this.y -= this.velocidade;
                break;
            case 2: // Esquerda
                this.x -= this.velocidade;
                break;
            case 1: // Baixo
                this.y += this.velocidade;
                break;
        }
    }

    verificarColisoes() {
        let colidiu = false;
        if (
            mapa[parseInt(this.y / tamanhoDeUmBloco)][
                parseInt(this.x / tamanhoDeUmBloco)
            ] == 1 ||
            mapa[parseInt(this.y / tamanhoDeUmBloco + 0.9999)][
                parseInt(this.x / tamanhoDeUmBloco)
            ] == 1 ||
            mapa[parseInt(this.y / tamanhoDeUmBloco)][
                parseInt(this.x / tamanhoDeUmBloco + 0.9999)
            ] == 1 ||
            mapa[parseInt(this.y / tamanhoDeUmBloco + 0.9999)][
                parseInt(this.x / tamanhoDeUmBloco + 0.9999)
            ] == 1
        ) {
            colidiu = true;
        }
        return colidiu;
    }

    mudarDirecaoSePossivel() {
        let direcaoTemp = this.direcao;
        this.direcao = this.calcularNovaDirecao(
            mapa,
            parseInt(this.alvo.x / tamanhoDeUmBloco),
            parseInt(this.alvo.y / tamanhoDeUmBloco)
        );
        if (typeof this.direcao == "undefined") {
            this.direcao = direcaoTemp;
            return;
        }
        if (
            this.MapaY() != this.MapaYLadoDireito() &&
            (this.direcao == DIRECAO_ESQUERDA ||
                this.direcao == DIRECAO_DIREITA)
        ) {
            this.direcao = DIRECAO_CIMA;
        }
        if (
            this.MapaX() != this.MapaXLadoDireito() &&
            this.direcao == DIRECAO_CIMA
        ) {
            this.direcao = DIRECAO_ESQUERDA;
        }
        this.moverParaFrente();
        if (this.verificarColisoes()) {
            this.moverParaTras();
            this.direcao = direcaoTemp;
        } else {
            this.moverParaTras();
        }
        console.log(this.direcao);
    }

    calcularNovaDirecao(mapa, destX, destY) {
        let mp = [];
        for (let i = 0; i < mapa.length; i++) {
            mp[i] = mapa[i].slice();
        }

        let fila = [
            {
                x: this.MapaX(),
                y: this.MapaY(),
                ladoDireitoX: this.MapaXLadoDireito(),
                ladoDireitoY: this.MapaYLadoDireito(),
                movimentos: [],
            },
        ];
        while (fila.length > 0) {
            let removido = fila.shift();
            if (removido.x == destX && removido.y == destY) {
                return removido.movimentos[0];
            } else {
                mp[removido.y][removido.x] = 1;
                let listaVizinhos = this.adicionarVizinhos(removido, mp);
                for (let i = 0; i < listaVizinhos.length; i++) {
                    fila.push(listaVizinhos[i]);
                }
            }
        }

        return 1; // direção
    }

    adicionarVizinhos(removido, mp) {
        let fila = [];
        let numDeLinhas = mp.length;
        let numDeColunas = mp[0].length;

        if (
            removido.x - 1 >= 0 &&
            removido.x - 1 < numDeLinhas &&
            mp[removido.y][removido.x - 1] != 1
        ) {
            let movimentosTemp = removido.movimentos.slice();
            movimentosTemp.push(DIRECAO_ESQUERDA);
            fila.push({ x: removido.x - 1, y: removido.y, movimentos: movimentosTemp });
        }
        if (
            removido.x + 1 >= 0 &&
            removido.x + 1 < numDeLinhas &&
            mp[removido.y][removido.x + 1] != 1
        ) {
            let movimentosTemp = removido.movimentos.slice();
            movimentosTemp.push(DIRECAO_DIREITA);
            fila.push({ x: removido.x + 1, y: removido.y, movimentos: movimentosTemp });
        }
        if (
            removido.y - 1 >= 0 &&
            removido.y - 1 < numDeColunas &&
            mp[removido.y - 1][removido.x] != 1
        ) {
            let movimentosTemp = removido.movimentos.slice();
            movimentosTemp.push(DIRECAO_CIMA);
            fila.push({ x: removido.x, y: removido.y - 1, movimentos: movimentosTemp });
        }
        if (
            removido.y + 1 >= 0 &&
            removido.y + 1 < numDeColunas &&
            mp[removido.y + 1][removido.x] != 1
        ) {
            let movimentosTemp = removido.movimentos.slice();
            movimentosTemp.push(DIRECAO_BAIXO);
            fila.push({ x: removido.x, y: removido.y + 1, movimentos: movimentosTemp });
        }
        return fila;
    }

    MapaX() {
        let mapaX = parseInt(this.x / tamanhoDeUmBloco);
        return mapaX;
    }

    MapaY() {
        let mapaY = parseInt(this.y / tamanhoDeUmBloco);
        return mapaY;
    }

    MapaXLadoDireito() {
        let mapaX = parseInt((this.x * 0.99 + tamanhoDeUmBloco) / tamanhoDeUmBloco);
        return mapaX;
    }

    MapaYLadoDireito() {
        let mapaY = parseInt((this.y * 0.99 + tamanhoDeUmBloco) / tamanhoDeUmBloco);
        return mapaY;
    }

    desenhar() {
        contextCanvas.save();
        contextCanvas.drawImage(
            quadrosFantasma,
            this.imagemX,
            this.imagemY,
            this.imagemLargura,
            this.imagemAltura,
            this.x,
            this.y,
            this.largura,
            this.altura
        );
        contextCanvas.restore();
    }
    
}

let atualizarFantasmas = () => {
    for (let i = 0; i < fantasmas.length; i++) {
        fantasmas[i].processoDeMovimento();
    }
};

let desenharFantasmas = () => {
    for (let i = 0; i < fantasmas.length; i++) {
        fantasmas[i].desenhar();
    }
};
