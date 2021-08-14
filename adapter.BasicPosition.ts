import {IAssetPosition, ITransaction} from "./adapter.interface";
import BigNumber from "bignumber.js";

export class BasicPosition implements IAssetPosition {
    public id: string;
    public baseId: string;
    public shares: BigNumber;
    public shareToken: string; // token name
    public transaction: ITransaction;
    public logo: string;
    public sharePrice: BigNumber;

    /**
     * @param id ID of the position
     * @param baseId base ID of the position
     * @param shares vault share of the position
     * @param shareToken vault share token
     * @param transaction on-chain tx for the position
     * @param logo avatar of the vault
     * @param sharePrice vault share price
     */
    constructor(id: string, baseId: string, shares: BigNumber, shareToken: string, transaction: ITransaction, logo: string, sharePrice: BigNumber) {
        this.id = id;
        this.baseId = baseId;
        this.shares = shares;
        this.shareToken = shareToken;
        this.transaction = transaction;
        this.logo = logo;
        this.sharePrice = sharePrice;
    }
}