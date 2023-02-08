describe("Home", () => {
    beforeEach(() => {
      cy.visit("/example/product-page.html");
    });
  
    it("Widget is present", () => {
      cy.get(".instalments-widget").should("exist");
    });
    
    it("Open modal", () => {
        cy.get(".instalments-widget").find(".more_info").click();
        cy.get(".mode-info--content").should("exist");
    });

    it("Close modal", () => {
        cy.get(".instalments-widget").find(".more_info").click();
        cy.get(".instalments-widget").find(".modal_more_info_close").click();
        cy.get(".mode-info--content").should("not.exist");
    });
  });