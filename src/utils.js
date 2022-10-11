//                address                 |                private key
const dataset = `
0x9214F8F5fc89FB7baCE5d6Cd7316EdFEcd53E78b|0xdb3448019c147d92301c61439b4382c6ab6e99f90e36512095539fb4fc670ccb|
`

const removeByItem = (item, array) => {
  var index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

function copy(text) {
  navigator.clipboard.writeText(text);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getDataset = () => {
  const datasetArray = dataset.split('|')
  let result = []
  for (let i = 0; i < datasetArray.length; i++) {
    if (i % 2 === 0) {
      result.push({
        address: datasetArray[i].replace('\n', ''),
        private_key: i !== datasetArray.length - 1 ?  datasetArray[i + 1] : ''
      })
    }
  }
  return result
}

module.exports = {
  getDataset,
  removeByItem,
  copy,
  sleep
}