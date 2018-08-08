// genetic algorithm

var gen_params ={
    SURVIVE_RATE : 50   //percentage
}

function GeneticAlgo(){
    this.generation_num = 1;
    this.units = [];
    this.total_fitness = 0;
}

GeneticAlgo.prototype.init = function(){

    // feed the algo with birds and randomize their weights
    var i;
    for(i = 0; i < params.BIRD_NUM; i++){
        this.units[i] = new Bird();
        this.units[i].brain.mutate();
    }
}

GeneticAlgo.prototype.nextGen = function(){
    
    // sort the birds according to their fitness (highest -> lowest)
    // https://www.w3schools.com/jsref/jsref_sort.asp
    this.units.sort(
        function(a,b){
            return b.fitness - a.fitness;
        }
    );

    // calculate survived numbers
    var survived_num = int(params.BIRD_NUM*gen_params.SURVIVE_RATE/100);
    var killoff_num = params.BIRD_NUM - survived_num;
    for (var i = 0; i < killoff_num; i++){
        this.units[i].pop();
    }

    // create cummlative function
    for (var i = 0; i < units.length; i++){
        units[i].fitness /= 
    }

    // crossover
    for (var i = survived_num; i < params.BIRD_NUM; i++){
        this.units[i] = 
    }

}

GeneticAlgo.prototype._getTotalFitness = function(){

}





