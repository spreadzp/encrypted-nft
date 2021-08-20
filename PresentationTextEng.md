encrypted NFT

This project solves the transfer of a secret between a buyer and a seller using NFT on the public blockchain and IPFS / Filecoin to store encrypted information or a file. Everything is built on the principle of asymmetric cryptography - we encrypt with a public key - we decrypt with a private key.
 
 Step 1 - Preparing Content
 1.1 The Issuer has data that he is going to transfer using NFT and at the same time he does not want the third party to be able to read this data. Suppose Elon Musk wrote Knowledge "How to make a million dollars using Dogecoin". He does not want to give this knowledge to the general public, but only to a select few who will pay some amount that he considers sufficient.
 Suppose Elon Musk tweeted that he is the owner of the wallet
 0x123HAE ... The account will be the first owner of the NFT. All this can always be checked, therefore, the data linked to the NFT is true from Elon Musk
 Such data can be in the form:
 image,
    text, string,
    QR code,
    script - file,
    video - file ,
    music - file,
    byte-data - file
1.2 On the content preparation page, the Issuer generates a private / public key pair. ContentPrivateKey / ContentPublicKey
1.3 Using ContentPublicKey and service in the Issuer application data encryption. As a result, we get Hash - string like as 0xHAAC23...
This hash can only be decrypted using the private key ContentPrivateKey.
1.4 Using the service of the application for working with IPFS / Filecoin makes the saving of this hash. IPFS gives the answer in the form of url like as IPFS/
 - where is our hash of encrypted data

Step 2 - Minting NFT
 2.1 Issuer fills in NFT data
 name, description, url ipfs / encrypted / hash are entered in the URI in the image field
 2.2 The Issuer, using the Metamask service, provides the public key OwnerPublicKey from the OwnerAccount account (This is the account that Elon Musk posted on Twitter as his own :)) that will participate in the release of the NFT. This public key OwnerPublicKey will be used to encrypt the private key - ContentPrivateKey
 2.3 Minting NFT - the Issuer becomes the owner (OwnerAccount)
 at the same step, the hash of the encrypted ContentPrivateKey with the OwnerPublicKey key is written to the smart contract
 2.4 NFT owner can view encrypted data content in IPFS
 using ContentPrivateKey. Hash which it will decrypt using the Metamask service - encrypt using OwnerPrivateKey

 Step 3 Withdraw NFT for sale
 3.1 OwnerAccount make approve for MarketPlace smart-contract
 3.2 OwnerAccount exposes NFTs for trading using MoveNFTForSell

 Step4 Buyers place bids
 Now buyers can place their bids and at the same time can write their goals / slogans why they want to buy this NFT
 4.1 The Buyer, using the Metamask service, provides a public key BuyerPublicKey
 4.2 Now the buyer enters his rate, which will be debited from his account to the address of the MarketPlace smart contract and a description of his purchase purpose or any wish for the seller.
 4.3 The Buyer's funds are debited and his offer appears in the line of buyers with the price and his wishes and goals.
 4.4 The buyer can add a bid if he follows steps 4.1 - 4.3 his bids will be summed up
 4.5 The buyer can withdraw his bet using withdraw
 4.6 Other buyers add their bids using steps 4.1 - 4.5

 Step 5 Selling NFT
 5.1 The owner of the NFT OwnerAccount sees a table of buyers rates with descriptions of their goals
 5.2 The NFT owner selects any line with the highest price or the best slogan and clicks sell NFT
 5.3 NFT Owner sells to BuyerN. This step decrypts the hash ContentPrivateKey using the OwnerPrivateKey and encrypts it to the new owner BuyerN. Encryption is performed using the public key BuyerN, which was recorded in the MarketPlace smart contract when BuyerN made a bet, see steps 4.1-4.3. And at the same time, NFT is transferred to the new owner BuyerN.
 5.4. In the MarketPlace smart contract, the buyer's bid is subtracted in favour of the seller
 5.5 The seller can withdraw the received amount at any time using the service on the My Assets page

 Step 6 New owner
 6.1 To sell NFT, you must go through steps 3.1 - 3.2
 6.2 The board with buyers' bids is preserved! And now you can sell to any buyer or wait for new bids
 6.3 The encrypted data can be viewed by the new owner using step - 2.4
 6.4 Any owner can use the BurnNFT service to burn NFT and now further transfer of the secret is not possible using NFT.
 6.5 This is how the secret is transferred from the owner to the new owner without third party read access, using a public blockchain and a public data storage service


 Applications in the gaming industry
 can be transferred without fear of disclosure of the 3rd party
  secret passwords
  cheating patches
  images of objects
  instructions
  map images
  and much more