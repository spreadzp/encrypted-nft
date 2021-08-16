import React, { useState, useEffect } from "react";
import TokenCard from "./components/TokenCard";
import { Link } from "react-router-dom";
import * as _ from "lodash";
import TransferNFT from "./TransferNFT";
import BuyersBoard from "./BuyersBoard";

const MarketPlace = props => {
  const [dataKey, setDataKey] = useState(null);
  const [totalAmountNft, setTotalAmountNft] = useState(0);
  const [nftOwnersDetails, setNftOwnersDetails] = useState([]);
  const { drizzle, drizzleState } = props;
  const contract = drizzle.contracts.EncNft;
  const contractMarket = drizzle.contracts.MarketPlace;
  useEffect(() => {
    getCoupons();
  }, []);

  const toggleLock = async (_id, _tradable) => {
    // const contract = await drizzle.contracts.Coupoken;
    // await contract.methods.toggleLockCoupon.cacheSend(_id, !_tradable, {
    //   from: drizzleState.accounts[0]
    // });
  };

  const transferNFT = async (owner) => {
    let result = await contractMarket.methods.moveTokenForSell(owner.idNft,`Advertise of token ${owner.idNft}`).send({ from: drizzleState.accounts[0],      
      gasLimit: 150000})
    console.log("🚀 ~ file: MarketPlace.js ~ line 30 ~ transferNFT ~ result", result)
      

  }
  const getCoupons = async () => {
    let result = await contract.methods
      .totalSupply()
      .call({ from: drizzleState.accounts[0] });
    if (result > 0) {
      setTotalAmountNft(result)
      const ownersArray = []
      for (let index = 1; index <= result; index++) {
        ownersArray.push({ idNft: index, owner: '' })
      }
      ownersArray.map(async owner => {
        const ownerAddress = await contract.methods.ownerOf(owner.idNft).call({ from: drizzleState.accounts[0] });
        if (ownerAddress) {
          owner.owner = ownerAddress
          console.log("🚀 ~ file: MarketPlace.js ~ line 34 ~ getCoupons ~ ownerAddress", ownerAddress)

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
      {nftOwnersDetails.length == totalAmountNft ? nftOwnersDetails.map(owner =>
        <div><span>{owner.idNft}: {owner.owner} {drizzleState.accounts[0] === owner.owner && <button onClick={() => transferNFT(owner)}>Move NFT for sell place</button>}</span></div>
      ) : <> </>}
      <BuyersBoard
        drizzle={drizzle}
        drizzleState={drizzleState}
      />
    </section>
  );
};

export default MarketPlace;
