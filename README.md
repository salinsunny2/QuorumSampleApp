# QuorumSample_DApp

* _Pre-requisites:_
  * Docker version 18.09.0+
  * docker-compose version 1.23.2+ 
  * Node.js v8.5+
  * Truffle v4+
  * IDE of Your choice (preferred is VsCode)

### Index
1. Introduction
2. Network Architecture
3. The Flow and Idea
4. Smart Contract
5. How Quorum Is Maintaining the Privacy
6. Steps t start the Quorum Blockchain
7. Steps to Deploy the Smart Contracts for he Bidder Dapp
8. Steps to start the server
9. Swagger for interaction with the server
10. Conclusion and what next?


## 1. Introduction:- 
Its a simple dapp demo over `Quorum Blockchain`, which utilizes a `dockerized` environment to host the Quorum Blockchain and have its smart contracts written in `Solidity 0.4.17` and handles deployments with `truffle smart contract deployment/development framework` and it has a `NodeJS server` to serve the APIs for feature interactions with the smart contract and it has a `Swagger UI` to provide UI interface / Documentation.

## 2. Network Architecture:-
There is a dockerized environment cloned from quorum's official repo for maintaining the dockerized environment for the quorum dapp network.

Basically there are 7 Nodes, and their respective tx managers, for further details yu can study the docker-compose file attached in this sample project.

## 3. The Flow and Idea

## 4. Smart Contract

#### For NodeB

```
pragma solidity ^0.4.17;

contract NodeB {

    struct Bids {
        string itemName;
        uint bid;
        address bidder;
    }
    address private owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner(address _owner) {
        require(_owner == owner, "cannot perform action.");
        _;
    }

    mapping (string => uint) Items;
    mapping (string => mapping (address => Bids)) itemAddressBids;

    modifier addressNotBlank(address add){
        require(add != 0x0, "null address");
        _;
    }

    modifier nullStringCheck(string memory val){
        require(bytes(val).length > 0, "empty string");
        _;
    }

    modifier uintNonZero (uint val) {
        require(val > 0, "cannot be zero");
        _;
    }
    
    function createItem(string memory name, uint price) public 
    onlyOwner(msg.sender)
    nullStringCheck(name)
    uintNonZero(price) 
    {
        Items[name] = price;
    }
    
    function placeABid(string memory name, uint bid, address bidderAddress) public 
    nullStringCheck(name) 
    uintNonZero(bid)
    {
        require(bid > Items[name], "the bid should exceed the price.");
        
        Bids memory bids = Bids(name, bid, bidderAddress);
        itemAddressBids[name][bidderAddress] = bids;
    }
    
    function getItemPrice(string memory name) public view returns (uint itemPrice){
        return Items[name];
    }
    
    function getBidsForItem(string memory name, address bidderAddress) 
    public 
    addressNotBlank(bidderAddress)
    view 
    returns (string memory itemName, uint latestUserBid)
    {
        return (itemAddressBids[name][bidderAddress].itemName, itemAddressBids[name][bidderAddress].bid);
    }
}
```

#### For NodeC

```
pragma solidity ^0.4.17;

contract NodeB {

    struct Bids {
        string itemName;
        uint bid;
        address bidder;
    }
    address private owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner(address _owner) {
        require(_owner == owner, "cannot perform action.");
        _;
    }

    mapping (string => uint) Items;
    mapping (string => mapping (address => Bids)) itemAddressBids;

    modifier addressNotBlank(address add){
        require(add != 0x0, "null address");
        _;
    }

    modifier nullStringCheck(string memory val){
        require(bytes(val).length > 0, "empty string");
        _;
    }

    modifier uintNonZero (uint val) {
        require(val > 0, "cannot be zero");
        _;
    }
    
    function createItem(string memory name, uint price) public 
    onlyOwner(msg.sender)
    nullStringCheck(name)
    uintNonZero(price) 
    {
        Items[name] = price;
    }
    
    function placeABid(string memory name, uint bid, address bidderAddress) public 
    nullStringCheck(name) 
    uintNonZero(bid)
    {
        require(bid > Items[name], "the bid should exceed the price.");
        
        Bids memory bids = Bids(name, bid, bidderAddress);
        itemAddressBids[name][bidderAddress] = bids;
    }
    
    function getItemPrice(string memory name) public view returns (uint itemPrice){
        return Items[name];
    }
    
    function getBidsForItem(string memory name, address bidderAddress) 
    public 
    addressNotBlank(bidderAddress)
    view 
    returns (string memory itemName, uint latestUserBid)
    {
        return (itemAddressBids[name][bidderAddress].itemName, itemAddressBids[name][bidderAddress].bid);
    }
}
```
## 5. How Quorum Is Maintaining the Privacy



Image below is from the official quorum repo:-

![from the official quorum repo](https://raw.githubusercontent.com/jpmorganchase/quorum-docs/master/images/QuorumTransactionProcessing.JPG)

## 6. Steps to start the Quorum Blockchain

First clone this repo into your machine
```
git clone https://github.com/NRajTheGeek/QuorumSampleApp.git
```
and 
```
cd quorum-examples
```
now to start the dockerized environment and the quorum blockchain 7 node and 7 tx mnager network up and running: 
```
docker-compose up -d
```

now wait for 5 or 10 min for all nodes to start mining properly, now that we have the network up and running we can now depoy our smart contracts on it.

before moving on further, go through this link and study how to deploy solidity smart contracts on quorum blockchain nodes.

https://truffleframework.com/tutorials/building-dapps-for-quorum-private-enterprise-blockchains


## 7. Steps to Deploy the Smart Contracts for he Bidder Dapp

There are two smart contracts in the 
```
contracts
   Migrations.sol
   NodeB.sol
   NodeC.sol
```
which are displayed above.

lets have a look on out *truffle.json file*
```

module.exports = {
  networks: {
    nodeA: {
      host: '127.0.0.1',
      port: 22000, 
      network_id: '*',
      gasPrice: 0,
      gas: 4500000
    },
    nodeB: {
      host: '127.0.0.1',
      port: 22001, 
      network_id: '*',
      gasPrice: 0,
      gas: 4500000
    },
    nodeC: {
      host: '127.0.0.1',
      port: 22002, 
      network_id: '*',
      gasPrice: 0,
      gas: 4500000
    },
    node4: {
      host: '127.0.0.1',
      port: 22003, 
      network_id: '*',
      gasPrice: 0,
      gas: 4500000
    }
  }
}

```

now to deploy these using truffle framework first do a compile from the project root directory
```
truffle compile
```
now you can deply the smart contract from project root directory

```
truffle compile --network nodeA
```

you should see output similar to
```
Using network 'nodeA'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0xb62991b10c7c39af1603164a35b7e34dd530e9c933781c8fd9da8465b1f0229e
  Migrations: 0x1932c48b2bf8102ba33b4a6b545c32236e342f34
Saving successful migration to network...
  ... 0x7f6c7e9834a9f52ec1bd026a22303ace02506c767199db7e262089523b4737c7
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying NodeB...
  ... 0xd47f328fc16eb28fc9e94e36166234252629a702d82ff5369a019ee690d5f8cc
  NodeB: 0x9d13c6d3afe1721beef56b55d303b09e021e27ab
  Deploying NodeC...
  ... 0x5bf35a010b9b779b38210af7347586cabff9faef8bc337fa22e16acc3e2a72a1
  NodeC: 0xd9d64b7dc034fafdba5dc2902875a67b5d586420
Saving successful migration to network...
  ... 0x7fe29077aa04a72a4b85b10c877d5b43fe1bba655fba5d0bace8ac42b67e6e4b
Saving artifacts...
```
with obviously contract addresses and tx hashes changed.
Now

## 8. Steps to start the server



## 9. Swagger for interaction with the server



## 10. Conclusion and what next?
