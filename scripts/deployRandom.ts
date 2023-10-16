import {ethers} from "hardhat";
import * as fs from "fs";

async function main() {
    const network: any = process.env.HARDHAT_NETWORK;
    console.log('Deploy Random...')
    const Random = await ethers.getContractFactory("Random");
    const random = await Random.deploy();
    await random.deployed();

    // save the addresses
    const addresses = {
        Random: random.address
    }
    console.log(addresses)
    fs.writeFile(`randomContractAddress-${network}.json`, JSON.stringify(addresses, undefined, 4), err => {
        if (err) console.log('Write file error: ' + err.message)
        else console.log(`Addresses is saved into address-${network}.json...`)
    })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
