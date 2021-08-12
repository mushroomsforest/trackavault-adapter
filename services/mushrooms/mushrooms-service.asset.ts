import {Asset} from "../../adapter.asset";
import {IAssetPrice} from "../../adapter.interface";
import {AssetsSingleton} from "../../assets";
import BigNumber from "bignumber.js";

import {MushroomsConfig} from "./mushrooms-service.config";
const { ethers } = require("ethers");

const mushroomsConfig = new MushroomsConfig();
const provider = mushroomsConfig.provider;
const oneEther = mushroomsConfig.oneEther;
const mushrooms_vault_abi = mushroomsConfig.mushrooms_vault_abi;
const BPS = mushroomsConfig.BPS;

export class MushroomsAsset extends Asset {
    public readonly mVault: string;
    public readonly mVaultName: string;
    public readonly farmingPid: number = 0;
    public readonly mVaultDecimal: string;

    constructor(name: string, address: string, mVault: string, mVaultName: string, farmingPid: number, mVaultDecimal: string) {
        super(name, address);
        this.mVault = mVault;
        this.mVaultName = mVaultName;
        this.farmingPid = farmingPid;
        this.mVaultDecimal = mVaultDecimal;
    }

    // price per share token at minimum decimal
    public async GetPrice(blockNumber?: number): Promise<IAssetPrice> {
        const wantAddress = this.address;
        const underlyingAsset = AssetsSingleton.asset(wantAddress);

        // Retrieve the factor by which to multiply the underlying asset and the underlying asset price
        const [underlyingFactor, underlyingPrice] = await Promise.all([
            this.GetUnderlyingFactor(blockNumber),
            underlyingAsset.GetPrice(blockNumber),
        ]);
        const price = underlyingPrice.price.times(underlyingFactor).div(new BigNumber(BPS.toString())).div(new BigNumber(this.mVaultDecimal));

        return {
            chain: underlyingPrice.chain.concat([{
                factor: underlyingFactor,
                name: underlyingAsset.name,
                price: underlyingPrice.price,
            }]),
            price,
        } as IAssetPrice;
    }

    // vault getRatio() multiplied by BPS
    public async GetUnderlyingFactor(blockNumber?: number): Promise<BigNumber> {
        // Retrieve the underlying factor here
        const contract = new ethers.Contract(this.mVault, mushrooms_vault_abi, provider);
        let vaultRatio = await ethers.utils.parseUnits((await contract.getRatio({ blockTag: blockNumber })).toString(), 0);
        //console.log('get factor using getRatio() for ' + this.mVaultName + ' at block[' + (blockNumber? blockNumber : 'latest') + ']=' + vaultRatio);
        let factor = vaultRatio.mul(BPS).div(oneEther);
        return new BigNumber(factor.toString());
    }
}