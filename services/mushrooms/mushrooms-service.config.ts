const { ethers, BigNumber, JsonRpcProvider } = require("ethers");

export class MushroomsConfig {
	
    public readonly RPC_PROVIDER_URL: string = "https://eth-mainnet.alchemyapi.io/v2/{plz put your rpc key here}";//replace with your archive node rpc like Infura or Alchemyapi
	
    public readonly mushroomsAPI: string = "https://vjeieiw4tf.execute-api.us-east-1.amazonaws.com/apy";
    public readonly mmFarmingPool: string = "0xf8873a6080e8dbF41ADa900498DE0951074af577";
    public readonly mushrooms_masterchef_abi: string = '[{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"}]';
    public readonly mushrooms_vault_abi: string = '[{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]';
    
    public BPS: InstanceType<typeof BigNumber>;
    public TEN: InstanceType<typeof BigNumber>;
    public oneEther: InstanceType<typeof BigNumber>;	
    public provider: InstanceType<typeof JsonRpcProvider>;

    constructor() {
       this.BPS = BigNumber.from("10000");
       this.TEN = BigNumber.from("10");
       this.oneEther = BigNumber.from("1000000000000000000");
       this.provider = new ethers.providers.JsonRpcProvider(this.RPC_PROVIDER_URL);
    }
}