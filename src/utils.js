const { web3 } = require("./web3");
//                address                 |                private key
// Set this to null to use auto generated dataset
const dataset = null;

// Set this number to the number of accounts you want to generate
const accountCount = 20;

const removeByItem = (item, array) => {
  var index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
};

function copy(text) {
  navigator.clipboard.writeText(text);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getDataset = () => {
  return dataset ? manualDataSet() : autoDataSet();
};

const manualDataSet = () => {
  const datasetArray = dataset.split("|");
  let result = [];
  for (let i = 0; i < datasetArray.length; i++) {
    if (i % 2 === 0) {
      result.push({
        address: datasetArray[i].replace("\n", ""),
        private_key: i !== datasetArray.length - 1 ? datasetArray[i + 1] : "",
      });
    }
  }
  return result;
};

const autoDataSet = () => {
  let result = [];
  for (let i = 0; i < accountCount; i++) {
    const account = web3.eth.accounts.create();
    result.push({
      address: account.address,
      private_key: account.privateKey,
    });
  }
  return result;
};

module.exports = {
  getDataset,
  removeByItem,
  copy,
  sleep,
};
