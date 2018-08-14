// genetic algorithm

var gen_params ={
    SURVIVE_RATE : 30,   //percentage
    CHANCE_OF_MUTATION: 0.4
}

function GeneticAlgo(){
    this.generation_num = 1;
    this.units = [];
}

// initialize bird population
GeneticAlgo.prototype.init = function(){

    // feed the algo with birds and randomize their weights
    var i;
    for(i = 0; i < params.BIRD_NUM; i++){
        this.units[i] = new Bird();
        this.units[i].brain.mutate();
    }
}

// flock make decision and update pos
GeneticAlgo.prototype.flockUpdate = function(){

    var i;
    for(i = 0; i < params.BIRD_NUM; i++){

        if (!this.units[i].isDead){

            // calculate input parameters
            var distToNearestPipe = (pipes[nextUpperIdx].startPos - params.BIRD_X)/params.FRAME_WIDTH;
            var unitHeight = this.units[i].position.y/params.FRAME_HEIGHT;
            var lowerPipeLength = pipes[nextUpperIdx].length/params.FRAME_HEIGHT;

            // update fitness
            this.units[i].fitness += (1 + this.units[i].score);

            if(this.units[i].brain.feedforward(distToNearestPipe,unitHeight,lowerPipeLength)){
                this.units[i].velocity.y += params.FLAP_GAIN;
            }

            this.units[i].updatePos();
        }
    }
}

GeneticAlgo.prototype.nextGen = function(){
    
    // sort the birds according to their fitness (highest -> lowest)
    // ref: https://www.w3schools.com/jsref/jsref_sort.asp
    this.units.sort(
        function(a,b){
            return b.fitness - a.fitness;
        }
    );


    // kill off a certain percentage of the population based on fitness
    var survived_num = int(params.BIRD_NUM*gen_params.SURVIVE_RATE/100);
    var killoff_num = params.BIRD_NUM - survived_num;
    for (var i = 0; i < killoff_num; i++){
        this.units.pop();
    }

    // crossover to fill up the population
    for (var i = survived_num; i < params.BIRD_NUM; i++){

        //roulette wheel selection
        var parentA = int(random(0,survived_num));
        var parentB = int(random(0,survived_num));

        //make new birds
        this.units[i] = this._crossover(parentA, parentB);
    }

    // reset params for survived birds
    for (var i = 0; i < survived_num; i++)
        this.units[i].reset();

    this.generation_num++;
    console.log(this.generation_num);
}

GeneticAlgo.prototype._crossover = function(uDexA, uDexB){
    
    // default: uDexA has a higher fitness (swap if otherwise)
    if (this.units[uDexA].fitness < this.units[uDexB].fitness){
        var temp = uDexA;
        uDexA = uDexB;
        uDexB = temp;
    }
    
    var offspring = new Bird();
    offspring.brain.nodesNum = this.units[uDexA].brain.nodesNum;
    //console.log(this.units[uDexA].brain.size);

    for (var i = 0; i < offspring.brain.nodesNum; i++){
        if(i != params.NODE_OUTPUT){
            offspring.brain.edges[i] = [];
            for(var j in this.units[uDexA].brain.edges[i]){
                if(this.units[uDexB].brain.edges.hasOwnProperty(i) && this.units[uDexB].brain.edges[i].hasOwnProperty(j)){
                    if(random() > 0.5){
                        offspring.brain.edges[i][j] = this.units[uDexB].brain.edges[i][j];
                    }else{
                        offspring.brain.edges[i][j] = this.units[uDexA].brain.edges[i][j];
                    }
                }else
                    offspring.brain.edges[i][j] = this.units[uDexA].brain.edges[i][j];
            }
        }
    }

    if(random() <= gen_params.CHANCE_OF_MUTATION){
        offspring.brain.mutate();
    }

    return offspring;
}