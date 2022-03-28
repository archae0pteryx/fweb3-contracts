import { deployFweb3DiamondNFT } from './fweb3_diamond_nft_deploy'
import { deployFweb3Game } from './fweb3_game_deploy'
;(async () => {
  try {
    await deployFweb3Game()
    await deployFweb3DiamondNFT()
    console.log('deployed contracts!')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
