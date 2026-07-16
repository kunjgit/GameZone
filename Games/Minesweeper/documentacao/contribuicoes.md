# Contribuições

**Equipe:**
- Emerson Caetano Ataíde - 23.2.8123
- Lucas Lucio Silva Caixeta - 24.1.8065

**Repositório (Fork):** [lucaslscaixeta/GameZone](https://github.com/lucaslscaixeta/GameZone)

Este documento sumariza as contribuições realizadas no projeto de código aberto **GameZone** (focadas no jogo **Minesweeper**), detalhando a implementação de novas features (Caminho A), as refatorações estruturais (Caminho B), os Pull Requests gerados e o papel desempenhado por cada integrante da dupla na disciplina de Engenharia de Software.

---

## Caminho A: Manutenção Evolutiva/Corretiva

- **Link da Issue Escolhida:** [Feature Request: Adicionar Botão de Restart #5256](https://github.com/kunjgit/GameZone/issues/5256)
- **Descrição da Solução:** 
  - O problema identificado consistia na ausência de um mecanismo de reinício rápido (Restart) no jogo Minesweeper. Anteriormente, o usuário era obrigado a recarregar a página inteira (F5) para jogar novamente após uma vitória ou derrota.
  - A solução envolveu o desenvolvimento e estilização de um `<button>` de Restart dinâmico na interface, integrado às telas de *Game Over* e *Victory*.
  - Na camada lógica (JavaScript), o fluxo de estado foi reestruturado. Ao acionar o botão, as variáveis mutáveis (tamanho do grid, minas, contador de bandeiras e cronômetro) são resetadas de forma limpa, e o tabuleiro antigo é destruído e recriado via manipulação de DOM, evitando vazamento de estado (*memory leaks*) entre as partidas.

---

## Caminho B: Engenharia de Qualidade e Refatoração

- **Descrição da Refatoração:** 
  - Como parte da melhoria contínua da qualidade do código base do Minesweeper, implementamos uma refatoração pontual focada na redução de acoplamento, aplicação de princípios SOLID e adoção de uma Arquitetura em 3 Camadas.
  - **Mitigação de Code Smells:** Foram tratados *smells* críticos como *Duplicated Code*, *Long Method* e *Global Data*. A lógica monolítica de criação do tabuleiro e inicialização do jogo foi extraída e dividida em funções menores e com responsabilidades únicas.
  - **Desacoplamento do DOM:** O acesso e a manipulação de elementos HTML foram centralizados, evitando que a lógica de negócio principal ficasse poluída com atualizações diretas de tela.
  - **Qualidade e DevOps:** Foi implementada uma suíte de testes de aceitação automatizados utilizando **Cypress** (baseada em Gherkin) e configurada uma esteira de CI/CD via **GitHub Actions** para garantir a integridade das regras de negócio a cada novo commit.
- **Commit da Refatoração:** [2d7d599](https://github.com/lucaslscaixeta/GameZone/commit/2d7d599)

---

## Lista de Pull Requests (PRs) Criados

1. **[PR1 - Arquitetura](https://github.com/lucaslscaixeta/GameZone/pull/10):** Documentação técnica detalhando a proposta de arquitetura em 3 camadas e representação estrutural via diagrama de componentes (Mermaid).
2. **[PR2 - Padrões e Smells](https://github.com/lucaslscaixeta/GameZone/pull/11):** Relatório analítico de *Code Smells* identificados no código legado, levantamento de Padrões de Projeto (*Design Patterns*) e justificativas estruturais.
3. **[PR3 - Refatoração](https://github.com/lucaslscaixeta/GameZone/pull/2):** Execução prática da refatoração e limpeza de código no repositório (desacoplamento e encapsulamento de estado).
4. **[PR4 - Testes](https://github.com/lucaslscaixeta/GameZone/pull/3):** Implementação da suíte de testes de aceitação automatizados (cenários BDD e automação via Cypress).
5. **[PR5 - DevOps](https://github.com/lucaslscaixeta/GameZone/pull/4):** Implementação da esteira de Integração Contínua (CI/CD via GitHub Actions).
6. **[PR6 - Issue Resolvida (Feature Restart)](https://github.com/kunjgit/GameZone/pull/5259):** Desenvolvimento, integração e estabilização da nova Feature (Botão de Restart) e resolução da issue no repositório original.


🌟 **PR Extra - Contribuição para o Projeto Principal:**
- **[Submissão Oficial GameZone](https://github.com/kunjgit/GameZone/pull/5265):** Pull Request consolidando todo o pacote de trabalho (feature, refatoração, testes e CI) submetido diretamente para o repositório base original `kunjgit/GameZone`.

---

## Papel de Cada Integrante

Para o cumprimento dos requisitos da disciplina, a carga de trabalho prático e de engenharia foi dividida de maneira estratégica entre a dupla:

- **Emerson Caetano Ataíde:** Focou primariamente no **Caminho B (Engenharia de Qualidade e Refatoração)** e na base analítica do projeto. Seu papel abrangeu a análise minuciosa do código legado para a identificação e documentação dos *Code Smells*, além do levantamento e proposição teórica de Padrões de Projeto. Foi responsável por projetar e documentar a nova estrutura baseada na arquitetura de 3 camadas (criando os diagramas), garantindo que as refatorações práticas tivessem um embasamento técnico e arquitetural sólido antes de serem aplicadas.

- **Lucas Lúcio Silva Caixeta:** Focou integralmente no **Caminho A (Manutenção Evolutiva)**, na execução das refatorações práticas no código e na validação sistêmica. Foi o responsável pelo desenvolvimento *end-to-end* da nova *feature* (Botão de Restart) e por codificar as refatorações no JavaScript (isolamento do DOM e encapsulamento dos estados do jogo). Além disso, encabeçou a engenharia de infraestrutura e testes, configurando o ambiente Cypress, codificando os testes E2E e orquestrando a esteira de automação (CI/CD) no GitHub Actions.