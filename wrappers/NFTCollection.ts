import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    toNano,
} from '@ton/core';

export type NftCollectionContent = {
    uri: string;
};

export type NftCollectionConfig = {
    ownerAddress: Address;
    nextItemIndex: bigint;
    nftItemCode: Cell;
    collectionContent: Cell | NftCollectionContent;
    royaltyParams: Cell;
};

export class NFTCollection implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new NFTCollection(address);
    }

    static nftContentToCell(content: NftCollectionContent): Cell {
        return beginCell()
            .storeRef(
                beginCell()
                    .storeUint(0x01, 8) // Content type (off-chain)
                    .storeStringTail(content.uri)
                    .endCell()
            )
            .endCell();
    }

    static royaltyParamsToCell(royaltyPercent: number, royaltyRecipientAddress: Address) {
        const royaltyPrecisionBase = 10;
        return beginCell()
            .storeUint(Math.floor(royaltyPercent * royaltyPrecisionBase), 16)
            .storeUint(100 * royaltyPrecisionBase, 16)
            .storeAddress(royaltyRecipientAddress)
            .endCell();
    }

    static nftCollectionConfigToCell(config: NftCollectionConfig): Cell {
        const content =
            config.collectionContent instanceof Cell
                ? config.collectionContent
                : NFTCollection.nftContentToCell(config.collectionContent);
    
        return beginCell()
            .storeAddress(config.ownerAddress)
            .storeUint(config.nextItemIndex, 64)
            .storeRef(content)
            .storeRef(config.nftItemCode)
            .storeRef(config.royaltyParams)
            .endCell();
    }

    static createFromConfig(config: NftCollectionConfig, code: Cell, workchain = 0) {
        const data = NFTCollection.nftCollectionConfigToCell(config);
        const init = { code, data };
        return new NFTCollection(contractAddress(workchain, init), init);
    }

    static estimatedDeployFee = toNano('0.0002'); // failed for 0.0001
    async sendDeploy(provider: ContractProvider, via: Sender, value?: bigint) {
        await provider.internal(via, {
            value: value || NFTCollection.estimatedDeployFee,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: new Cell(),
        });
    }
}