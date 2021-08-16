import React, { useState, useEffect } from "react";
import TokenCard from "./components/TokenCard";
import { Link } from "react-router-dom";
import * as _ from "lodash";
import TransferNFT from "./TransferNFT";
import { decryptPrivateKey, getPublicKeyViaMetamask, metamaskEncrypt, metamaskEncryptData } from "./metamask";
import BetForm from "./BetForm";
import { BigNumber, ethers, utils } from 'ethers'

const BuyersBoard = props => {
    const [dataKey, setDataKey] = useState(null);
    const [totalAmountNft, setTotalAmountNft] = useState(0);
    const [nftOwnersDetails, setNftOwnersDetails] = useState([]);
    const [nftBuyersDetails, setNftBuyersDetails] = useState([]);
    const [publicKey, setPubKey] = useState('');
    const [chosenTokenId, setChosenTokenId] = useState(0);
    const { drizzle, drizzleState } = props;
    const contract = drizzle.contracts.EncNft;
    const contractMarket = drizzle.contracts.MarketPlace;
    const [showBetForm, setShowBetForm] = useState(false);
    useEffect(() => {
        getBuyers();
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
    const getBuyers = async () => {
        let result = await contract.methods
            .totalSupply()
            .call({ from: drizzleState.accounts[0] });
        if (result > 0) {
            setTotalAmountNft(result)
            const tokensArray = []
            for (let index = 1; index <= result; index++) {
                tokensArray.push({ idNft: index, owner: '', name: '', description: '', image: '' })
            }
            console.log('tokensArray   :>> ', tokensArray);
            tokensArray.map(async token => {
                const ownerAddress = await contract.methods.ownerOf(token.idNft).call({ from: drizzleState.accounts[0] });
                const tokenUri = await contract.methods.tokenURI(token.idNft).call({ from: drizzleState.accounts[0] });



                if (tokenUri && ownerAddress) {
                    token.owner = ownerAddress
                    console.log("🚀 ~ file: BuyersBoard.js ~ line 56 ~ getBuyers ~ tokenUri", tokenUri)
                    const uri = JSON.parse(tokenUri);
                    token.name = uri.name;
                    token.description = uri.description;
                    token.image = uri.image;
                    console.log('token :>> ', token);
                    nftOwnersDetails.length > 0 ? setNftOwnersDetails(nftOwnersDetails => [...nftOwnersDetails, token]) :
                        setNftOwnersDetails([token])
                    console.log('####nftOwnersDetails :>> ', nftOwnersDetails);
                }
                try {
                      contractMarket.methods.getBuyersrById(token.idNft).call({ from: drizzleState.accounts[0] })
                      .then(res => console.log('res :>> ', res))
                    // console.log("🚀 ~ file: BuyersBoard.js ~ line 66 ~ getBuyers ~ countBuyers", countBuyers)
                    // if(countBuyers) {
                    //     const buyersMakeBet = await contractMarket.methods.buyersBoard(token.idNft, 0).call({ from: drizzleState.accounts[0] });
                    //     if (buyersMakeBet) {
                    //         console.log("🚀 ~ file: BuyersBoard.js ~ line 55 ~ getBuyers ~ buyersMakeBet", buyersMakeBet)
                    //         setNftBuyersDetails(nftBuyersDetails => [...nftBuyersDetails, [{ buyerAddress: buyersMakeBet[0], buyerPubKey: buyersMakeBet[1], byuerBet: buyersMakeBet[2] }]])
                    //         console.log('nftBuyersDetails  :>> ', nftBuyersDetails);
                    //     }
                    // }                    
                } catch(error) {
                console.log("🚀 ~ file: BuyersBoard.js ~ line 72 ~ getBuyers ~ error", error)
                    
                }
                
            })
        }
    };

    const sellNft = async (buyer, token) => {
        if (token.owner === drizzleState.accounts[0]) {
            // enc-decrypt pryvateKey - enc via buyerPubKey
            const ownerOfTokenInfo = await contract.methods.getTokenInfoLastOwner(token.idNft).call({ from: drizzleState.accounts[0] });
            console.log("🚀 ~ file: BuyersBoard.js ~ line 78 ~ sellNft ~ ownerOfTokenInfo", ownerOfTokenInfo)
            const lastEncryptedPrivateKey = ownerOfTokenInfo.encData
            console.log("🚀 ~ file: BuyersBoard.js ~ line 79 ~ sellNft ~ lastEncryptedPrivateKey", lastEncryptedPrivateKey)
            const encryptedPrivateKey = await decryptPrivateKey(lastEncryptedPrivateKey, drizzleState.accounts[0])
            console.log("🚀 ~ file: BuyersBoard.js ~ line 81 ~ sellNft ~ encryptedPrivateKey", encryptedPrivateKey)
            console.log('buyer.buyerPubKey  :>> ', buyer[0].buyerPubKey, buyer );
            if (encryptedPrivateKey) {
                const encData = await metamaskEncrypt(encryptedPrivateKey, buyer[0].buyerPubKey )
                if (encData !== '') {
                    console.log("🚀 ~ file: BuyersBoard.js ~ line 85 ~ sellNft ~ encData", encData)
                    const sellInfo = await contractMarket.methods.acceptRateAndTransferToken(token.idNft, buyer[0].buyerAddress, encData).send(
                        { from: drizzleState.accounts[0], gasPrice: 10 * 10 ** 10, gasLimit: 600000 })
                    console.log("🚀 ~ file: BuyersBoard.js ~ line 65 ~ sellNft ~ sellInfo", sellInfo)
                }
            }


        }
    }

    useEffect(() => {
        console.log('totalAmountNft  :>> ', totalAmountNft);
        console.log('nftOwnersDetails.length :>> ', nftOwnersDetails.length);
        console.log('nftOwnersDetails.length === totalAmountNft :>> ', nftOwnersDetails.length === totalAmountNft);
        if (nftOwnersDetails.length == totalAmountNft) {
            console.log(' @@@@totalAmountNft  :>> ', totalAmountNft);
        }
    }, [nftOwnersDetails.length])


    const ByersOfToken = (token) =>
        nftBuyersDetails.map(buyer =>
            <span><div>{buyer.buyerAddress}{buyer.byuerBet}</div>{token.owner === drizzleState.accounts[0] && <button onClick={() => sellNft(buyer, token)}>Sell NFT</button>}</span>
        )

    return (
        // if it exists, then we display its value
        <>
            <section>
                {showBetForm && <BetForm
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                    idToken={chosenTokenId}
                    pk={publicKey}
                    address={drizzleState.accounts[0]}
                />}
            </section>
            <section>
                <h2>Buyers Board</h2>
                {nftOwnersDetails.length == totalAmountNft ? nftOwnersDetails.map(token => {
                    return (<><span>{token.idNft}: {token.name} {token.description}
                        {token.owner !== drizzleState.accounts[0] && <button onClick={() => makeBet(token)}>Make Bet</button>}{ByersOfToken(token)}</span>
                    </>)
                }


                ) : <> </>}

            </section>
        </>
    );
};

export default BuyersBoard;
