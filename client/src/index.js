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
      web3Contract: new web3.eth.Contract(EncNft.abi, '0x8C151518F690a51aC559eB2eA5A4A6e7AFA75F82') 
    },
    {
      contractName: 'MarketPlace',
      web3Contract: new web3.eth.Contract(MarketPlace.abi, '0xD91f649c4301F9840D2442D3D412C8c014CB0F2A') 
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
