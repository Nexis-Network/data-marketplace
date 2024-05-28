import { ConfigHelper, Config } from '@oceanprotocol/lib'
import { ethers } from 'ethers'
import abiDatatoken from '@oceanprotocol/contracts/artifacts/contracts/templates/ERC20TemplateEnterprise.sol/ERC20TemplateEnterprise.json'

/**
  This function takes a Config object as an input and returns a new sanitized Config object
  The new Config object has the same properties as the input object, but with some values replaced by environment variables if they exist
  Also adds missing contract addresses deployed when running barge locally
  @param {Config} config - The input Config object
  @returns {Config} A new Config object
*/
export function sanitizeDevelopmentConfig(config: Config): Config {
  return {
    subgraphUri: process.env.NEXT_PUBLIC_SUBGRAPH_URI || config.subgraphUri,
    metadataCacheUri:
      process.env.NEXT_PUBLIC_METADATACACHE_URI || config.metadataCacheUri,
    providerUri: process.env.NEXT_PUBLIC_PROVIDER_URL || config.providerUri,
    nodeUri: process.env.NEXT_PUBLIC_RPC_URL || config.nodeUri,
    fixedRateExchangeAddress:
      process.env.NEXT_PUBLIC_FIXED_RATE_EXCHANGE_ADDRESS,
    dispenserAddress: process.env.NEXT_PUBLIC_DISPENSER_ADDRESS,
    oceanTokenAddress: process.env.NEXT_PUBLIC_OCEAN_TOKEN_ADDRESS,
    nftFactoryAddress: process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS
  } as Config
}

export function getOceanConfig(network: string | number): Config {
  if(network===2370|| network==='nexis'){
    return {
      chainId:2370,
      explorerUri:"https://evm-testnet.nexscan.io",
      gasFeeMultiplier:1.04,
      network:"testnet",
      DFRewards:"0xFe27534EA0c016634b2DaA97Ae3eF43fEe71EEB0",
      DFStrategyV1:"0x545138e8D76C304C916B1261B3f6c446fe4f63e3",
      dispenserAddress:"0x5DFc34101a9E5EC5e1327A4B1bf79fEe318Bf558",
      fixedRateExchangeAddress:"0x9F86AC4Bc0Ad104f741ecbe95E4A7E3c87357819",
      metadataCacheUri: "https://v4.aquarius.oceanprotocol.com",
      nftFactoryAddress:"0x65e5B7aA9C03821CAca7F5EB30bFD9a8B26C39AB",
      nodeUri:"https://mainnet.infura.io/v3",
      oceanTokenAddress:"0x8F1C77D54f58456f34E04Ddc8F7981539c277A5b",
      oceanTokenSymbol:"OCEAN",
      opfCommunityFeeCollector:"0xc2636c767E555EB97C01D491E0a79446F2262cF8",
      providerUri:"https://v4.provider.oceanprotocol.com",
      startBlock:9445599,
      subgraphUri:"https://v4.subgraph.mainnet.oceanprotocol.com",
      transactionBlockTimeout:150,
      transactionConfirmationBlocks:5,
      transactionPollingTimeout:1750,
      veAllocate:undefined,
      veDelegation:undefined,
      veDelegationProxy:undefined,
      veFeeDistributor:undefined,
      veFeeEstimate:undefined,
      veOCEAN:undefined
    };
  }
  let config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 'gaiaxtestnet' ||
      network === 2021000 ||
      network === 8996
      ? undefined
      : process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  ) as Config
  if (network === 8996) {
    config = { ...config, ...sanitizeDevelopmentConfig(config) }
  }
  return config as Config
}

export function getDevelopmentConfig(): Config {
  return {
    // factoryAddress: contractAddresses.development?.DTFactory,
    // poolFactoryAddress: contractAddresses.development?.BFactory,
    // fixedRateExchangeAddress: contractAddresses.development?.FixedRateExchange,
    // metadataContractAddress: contractAddresses.development?.Metadata,
    // oceanTokenAddress: contractAddresses.development?.Ocean,
    // There is no subgraph in barge so we hardcode the Polygon Mumbai one for now
    subgraphUri: 'https://v4.subgraph.sepolia.oceanprotocol.com'
  } as Config
}

/**
 * getPaymentCollector - returns the current paymentCollector
 * @param dtAddress datatoken address
 * @param provider the ethers.js web3 provider
 * @return {Promise<string>}
 */
export async function getPaymentCollector(
  dtAddress: string,
  provider: ethers.providers.Provider
): Promise<string> {
  const dtContract = new ethers.Contract(dtAddress, abiDatatoken.abi, provider)
  const paymentCollector = await dtContract.getPaymentCollector()
  return paymentCollector
}
