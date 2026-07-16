# Testes Automatizados

## Ferramenta utilizada

- Cypress

Os testes de aceitação automatizados foram desenvolvidos utilizando o Cypress, validando cenários reais de interação do usuário com o jogo Minesweeper.

---

# Cenário 1 — Reiniciar o jogo

## Objetivo

Validar que o botão Restart reinicia corretamente uma partida encerrada, restaurando o estado inicial do jogo.

## Cenário (Gherkin)

```gherkin
Funcionalidade: Reiniciar partida

Cenário: Reiniciar o jogo após derrota

Dado que o jogador perdeu a partida
Quando clicar no botão "Restart"
Então um novo tabuleiro deve ser criado
E todas as células devem voltar ao estado inicial
E o contador de minas deve voltar ao valor inicial
```

## O que cobre

- Funcionamento do botão Restart.
- Reset do estado do jogo.
- Limpeza e recriação do tabuleiro.
- Reinicialização das variáveis internas da partida.

---

# Cenário 2 — Colocar e remover bandeira

## Objetivo

Validar que o jogador consegue ativar o modo bandeira e adicionar ou remover marcações no tabuleiro.

## Cenário (Gherkin)

```gherkin
Funcionalidade: Marcação de minas

Cenário: Adicionar e remover uma bandeira

Dado que o jogador ativou o modo bandeira
Quando clicar em uma célula fechada
Então uma bandeira deve ser exibida na célula

Quando clicar novamente na mesma célula
Então a bandeira deve ser removida
```

## O que cobre

- Funcionamento do botão Flag.
- Alteração do estado flagEnabled.
- Adição e remoção da bandeira.
- Atualização visual da célula.

---

# Cenário 3 — Vitória

## Objetivo

Validar que o sistema identifica corretamente uma vitória e atualiza a interface.

## Cenário (Gherkin)

```gherkin
Funcionalidade: Finalização da partida

Cenário: Vencer o jogo

Dado que todas as células sem minas foram reveladas
Quando a última célula segura for aberta
Então o jogo deve ser finalizado
E o contador deve exibir "Cleared"
E o botão "AGAIN" deve aparecer
```

## O que cobre

- Condição de vitória.
- Encerramento da partida.
- Atualização dos elementos da interface.

---

# Execução dos testes

Instalar dependências:

```bash
npm install
```

Executar Cypress:

```bash
npx cypress open
```

ou executar no terminal:

```bash
npx cypress run
```
