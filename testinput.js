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

// random number generator based on number of hidden neuron
function randGen(n){
    var upperRange = 1/Math.sqrt(n);
    var randomNum = Math.random()*upperRange;
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


function Model(hidden_layer,output_layer){

    this.hiddenLayer = hidden_layer;
    this.outputLayer = output_layer;
    
}

Model.prototype.feedforward = function(inputArray){

    var i;
    var j;

    var hidden_neuron_output = [];
    var final_node_output = [];

    for (i = 0; i < this.hiddenLayer.length; i++){

        var sum_of_weights = 0;
        for (j = 0; j < inputArray.length; j++){
            sum_of_weights += this.hiddenLayer[i][j]*inputArray[j];
        }

        //sigmoid
        hidden_neuron_output.push(1/(1+Math.exp(-sum_of_weights)));
    }

    console.log(hidden_neuron_output);
}



function testFunc(){

    var hiddenlayer = construct_hidden(numInputs, numHiddenNeurons);
    var outputlayer = construct_output(numOutputs, numHiddenNeurons);

    test = new Model(hiddenlayer,outputlayer);

    test.feedforward([3,3,3]);

}