describe("Minesweeper", () => {

  beforeEach(() => {
    cy.visit("/index.html");
  });

  it("Cenário 1 - Reiniciar o jogo após derrota", () => {
    cy.get("#0-0").click();

    cy.get("#restart-button")
      .should("be.visible")
      .and("contain", "Restart");

    cy.get("#restart-button").click();

    cy.get("#mines-count").should("have.text", "10");
    cy.get(".tile-clicked").should("have.length", 0);
  });

  it("Cenário 2 - Adicionar e remover bandeira", () => {
    cy.get("#flag-button").click();

    cy.get("#2-2")
      .click()
      .should("have.text", "🚩");

    cy.get("#2-2")
      .click()
      .should("have.text", "");
  });

  it("Cenário 3 - Vencer a partida", () => {
    for (let r = 2; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        cy.get(`#${r}-${c}`).click();
      }
    }

    cy.get("#1-2").click();
    cy.get("#1-3").click();
    cy.get("#1-4").click();
    cy.get("#1-5").click();
    cy.get("#1-6").click();
    cy.get("#1-7").click();

    cy.get("#mines-count").should("contain", "Cleared");
    cy.get("#restart-button").should("contain", "AGAIN");
  });

});