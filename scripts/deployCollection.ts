import { Address } from '@ton/core';
import { compile, NetworkProvider } from '@ton/blueprint';
import { NFTCollection, NftCollectionConfig } from '../wrappers/NFTCollection';

/**
 * TODO: specify details here:
 * - store collection content somewhere, specify collectionContentUri (choose a storage to your liking, IPFS is supported)
 *   example: https://github.com/YakovL/ton-example-nft/raw/refs/heads/master/collection-1.json
 *   specs: https://docs.ton.org/v3/guidelines/dapps/tutorials/nft-minting-guide#nft-specifications
 * - collectionOwnerAddress: address from which other operations (like minting) will be executed
 * - royaltyPercent: number, 2 float digits allowed (1 → 1%, 0.01 → 0.01%; 0.001 → 0%)
 */
const overallConfig = {
    collectionContentUri: '',
    collectionOwnerAddress: '',
    royaltyPercent: 0,
}

export async function run(provider: NetworkProvider) {
    const ownerAddress = Address.parse(overallConfig.collectionOwnerAddress);
    const collectionConfig: NftCollectionConfig = {
        ownerAddress: ownerAddress,
        nextItemIndex: 0n,
        nftItemCode: await compile('NFTItem'),
        collectionContent: NFTCollection.nftContentToCell({ uri: overallConfig.collectionContentUri }),
        royaltyParams: NFTCollection.royaltyParamsToCell(overallConfig.royaltyPercent, ownerAddress)
    };

    const collection = provider.open(NFTCollection.createFromConfig(
        collectionConfig,
        await compile('NFTCollection')
    ));

    await collection.sendDeploy(provider.sender());

    await provider.waitForDeploy(collection.address);
}
