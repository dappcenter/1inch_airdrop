const { connection } = require('./connections');
const { BigNumber, utils } = require('ethers');

const App = async () => {
  // check the latest block in the database;
  let sql = 'SELECT MAX(block) as latest from oneinch.airdrop;';
  let result = connection.query(sql);
  let blockHead = result[0].latest;
  console.log('latest block in database:', blockHead);

  // check all the claimed amount;
  let total = BigNumber.from('0');
  sql = `SELECT amount from oneinch.airdrop`;
  result = connection.query(sql);
  result.forEach((e) => {
    let amount = BigNumber.from(e.amount);

    total = total.add(amount);
  });

  console.log(
    'total claimed token:',
    parseFloat(utils.formatUnits(total, 'ether')).toFixed(2)
  );
};

App();
