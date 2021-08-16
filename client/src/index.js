import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Web3 from "web3";

// import drizzle functions and contract artifact
import { Drizzle } from "drizzle";
import Coupoken from "./contracts/Coupoken.json";
import MarketPlace from "./contracts/MarketPlace.json";
import EncNft from "./contracts/EncNft.json"
const web3 = new Web3(window.web3.currentProvider);

// let drizzle know what contracts we want and how to access our test blockchain
const options = {
  contracts: [
    {
      contractName: 'EncNft',
      web3Contract: new web3.eth.Contract(EncNft.abi, '0x017B48535979B015687B26E37c9361145CB19147') 
    },
    {
      contractName: 'MarketPlace',
      web3Contract: new web3.eth.Contract(MarketPlace.abi, '0xFDDFbd6102F67b4C424254383e228b7CdF968F98') 
    },
    {
      contractName: 'Coupoken',
      web3Contract: new web3.eth.Contract(Coupoken.abi, '0x8583360814F7DBD94EdC25cf48Aa782B7e474A42') 
    }
    
  ],
  // contracts: [Coupoken, EncNft],
  web3: {
    block: false,
    // customProvider: new Web3("ws://localhost:8545"),
    customProvider: new Web3(window.web3.currentProvider),
  },
  // syncAlways:true,
  polls: {
    accounts: 2000,
  },
};

// setup drizzle
const drizzle = new Drizzle(options);

ReactDOM.render(<App drizzle={drizzle}/>, document.getElementById('root'));
