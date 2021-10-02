/// <reference types="cypress" />

Cypress.Commands.add("editNodeObj", (key, oldValue, newValue, number) => {
  cy.get("[data-id='users']")
    .siblings()
    .eq(0)
    .children()
    .eq(number)
    .find(`[data-id='${key}']`)
    .next(`[data-id='${oldValue}']`)
    .rightclick();

  cy.contains("Edit").click({ force: true });

  cy.contains("MODIFY").should("exist");

  cy.get(`input[data-id=${key}]`).clear();
  cy.get(`input[data-id=${key}]`).type(`${newValue}`);

  cy.get("Button[data-id='ok1']").click();

  cy.get("[data-id='users']")
    .siblings()
    .eq(0)
    .children()
    .eq(number)
    .find(`[data-id='${key}']`)
    .next(`[data-id='${newValue}']`)
    .should("exist");

  cy.contains("users").click();
  cy.contains("users").click();
});

Cypress.Commands.add("editNodeObj_error", (key, oldValue, newValue, number) => {
  cy.get("[data-id='users']")
    .siblings()
    .eq(0)
    .children()
    .eq(number)
    .find(`[data-id='${key}']`)
    .next(`[data-id='${oldValue}']`)
    .rightclick();

  cy.contains("Edit").click({ force: true });

  cy.contains("MODIFY").should("exist");

  cy.get(`input[data-id=${key}]`).clear();
  cy.get(`input[data-id=${key}]`).type(`${newValue}`);

  cy.get("Button[data-id='ok1']").should("be.disabled");

  cy.get("svg[data-icon='close']").click();

  cy.contains("users").click();
  cy.contains("users").click();
});

Cypress.Commands.add("editNodeNoObj", (oldValue, newValue) => {
  cy.get("[data-id='images']")
    .siblings()
    .eq(0)
    .find(`[data-id='${oldValue}']`)
    .rightclick();

  cy.contains("Edit").click({ force: true });

  cy.contains("MODIFY").should("exist");

  cy.get("input").clear();
  cy.get("input").type(`${newValue}`);

  cy.get("Button[data-id='ok1']").click();

  cy.get("[data-id='images']")
    .siblings()
    .eq(0)
    .find(`[data-id='${newValue}']`)
    .should("exist");
});

/////////////////////////////////////////////////////////

describe("Json tree edit test", () => {
  beforeEach(() => {
    cy.visit("");
    cy.intercept("get", "https://bs-random-json.vercel.app/api/data", {
      fixture: "jsontree.json",
    });
  });

  it("users: edit test", () => {
    cy.contains("users").click();

    cy.editNodeObj("id", "0", "1234", 0);
    cy.editNodeObj("name", "Roman Verde", "Marry", 0);
    cy.editNodeObj("work", "Solexis", "NewYork", 0);
    cy.editNodeObj("email", "roman.verde@solexis.mobi", "abc@google.com", 0);
    cy.editNodeObj("dob", "1938", "1963", 0);
    cy.editNodeObj(
      "address",
      "18 Springfield Street",
      "55 Springfield Street",
      0
    );
    cy.editNodeObj("city", "Kingston", "HongKong", 0);
    cy.editNodeObj("optedin", "true", "false", 0);

    ////////error test/////////////////////
  });

  it("images: edit test", () => {
    cy.contains("images").click();

    cy.editNodeNoObj("img0.png", "img01.png");
    cy.editNodeNoObj("img1.png", "img11.png");
    cy.editNodeNoObj("img2.png", "img21.png");
    cy.editNodeNoObj("img3.png", "img21.png");
    cy.editNodeNoObj("img4.png", "img41.png");
    cy.editNodeNoObj("img5.png", "img51.png");
    cy.editNodeNoObj("img6.png", "img61.png");
    cy.editNodeNoObj("img7.png", "img71.png");
  });

  it("price: edit test", () => {
    cy.get("[data-id='price']").next().rightclick();
    cy.contains("Edit").click({ force: true });

    cy.contains("MODIFY").should("exist");

    cy.get("input").clear();
    cy.get("input").type("$90000");
    cy.get("Button[data-id='ok1']").click();

    cy.get("[data-id='price']").next("[data-id='$90000']").should("exist");
  });

  it("coordinates: edit test", () => {
    cy.get("[data-id='coordinates']").next().rightclick();
    cy.contains("Edit").click({ force: true });

    cy.contains("MODIFY").should("exist");

    cy.contains("Please input Key and Values").get(".ant-input").eq(0).type(11);
    cy.contains("Please input Key and Values").get(".ant-input").eq(1).type(22);

    cy.get("Button[data-id='ok2']").click();

    cy.contains("coordinates").next().should("contain", "x:11 y:22");
  });

  it("error input test", () => {
    cy.contains("users").click();
    cy.editNodeObj_error("id", "0", "1aaa", 0);
    cy.editNodeObj_error("optedin", "true", "boolll", 0);
  });
});
