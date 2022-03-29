import { Contract, ContractFactory } from 'ethers'
import hre from 'hardhat'

import { writeAddressToFile } from './utils'

const deployFweb3Poll = async (tokenAddress: string): Promise<string> => {
  try {
    const Fweb3PollFactory: ContractFactory =
      await hre.ethers.getContractFactory('Fweb3Poll')
    const fweb3Poll: Contract = await Fweb3PollFactory.deploy(tokenAddress)
    await fweb3Poll.deployed()
    const fweb3PollAddress = fweb3Poll.address
    writeAddressToFile('fweb3_poll', fweb3PollAddress)
    console.log('fweb3 poll address:', fweb3PollAddress)
    return fweb3PollAddress
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

export { deployFweb3Poll }
