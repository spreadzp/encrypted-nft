import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import TokenCard from "./components/TokenCard";
import { Link } from "react-router-dom";
import * as _ from "lodash";
import TransferNFT from "./TransferNFT";
import BuyersBoard from "./BuyersBoard";
import BetForm from "./BetForm";
import { getPublicKeyViaMetamask } from "./metamask";

const MarketPlace = props => {
  const [dataKey, setDataKey] = useState(null);
  const [totalAmountNft, setTotalAmountNft] = useState(0);
  const [nftOwnersDetails, setNftOwnersDetails] = useState([]);
  const { drizzle, drizzleState } = props;
  const contract = drizzle.contracts.EncNft;
  const contractMarket = drizzle.contracts.MarketPlace;

  const [publicKey, setPubKey] = useState('');
  const [chosenTokenId, setChosenTokenId] = useState(0);
  const [showBetForm, setShowBetForm] = useState(false);
  useEffect(() => {
    getCoupons();
  }, []);

  const makeBet = async (owner) => {
    setChosenTokenId(owner.idNft)
    const pk = await getPublicKeyViaMetamask(drizzleState.accounts[0])
    console.log("🚀 ~ file: BuyersBoard.js ~ line 29 ~ makeBet ~ pk", pk)
    if (pk) {
      setPubKey(pk)
      setShowBetForm(true)
    }
  }

  const transferNFT = async (owner) => {
    let result = await contractMarket.methods.moveTokenForSell(owner.idNft, `Advertise of token ${owner.idNft}`).send({
      from: drizzleState.accounts[0],
      gasLimit: 150000
    })
    console.log("🚀 ~ file: MarketPlace.js ~ line 30 ~ transferNFT ~ result", result)


  }

  const approveNFT = async (owner) => {
    let result = await contract.methods.approve(contractMarket.address, owner.idNft).send({
      from: drizzleState.accounts[0],
      gasLimit: 150000
    })
    console.log("🚀 ~ file: MarketPlace.js ~ line 51 ~ result ~ result", result)
  }

  const getCoupons = async () => {
    let result = await contract.methods
      .totalSupply()
      .call({ from: drizzleState.accounts[0] });
    if (result > 0) {
      setTotalAmountNft(result)
      const ownersArray = []
      for (let index = 1; index <= result; index++) {
        ownersArray.push({ idNft: index, owner: '', approved: false, isTokenForSell: false })
      }
      ownersArray.map(async owner => {
        const ownerAddress = await contract.methods.ownerOf(owner.idNft).call({ from: drizzleState.accounts[0] });
        if (ownerAddress) {
          owner.owner = ownerAddress
          console.log("🚀 ~ file: MarketPlace.js ~ line 34 ~ getCoupons ~ ownerAddress", ownerAddress)
          const approvedAddress = await contract.methods.getApproved(owner.idNft).call({ from: drizzleState.accounts[0] });
          console.log("🚀 ~ file: MarketPlace.js ~ line 59 ~ getCoupons ~ approvedAddress", approvedAddress)
          if(approvedAddress) {
            console.log('contractMarket.address :>> ', contractMarket.address);
            owner.approved = approvedAddress === contractMarket.address
          }
          

          setNftOwnersDetails(nftOwnersDetails => [...nftOwnersDetails, owner])
          console.log('# ###nftOwnersDetails :>> ', nftOwnersDetails);
        }
      })
    }

  };

  useEffect(() => {
    console.log('totalAmountNft  :>> ', totalAmountNft);
    console.log('nftOwnersDetails.length :>> ', nftOwnersDetails.length);
    console.log('nftOwnersDetails.length === totalAmountNft :>> ', nftOwnersDetails.length === totalAmountNft);
    if (nftOwnersDetails.length == totalAmountNft) {
      console.log(' @@@@totalAmountNft  :>> ', totalAmountNft);
    }
  }, [nftOwnersDetails.length])


  return (
    // if it exists, then we display its value
    <section>
      <h2>MarketPlace</h2>


      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID NFT</th>
            <th>Owner address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {nftOwnersDetails.length == totalAmountNft ? nftOwnersDetails.map(owner =>
            <tr>
              <td>{owner.idNft}</td>
              <td className={drizzleState.accounts[0] === owner.owner? 'owner-address' : null}> {owner.owner}</td>
              <td>{drizzleState.accounts[0] === owner.owner ?
              owner.approved ? 
                <button onClick={() => transferNFT(owner)}>Move NFT for sell place</button> :
                <button onClick={() => approveNFT(owner)}>Approve NFT for sell</button> :
                <button onClick={() => makeBet(owner)}> Make BET</button>}</td>
            </tr>
          ) : <></>}
        </tbody>
      </Table>

      {<section>
        {showBetForm && <BetForm
          drizzle={drizzle}
          drizzleState={drizzleState}
          idToken={chosenTokenId}
          pk={publicKey}
          address={drizzleState.accounts[0]}
        />}
      </section>}
      <BuyersBoard
        drizzle={drizzle}
        drizzleState={drizzleState}
        nftOwnersDetails={nftOwnersDetails}
      />
    </section>
  );
};

export default MarketPlace;
