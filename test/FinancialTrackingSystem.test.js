// SPDX-License-Identifier: GPL-3.0

import "truffle/Assert.sol";
import "../contracts/FinancialTrackingSystem.sol";

const FinancialTrackingSystem = artifacts.require("FinancialTrackingSystem");

contract("FinancialTrackingSystem", accounts => {
    let financialTrackingSystem;
  
    beforeEach(async () => {
      financialTrackingSystem = await FinancialTrackingSystem.new();
    });
    
    it("should create a new transaction", async () => {
        // Arrange
        const donor = accounts[0];
        const usaid = accounts[1];
        const amount = 100;
        const purpose = "Donation";
      
        // Act
        await financialTrackingSystem.createTransaction(donor, usaid, amount, purpose);
        const transactions = await financialTrackingSystem.getTransactions();
      
        // Assert
        assert.equal(transactions.length, 1, "Transaction not created");
        assert.equal(transactions[0].donor, donor, "Donor address incorrect");
        assert.equal(transactions[0].usaid, usaid, "USAID address incorrect");
        assert.equal(transactions[0].amount, amount, "Amount incorrect");
        assert.equal(transactions[0].purpose, purpose, "Purpose incorrect");
      });
    });

    
    