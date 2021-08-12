import {Adapter} from "../../adapter";
import {Asset} from "../../adapter.asset";
import {IAdapterHistory, IAssetPosition, IAssetPositionCompleted} from "../../adapter.interface";

import {BasicPosition} from "../../adapter.BasicPosition";
import {BasicTransaction} from "../../adapter.BasicTransaction";
import {MushroomsAsset} from "./mushrooms-service.asset";
import {MushroomsConfig} from "./mushrooms-service.config";

import BigNumber from "bignumber.js";

const { ethers } = require("ethers");
const axios = require('axios');

const mushroomsConfig = new MushroomsConfig();
const provider = mushroomsConfig.provider;
const oneEther = mushroomsConfig.oneEther;
const TEN = mushroomsConfig.TEN;
const mushrooms_vault_abi = mushroomsConfig.mushrooms_vault_abi;
const mushrooms_masterchef_abi = mushroomsConfig.mushrooms_masterchef_abi;
const mmFarmingPool = mushroomsConfig.mmFarmingPool;
const mushroomsAPI = mushroomsConfig.mushroomsAPI;

export class MushroomsAdapter extends Adapter {
	
    public assets: MushroomsAsset[];
			
    constructor() {
        super("MushroomsAdapter");		
        this.assets = new Array(); 
    }

    async GetAllAssets(): Promise<MushroomsAsset[]> {
        // Retrieve all the services assets from the blockchain or a graphs		
        if(this.assets.length <= 0){	
           await this.BuildAllAssets();
        }		
        return Promise.resolve(this.assets);	
    }


    async GetActivity(addresses: string[]): Promise<IAdapterHistory> {		
        var currentPositions: BasicPosition[];
        currentPositions = new Array();
		
        if(this.assets.length <= 0){
           await this.GetAllAssets();
        }
		
        const masterChef = new ethers.Contract(mmFarmingPool, mushrooms_masterchef_abi, provider);
		
        for(const addr of addresses){		
            for(const asset of this.assets){	
                const mVault = new ethers.Contract(asset.mVault, mushrooms_vault_abi, provider);		   
                let balanceOfShare = await ethers.utils.parseUnits((await mVault.balanceOf(addr)).toString(), 0);
                if(balanceOfShare > 0){  
                   //console.log('balanceOfShare for ' + asset.mVaultName + '=' + balanceOfShare);				  
                }				
			   
                let userInfo = await masterChef.userInfo(asset.farmingPid, addr);
                let balanceOfShareInFarming = await ethers.utils.parseUnits(userInfo[0].toString(), 0);
                if(balanceOfShareInFarming > 0){
                   //console.log('balanceOfShareInFarming for ' + asset.mVaultName + '=' + balanceOfShareInFarming);				   
                }
			   
                let shares = balanceOfShare.add(balanceOfShareInFarming);
                if(shares > 0){		       
                   const dummyTx = new BasicTransaction("blockNumber", "timestamp", "hash");
			   
                   let vaultSharePrice = await asset.GetPrice();
                   //let vaultRatio = await asset.GetUnderlyingFactor();
                   //console.log('fetch position for ' + asset.mVaultName + '=' + shares + ", currentRatio(BPS)=" + vaultRatio + ", currentSharePrice=" + vaultSharePrice.price);	
				  
                   const pos = new BasicPosition("id", "baseId", new BigNumber(shares.toString()), asset.mVaultName, dummyTx, "logo", vaultSharePrice.price);
                   currentPositions.push(pos);		   
                }
            }			
        }
		
        return Promise.resolve({
            name: this.name,
            ongoing: currentPositions,
            completed: [],
        });
    }
	
    async BuildAllAssets() {
        await axios.get(mushroomsAPI).then(async (resp: any) => {			
            let vaults = resp.data.result.vaults;			
            for(const vault of vaults) {		
                if(vault.token.toLowerCase() == '0x87da823b6fc8eb8575a235a824690fda94674c88'){
                   continue;//skip LP vault for MIR-UST
                }					
                let mDecimal = await this.FetchVaultDecimal(vault.vault_address);
                var asset = new MushroomsAsset(vault.token_name, vault.token, vault.vault_address, vault.name, vault.farming_pid, mDecimal.toString());
                this.assets.push(asset);
            }
        });	
    }
	
    async FetchVaultDecimal(vault_address: string): Promise<string> {
        const mVault = new ethers.Contract(vault_address, mushrooms_vault_abi, provider);		   
        let mVaultDecimal = await ethers.utils.parseUnits((await mVault.decimals()).toString(), 0);
        let mDecimal = TEN.pow(mVaultDecimal);
        return mDecimal.toString();
    }
}