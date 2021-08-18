import React, { useState, useEffect } from "react";
import TokenCard from "./components/TokenCard";
import { Table, Accordion } from 'react-bootstrap';
import TransferNFT from "./TransferNFT";
import { decryptPrivateKey, getPublicKeyViaMetamask, metamaskEncrypt, metamaskEncryptData } from "./metamask";
import BetForm from "./BetForm";
import { BigNumber, ethers, utils } from 'ethers'
import { encryptData } from "./cypher";

const BuyersBoard = props => {
    const [dataKey, setDataKey] = useState(null);
    const [totalAmountNft, setTotalAmountNft] = useState(0);
    const [nftBuyersDetails, setNftBuyersDetails] = useState([]);
    const [publicKey, setPubKey] = useState('');
    const [chosenTokenId, setChosenTokenId] = useState(0);
    const { drizzle, drizzleState, nftOwnersDetails } = props;
    const contract = drizzle.contracts.EncNft;
    const contractMarket = drizzle.contracts.MarketPlace;
    const [showBetForm, setShowBetForm] = useState(false);
    const [buyerIndex, setBuyerIndex] = useState(-1);
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



                // if (tokenUri && ownerAddress) {
                //     token.owner = ownerAddress
                //     console.log("🚀 ~ file: BuyersBoard.js ~ line 56 ~ getBuyers ~ tokenUri", tokenUri)
                //     const uri = JSON.parse(tokenUri);
                //     token.name = uri.name;
                //     token.description = uri.description;
                //     token.image = uri.image;
                //     console.log('token :>> ', token);
                //     nftOwnersDetails.length > 0 ? setNftOwnersDetails(nftOwnersDetails => [...nftOwnersDetails, token]) :
                //         setNftOwnersDetails([token])
                //     console.log('####nftOwnersDetails :>> ', nftOwnersDetails);
                // }
                try {
                    const countBuyers = await contractMarket.methods.getCountBuyers(token.idNft).call({ from: drizzleState.accounts[0] })

                    console.log("🚀 ~ file: BuyersBoard.js ~ line 66 ~ getBuyers ~ countBuyers", countBuyers)
                    if (countBuyers > 0) {
                        for (let index = 0; index < countBuyers; index++) {
                            const buyersMakeBet = await contractMarket.methods.buyersBoard(token.idNft, index).call({ from: drizzleState.accounts[0] });
                            if (buyersMakeBet) {
                                console.log("🚀 ~ file: BuyersBoard.js ~ line 55 ~ getBuyers ~ buyersMakeBet", buyersMakeBet)
                                setNftBuyersDetails(nftBuyersDetails => [...nftBuyersDetails, {idToken: token.idNft, buyerAddress: buyersMakeBet[0], buyerPubKey: buyersMakeBet[1],
                                     buyerBet: buyersMakeBet[2], goalPurchase: buyersMakeBet[3] }])
                                console.log('nftBuyersDetails  :>> ', nftBuyersDetails);
                            }
                            
                        }
                      
                    }
                } catch (error) {
                    console.log("🚀 ~ file: BuyersBoard.js ~ line 72 ~ getBuyers ~ error", error)

                }

            })
        }
    };

    const sellNft = async (buyer, token) => {
    console.log("🚀 ~ file: BuyersBoard.js ~ line 85 ~ sellNft ~ buyer", buyer)
        if (token.owner === drizzleState.accounts[0]) {
            // enc-decrypt pryvateKey - enc via buyerPubKey
            const ownerOfTokenInfo = await contract.methods.getTokenInfoLastOwner(token.idNft).call({ from: drizzleState.accounts[0] });
            console.log("🚀 ~ file: BuyersBoard.js ~ line 78 ~ sellNft ~ ownerOfTokenInfo", ownerOfTokenInfo)
            const lastEncryptedPrivateKey = ownerOfTokenInfo.encData
            console.log("🚀 ~ file: BuyersBoard.js ~ line 79 ~ sellNft ~ lastEncryptedPrivateKey", lastEncryptedPrivateKey)
            const decryptedPrivateKey = await decryptPrivateKey(lastEncryptedPrivateKey, drizzleState.accounts[0])
            console.log("🚀 ~ file: BuyersBoard.js ~ line 81 ~ sellNft ~ encryptedPrivateKey", decryptedPrivateKey)
            console.log('buyer.buyerPubKey  :>> ', buyer.buyerPubKey, buyer);
            if (decryptedPrivateKey) {
                const encData = await metamaskEncrypt(  decryptedPrivateKey, buyer.buyerPubKey)
                if (encData !== '') {
                    console.log("🚀 ~ file: BuyersBoard.js ~ line 85 ~ sellNft ~ encData", encData)
                    const sellInfo = await contractMarket.methods.acceptRateAndTransferToken(token.idNft, buyer.buyerAddress, encData).send({ from: drizzleState.accounts[0], gasPrice: 10 * 10 ** 10, gasLimit: 600000 })
                    console.log("🚀 ~ file: BuyersBoard.js ~ line 65 ~ sellNft ~ sellInfo", sellInfo)
                }
            }


        }
    }

const getSellerActions = (buyer, token) => { 
    return (
        token.owner === drizzleState.accounts[0] && token.approved ?  
        token.owner === drizzleState.accounts[0] && !token.approved ? 
        'Need to approve to sell':   
        <button onClick={() => sellNft(buyer, token)}>Sell NFT</button > :
        
        ''
    )
}
    const BuyersOfToken = (token) => {
        // own address make color red

        return (< Table striped bordered hover >
            <thead >
                <th > Buyer address </th>
                <th > Buyer rate </th>
                <th > Why do I need it </th>
                <th > Action </th>
            </thead >
            <tbody > {
                nftBuyersDetails.filter(item => item.idToken === token.idNft).map(buyer => {
                    return (buyer.buyerBet > 0 && < tr >
                        <th className={buyer.buyerAddress === drizzleState.accounts[0]? 'owner-address': null}> {buyer.buyerAddress} </th> <th>{utils.formatEther(buyer.buyerBet)}ETH</th>
                        <th> {buyer.goalPurchase} </th>
                        <th>{getSellerActions(buyer, token)} </th>
                    </tr >)
                })
            } </tbody>
        </Table>)
    }



    return (
        // if it exists, then we display its value
        <>
            <h2 > Buyers Board </h2>
            <Accordion defaultActiveKey="0" > {
                nftOwnersDetails.map((token, index) =>
                    <Accordion.Item eventKey={index} >
                        <Accordion.Header onClick={() => setBuyerIndex(index)}> ID NFT: {token.idNft} {token.name} </Accordion.Header>
                        <Accordion.Body className={buyerIndex === index ? "active" : "inactive"} >
                            <div > {token.description} </div> {BuyersOfToken(token)}
                        </Accordion.Body> </Accordion.Item >
                )
            }

            </Accordion>
        </>
    );
};

export default BuyersBoard;