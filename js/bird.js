function Bird(){
    this.brain;
    this.init();
}

Bird.prototype = {
    init: function(){
        this.score = 0;
        this.x = Params.game_manager.BIRD_INIT_X;
        this.y = Params.game_manager.BIRD_INIT_Y;
        this.speed = 0;
        this.isAlive = true;
        this.fitness = 0;
    },

    flap: function(doFlap){
        if (this.isAlive){
            this.fitness += (1 + this.score*100);
            if (doFlap)
                this.speed = -Params.game_manager.BIRD_Y_SPEED;
        }
        this.speed += Params.game_manager.GRAVITY;
        this.y += this.speed;
    },

    hover: function(){
        if (this.y >= Params.game_manager.BIRD_HOVER_MAX_Y && this.speed >= 0){
            this.speed = -Params.game_manager.BIRD_HOVER_SPEED;
        }else if (this.y <= Params.game_manager.BIRD_HOVER_MIN_Y && this.speed <= 0){
            this.speed = Params.game_manager.BIRD_HOVER_SPEED;
        }

        this.speed += Params.game_manager.BIRD_HOVER_GRAVITY;
        this.y += this.speed;
    },

    getBirdHeight: function(){
        return this.y;
    }
}