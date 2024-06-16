class Pacman {
    constructor(x, y, largura, altura, velocidade) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.velocidade = velocidade;
        this.direcao = 4;
        this.proximaDirecao = 4;
        this.quantidadeQuadros = 7;
        this.quadroAtual = 1;
        setInterval(() => {
            this.alterarAnimacao();
        }, 100);
    }

    processoDeMovimento() {
        this.alterarDirecaoSePossivel();
        this.moverParaFrente();
        if (this.verificarColisoes()) {
            this.moverParaTras();
            return;
        }
    }

    comer() {
        for (let i = 0; i < mapa.length; i++) {
            for (let j = 0; j < mapa[0].length; j++) {
                if (
                    mapa[i][j] == 2 &&
                    this.MapaX() == j &&
                    this.MapaY() == i
                ) {
                    mapa[i][j] = 3;
                    pontuacao++;
                }
            }
        }
    }

    moverParaTras() {
        switch (this.direcao) {
            case DIRECAO_DIREITA:
                this.x -= this.velocidade;
                break;
            case DIRECAO_CIMA:
                this.y += this.velocidade;
                break;
            case DIRECAO_ESQUERDA:
                this.x += this.velocidade;
                break;
            case DIRECAO_BAIXO:
                this.y -= this.velocidade;
                break;
        }
    }

    moverParaFrente() {
        switch (this.direcao) {
            case DIRECAO_DIREITA:
                this.x += this.velocidade;
                break;
            case DIRECAO_CIMA:
                this.y -= this.velocidade;
                break;
            case DIRECAO_ESQUERDA:
                this.x -= this.velocidade;
                break;
            case DIRECAO_BAIXO:
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

    verificarColisaoComFantasmas(fantasmas) {
        for (let i = 0; i < fantasmas.length; i++) {
            let fantasma = fantasmas[i];
            if (
                fantasma.MapaX() == this.MapaX() &&
                fantasma.MapaY() == this.MapaY()
            ) {
                return true;
            }
        }
        return false;
    }

    alterarDirecaoSePossivel() {
        if (this.direcao == this.proximaDirecao) return;
        let direcaoTemporaria = this.direcao;
        this.direcao = this.proximaDirecao;
        this.moverParaFrente();
        if (this.verificarColisoes()) {
            this.moverParaTras();
            this.direcao = direcaoTemporaria;
        } else {
            this.moverParaTras();
        }
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

    alterarAnimacao() {
        this.quadroAtual =
            this.quadroAtual == this.quantidadeQuadros ? 1 : this.quadroAtual + 1;
    }

    desenhar() {
        contextCanvas.save();
        contextCanvas.translate(
            this.x + tamanhoDeUmBloco / 2,
            this.y + tamanhoDeUmBloco / 2
        );
        contextCanvas.rotate((this.direcao * 90 * Math.PI) / 180);
        contextCanvas.translate(
            -this.x - tamanhoDeUmBloco / 2,
            -this.y - tamanhoDeUmBloco / 2
        );
        contextCanvas.drawImage(
            quadrosPacman,
            (this.quadroAtual - 1) * tamanhoDeUmBloco,
            0,
            tamanhoDeUmBloco,
            tamanhoDeUmBloco,
            this.x,
            this.y,
            this.largura,
            this.altura
        );
        contextCanvas.restore();
    }
}
