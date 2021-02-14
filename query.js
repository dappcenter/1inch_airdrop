const { connection, provider } = require('./connections');
const { ethers, BigNumber, utils } = require('ethers');

const {
  airdrop_abi,
  erc20_abi,
  airdrop_addr,
  token_addr,
} = require('./constants');

const App = async () => {
  // check the latest block in the database;
  let sql = 'SELECT MAX(block) as latest from oneinch.airdrop;';
  let result = connection.query(sql);
  let blockHead = result[0].latest;
  console.log('latest block in database:', blockHead);

  // check all the claimed amount;
  sql = `SELECT SUM(amount) as total from oneinch.airdrop; `;
  result = connection.query(sql);

  console.log(
    'total claimed token:',
    parseFloat(result[0].total / 1e18).toFixed(2)
  );

  // check the balance in the merkeldrop contract
  let oneinch = new ethers.Contract(token_addr, erc20_abi, provider);
  result = await oneinch.functions.balanceOf(airdrop_addr);
  console.log(
    `remaining balance: ${parseFloat(utils.formatEther(result[0])).toFixed(2)}`
  );
};

App();
