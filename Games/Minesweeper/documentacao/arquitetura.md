# Arquitetura do Sistema: Minesweeper

## 1. Descrição da Arquitetura
A aplicação adota uma **Arquitetura em Camadas**, estruturada logicamente em três níveis de responsabilidade. Por se tratar de um projeto construído em Vanilla JavaScript (sem o uso de frameworks), essa separação garante que a manipulação visual do navegador não se acople intrinsecamente com as regras matemáticas do jogo.

O sistema está mapeado nas seguintes camadas:
1.  **Camada de Apresentação (UI / View):** Composta pelos arquivos `index.html` e `styles.css`. Define exclusivamente a estrutura semântica da página, a grade do tabuleiro e os estados visuais (cores, botões, emojis).
2.  **Camada de Aplicação (Controle de Fluxo):** Implementada no arquivo `script.js` através das funções de manipulação de DOM e captura de eventos (ex: `startGame()`, `clickTile()`, `registerEventListeners()`). Atua como a ponte de comunicação: captura a interação do usuário na interface, aciona a regra de negócio e, de forma imperativa, atualiza a tela com o resultado.
3.  **Camada de Domínio (Lógica do Jogo):** Representada pelo objeto central `gameState` e pelas funções puras de regras da partida (ex: `setMines()`, matemática de posições adjacentes em `checkMine()`). É responsável por calcular as minas vizinhas e determinar as condições de vitória ou derrota de forma agnóstica à interface gráfica.

## 2. Justificativa Técnica: Por que 3 Camadas e não MVC?

Durante a análise arquitetural, o grupo optou por classificar o sistema como **Arquitetura de 3 Camadas** em detrimento do padrão **MVC (Model-View-Controller)** pelas seguintes razões técnicas:

*   **Ausência de Reatividade (Observer Pattern):** No padrão MVC clássico, a *View* deve observar o *Model* e se atualizar automaticamente quando os dados mudam. No nosso projeto em Vanilla JS, não há essa reatividade intrínseca. O fluxo é puramente sequencial: o usuário clica, o script calcula o estado e o próprio script força a manipulação do DOM (`element.style.backgroundColor = "red"`).
*   **Ausência de Comunicação Client-Server (Web MVC):** O MVC moderno para web geralmente dita um fluxo guiado por requisições HTTP (Rotas/Controllers no Backend, Views no Frontend). O Minesweeper roda 100% no *Client-Side* sem consumo de APIs externas.
*   **Isolamento do Domínio:** A estrutura de 3 camadas ilustra perfeitamente (como demonstrado na pirâmide arquitetural do projeto) que a **Lógica do Jogo** é a base do sistema. Ela funciona de forma independente e poderia ser executada até mesmo em um terminal de linha de comando. A **Aplicação** apenas orquestra como essa lógica interage com a **UI**.

A refatoração que realizamos ao criar o objeto `gameState` consolidou a separação conceitual entre a Camada de Aplicação e a Camada de Domínio, facilitando testes automatizados isolados.

## 3. Diagrama de Pacotes e Componentes (Mermaid)

O diagrama abaixo ilustra a organização dos componentes do sistema divididos nas três camadas lógicas da nossa arquitetura:

```mermaid
flowchart TD
    %% Estilos das Camadas
    classDef presentation fill:#E1F5FE,stroke:#0288D1,stroke-width:2px;
    classDef application fill:#E8F5E9,stroke:#388E3C,stroke-width:2px;
    classDef domain fill:#FFF3E0,stroke:#F57C00,stroke-width:2px;

    %% Pacote 1: UI
    subgraph UI [Camada de Apresentação / Interface]
        direction LR
        HTML[index.html <br> Estrutura Visual]:::presentation
        CSS[styles.css <br> Estilização]:::presentation
    end

    %% Pacote 2: Controller / Aplicação
    subgraph APP [Camada de Aplicação / Controle de Fluxo]
        direction LR
        Eventos[Ouvintes de Eventos <br> Captura de Cliques]:::application
        DOM[Manipulador de DOM <br> Atualização de Tela]:::application
    end

    %% Pacote 3: Regras de Negócio
    subgraph DOMAIN [Camada de Domínio / Lógica do Jogo]
        direction LR
        Estado[(gameState <br> Estado da Partida)]:::domain
        Regras[Regras de Negócio <br> Validações e Matrizes]:::domain
    end

    %% Relações Internas
    CSS -.->|Estiliza| HTML
    Regras -->|Consulta / Atualiza| Estado

    %% Fluxo de execução entre as camadas (Top-Down)
    HTML -->|1. Dispara interações| Eventos
    Eventos -->|2. Aciona processamento| Regras
    Regras -->|3. Retorna novo estado| DOM
    DOM -->|4. Altera elementos visuais| HTML