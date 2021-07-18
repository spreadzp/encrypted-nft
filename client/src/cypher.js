// const ecies = require("eth-ecies");
// var Wallet = require('ethereumjs-wallet');
// import { EthUtil } from 'ethereumjs-util'
// import { EthTx } from 'ethereumjs-tx'
import EthCrypto from 'eth-crypto';
import { metamaskEncrypt, metamaskPublic } from './metamask';

// Get a wallet instance from a private key

var Web3 = require('web3');
var web3 = new Web3('http://127.0.0.1:9545');

export async function getAccount() {
    return await window.ethereum.selectedAddress
}

export async function encryptData(publicKey, data) {
    const pk = await metamaskPublic(publicKey)
    console.log("🚀 ~ file: cypher.js ~ line 19 ~ encrypt ~ pk", pk)
    return await metamaskEncrypt(data, pk)
}

export async function decrypt(cMessage) {
    const cyperObj = EthCrypto.cipher.parse(cMessage);
    return await EthCrypto.decryptWithPrivateKey(
        'bdb335a3c6dceda42eb92e6479f326d68d86bdf5237c41ff1eedf961813d2eb4', // privateKey
        cyperObj // encrypted-data
    );
}