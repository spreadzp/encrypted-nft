import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { encrypt, encryptData } from "./cypher";
import SetDecrypt from "./SetDecrypt";
import TransferNFT from "./TransferNFT";

const MintNFT = props => {
    const [stackId, setStackID] = useState(null);
    const [clearData, setClearData] = useState('');
    const [hashMint, setHashMint] = useState('');
    const [pubKey, setPubKey] = useState('');
    const [countTokens, setCountTokens] = useState(0);
    const { drizzle, drizzleState, ipfsLink, encryptedKey } = props;
    const contract = drizzle.contracts.EncNft;


    const { register, handleSubmit, watch, errors } = useForm();
    useEffect(() => {
        async function countOfTokens() {
            const result = await contract.methods
                .totalSupply()
                .call({ from: drizzleState.accounts[0] });
                console.log('result !== countTokens :>> ', result, countTokens);
            if (+result !== countTokens) {
                const numResult = +result 
                console.log("🚀 ~ file: MintNFT.js ~ line 28 ~ countOfTokens ~ numResult", numResult)
                setCountTokens(numResult)
                console.log('countTokens :>> ', countTokens);
            }
            

        }
        countOfTokens()
    }, [])
    const onSubmit = async (data) => {

        const stringUri = setUri(data);
        console.log("🚀 ~ file: MintNFT.js ~ line 19 ~ onSubmit ~ stringUri", stringUri)
        const resMint = await contract.methods.mint(drizzleState.accounts[0], countTokens + 1, stringUri, encryptedKey).send({ from: drizzleState.accounts[0] })
        if (resMint) {
            console.log("🚀 ~ file: MintNFT.js ~ line 21 ~ onSubmit ~ resMint", resMint)
            setHashMint(resMint.transactionHash)
        }
    };
    const approveNft = async () => {
        console.log('countTokens :>> ', countTokens);
        // countTokens ???
        const res = await contract.methods.approve(drizzle.contracts.MarketPlace.address, countTokens).send({
            from: drizzleState.accounts[0],
            gasPrice: 5 * 10 ** 10, gasLimit: 400000
        })
        if (res) {
            console.log("🚀 ~ file: MintNFT.js ~ line 45 ~ approveNft ~ res", res)
            getTxStatus()
        }
    }
        const setUri = data => {
            const uri = { ...data, image: ipfsLink }
            return JSON.stringify(uri)
        };

        useEffect(() => {
            // const getName = async () => {
            //     const name = await contract.methods.name.call()
            //     if(name) {
            //         setEncryptedData(name)
            //     }
            // }
            // getName()

        }, [contract])



        const getTxStatus = () => {
            // get the transaction states from the drizzle state
            const { transactions, transactionStack } = drizzleState;

            // get the transaction hash using our saved `stackId`
            const txHash = transactionStack[stackId];

            // if transaction hash does not exist, don't display anything
            if (!txHash) return null;

            // otherwise, return the transaction status
            return `Transaction status: ${transactions[txHash] &&
                transactions[txHash].status}`;
        };

        return (
            <section>
                <div>Mint new NFT to owner</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="u-full-width">
                            <label htmlFor="mNft">Name</label>
                            <input
                                name="name"
                                className="u-full-width"
                                placeholder="Test NFT"
                                ref={register({ required: true, maxLength: 42 })}
                            />
                            {errors.name && <span>Use a valid input</span>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="u-full-width">
                            <label htmlFor="mNft">Description of the NFT</label>
                            <input
                                name="description"
                                className="u-full-width"
                                placeholder="string data"
                                ref={register({ required: false, maxLength: 8000 })}
                            />
                            {errors.description && <span>Use a valid input</span>}
                        </div>
                    </div>

                    <input className="button-primary" type="submit" value="Mint" />
                </form>
                <div>
                    Hash mint transaction:  {hashMint}
                </div>
                {/* <TransferNFT drizzle={drizzle}
                    drizzleState={drizzleState}
                    ipfsLink={ipfsLink} /> */}
                <button onClick={() => approveNft()}>Approve to MarketPlace contract</button>
            </section>
        );
    };

    export default MintNFT;
