# Padrões de Projeto e Code Smells

Este documento apresenta a análise de qualidade de código e refatoração do arquivo principal (`script.js`) do projeto Minesweeper.

---

## 1. Code Smells Identificados e Refatorados

### Smell 1: Variáveis Globais (Global Data / God Object)
*   **Problema identificado:** O uso de variáveis globais soltas (`var`) polui o escopo principal, viola o encapsulamento e aumenta a probabilidade de efeitos colaterais acidentais (side effects), dificultando o reset da partida.
*   **Como estava (Antes):**
    ```javascript
    var board = [];
    var rows = 8;
    var columns = 8;
    var minesCount = 10;
    var minesLocation = []; 
    var tilesClicked = 0; 
    var flagEnabled = false;
    var gameOver = false;
    ```
*   **Alterações feitas :** As variáveis foram encapsuladas em um único objeto chamado `gameState`, atuando como a única fonte de verdade do estado da aplicação. 
    ```javascript
    const rows = 8;
    const columns = 8;
    const minesCount = 10;

    const gameState = {
        board: [],
        minesLocation: [],
        tilesClicked: 0,
        flagEnabled: false,
        gameOver: false
    };
    ```

### Smell 2: Lógica de Teste no Código de Produção (Test Code in Production)
*   **Problema identificado:** Para viabilizar os testes automatizados E2E, inseriu-se um objeto de teste (`window.Cypress`) diretamente na regra de negócio. O código de produção não deveria conhecer o ambiente de teste, caracterizando uma violação do princípio SRP (Single Responsibility Principle).
*   **Como estava ( - Geração Aleatória Padrão):**
    ```javascript
    function setMines() {
        let minesLeft = minesCount;
        while (minesLeft > 0) {
            let r = Math.floor(Math.random() * rows);
            let c = Math.floor(Math.random() * columns);
            // ...
        }
    }
    ```
*   **Nossas alterações ( - Inserção do Débito Técnico):**
    ```javascript
    function setMines() {
        if (window.Cypress) {
            gameState.minesLocation = [ "0-0", "0-1", "0-2", "0-3", "0-4", "0-5", "0-6", "0-7", "1-0", "1-1" ];
            return;
        }
        // ... geração aleatória padrão
    }
    ```
*   **Solução proposta (Refatoração Futura):** Utilizar Injeção de Dependência. A função que gera as minas deve receber uma *seed* ou um array mapeado por parâmetro. O ambiente de teste passa o array fixo, enquanto a produção passa o gerador aleatório, removendo o `if` da lógica principal.

### Smell 3: Código Duplicado (DRY Violation)
*   **Problema identificado:** A checagem das 8 células adjacentes é feita manualmente linha por linha, e depois repetida integralmente no bloco `else` (na chamada recursiva de `checkMine`). Isso gera alta complexidade cognitiva e facilita erros lógicos caso a regra de vizinhança precise mudar.
*   **Como está (O problema estrutural):**
    ```javascript
    let minesFound = 0;
    minesFound += checkTile(r-1, c-1);      
    minesFound += checkTile(r-1, c);        
    minesFound += checkTile(r-1, c+1);      
    minesFound += checkTile(r, c-1);        
    // ... repetido para as 8 direções ...
    ```
*   **Nossa proposta de refatoração:** Substituir as chamadas repetitivas por uma iteração sobre um array de vetores de direção iterando com um laço `for`.
    ```javascript
    let minesFound = 0;
    const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
    
    for (let [dr, dc] of directions) {
        minesFound += checkTile(r + dr, c + dc);
    }
    ```

---

## 2. Padrões de Projeto Aplicados/Sugeridos

### Padrão 1: Facade Pattern (Padrão Estrutural)
*   **Justificativa:** No código original, a inicialização misturava manipulação direta do DOM com a lógica de criação de matriz no mesmo bloco. A criação da função `startGame()` serviu como uma Fachada (Facade), escondendo do cliente a complexidade de como a UI e a estrutura de dados são montadas passo a passo.
*   **Como estava :**
    ```javascript
    function startGame() {
        document.getElementById("mines-count").innerText = minesCount;
        document.getElementById("flag-button").addEventListener("click", setFlag);
        setMines();
        for (let r = 0; r < rows; r++) {
            // ... lógica complexa misturando array e document.createElement
        }
    }
    ```
*   ** Alterações feitas :**
    ```javascript
    function startGame() {
        initializeUI();
        initializeBoard();
        // A complexidade foi abstraída para dentro destas funções auxiliares
    }
    
    // Onde initializeBoard() agora delega corretamente as ações:
    function initializeBoard() {
        setMines();
        createBoardTiles();
    }
    ```

### Padrão 2: State Pattern (Padrão Comportamental)
*   **Justificativa:** O comportamento das funções mudava baseado em múltiplas variáveis soltas (`flagEnabled`, `gameOver`). Ao criar o objeto `gameState`, preparamos o terreno para o padrão State, centralizando as transições de estado do jogo. Sugere-se evoluir essa estrutura para classes ou manipuladores de estado distintos (ex: `PlayingState`, `FinishedState`), eliminando as longas cadeias de `if/else`.
*   **Como estava (Antes):**
    ```javascript
    function clickTile() {
        // Checagem dependente de variáveis globais soltas
        if (gameOver || this.classList.contains("tile-clicked")) {
            return;
        }
        if (flagEnabled) { ... }
    }
    ```
*   **Nossas alterações (Depois - Agrupamento de Estado):**
    ```javascript
    function clickTile() {
        // O fluxo agora consulta uma única fonte de verdade de estado
        if (gameState.gameOver || this.classList.contains("tile-clicked")) {
            return;
        }
        if (gameState.flagEnabled) { ... }
    }
    ```

---

## 3. Sugestões de Melhorias Arquiteturais Adicionais

Como parte da análise evolutiva, sugerimos as seguintes refatorações para diminuir a dívida técnica:

*   **Implementação do Observer Pattern:** Atualmente, a função `checkMine` altera variáveis internas (Regras de Negócio) e manipula o DOM (View) simultaneamente adicionando classes CSS (`.classList.add`). O padrão *Observer* desacoplaria isso: a lógica apenas atualizaria o `gameState`, disparando um evento para que funções puramente de UI (View) reajam e pintem a tela, facilitando testes unitários sem mockar o navegador.
*   **Extração de Configuração (Magic Numbers):** Valores literais como `8` (linhas), `8` (colunas) e `10` (minas) estão "chumbados" em constantes isoladas. Eles deveriam ser movidos para um objeto de configuração centralizado (`GAME_CONFIG = { easy: {...}, medium: {...} }`). O uso de um **Factory Method** consumiria esse objeto para construir tabuleiros de diferentes dificuldades dinamicamente.