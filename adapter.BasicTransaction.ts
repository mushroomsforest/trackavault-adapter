import {ITransaction} from "./adapter.interface";

export class BasicTransaction implements ITransaction {
    public blockNumber: string;
    public timestamp: string;
    public hash: string;

    /**
     * @param blockNumber block number of the transaction
     * @param timestamp block timestamp (Unix seconds) of the transaction
	 * @param hash transaction hash
     */
    constructor(blockNumber: string, timestamp: string, hash: string) {
        this.blockNumber = blockNumber;
        this.timestamp = timestamp;
        this.hash = hash;
    }
}