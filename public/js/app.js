const web3 = new Web3(window.ethereum);
console.log(abi);

var contract = new web3.eth.Contract(
  abi,
  "0xCE298f5E9e8EF809aBc9D2b9273c4F4572A648c5"
);

const connectWallet = async () => {
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  console.log(account);
};

const addTickets = async () => {
  let eventName = document.getElementById("eventName").value;
  let location = document.getElementById("location").value;
  let eventDateAndTime = document.getElementById("eventDateAndTime").value;
  let price = document.getElementById("price").value;
  let noOfTickets = document.getElementById("noOfTickets").value;

  if (
    eventName == "" ||
    location == "" ||
    eventDateAndTime == "" ||
    price == "" ||
    noOfTickets == ""
  ) {
    alert("please fill in all the details");
    return;
  }

  if (Number(noOfTickets) > 10) {
    alert("exceeded maximum number of tickets to be created");
    return;
  }

  let formattedPrice = web3.utils.toWei(price, "ether");
  let formattedDate = Date.parse(eventDateAndTime);

  console.log({
    eventName,
    location,
    formattedDate,
    formattedPrice,
    noOfTickets,
  });
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const account = accounts[0];
  await contract.methods
    .createTicket(
      eventName,
      location,
      formattedDate,
      formattedPrice,
      noOfTickets
    )
    .send({ from: account, gasLimit: "1000000" })
    .then((data) => console.log(data));
};

function viewTickets() {
  let tickets = [];
  const noOfTicketsMinted = contract.methods
    .ticketCount()
    .call()
    .then((data) => {
      for (let i = 1; i <= data; i++) {
        const ticket = contract.methods
          .tickets(i)
          .call()
          .then(function ({
            owner,
            eventName,
            location,
            eventDateAndTime,
            price,
            isAvailable,
          }) {
            const d = new Date(Number(eventDateAndTime));
            const formattedDate = d.toLocaleString();
            const formattedPrice = web3.utils.fromWei(price, "ether");
            tickets.push({
              eventId: i,
              owner,
              eventName,
              location,
              eventDateAndTime: formattedDate,
              price: formattedPrice,
              isAvailable,
            });
            let ButtonValue;
            if (isAvailable == true) {
              ButtonValue = "Buy";
            } else {
              ButtonValue = "bought";
            }
            if (isAvailable == true) {
              document.getElementById("events").innerHTML += `
              <div class="w3-col l4" style="margin-bottom: 5px;">
              <div class="w3-card">
                <table class="w3-table w3-small">
                  <tr>
                    <th>Event Name</th>
                    <td>${eventName}</td>
                  </tr>
                  <tr>
                    <th>Event Location</th>
                    <td>${location}</td>
                  </tr>
                  <tr>
                    <th>Time</th>
                    <td>${formattedDate}</td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td>${formattedPrice} ETH</td>
                  </tr>
                  <tr>
                    <th>owner</th>
                    <td>0x48...C680</td>
                  </tr>
                  <tr>
                    <td colspan="2">
                      <button class="w3-btn w3-border w3-border-blue" onclick='buyTicket(${i}, ${formattedPrice})'>${ButtonValue}</button>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
              `;
            }
          });
      }
    });

  console.log(tickets);
}

viewTickets();
async function buyTicket(id, value) {
  try {
    const formattedPrice = web3.utils.toWei(value.toString(), "ether");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];
    contract.methods
      .purchaseTicket(id)
      .send({
        from: account,
        gasLimit: "1000000",
        value: formattedPrice,
      })
      .then((data) => {
        alert("ticket bought successfully");
        console.log(data);
      })
      .catch((e) => {
        alert("ticket alsready bought");
      });
  } catch (error) {
    alert("some error occured");
  }
}

(async function getMyTickets() {
  let tickets = [];
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });

  const account = accounts[0];

  const noOfTicketsMinted = contract.methods
    .ticketCount()
    .call()
    .then((data) => {
      for (let i = 1; i <= data; i++) {
        const ticket = contract.methods
          .tickets(i)
          .call()
          .then(function ({
            owner,
            eventName,
            location,
            eventDateAndTime,
            price,
            isAvailable,
          }) {
            if (owner.toLowerCase() == account.toLowerCase()) {
              const d = new Date(Number(eventDateAndTime));
              const formattedDate = d.toLocaleString();
              const formattedPrice = web3.utils.fromWei(price, "ether");

              tickets.push({
                eventId: i,
                owner,
                eventName,
                location,
                eventDateAndTime: formattedDate,
                price: formattedPrice,
                isAvailable,
              });

              document.getElementById("my-profile").innerHTML += `<tr>
              <td>${i}</td>
              <td>${eventName}</td>
              <td>${location}</td>
              <td>${formattedDate}</td>
              <td>${formattedPrice}</td>
              <td><button>change Ownership</button></td>
              </tr>`;
            }
          });
      }
    });
  console.log(tickets);
})();
