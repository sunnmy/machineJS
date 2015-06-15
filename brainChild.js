process.on('message', function(message) {
  var startTime = Date.now();
  var path = require('path');
  var fs = require('fs');
  var brain = require('brain');
  console.log('inside a child_process');
  var stream = require('stream');

  var net = new brain.NeuralNetwork(); 

  var currentPath = message.pathToData;

  // create all the right streams to start an iteration of our brain. 
  var startBrain = function() {
    var readStream = fs.createReadStream(currentPath, {encoding:'utf8'});
    // setting objectMode: true means we can pass JS objects through to the train stream, rather than having to pass them as strings or buffers as we normally would have to. 
    var transformStream = new stream.Transform({objectMode: true});

    // This variable accounts for what happens when the incoming buffer ends in the middle of a line
    transformStream._partialLineData = '';

    // transforms a giant chunk of buffer object into individual JS objects, which we pass one at at time into our brain training stream in objectMode
    transformStream._transform = function (chunk, encoding, done) {
      var data = chunk.toString();
      data = this._partialLineData + data;

      var rows = data.split('\n');
      this._partialLineData = rows.splice( rows.length - 1, 1 )[0];

      for(var i = 0; i < rows.length; i++) {
        this.push(JSON.parse(rows[i]));
      }
      done();
    };

    transformStream._flush = function (done) {
      if (this._partialLineData) {
        this.push(this._partialLineData);
      }
      this._partialLineData = '';
      done();
    };

    // pipe our data from the file, into our transformStream, which turns it into a tidy stream of JS objects, into our trainStream (which we must leave open for the next iteration).
    readStream.pipe(transformStream).pipe(trainStream, {end: false});

    readStream.on('end', function() {
      trainStream.write(null);  
    });

  };

  var trainStream = net.createTrainStream({
    errorThresh: message.trainingObj.errorThresh,  // error threshold to reach
    iterations: message.trainingObj.iterations,    // maximum training iterations
    log: message.trainingObj.log,          // console.log() progress periodically
    logPeriod: message.trainingObj.logPeriod,       // number of iterations between logging
    learningRate: message.trainingObj.learningRate,   // learning rate
    
    // Write training data to the stream. Called on each training iteration.
    // Streams happen asynchronously. 
    floodCallback: function() {
      startBrain();
    },

     // Called when the network is done training.
     doneTrainingCallback: function(obj) {
      var trainingTime = Date.now() - startTime;
      console.log("trained in " + obj.iterations + " iterations with error: "
        + obj.error + "taking", trainingTime,"seconds.");
      // TODO: invoke bestNetChecker here. Well, we can't, because this thread is actually in a different memory space. 
      // TODO: write the fully trained net to a file. Save a path to that file. Make it in the same location as our inputData.txt file. 
      returnData = obj;
      // TODO: add our net to returnData
      returnData.net = net.toJSON();
      returnData.trainingTime = trainingTime;

      process.send(obj);
      // console.log('sent a message from the child!');
      // self.close();

      // TODO: send message (will this message include the JSON version of the net? probably)
      // TODO: write net to file
      // TODO: self.close after some time
        // Post MVP: set that time to be dependent on the size of the net
      }
    });

  startBrain();

});