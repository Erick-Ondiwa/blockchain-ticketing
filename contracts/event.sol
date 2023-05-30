pragma solidity ^0.8.0;

// Define a contract for the ticketing system
contract TicketingSystem {
    
    // Define a struct to hold ticket information
    struct Ticket {
        address payable owner;
        string eventName;
        string location;
        uint eventDateAndTime;
        uint256 price;
        bool isAvailable;
    }
    
    // Define a mapping of ticket IDs to ticket information
    mapping (uint256 => Ticket) public tickets;
    uint public ticketCount;
    
    // Define an event to track ticket purchases
    event TicketPurchased(uint256 ticketId, address buyer);
    
    // Define a function to create new tickets
    function createTicket(string memory _eventName, string memory _location, uint _eventDateAndTime, uint256 _price, uint _number) public {
        
        for(uint i = 0; i < _number; i++){
            ticketCount++;
            tickets[ticketCount] = Ticket(payable(msg.sender), _eventName, _location, _eventDateAndTime, _price, true);
        }
        
    }
    
    // Define a function to purchase a ticket
    function purchaseTicket(uint256 _ticketId) public payable returns(string memory){
        Ticket storage ticket = tickets[_ticketId];
        require(msg.value == ticket.price, "Incorrect payment amount");
        require(ticket.isAvailable, "Ticket is not available");
        if(ticket.isAvailable){
        ticket.owner.transfer(msg.value);
        ticket.isAvailable = false;
        tickets[_ticketId].owner = payable(msg.sender);
        emit TicketPurchased(_ticketId, msg.sender);
        return "successfull";
        }else{
            return "allready Sold";
        }
        
    }
    
    // Define a function to check ticket ownership
    function checkTicketOwner(uint256 _ticketId) public view returns (bool) {
        Ticket storage ticket = tickets[_ticketId];
        return (msg.sender == ticket.owner);
    }
    
    // Define a function to transfer ticket ownership
    function transferTicket(uint256 _ticketId, address _newOwner) public {
        Ticket storage ticket = tickets[_ticketId];
        require(msg.sender == ticket.owner, "Only the owner can transfer the ticket");
        require(ticket.isAvailable, "Ticket is not available");
        ticket.owner = payable(_newOwner);
    }
}
