const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")


!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
        let fundMe
        let deployer
        let mockV3Aggregator
        let sendValue = ethers.parseEther("1")
        beforeEach(async function () {
            // deploy FundMe contract using hardhat deploy
            // const accounts = await ethers.getSigners()
            // const accountZero = accounts[0]
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            fundMe = await ethers.getContract("FundMe", deployer)
            mockV3Aggregator = await ethers.getContract(
                "MockV3Aggregator",
                deployer
            )
        })

        describe("constructor", async function () {
            it("Sets the aggregator addresses correctly", async function () {
                const response = await fundMe.getPriceFeed()
                assert.equal(response, await mockV3Aggregator.getAddress())
            })

        })

        describe("fund", async function () {
            it("Fails if the amount is not enough", async function () {
                await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")
            })

            it("updated the amount funded data structure", async () => {
                await fundMe.fund({ value: sendValue })
                const response = await fundMe.getAddressToAmountFunded(deployer)
                assert.equal(response.toString(), sendValue.toString())
            })

            it("Adds funder to array of funders", async () => {
                await fundMe.fund({ value: sendValue })
                const funder = await fundMe.getFunders(0)
                assert.equal(funder, deployer)
            })



        })

        describe("withdraw", async () => {
            beforeEach(async () => {
                await fundMe.fund({ value: sendValue })
            })

            it("Withdraw ETH from a single funder", async () => {
                const startingBalance = await ethers.provider.getBalance(fundMe.target)
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)
                const transactionResponse = await fundMe.withdraw()
                const transactionReceipt = await transactionResponse.wait(1)

                const endingBalance = await ethers.provider.getBalance(fundMe.target)
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)

                assert.equal(endingBalance, 0)
                assert.equal((startingBalance + startingDeployerBalance), (endingDeployerBalance + transactionReceipt.fee).toString())
            })

            it("allows us to withdrax with multiple funders", async () => {
                const accounts = await ethers.getSigners()
                for (let i = 1; i < 5; i++) {
                    const fundMeConnectedContract = fundMe.connect(accounts[i])
                    await fundMeConnectedContract.fund({ value: sendValue })

                }
                const startingBalance = await ethers.provider.getBalance(fundMe.target)
                const startingDeployerBalance = await ethers.provider.getBalance(deployer)


                const transactionResponse = await fundMe.withdraw()
                const transactionReceipt = await transactionResponse.wait(1)

                const endingBalance = await ethers.provider.getBalance(fundMe.target)
                const endingDeployerBalance = await ethers.provider.getBalance(deployer)



                assert.equal(endingBalance, 0)
                assert.equal((startingBalance + startingDeployerBalance), (endingDeployerBalance + transactionReceipt.fee).toString())
                await expect(fundMe.getFunders(0)).to.be.reverted

                for (i = 1; i < 5; i++) {

                    assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address), 0)
                }


            })

            it("Only owners to withdraw", async () => {
                const accounts = await ethers.getSigners()
                const attackr = accounts[1]
                const attackerConnectedContract = await fundMe.connect(attackr)
                await expect(attackerConnectedContract.withdraw()).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
            })
        })

    })