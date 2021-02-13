const { ethers, utils } = require('ethers');
const { airdrop_abi, erc20_abi } = require('./abi');
const airdrop_addr = '0x4ee7c0F5480Eb1EDd8902a5E8b991ed52992d5f5';
const token_addr = '0x111111111117dc0aa78b770fa6a738034120c302';

const provider = new ethers.providers.InfuraProvider(
  'mainnet',
  '706c18550c6b4a1c97cc21d90f23018b'
);

const abi = [
  'event Transfer(address indexed src, address indexed dst, uint val)',
];

const App = async () => {
  let airdrop = new ethers.Contract(airdrop_addr, airdrop_abi, provider);
  let oneinch = new ethers.Contract(token_addr, abi, provider);

  let filter = await airdrop.filters.Claimed();

  // query claim events
  let events = await airdrop.queryFilter(filter, 11849798);
  console.log(events.length);

  // events.forEach((e) => {
  //   console.log(e.blockHash);
  // });

  // let filter = {
  //   address: token_addr,
  //   topics: [utils.id('Transfer(address,address,uint256)')],
  // };

  // let event = 'Claimed (uint256, address, uint256)';

  // // let topic = utils.id(
  // //   'Claimed (uint256 index, address account, uint256 amount)'
  // // );
  // // provider.on(filter, (log, event) => {
  // //   console.log(log);
  // //   console.log(event);
  // // });

  // // let data = await airdrop.filters.Claimed();
  // // console.log(data);

  // oneinch.queryFilter(filter, 11649798);
  // console.log(data);
};

App();
