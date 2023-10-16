import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    ganache: {
        url: 'http://localhost:7545',
        accounts: [
            '0xfc02eb04c430e8ce7e5afdeb579045d73ec158acf8d00532ef09c27130b1cbb9',
            '0xd0e3f2286024f9b9088c3e4ad162b85fefdc1322f76fb26d36de54de342356e8',
            '0x601a166a21b1ca5841049537015dac5537b0ec7fd364dcac335c101a51a06fe3',
            '0x0d31d2be7a69c5b0f1e2955dc8d8bef9089db2fe86bdf771118589263256efa3',
            '0x7bda628f5ef2435af0e101cc8bb407858cebe1015d95e612d628650c1e3a69fc'
      ],
    },
    // goerli: {
    //   url: 'https://goerli.infura.io/v3/e45c5cb64e5a4a6c9b6218358c529b65',
    //   accounts: [
    //       '0x66802bc37d3cfb38ff282b24d420280b5616554388432bd48457b65b0208abfb',
    //       '0x8f01ac58c592328b827eeb73a0f024475133088038845a29ac16c31a6c761927',
    //       '0xa78dd2aa256882a25fe5b929575f6f70c6e8b1872b22c1925274dee71596d940',
    //       '0x66e3792dc624ecafb28cc744762d63c6016ed29bc5c5bdf409ade7fc112a52ec',
    //       '0x172a483415c5e119f1ea336d44646572ac34a088e7bc2884f8e1f83da4cb304a'
    //   ]
    // },
    // sepolia: {
    //   url: 'https://sepolia.infura.io/v3/e45c5cb64e5a4a6c9b6218358c529b65',
    //   accounts: [
    //       '0x66802bc37d3cfb38ff282b24d420280b5616554388432bd48457b65b0208abfb',
    //       '0x8f01ac58c592328b827eeb73a0f024475133088038845a29ac16c31a6c761927',
    //       '0xa78dd2aa256882a25fe5b929575f6f70c6e8b1872b22c1925274dee71596d940',
    //       '0x66e3792dc624ecafb28cc744762d63c6016ed29bc5c5bdf409ade7fc112a52ec',
    //       '0x172a483415c5e119f1ea336d44646572ac34a088e7bc2884f8e1f83da4cb304a'
    //   ]
    // },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
},
};

export default config;
