//reference: https://threads-iiith.quora.com/Neuro-Evolution-with-Flappy-Bird-Genetic-Evolution-on-Neural-Networks


var totalModels = 5;
var LEARNING_RATE = 0.01;
var model_pool = [];

//create a model
var i;
for (i = 0; i < 5; i++){
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 7,
                            activation: 'sigmoid',
                            inputDim: 3
                            }));
    model.add(tf.layers.dense({units: 1,
                            activation: 'sigmoid',
                            }));
    const optimizer = tf.train.sgd(LEARNING_RATE);
    model.compile({optimizer, loss: 'meanSquaredError', metrics: ["accuracy"]});
    model_pool.push(model);
}

function crossover(modexA, modexB){
    var weightsA = model_pool[modexA].layers[0].getWeights();
    var weightsB = model_pool[modexB].layers[0].getWeights();

    console.log(weightsA);

    var newWeightsA = weightsA;
    var newWeightsB = weightsB;

    newWeightsA[0] = weightsB[0];
    newWeightsB[0] = weightsA[0];
    
    model_pool[modexA].layers[0].setWeights(newWeightsA);
    model_pool[modexB].layers[0].setWeights(newWeightsB);
}

function mutate(weights){
    crossover(0,1);
}
