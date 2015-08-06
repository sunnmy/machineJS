module.exports = {
  createParamsToTest: function (numFeatures) {
    var allParamsToTest = [];
  // TODO: figure out some way of having fewer than 1 times the number of features as the node for each hidden layer. 
    // e.g., DilMil where we pruned out any feature that wasn't present in at least 1% of the dataset. 
      // technically, I grouped all those features together into something like "column5RareFeature = 1"
    var layersArray = [1,2,3,6,10];
    var nodesArray = [1,2,5,10,50,100];

    function createOneParamArray(numLayers,numNodes) {
      var outputArr = [];
      for (var i = 0; i < numLayers; i++) {
        outputArr.push(numNodes * numFeatures); //multiply this by the number of features. 
      }
      return outputArr;
    }

  // creates nodesArray.length nets for each item in layersArray
    for (var i = 0; i < layersArray.length; i++) {
      // create nets with up to nodesArray[i] * the number of features in the dataset
      for (var j = 0; j < nodesArray.length; j++) {
        allParamsToTest.push(createOneParamArray(layersArray[i],nodesArray[j]));
      }
    }
    console.log('allParamsToTest:',allParamsToTest);
    numOfNetsToTest = allParamsToTest.length;
    return allParamsToTest;
  }
}