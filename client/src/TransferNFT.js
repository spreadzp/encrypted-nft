import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { encrypt, encryptData } from "./cypher";
import SetDecrypt from "./SetDecrypt";

const TransferNFT = props => {
    const [stackId, setStackID] = useState(null);
    const [clearData, setClearData] = useState('');
    const [hashMint, setHashMint] = useState('');
    const [uriData, setUriData] = useState('');
    const { drizzle, drizzleState, ipfsLink } = props;
    const contract = drizzle.contracts.EncNft;


    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = async (data) => {
        const stringUri = setUri(data);
        console.log("🚀 ~ file: MintNFT.js ~ line 19 ~ onSubmit ~ stringUri", stringUri)
        const resMint = await contract.methods.mint(drizzleState.accounts[0], 6, stringUri).send({ from: drizzleState.accounts[0] })
        if (resMint) {
            console.log("🚀 ~ file: MintNFT.js ~ line 21 ~ onSubmit ~ resMint", resMint)
            setHashMint(resMint.transactionHash)
        }
    };

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
        </section>
    );
};

export default TransferNFT;
