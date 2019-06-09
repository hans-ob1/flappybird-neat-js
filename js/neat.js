/*
    Contains NEAT Algorithm for AI part
*/

Constant = {
    // Network Params
    IDX_BIAS: 1,
    IDX_PIPE_DIST: 2,
    IDX_PIPE_TOP: 3,
    IDX_BIRD_HEIGHT: 4,
    IDX_PIPE_SPEED: 5,
    IDX_OUTPUT: 0,

    NUM_INPUTS: 5,
    STEPSIZE: 0.05,
    ADDNODE_PROB: 0.5,

    // Generation Params
    POPULATION: 30,
    SURVIVORS: 10,
    MUTATE_PROB: 0.3
}

// Neural Network that controls each bird
function Network() {
    this.size_of_nodes = Constant.NUM_INPUTS;
    this._nodes = [];
    this._edges = [];
}

Network.prototype = {
    mutate: function(){
        var node_start = Math.ceil(Math.random() * this.size_of_nodes);
        var node_end = Math.ceil(Math.random() * (this.size_of_nodes + 1 - Constant.NUM_INPUTS)) + Constant.NUM_INPUTS;

        // bound to output if exceed
        if (node_end > this.size_of_nodes){
            node_end = Constant.IDX_OUTPUT;
        }

        if (node_start > node_end){
            if (node_end != Constant.IDX_OUTPUT){
                var temp = node_start;
                node_start = node_end;
                node_end = temp;
            }
        }

        if (this._edges.hasOwnProperty(node_start) && this._edges[node_start].hasOwnProperty(node_end)) {
            if (Math.random() < Constant.ADDNODE_PROB) {
                this._addNode(node_start, node_end);
            } else {
                this._changeWeight(node_start, node_end);
            }
        } else {
            this._addEdge(node_start, node_end);
        }
    },

    _activation: function(x){
        return Math.max(0, x);
    },

    _changeWeight: function(node_start, node_end){
        this._edges[node_start][node_end] += (Math.random() * Constant.STEPSIZE * 2) - Constant.STEPSIZE;
    },

    _addEdge: function(node_start, node_end){
        this._edges[node_start] = this._edges[node_start] || [];
        this._edges[node_start][node_end] = Math.random() * 2 - 1;
    },

    _addNode: function(node_start, node_end){
        this._edges[node_start][++this.size_of_nodes] = 1;
        this._edges[this.size_of_nodes] = this._edges[this.size_of_nodes] || [];
        this._edges[this.size_of_nodes][node_end] = this._edges[node_start][node_end];
        this._edges[node_start][node_end] = 0;
    },

    forwardFlow: function(pipe_distance, pipe_height, bird_height, pipe_gap, pipe_speed){

        // return true or false for performing an action
        this._nodes[Constant.IDX_BIAS] = 1;
        this._nodes[Constant.IDX_PIPE_DIST] = pipe_distance;
        this._nodes[Constant.IDX_PIPE_TOP] = (bird_height - pipe_height)/Params.frame_updater.HEIGHT_OF_SCREEN;
        this._nodes[Constant.IDX_BIRD_HEIGHT] =((pipe_height + pipe_gap) - bird_height)/Params.frame_updater.HEIGHT_OF_SCREEN;
        this._nodes[Constant.IDX_PIPE_SPEED] = pipe_speed/Params.frame_updater.HEIGHT_OF_SCREEN;
        this._nodes[Constant.IDX_OUTPUT] = 0;

        for (var i = Constant.NUM_INPUTS + 1; i <= this.size_of_nodes; i++)
            this._nodes[i] = 0;

        for (var i = 1; i <= this.size_of_nodes; i++){
            if (i > Constant.NUM_INPUTS){
                this._nodes[i] = this._activation(this._nodes[i]);
            }
            for (var j in this._edges[i]){
                this._nodes[j] += this._nodes[i]*this._edges[i][j];
            }
        }
        return this._nodes[Constant.IDX_OUTPUT] > 0;
    }
}

function Generation(){
    this.gen_num = 1;
    this.population = [];
    for (var i = 0; i < Constant.POPULATION; i++){
        this.population[i] = new Bird();
        this.population[i].brain = new Network();
        this.population[i].brain.mutate();
    }
}

Generation.prototype = {

    getSummary: function(){

        this.population.sort(function(a,b){
            return b.fitness - a.fitness;
        });

        // keep top surviving birds and kill the rest
        for (var i = Constant.SURVIVORS; i < Constant.POPULATION; i++){
            this.population[i] = null;
            delete this.population[i];
        }

        // conduct crossover on top winners
        for (var i = Constant.SURVIVORS; i < Constant.POPULATION; i++){
            this.population[i] = this._crossover(Math.floor(Math.random() * Constant.SURVIVORS), Math.floor(Math.random() * Constant.SURVIVORS));
        }

        // reset params on top winners
        for (var i = 0; i < Constant.SURVIVORS; i++){
            this.population[i].init();
        }

        this.gen_num++;
    },

    getBestBrain: function(){

        // get current best brain
        var best_bird_idx = -1;
        var best_bird_fitness = 0;
        for (var i = 0; i < Constant.POPULATION; i++){
            if (this.population[i].fitness > best_bird_fitness){
                best_bird_fitness = this.population[i].fitness;
                best_bird_idx = i;
            }
        }

        if (best_bird_idx === -1){
            return null;
        }else{
            return this.population[best_bird_idx].brain;
        }

    },

    triggerFlap: function(){
        for (var i = 0; i < Constant.POPULATION; i++){
            if (this.population[i].isAlive){
                if (this.population[i].brain.forwardFlow(game_manager.getNearestPipeDist(),game_manager.getNearestPipeHeight(),this.population[i].getBirdHeight(),game_manager.getNearestPipeGap(), game_manager.getNearestPipeSpeedY())){
                    this.population[i].flap(true);
                }else{
                    this.population[i].flap(false);
                }
            }
        }
    },

    _crossover: function(parentA, parentB){

        var child = new Bird();
        child.brain = new Network();
        if (this.population[parentA].fitness < this.population[parentB].fitness){
            // swap
            var temp = parentA;
            parentA = parentB;
            parentB = temp;
        }

        // adopt the stronger parent characteristics
        child.brain.size_of_nodes = this.population[parentA].brain.size_of_nodes;
        for (var i = 1; i <= child.brain.size_of_nodes; i++){
            child.brain._edges[i] = [];
            for (var j in this.population[parentA].brain._edges[i]){
                if (this.population[parentB].brain._edges.hasOwnProperty(i) && this.population[parentB].brain._edges[i].hasOwnProperty(j)){
                    if (Math.random() < 0.5){
                        child.brain._edges[i][j] = this.population[parentA].brain._edges[i][j];
                    }
                    else{
                        child.brain._edges[i][j] = this.population[parentB].brain._edges[i][j];
                    }
                }else{
                    child.brain._edges[i][j] = this.population[parentA].brain._edges[i][j];
                }

            }
        }

        if (Math.random() <= Constant.MUTATE_PROB)
            child.brain.mutate();

        return child;
    }
}
