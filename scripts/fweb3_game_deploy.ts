import { Contract, ContractFactory } from 'ethers'
import hre from 'hardhat'

import { deployFweb3Token } from './fweb3_token_deploy'
import { writeAddressToFile } from './utils'
interface DeployAddresses {
  fweb3TokenAddress: string
  fweb3GameAddress: string
}

const deployFweb3Game = async (): Promise<DeployAddresses> => {
  try {
    const fweb3TokenAddress: string = await deployFweb3Token()
    const Fweb3GameFactory: ContractFactory =
      await hre.ethers.getContractFactory('Fweb3Game')
    const fweb3Game: Contract = await Fweb3GameFactory.deploy(fweb3TokenAddress)
    await fweb3Game.deployed()
    const fweb3GameAddress: string = fweb3Game.address
    writeAddressToFile('fweb3_game', fweb3GameAddress)
    console.log('fweb3 game address:', fweb3GameAddress)
    return {
      fweb3TokenAddress,
      fweb3GameAddress,
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { deployFweb3Game }
