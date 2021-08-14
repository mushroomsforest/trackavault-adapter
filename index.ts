import {ExampleAdapter} from "./example/example-service.adapater";
import {MushroomsAdapter} from "./services/mushrooms/mushrooms-service.adapater";
import {MushroomsAsset} from "./services/mushrooms/mushrooms-service.asset";
import {BasicPosition} from "./adapter.BasicPosition";

const UserAddress = "0xc0b09b78c00ebced69ed1b397f5fb6ad94938441";

const runTest = async function() {
    const MyExampleAdapter = new ExampleAdapter();
    const AllAssets = await MyExampleAdapter.GetAllAssets();

    console.log(`Found ${AllAssets.length} assets.`)
    for (const asset of AllAssets) {
        console.log(`Asset ${asset.name} at address ${asset.address}`);
    }

    const UserActivity = await MyExampleAdapter.GetActivity([UserAddress]);
    console.log(UserActivity);
}

//runTest();

const UserAddressMushrooms = "0x98E55d2288385bc1B0EBBE0e56eAc6AEB099C496";
const runTestMushrooms = async function() {
    const mushroomsAdapter = new MushroomsAdapter();
    const AllAssets = await mushroomsAdapter.GetAllAssets();
    console.log(`Found ${AllAssets.length} assets in Mushrooms Finance:`)
    for (const mAsset of AllAssets) {
        let mAssetName = mAsset.name;
        let mVaultName = mAsset.mVaultName;
        let mVaultDecimal = mAsset.mVaultDecimal;
        console.log('Vault want Asset[' + mAssetName + ']with vault name[' + mVaultName + '] and share decimal=' + mVaultDecimal);
    }
    const UserActivity = await mushroomsAdapter.GetActivity([UserAddressMushrooms]);	
    const ongoing = UserActivity.ongoing;
    console.log('Ongoing positions for address[' + UserAddressMushrooms + ']:');
    for (const curPos of ongoing) {
        let basicPos = <BasicPosition>curPos;
        console.log(`Current Position Share of[${basicPos.shareToken}]=${basicPos.shares} with share price=${basicPos.sharePrice}`);		
    }
}
runTestMushrooms();