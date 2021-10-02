/// <reference types="cypress" />

describe("Json tree show test", () => {
  beforeEach(() => {
    cy.visit("");
    cy.intercept("get", "https://bs-random-json.vercel.app/api/data", {
      fixture: "jsontree.json",
    });
  });

  it("should display root node", () => {
    cy.contains("users").should("be.visible");
    cy.contains("images").should("be.visible");
    cy.contains("price").should("be.visible");
  });

  it("users display test,,one node", () => {
    cy.contains("users").click();

    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='id']")
      .next("[data-id='0']")
      .should("contain", "0");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='name']")
      .next("[data-id='Roman Verde']")
      .should("contain", "Roman Verde");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='work']")
      .next("[data-id='Solexis']")
      .should("contain", "Solexis");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='email']")
      .next("[data-id='roman.verde@solexis.mobi']")
      .should("contain", "roman.verde@solexis.mobi");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='dob']")
      .next("[data-id='1938']")
      .should("contain", "1938");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='address']")
      .next("[data-id='18 Springfield Street']")
      .should("contain", "18 Springfield Street");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='optedin']")
      .next("[data-id='true']")
      .should("contain", "true");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='city']")
      .next("[data-id='Kingston']")
      .should("contain", "Kingston");
  });
  /////////////////////////////////////////////////////////
  it("users display test,another node", () => {
    cy.contains("users").click();
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='id']")
      .next("[data-id='1']")
      .should("contain", "1");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='id']")
      .next("[data-id='2']")
      .should("contain", "2");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='id']")
      .next("[data-id='3']")
      .should("contain", "3");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='id']")
      .next("[data-id='4']")
      .should("contain", "4");
    cy.get("[data-id='users']")
      .siblings()
      .eq(0)
      .find("[data-id='id']")
      .next("[data-id='5']")
      .should("contain", "5");
  });

  /////////////////////////////////////////////////////////
  it("images display test", () => {
    cy.contains("images").click();

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img0.png']")
      .should("be.visible");

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img1.png']")
      .should("be.visible");

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img2.png']")
      .should("be.visible");

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img3.png']")
      .should("be.visible");

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img4.png']")
      .should("be.visible");

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img5.png']")
      .should("be.visible");

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img6.png']")
      .should("be.visible");

    cy.get("[data-id='images']")
      .siblings()
      .eq(0)
      .find("[data-id='img7.png']")
      .should("be.visible");
  });

  //////////////////////////////////////////////////
  it("coordinates display test", () => {
    cy.get("[data-id='coordinates']")
      .siblings()
      .first()
      .should("contain", "x:-24.91 y:5.67");
  });

  //////////////////////////////////////////////////
  it("price display test", () => {
    cy.get("[data-id='price']").siblings().first().should("contain", "42,299");
  });
});

//cy.get("[data-id='']").next("[data-id='']").should("be.visible");
