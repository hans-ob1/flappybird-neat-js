
function Network(){
    this.nodesNum = net_params.INPUT_SIZE;
    this.nodes = [];
    this.edges = [];
}

Network.prototype.mutate = function(){

    // pick between 1 - nodesNum
    var sn = int(random(1,this.nodesNum+1));

    if (this.nodesNum > net_params.INPUT_SIZE)
        var fn = int(random(net_params.INPUT_SIZE+1, this.nodesNum+1));
    else
        var fn = net_params.NODE_OUTPUT

    // perform swap
    if (sn > fn && fn != net_params.NODE_OUTPUT){
        var temp = sn;
        sn = fn;
        fn = temp;
    }

    // check if two nodes are linked
    if (this.edges.hasOwnProperty(sn) && this.edges[sn].hasOwnProperty(fn)){
        if (random() > net_params.ADD_NODE_PROB){
            this.add_node(sn,fn);
        }else{
            this.change_edge_weights(sn,fn);
        }
    }else{
        this.add_edge(sn,fn);
    }
}

Network.prototype.feedforward = function(dist_to_pipe, bird_height, lower_pipe_len){

    // Feed input into the input nodes
    this.nodes[net_params.NODE_BIAS] = 1;
    this.nodes[net_params.NODE_PIPE_DIS] = dist_to_pipe;
    this.nodes[net_params.NODE_PIPE_LOWER] = lower_pipe_len;
    this.nodes[net_params.NODE_BIRD_HEIGHT] = bird_height;
    this.nodes[net_params.NODE_OUTPUT] = 0;

    var i;
    for (i = net_params.INPUT_SIZE + 1; i <= this.nodesNum; i++){
        this.nodes[i] = 0;
    }

    for (i = 1; i <= this.nodesNum; i++){

            if(i > net_params.INPUT_SIZE){
                this.nodes[i] = this.activation(this.nodes[i]);
            }

            for (var j in this.edges[i]){
                this.nodes[j] += this.nodes[i]*this.edges[i][j];
            }
    }


    return this.nodes[net_params.NODE_OUTPUT] > 0;
}

Network.prototype.add_node = function(a,b){
    this.edges[a][++this.nodesNum] = 1;
    this.edges[this.nodesNum] = this.edges[this.nodesNum] || [];
    this.edges[this.nodesNum][b] = this.edges[a][b];
    this.edges[a][b] = 0;
}

Network.prototype.add_edge = function(a,b){
    this.edges[a] = this.edges[a] || [];
    this.edges[a][b] = random(-1,1);
}

Network.prototype.change_edge_weights = function(a,b){
    this.edges[a][b] += random(-params.STEP_SIZE, params.STEP_SIZE);
}

Network.prototype.activation = function(x){
    // Sigmoid function
    return 1 / (1 + exp(-x));
}

