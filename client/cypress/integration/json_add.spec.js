/// <reference types="cypress" />

const testData1 = [
  "111",
  "Marry",
  "teacher",
  "abcgmailcom",
  "1999",
  "18address",
  "HongKong",
  "true",
];

const testData2 = [
  "1d",
  "Marry",
  "teacher",
  "abcgmailcom",
  "1999",
  "18address",
  "HongKong",
  "true",
];

const testData3 = [
  "111",
  "Marry",
  "teacher",
  "abcgmailcom",
  "1999",
  "18address",
  "HongKong",
  "trueee",
];

Cypress.Commands.add("addNodeObj", (value) => {
  cy.get("[data-id='users']")
    .siblings()
    .eq(0)
    .children()
    .eq(0)
    .find("[data-id='id']")
    .next("[data-id='0']")
    .rightclick();

  cy.contains("Add").click({ force: true });
  cy.contains("Add").should("exist");

  if (value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      cy.contains("Please input Key and Values")
        .get(".ant-input")
        .eq(i)
        .type(value[i]);
    }
  }

  cy.get("Button[data-id='ok2']").click();

  //verify
  if (value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      cy.get("[data-id='users']")
        .siblings()
        .eq(0)
        .children()
        .eq(6)
        .find(`[data-id=${value[i]}]`);
    }
  }
});

Cypress.Commands.add("addNodeObj_error", (value) => {
  cy.get("[data-id='users']")
    .siblings()
    .eq(0)
    .children()
    .eq(0)
    .find("[data-id='id']")
    .next("[data-id='0']")
    .rightclick();

  cy.contains("Add").click({ force: true });
  cy.contains("Add").should("exist");

  if (value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      cy.contains("Please input Key and Values")
        .get(".ant-input")
        .eq(i)
        .type(value[i]);
    }
  }

  cy.get("Button[data-id='ok2']").click();

  //display error
  cy.contains("Message").should("be.visible");
});

Cypress.Commands.add("addNodeNoObj", (value) => {
  cy.get("[data-id='images']")
    .siblings()
    .eq(0)
    .find("[data-id='img0.png']")
    .rightclick();

  cy.contains("Add").click({ force: true });

  cy.contains("Add").should("exist");

  cy.get("input").clear();
  cy.get("input").type(`${value}`);

  cy.get("Button[data-id='ok2']").click();

  cy.get("[data-id='images']")
    .siblings()
    .eq(0)
    .find(`[data-id='${value}']`)
    .should("exist");
});

describe("Json tree add test", () => {
  beforeEach(() => {
    cy.visit("");
    cy.intercept("get", "https://bs-random-json.vercel.app/api/data", {
      fixture: "jsontree.json",
    });
  });

  it("user:add test", () => {
    cy.contains("users").click();
    cy.addNodeObj(testData1);
  });

  it("images:add test", () => {
    cy.contains("images").click();
    cy.addNodeNoObj("img99.png");
  });

  it("price:add test", () => {
    cy.contains("price").rightclick();
    cy.contains("Add").click();
    cy.get(".ant-modal-body").should("not.be.exist");
  });

  it("coordinates:add test", () => {
    cy.contains("coordinates").rightclick();
    cy.contains("Add").click();
    cy.get(".ant-modal-body").should("not.be.exist");
  });

  it("users:err test-1", () => {
    cy.contains("users").click();
    cy.addNodeObj_error(testData2);
  });

  it("users:err test-2", () => {
    cy.contains("users").click();
    cy.addNodeObj_error(testData3);
  });
});
