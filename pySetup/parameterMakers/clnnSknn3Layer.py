def makeParams(X, y, globalArgs, dev):

    # TODO: figure out more interesting parameters to try
        # follow a similar pattern to what we did for brainjs, basing the number of nodes on the size of the input
        # test number of hidden layers
    # TODO: break out each type into it's own classifier
    numFeatures = len( X[0] )
    parameters_to_try = {
        'learning_rate': [0.001, 0.01, 0.1, 0.3],
        'hidden0__units': [ numFeatures / 2, numFeatures, numFeatures * 3 ],
        'hidden1__units': [ numFeatures / 2, numFeatures, numFeatures * 3 ],
        'hidden2__units': [ numFeatures / 2, numFeatures, numFeatures * 3 ]
    }

    # if dev:
    #     parameters_to_try.pop('learning_rate', None)
    #     parameters_to_try.pop('hidden0__units', None)
        
    return parameters_to_try