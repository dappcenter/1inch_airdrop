// query my own sql database
const MySql = require('sync-mysql');
const { ethers, utils } = require('ethers');
require('dotenv').config();

const dbKeys = {
  host: process.env.HOST,
  user: process.env.USERID,
  password: process.env.PASSWORD,
  port: process.env.PORT,
};

const connection = new MySql(dbKeys);

const provider = new ethers.providers.InfuraProvider(
  'mainnet',
  process.env.INFURA
);

module.exports.connection = connection;
module.exports.provider = provider;
