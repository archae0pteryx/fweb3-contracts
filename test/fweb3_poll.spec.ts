import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { Contract, ContractFactory, utils } from 'ethers'
import { ethers } from 'hardhat'

let fweb3Poll: Contract,
  fweb3Token: Contract,
  owner: SignerWithAddress,
  user1: SignerWithAddress,
  user2: SignerWithAddress,
  user1Fweb3Poll: Contract,
  user2Fweb3Poll: Contract

describe('Fweb3 Poll Contract', () => {
  beforeEach(async () => {
    ;[owner, user1, user2] = await ethers.getSigners()
    const Fweb3ContractFactory: ContractFactory = await ethers.getContractFactory('Fweb3Token')
    fweb3Token = await Fweb3ContractFactory.deploy()
    await fweb3Token.deployed()
    await fweb3Token.transfer(user1.address, utils.parseEther('100'))
    const Fweb3PollContractFactory: ContractFactory = await ethers.getContractFactory(
      'Fweb3Poll'
    )
    fweb3Poll = await Fweb3PollContractFactory.deploy(fweb3Token.address)
    await fweb3Token.deployed()

    user1Fweb3Poll = await fweb3Poll.connect(user1)
    user2Fweb3Poll = await fweb3Poll.connect(user2)
  })
  it('can vote yes', async () => {
    await user1Fweb3Poll.voteYes()
    const hasVoted: boolean = await fweb3Poll.hasVoted(user1.address)
    const numVoters: number = await fweb3Poll.getNumVoters()
    expect(hasVoted).be.true
    expect(numVoters).to.eq(1)
  })
  it('can vote no', async () => {
    await user1Fweb3Poll.voteNo()
    const hasVoted: boolean = await fweb3Poll.hasVoted(user1.address)
    const numVoters: number = await fweb3Poll.getNumVoters()
    expect(hasVoted).be.true
    expect(numVoters).to.eq(1)
  })

  it('doesnt let a vote if not enough tokens', async () => {
    let error: any
    try {
      await user2Fweb3Poll.voteYes()
    } catch (e) {
      error = e
    }
    expect(error.message.includes('Need 100 FWEB3 tokens to vote')).be.true
  })
  it('doesnt let a vote if already voted', async () => {
    await user1Fweb3Poll.voteYes()
    let error: any
    try {
      await user1Fweb3Poll.voteYes()
    } catch (e) {
      error = e
    }
    expect(error.message.includes('You already voted')).be.true
  })

  it('gets correct vote percentage', async () => {
    await fweb3Token.transfer(user2.address, utils.parseEther('100'))
    await user1Fweb3Poll.voteYes()
    await user2Fweb3Poll.voteNo()
    const yesPercentage: number = await fweb3Poll.getYesPercentage()
    expect(yesPercentage).to.eq(50)
  })
})
