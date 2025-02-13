# TON: NFT Scripts

## How to use

### Deploy NFT

1. Store collection content somewhere, fill the config in `scripts/deployCollection.ts`; 
2. Prepare your wallet (should have at least 0.01 TON for fees, estimatedDeployFee is much less than the send fee);
3. Run `npm run start`/`yarn start`/`pnpm run start`, select `deployCollection`, follow the next steps;
4. Copy contract address from the console output ("Contract deployed at address ..."), see it in an explorer (like tonviewer).

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## References

This project is based on examples from the following repositories:

- [TON Blockchain Token Contract](https://github.com/ton-blockchain/token-contract/tree/main)
- [Wrappers](https://github.com/chainstacklabs/ton-nft-tutorial-1) from [TON: How to develop non-fungible tokens (NFT)](https://docs.chainstack.com/docs/ton-how-to-develop-non-fungible-tokens)
