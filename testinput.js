//reference: https://threads-iiith.quora.com/Neuro-Evolution-with-Flappy-Bird-Genetic-Evolution-on-Neural-Networks

/*
 input:  height_bird = height of the bird
         dist_to_pipe = distance to nearest pipe
         height_pipe = Height of the nearest pipe

 hidden_weights: arr[7][3]
 output_weights: arr[1][7]
 activation_function: f(x) = (1/(1-e^-x))

 initalize weights: 1/sqrt(n), where n is the number of hidden neurons
*/


var numModels = 50;
var numInputs = 3;
var numHiddenNeurons = 7;
var numOutputs = 1;

var mutateProbability = 0.15;
var absRange = 1/Math.sqrt(numHiddenNeurons);

var model_pool = [];
for (var i = 0; i < numModels; i++){
    model_pool.push(new Model(construct_hidden(numInputs,numHiddenNeurons), construct_output(numOutputs,numHiddenNeurons)));
}



// random number generator based on number of hidden neuron
function randGen(n){
    var randomNum = Math.random()*absRange;
    if (Math.random() > 0.5){
        randomNum = -randomNum;
    }

    return randomNum;
}


// construct hidden layer template
function construct_hidden(numIn, numHidden){
    var i;
    var j;

    var hidden_layer = [];
    for (i = 0; i < numHidden; i++){
        var slot = []
        for (j = 0; j < numIn; j++){
            slot.push(randGen(numHidden));
        }
        hidden_layer.push(slot);
    }

    return hidden_layer;
}

// construct output layer template
function construct_output(numOut,numHidden){
    var i;
    var j;

    var output_layer = [];
    // more than one output
    for (i = 0; i < numOut; i++){
        var slot = [];
        for (j = 0; j < numHidden; j++){
            slot.push(randGen(numHidden));
        }
        output_layer.push(slot);
    }
    return output_layer;
}

// ---------------------------------------------------------------------------------------------------------------------------------------
// neural network model
function Model(hidden_layer,output_layer){
    this.hiddenLayer = hidden_layer;
    this.outputLayer = output_layer;
    
    this.isAlive = true;
    this.fitness = 0;
}

Model.prototype.feedforward = function(inputArray){

    var i;
    var j;

    var hidden_neuron_output = [];
    var final_node_output = [];

    //input to hidden
    for (i = 0; i < this.hiddenLayer.length; i++){

        var sum_of_weights = 0;
        for (j = 0; j < inputArray.length; j++){
            sum_of_weights += this.hiddenLayer[i][j]*inputArray[j];
        }

        //sigmoid
        hidden_neuron_output.push(1/(1+Math.exp(-sum_of_weights)));
    }

    //hidden to output
    for (i = 0; i < this.outputLayer.length; i++){

        var sum_of_outputs = 0;
        for (j = 0; j < hidden_neuron_output.length; j++){
            sum_of_outputs += this.outputLayer[i][j]*hidden_neuron_output[j];
        }

        //activation function
        final_node_output.push(1/(1+Math.exp(-sum_of_outputs)));
    }

    return final_node_output;
}

Model.prototype.updateFitness = function(){
    if (this.isAlive)
        this.fitness += 1;
}


// ---------------------------------------------------------------------------------------------------------------------------------------
// genetic part (swap the hidden layer)
function crossover(modelA_idx, modelB_idx){
    var hiddenLayerA = model_pool[modelA_idx].hiddenLayer;
    var hiddenLayerB = model_pool[modelB_idx].hiddenLayer;

    model_pool[modelA_idx].hiddenLayer = hiddenLayerB;
    model_pool[modelB_idx].hiddenLayer = hiddenLayerA;
}

function mutate(layer){

    var outerSize = layer.length;
    var innerSize = layer[0].length;

    var i;
    var j;
    for (i = 0; i < outerSize; i++){
        for(j = 0; j < innerSize; j++){

            if (Math.random() > 1-mutateProbability){
                var mutateValue = Math.random()*absRange;
                if (Math.random() > 0.5){
                    // induce 50% chance flip sign
                    mutateValue = -mutateValue;
                }
                layer[i][j] += mutateValue;               
            }
        }
    }

    return layer;
}

function predict(bird_height, dist_to_pipe, pipe_height, modex){

    // normalize all parameters
    var birdHeight = Math.min(CANVASHEIGHT,bird_height)/CANVASHEIGHT - absRange;
    var pipeDist = dist_to_pipe / MAXPIPEDIST - absRange;
    var pipeHeight = Math.min(CANVASHEIGHT, pipe_height)/CANVASHEIGHT - absRange;

    var input_to_model = [birdHeight,pipeDist,pipeHeight]
    var output_prob = model_pool[modex].feedforward(input_to_model);

    //flap
    if (output_prob[0] >= 0.5){
        return 1
    }

    //dont flap
    return 0;
}

//called when all birds died
function endgameHandler(){

}


function testFunc(){

    var hiddenlayer = construct_hidden(numInputs, numHiddenNeurons);
    var outputlayer = construct_output(numOutputs, numHiddenNeurons);

    test = new Model(hiddenlayer,outputlayer);

    test.feedforward([3,3,3]);

}