/// <reference types="cypress" />

//delete node
Cypress.Commands.add("delNodeObj", (id) => {
  cy.get("[data-id='users']")
    .siblings()
    .eq(0)
    .find("[data-id='id']")
    .next(`[data-id='${id}']`)
    .rightclick();

  cy.contains("Delete").click({ force: true });

  cy.get("[data-id='users']")
    .siblings()
    .eq(0)
    .find(`[data-id='${id}']`)
    .should("not.exist");
});

Cypress.Commands.add("delNodeNoObj", (name) => {
  cy.get("[data-id='images']")
    .siblings()
    .eq(0)
    .find(`[data-id='${name}']`)
    .rightclick();

  cy.contains("Delete").click({ force: true });

  cy.get("[data-id='images']")
    .siblings()
    .eq(0)
    .find(`[data-id='${name}']`)
    .should("not.exist");
});

describe("Json tree delete test", () => {
  beforeEach(() => {
    cy.visit("");
    cy.intercept("get", "https://bs-random-json.vercel.app/api/data", {
      fixture: "jsontree.json",
    });
  });

  it("should display popup menu", () => {
    cy.contains("users").click();
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='id']")
      .next("[data-id='0']")
      .rightclick();

    cy.contains("Delete").should("be.visible");
    cy.contains("Add").should("be.visible");
    cy.contains("Edit").should("be.visible");
  });

  it("The user node should can be deleted", () => {
    cy.contains("users").click();

    cy.delNodeObj("0");
    cy.delNodeObj("1");
    cy.delNodeObj("2");
    cy.delNodeObj("3");
    cy.delNodeObj("4");

    //delete last node
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='id']")
      .next("[data-id='5']")
      .rightclick();

    cy.contains("Delete").click({ force: true });

    cy.contains("Sorry").should("exist");

    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='id']")
      .next("[data-id='5']")
      .should("contain", "5");
  });

  //////////////////////////////////////////////////////////////

  it("The images node should be deleted", () => {
    cy.contains("images").click();

    cy.delNodeNoObj("img0.png");
    cy.delNodeNoObj("img1.png");
    cy.delNodeNoObj("img2.png");
    cy.delNodeNoObj("img3.png");
    cy.delNodeNoObj("img4.png");
    cy.delNodeNoObj("img5.png");
    cy.delNodeNoObj("img6.png");

    //delete the last node

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img7.png']")
      .rightclick();

    cy.contains("Delete").click({ force: true });

    cy.contains("Sorry").should("exist");

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img7.png']")
      .should("contain", "img7.png");
  });

  //the price and coordinates should not be deleted

  it("The  price and coordinates should not be deleted", () => {
    cy.contains("price").click();
    cy.get("[data-id='price']").next().rightclick();
    cy.contains("Delete").click({ force: true });
    cy.contains("Sorry").should("exist");
    cy.get("[data-id='price']").next("[data-id='$42,299']").should("exist");

    cy.contains("OK").click();

    cy.contains("coordinates").click();
    cy.get("[data-id='coordinates']").next().rightclick();
    cy.contains("Delete").click({ force: true });
    cy.contains("Sorry").should("exist");
    cy.get("[data-id='coordinates']")
      .next("[data-id='x:-24.91 y:5.67 ']")
      .should("exist");
  });
});
