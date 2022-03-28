import { HardhatUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import dotenv from 'dotenv'
import '@typechain/hardhat'
import 'solidity-coverage'

dotenv.config()

const { MUMBAI_ACCOUNT_PRIVK = '', MUMBAI_ALCHEMY_API_KEY = '' } = process.env

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_ALCHEMY_API_KEY}`,
      accounts: [MUMBAI_ACCOUNT_PRIVK]
    }
  }
}

export default config
