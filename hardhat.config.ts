import { config as dotEnvConfig } from 'dotenv'

import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'solidity-coverage'

dotEnvConfig()

const { MUMBAI_ACCOUNT_PRIVK, MUMBAI_ALCHEMY_API_KEY } = process.env

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config = {
  solidity: '0.8.9',
  hardhat: {
    polygon_mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_ALCHEMY_API_KEY}`,
      accounts: [MUMBAI_ACCOUNT_PRIVK],
    },
    localhost: {
      url: "http://localhost:8545"
    },
    polygon_mainnet: {
      url: '',
      accounts: [],
    }  
  }
}

export default config
