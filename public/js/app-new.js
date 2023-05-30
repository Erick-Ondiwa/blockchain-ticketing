/*
This file is a new structure that does not require you to update deployed smart contract address in the code.
This is a web3-based dApp for creating and viewing transactions for a donation contract.
*/

const App = {
  web3Provider: null,
  contracts: {},

  // Initializes web3 provider and contract
  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      // If no web3 provider is available, defaults to localhost
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  // Initializes the Donation contract
  initContract: function () {
    $.getJSON("Donation.json", function (data) {
      const DonationArtifact = data;
      App.contracts.Donation = TruffleContract(DonationArtifact);
      App.contracts.Donation.setProvider(App.web3Provider);
      App.contracts.Donation.deployed().then(function (instance) {
        console.log("Donation contract deployed at address:", instance.address);
      });
    });
    return App.bindEvents();
  },

  // Binds click events to create transaction and view transaction buttons
  bindEvents: function () {
    $(document).on(
      "click",
      "#create-transaction-button",
      App.createDonorTransaction
    );
    $(document).on("click", "#view-transactions-button", App.viewTransactions);
  },

  // Creates a new donor transaction
  createDonorTransaction: function (event) {
    event.preventDefault();
    //   const senderAddress = $("#senderAddress").val();
    //   const receiverAddress = $("#receiverAddress").val();
    const amount = $("#amount").val();
    const purpose = $("#purpose").val();
    if (
      /*senderAddress == "" || receiverAddress == "" */ amount == "" ||
      purpose == ""
    ) {
      alert("Please fill in all the details");
      return;
    }
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      const account = accounts[0];
      App.contracts.Donation.deployed()
        .then(function (instance) {
          // Calls createTransaction() function on the contract instance
          return instance.createTransaction(purpose, {
            from: account,
            gas: 1000000,
            value: web3.utils.towei(amount, "ether"),
          });
        })
        .then(function (result) {
          console.log(result);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  },

  // Views all transactions stored in the contract
  viewTransactions: function (event) {
    event.preventDefault();
    const transactions = [];
    App.contracts.Donation.deployed()
      .then(function (instance) {
        // Calls getTransactions() function on the contract instance
        return instance.getTransactions.call();
      })
      .then(function (data) {
        for ({ donor, timestamp, usaid, purpose, amount } of data) {
          const timestamp2 = timestamp;
          const date = new Date(timestamp2 * 1000);
          const formattedDate = date.toLocaleString();
          const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "KES",
          });
          const formattedAmount = formatter.format(amount);
          transactions.push({
            donor,
            formattedDate,
            usaid,
            purpose,
            formattedAmount,
          });
        }
        console.log(JSON.stringify(transactions));
      })
      .catch(function (error) {
        console.warn(error);
      });
  },

  // Views all transactions stored in the contract
  viewTransactions: function (event) {
    event.preventDefault();
    const transactions = [];
    App.contracts.Donation.deployed()
      .then(function (instance) {
        // Calls getTransactions() function on the contract instance
        return instance.getTransactions.call();
      })
      .then(function (data) {
        for ({ donor, timestamp, usaid, purpose, amount } of data) {
          const timestamp2 = timestamp;
          const date = new Date(timestamp2 * 1000);
          const formattedDate = date.toLocaleString();
          const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "KES",
          });
          const formattedAmount = formatter.format(amount);
          transactions.push({
            donor,
            formattedDate,
            usaid,
            purpose,
            formattedAmount,
          });
        }
        console.log(JSON.stringify(transactions));
      })
      .catch(function (err) {
        console.log(err.message);
      });
  },
};
