// database indexer script

const { ethers, utils } = require('ethers');
const {
  airdrop_abi,
  erc20_abi,
  airdrop_addr,
  token_addr,
} = require('./constants');

const { connection, provider } = require('./connections');

const AIRDROP_FROM = 11841193;
const QUERY_INTERVAL = 100;

const App = async () => {
  let airdrop = new ethers.Contract(airdrop_addr, airdrop_abi, provider);

  let filter = await airdrop.filters.Claimed();

  let nowBlock = await provider.getBlockNumber();

  let result = connection.query(
    'SELECT MAX(block) as latest from oneinch.airdrop;'
  );
  let latestFromBlock = result[0].latest;

  let indexBlock =
    latestFromBlock === 'undefined' ? AIRDROP_FROM : latestFromBlock + 1;

  console.log('latestFromBlock:', latestFromBlock);
  console.log('indexBlock:', indexBlock);

  let queryDone = false;
  let total = 0;
  while (!queryDone) {
    let from = indexBlock;
    let to = indexBlock + QUERY_INTERVAL;
    if (to >= nowBlock) {
      to = nowBlock;
      queryDone = true;
    }

    console.group(`recording from ${from} to ${to}`);

    let events = await airdrop.queryFilter(filter, from, to);
    total = total + events.length;
    events.forEach(async (e) => {
      console.log('process block:', e.blockNumber);
      await processClaimEvent(e);
    });

    indexBlock = indexBlock + QUERY_INTERVAL + 1;
    console.groupEnd();
  }

  console.log('history record done. total:', total);

  // airdrop.on(filter, (log, event, test) => {
  //   console.log(log);
  //   console.log(event);
  //   console.log(test);
  // });

  provider.on(filter, async (log) => {
    console.log(log);
    events = await airdrop.queryFilter(
      filter,
      log.blockNumber,
      log.blockNumber
    );
    events.forEach(async (e) => {
      await processClaimEvent(e);
    });
  });
};

const processClaimEvent = async (e) => {
  // console.group('transaction hash:', e.transactionHash.toLowerCase());
  // console.log('block:', e.blockNumber);
  // console.log('merkle index:', e.args.index.toString());
  // console.log('receipient:', e.args.account);
  // console.log('amount:', e.args.amount.toString());
  // console.groupEnd();

  // query first
  let result = connection.query(
    `SELECT * FROM oneinch.airdrop where blockHash = '${e.transactionHash.toLowerCase()}'`
  );

  // if no duplicate
  if (result.length == 0) {
    // get timestamp
    let block = await provider.getBlock(e.blockNumber);
    let timestamp = block.timestamp;

    let sql = `INSERT INTO oneinch.airdrop (block, blockHash, merkleId, account, amount, timestamp) VALUES (${
      e.blockNumber
    },'${e.transactionHash.toLowerCase()}',${
      e.args.index
    },'${e.args.account.toLowerCase()}','${e.args.amount.toString()}',${timestamp})`;
    //console.log(sql);
    try {
      connection.query(sql);
    } catch (err) {
      console.log(err);
    }
  }
};

App();
