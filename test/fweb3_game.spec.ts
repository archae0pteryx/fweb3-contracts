import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Contract, ContractFactory, utils } from 'ethers'
import { ethers } from 'hardhat'



describe('Fweb3 game contract', async () => {
  let Fweb3GameFactory: ContractFactory,
  fweb3Game: Contract,
  user1Fweb3Game: Contract, // has tokens
  user2Fweb3Game: Contract, // no tokens
  judgeFweb3Game: Contract, // no tokens
  Fweb3TokenFactory: ContractFactory,
  fweb3Token: Contract,
  owner: SignerWithAddress,
  user1: SignerWithAddress,
  user2: SignerWithAddress,
  judgeUser: SignerWithAddress

  beforeEach(async () => {
    ;[owner, user1, user2, judgeUser] = await ethers.getSigners()

    Fweb3TokenFactory = await ethers.getContractFactory('Fweb3Token')
    fweb3Token = await Fweb3TokenFactory.deploy()
    await fweb3Token.deployed()

    // give user1 300 tokens
    await fweb3Token.transfer(user1.address, utils.parseEther('300'))
    
    Fweb3GameFactory = await ethers.getContractFactory('Fweb3Game')
    fweb3Game = await Fweb3GameFactory.deploy(fweb3Token.address)
    await fweb3Game.deployed()

    // give game tokens for winners
    await fweb3Token.transfer(fweb3Game.address, utils.parseEther('1000000'))

    user1Fweb3Game = await fweb3Game.connect(user1)
    user2Fweb3Game = await fweb3Game.connect(user2)
    judgeFweb3Game = await fweb3Game.connect(judgeUser)
  })
  it('checks if an account has > 100 tokens', async () => {
    const hasEnoughTokens = await fweb3Game.hasTokens(user1.address)
    const notEnoughTokens = await fweb3Game.hasTokens(user2.address)
    expect(hasEnoughTokens).to.equal(true)
    expect(notEnoughTokens).be.false
  })

  it('errors if player seeks verification without enough tokens', async () => {
    let error: any
    const userFweb3Token = await fweb3Game.connect(user2)
    try {
      await userFweb3Token.seekVerification()
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Not enough tokens')).be.true
  })
  it('allows only owner to set a judge', async () => {
    let error: any
    await fweb3Game.addJudge(judgeUser.address)
    const userJudgeCheck = await fweb3Game.isJudge(judgeUser.address)
    expect(userJudgeCheck).be.true

    try {
      const userFweb3Game = await fweb3Game.connect(user1)
      await userFweb3Game.addJudge(judgeUser.address)
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Ownable: caller is not the owner')).be.true
  })
  it('lets allowed player to seek verification', async () => {
    const userFweb3Game = await fweb3Game.connect(user1)
    const tx = await userFweb3Game.seekVerification()
    const receipt = await tx.wait()
    expect(receipt.events[0].event).to.equal('PlayerSeeksVerification')
    
    const playerDetails = await fweb3Game.getPlayer(user1.address)
    expect(playerDetails.isSeekingVerification).be.true
  })

  it('only judges or owner can check judges', async () => {
    await fweb3Game.addJudge(judgeUser.address)
    const notJudge = await fweb3Game.isJudge(user1.address)
    const isJudge = await fweb3Game.isJudge(judgeUser.address)
    expect(notJudge).be.false
    expect(isJudge).be.true

    const judgeAccountGame = await fweb3Game.connect(judgeUser)
    const judgeChecksIsJudge = await judgeAccountGame.isJudge(judgeUser.address)
    expect(judgeChecksIsJudge).be.true
  })

  it('allows owner remove a judge', async () => {
    const judgeAddress = judgeUser.address
    await fweb3Game.addJudge(judgeAddress)
    const isJudge = await fweb3Game.isJudge(judgeAddress)
    expect(isJudge).be.true

    await fweb3Game.removeJudge(judgeAddress)
    const isJudgeAfterRemove = await fweb3Game.isJudge(judgeAddress)
    expect(isJudgeAfterRemove).be.false

    let error: any
    try {
      const userFweb3Game = await fweb3Game.connect(user1)
      await userFweb3Game.removeJudge(judgeAddress)
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Ownable: caller is not the owner')).be.true
  })

  it('verifys a player to win', async () => {
    const userFweb3Game = await fweb3Game.connect(user1)
    const tx = await userFweb3Game.seekVerification()
    const receipt = await tx.wait()
    const playerDetails = await fweb3Game.getPlayer(user1.address)
    expect(playerDetails.isSeekingVerification).be.true
    expect(receipt.events[0].event).to.equal('PlayerSeeksVerification')

    const verifyTX = await fweb3Game.verifyPlayer(user1.address)
    const verifyReceipt = await verifyTX.wait()
    const playerDetailsAfterVerify = await fweb3Game.getPlayer(user1.address)
    expect(playerDetailsAfterVerify.isSeekingVerification).be.false
    expect(playerDetailsAfterVerify.verifiedToWin).be.true
    expect(verifyReceipt.events[0].event).to.equal('PlayerVerifiedToWin')
  })
  it('wins the game', async () => {
    await fweb3Game.verifyPlayer(user1.address)
    const tx = await user1Fweb3Game.win()
    const receipt = await tx.wait()
    const player = await fweb3Game.getPlayer(user1.address)
    expect(player.hasWon).be.true
    expect(receipt.events[1].event).to.equal('PlayerWon')
  })
  it('wont win if not enough tokens', async () => {
    let error: any
    try {
      await user2Fweb3Game.win()
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Not enough tokens')).be.true
  })
  it('wont win if hasnt been verified', async () => {
    let error: any
    try {
      await user1Fweb3Game.win()
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Not verified by a judge')).be.true
  })

})
