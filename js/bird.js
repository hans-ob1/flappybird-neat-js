function Bird(){
    this.init();
}

Bird.prototype = {
    init: function(){
        this.score = 0;
        this.x = Params.game_manager.BIRD_INIT_X;
        this.y = Params.game_manager.BIRD_INIT_Y;
        this.speed = 0;
        this.isAlive = true;
    },

    flap: function(doFlap){
        if (this.isAlive && doFlap){
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
    }
}