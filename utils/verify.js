const { run } = require("hardhat")

run

async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (error) {
        if (error.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified")
        } else {
            console.error(error)
        }
    }

}

module.exports = { verify }