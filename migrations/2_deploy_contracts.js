var FinancialTrackingSystem = artifacts.require("TicketingSystem");

module.exports = function (deployer) {
  deployer.deploy(FinancialTrackingSystem);
};
