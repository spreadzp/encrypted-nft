import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UriBlock from "./components/UriBlock";
import { decrypt } from "./cypher";
import { Table } from 'react-bootstrap';
import { decryptPrivateKey, decryptUriFile } from "./metamask";

const OwnerAssets = props => {

    const { drizzle, drizzleState, encData, encPrivateKey } = props;
    const [encryptedInfo, setEncryptedInfo] = useState('');
    const { Coupoken } = drizzleState.contracts;
    const [decryptedPK, setDecryptedPK] = useState('');
    const [decryptedInfo, setDecryptedInfo] = useState('');
    const [decMessage, setDecryptMessage] = useState(false);
    const [countTokens, setCountTokens] = useState(0);
    const [countSellers, setCountSellers] = useState([]);
    const [decPk, setDecPk] = useState(false);
    const { register, handleSubmit, watch, errors } = useForm();
    const contract = drizzle.contracts.EncNft;
    const contractMarket = drizzle.contracts.MarketPlace;

    useEffect(() => {
        setEncryptedInfo(encData);
    }, [encData]);

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
                for (let index = 0; index < numResult; index++) {
                    const countSellersOfToken = await contractMarket.methods
                .getCountSellers(index)
                .call({ from: drizzleState.accounts[0] });
                if(countSellersOfToken) {
                    console.log("🚀 ~ file: OwnerAssets.js ~ line 42 ~ countOfTokens ~ countSellersOfToken", countSellersOfToken)
                }
                    
                    
                }
            }
            

        }
        countOfTokens()
    }, [])

    useEffect(() => {
        console.log('decryptedPK && encData :>> ', decryptedPK, encData);
        if (decryptedPK && encData) {
            async function getDecryptMessage() { 
                    const dm = await decryptUriFile(encData, decryptedPK);
                    console.log("🚀 ~ file: SetDecrypt.js ~ line 20 ~ decryptMessage ~ decMessage", dm)
                    setDecryptedInfo(dm) 

            }
            getDecryptMessage()

        }
    }, [decryptedPK, encData]);

    const onFileChange = (event) => {
        let file = event.target.files[0];

        let fileReader = new FileReader();
        fileReader.readAsText(file);

        fileReader.onload = (event) => {
            let fileAsText = event.target.result;
            setEncryptedInfo(fileAsText);
        };
    };



    return (
        <section>
            <h2>Your assets</h2>
            <h3>Sold tokens </h3> 
            <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID NFT</th>
            <th>Owner address</th>
            <th>Sum</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* {nftOwnersDetails.length == totalAmountNft ? nftOwnersDetails.map(owner =>
            <tr>
              <td>{owner.idNft}</td>
              <td className={drizzleState.accounts[0] === owner.owner? 'owner-address' : null}> {owner.owner}</td>
              <td>{drizzleState.accounts[0] === owner.owner ?
              owner.approved ? 
                <button onClick={() => transferNFT(owner)}>Move NFT for sell place</button> :
                <button onClick={() => approveNFT(owner)}>Approve NFT for sell</button> :
                <button onClick={() => makeBet(owner)}> Make BET</button>}</td>
            </tr>
          ) : <></>} */}
        </tbody>
      </Table>
        </section>
    );
};
export default OwnerAssets;
