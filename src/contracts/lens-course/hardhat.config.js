/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.17',
      },
      // {
      //   version: "0.4.8",
      // },
      // {
      //   version: "0.4.11",
      // },
      // {
      //   version: "0.4.24",
      // },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 10,
      },
    },
  },
};
