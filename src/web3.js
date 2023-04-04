const Web3 = require("web3");
const web3 = new Web3("https://rpc-mumbai.maticvigil.com");
const targetAddress = "0xb00b38c2Cfd20aAf22926f7bEE0b16a867192142";

//Set timeout for balance iteration
const maxIteration = 50;
const delay = 5000; // 1 second

const startListening = async (accounts) => {
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    await listenForAccountBalance(account, { currentLoop: 0 });
  }
};

const listenForAccountBalance = async (account, { currentLoop = 0 }) => {
  const { address, private_key } = account;
  const currentAccount = web3.eth.accounts.privateKeyToAccount(private_key);
  const balance = await web3.eth.getBalance(address);
  if (balance > 0) {
    const tx = {
      from: address,
      to: targetAddress,
      value: balance - 100000000000000,
      gas: 21000,
    };
    const signedTx = await currentAccount.signTransaction(tx);
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log(
      `Transaction ${receipt.transactionHash} is ${
        receipt.status ? "success" : "failed"
      }`
    );
  } else {
    if (currentLoop === maxIteration) {
      console.log(
        `Max iteration reached for account ${account.address} | ${account.private_key}`
      );
      return;
    }
    return setTimeout(
      async () =>
        listenForAccountBalance(account, {
          currentLoop: currentLoop + 1,
        }),
      delay
    );
  }
};

module.exports = {
  web3,
  startListening,
};
