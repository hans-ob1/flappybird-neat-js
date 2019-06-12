function GameManager(){
    this.gameover = true;
    this.curr_score = 0;

    // game elements
    this.pipe_x_pos = [];
    this.pipe_y_height = [];

    // adverse
    this.pipe_nature = [];
    this.pipe_y_speed = [];
    this.pipe_gap = [];

    this.nearest_pipe = Params.game_manager.NUM_OF_PIPES;

    // ai params
    this.generation = new Generation();
    this.champion_ai = new Bird();
}

GameManager.prototype = {

    startGame: function() {
        
        this.curr_score = 0;
        this.pipe_x_pos = [];
        this.pipe_y_height = [];

        // human play
        if (Params.game_manager.PLAY_MODE === 0 || Params.game_manager.PLAY_MODE === 2){
            this.solo_bird = new Bird();

            if (Params.game_manager.PLAY_MODE === 2){
                this.champion_ai.init();
            }
        }
        // AI play
        else if (Params.game_manager.PLAY_MODE === 1){
            this.gameover = false;
            this.numAlive = Constant.POPULATION;
        }

        if (!this.gameover){
            // Initialize the position of pipes
            for (var i = 0; i < Params.game_manager.NUM_OF_PIPES; i++){
                this.pipe_x_pos[i] = (Params.frame_updater.WIDTH_OF_SCREEN + Params.game_manager.WIDTH_OF_PIPE) * (Params.game_manager.PIPE_SPACING_PERCENTAGE*i + 1);
                this.pipe_y_height[i] = this._getPipeHeight();

                // adversal
                if (Params.game_manager.ADVERSE_MODE === 1){

                    // ballot scenario number
                    this.pipe_nature[i] = Math.floor((Math.random() * 4));

                    // set initial pipe movement speed
                    if (Math.random() > 0.5)
                        this.pipe_y_speed[i] = 0.4*Params.game_manager.PIPE_Y_SPEED;
                    else
                        this.pipe_y_speed[i] = -0.4*Params.game_manager.PIPE_Y_SPEED;

                    // randomize pipe gap
                    this.pipe_gap[i] = Math.floor(0.8*Params.game_manager.GAP_PIPE + Math.random() * 40);
                }else{
                    this.pipe_gap[i] = Params.game_manager.GAP_PIPE;
                }
            }
            this.pipe_x_pos[Params.game_manager.NUM_OF_PIPES] = Number.MAX_VALUE;
        }        

        this.timerGame();
        frame_updater.initFrame();
    },

    updateGame: function(){

        if (Params.game_manager.PLAY_MODE === 0 || Params.game_manager.PLAY_MODE === 2){
            if (!this.gameover){
                this._movePipeX();
                this._findNearestPipe();
                this._moveBird();
            }else{
                this.solo_bird.hover();     // hover
                this.champion_ai.hover();
            }
        }else if (Params.game_manager.PLAY_MODE === 1){
            if (!this.gameover){
                this._movePipeX();
                this._findNearestPipe();
                this._moveBird();
                
                if(Params.game_manager.PRINT_BRAIN){ 
                    // inject brain to champion
                    this.champion_ai.brain = this.generation.getBestBrain();
                    Params.game_manager.PRINT_BRAIN = false;

                    console.log(this.champion_ai.brain);
                }
            }
        }

        this._checkGameStatus();

        // update the frame for each cycle
        frame_updater.updateFrame();        
    },

    timerGame: function(){
        var self = this;
        if (timer) {
            clearInterval(timer);
        }

        timer = setInterval(
            function(){
                self.updateGame();
            },
            Params.frame_updater.FRAME_RATE //measured in miliseconds
        )
    },

    getNearestPipeDist: function(){
        return (this.pipe_x_pos[this.nearest_pipe] - Params.game_manager.BIRD_INIT_X) / (Params.frame_updater.WIDTH_OF_SCREEN / 2);
    },

    getNearestPipeHeight: function(){
        return this.pipe_y_height[this.nearest_pipe];
    },

    getNearestPipeGap: function(){
        return this.pipe_gap[this.nearest_pipe];
    },

    getNearestPipeSpeedY: function(){
        if(Params.game_manager.ADVERSE_MODE)
            return this.pipe_y_speed[this.nearest_pipe];
        else
            return 0;
    },

    _getPipeHeight: function(){
        return Math.floor(Math.random() * (Params.game_manager.POS_MAX_Y_PIPE - Params.game_manager.POS_MIN_Y_PIPE)) + Params.game_manager.POS_MIN_Y_PIPE;
    },

    _movePipeX: function(){

        for (var i = 0; i < Params.game_manager.NUM_OF_PIPES; i++){

            // update pipe position
            this.pipe_x_pos[i] -= Params.game_manager.BIRD_X_SPEED;
            
            // ** adverse mode
            if (Params.game_manager.ADVERSE_MODE === 1){
                if (this.pipe_nature[i] === 0){
                    // normal

                }else if (this.pipe_nature[i] === 1){
                    // move pipe down (situation 1)
                    if (this.pipe_y_height[i] < Params.game_manager.POS_MAX_Y_PIPE + Params.game_manager.POS_MIN_Y_PIPE/2){
                        this.pipe_y_speed[i] = 0.4*Params.game_manager.PIPE_Y_SPEED;
                    }else{
                        this.pipe_y_speed[i] = 0;
                    }

                    this.pipe_y_height[i] += this.pipe_y_speed[i];

                }else if (this.pipe_nature[i] === 2){
                    // move pipe up (situation 2)
                    if (this.pipe_y_height[i] > Params.game_manager.POS_MIN_Y_PIPE/2){
                        this.pipe_y_speed[i] = -0.4*Params.game_manager.PIPE_Y_SPEED;
                    }else{
                        this.pipe_y_speed[i] = 0;
                    }

                    this.pipe_y_height[i] += this.pipe_y_speed[i];

                }else{
                    // move up and down (situation 3)
                    if (this.pipe_y_height[i] < Params.game_manager.POS_MIN_Y_PIPE/2 && this.pipe_y_speed[i] < 0){
                        this.pipe_y_speed[i] = 0.4*Params.game_manager.PIPE_Y_SPEED;
                    }
                    else if (this.pipe_y_height[i] > Params.game_manager.POS_MAX_Y_PIPE + Params.game_manager.POS_MIN_Y_PIPE/2 && this.pipe_y_speed[i] > 0){
                        this.pipe_y_speed[i] = -0.4*Params.game_manager.PIPE_Y_SPEED;
                    }
                    this.pipe_y_height[i] += this.pipe_y_speed[i];
                }
            }

            // update if the pipe past the screen
            if (this.pipe_x_pos[i] <= -Params.game_manager.WIDTH_OF_PIPE){
                this.pipe_x_pos[i] = (Params.frame_updater.WIDTH_OF_SCREEN + Params.game_manager.WIDTH_OF_PIPE) * Params.game_manager.PIPE_SPACING_PERCENTAGE *  Params.game_manager.NUM_OF_PIPES - Params.game_manager.WIDTH_OF_PIPE;
                this.pipe_y_height[i] = this._getPipeHeight();

                // ** adverse mode
                if (Params.game_manager.ADVERSE_MODE === 1){
                    this.pipe_nature[i] = Math.floor((Math.random() * 4));
                    if (Math.random() > 0.5)
                        this.pipe_y_speed[i] = 0.4*Params.game_manager.PIPE_Y_SPEED;
                    else
                        this.pipe_y_speed[i] = -0.4*Params.game_manager.PIPE_Y_SPEED;

                    this.pipe_gap[i] = Math.floor(0.9*Params.game_manager.GAP_PIPE + Math.random() * 40);
                }else{
                    this.pipe_gap[i] = Params.game_manager.GAP_PIPE;
                }
            }
        }

        // track scoring
        if (this.pipe_x_pos[this.nearest_pipe] < Params.game_manager.BIRD_INIT_X - Params.game_manager.WIDTH_OF_PIPE - Params.game_manager.BIRD_RADIUS)
            this.curr_score++;
    },

    _moveBird: function(){
        if (Params.game_manager.PLAY_MODE === 0 || Params.game_manager.PLAY_MODE === 2){   // human play or human vs ai

            this.solo_bird.flap(false);
            if (this.solo_bird.isAlive){

                // update the bird score
                this.solo_bird.score = this.curr_score;

                // bird hit the platform
                if (this.solo_bird.y + Params.game_manager.BIRD_RADIUS >= Params.game_manager.PlATFORM_Y){
                    this.solo_bird.isAlive = false;
                }
                // bird hit ceiling
                else if (this.solo_bird.y <= - Params.game_manager.BIRD_RADIUS){
                    this.solo_bird.isAlive = false;
                }
                // crashed into pipes
                else if (this.pipe_x_pos[this.nearest_pipe] - Params.game_manager.BIRD_INIT_X <= Params.game_manager.BIRD_RADIUS){

                    // upper pipe
                    if (this.solo_bird.y - Params.game_manager.BIRD_RADIUS <= this.pipe_y_height[this.nearest_pipe]){
                        this.solo_bird.isAlive = false;
                    }
                    // lower pipe
                    else if (this.solo_bird.y + Params.game_manager.BIRD_RADIUS >= this.pipe_y_height[this.nearest_pipe] + Params.game_manager.GAP_PIPE){
                        this.solo_bird.isAlive = false;
                    }

                }
            }else{
                // move back the dead bodies
                this.solo_bird.x -= Params.game_manager.BIRD_X_SPEED;                
            }
            
            if (Params.game_manager.PLAY_MODE === 2){    //human vs ai

                if (this.champion_ai.brain){
                    if (this.champion_ai.brain.forwardFlow(game_manager.getNearestPipeDist(),game_manager.getNearestPipeHeight(),this.champion_ai.getBirdHeight(),game_manager.getNearestPipeGap(), game_manager.getNearestPipeSpeedY())){
                        this.champion_ai.flap(true);
                    }else{
                        this.champion_ai.flap(false);
                    }
                }else{
                    this.champion_ai.flap(false);
                }

                if (this.champion_ai.isAlive){
                    this.champion_ai.score = this.curr_score;

                    // bird hit the platform
                    if (this.champion_ai.y + Params.game_manager.BIRD_RADIUS >= Params.game_manager.PlATFORM_Y){
                        this.champion_ai.isAlive = false;
                    }
                    // bird hit ceiling
                    else if (this.champion_ai.y <= - Params.game_manager.BIRD_RADIUS){
                        this.champion_ai.isAlive = false;
                    }
                    // crashed into pipes
                    else if (this.pipe_x_pos[this.nearest_pipe] - Params.game_manager.BIRD_INIT_X <= Params.game_manager.BIRD_RADIUS){

                        // upper pipe
                        if (this.champion_ai.y - Params.game_manager.BIRD_RADIUS <= this.pipe_y_height[this.nearest_pipe]){
                            this.champion_ai.isAlive = false;
                        }
                        // lower pipe
                        else if (this.champion_ai.y + Params.game_manager.BIRD_RADIUS >= this.pipe_y_height[this.nearest_pipe] + Params.game_manager.GAP_PIPE){
                            this.champion_ai.isAlive = false;
                        }

                    }
                }else{
                    // move back the dead bodies
                    this.champion_ai.x -= Params.game_manager.BIRD_X_SPEED;
                }

                if (this.champion_ai.y + Params.game_manager.BIRD_RADIUS >= Params.game_manager.PlATFORM_Y){
                        this.champion_ai.y = Params.game_manager.PlATFORM_Y + Params.game_manager.BIRD_RADIUS;
                }

            }

            // prevent birds from going out of bound
            if (this.solo_bird.y + Params.game_manager.BIRD_RADIUS >= Params.game_manager.PlATFORM_Y){
                this.solo_bird.y = Params.game_manager.PlATFORM_Y + Params.game_manager.BIRD_RADIUS;
            }



        }else if (Params.game_manager.PLAY_MODE === 1){     // ai player

            this.generation.triggerFlap();
            for (var i = 0; i < Constant.POPULATION; i++){
                if (this.generation.population[i].isAlive) {
                    this.generation.population[i].score = this.curr_score;

                    if (this.generation.population[i].y + Params.game_manager.BIRD_RADIUS >= Params.game_manager.PlATFORM_Y) {
                        this.generation.population[i].isAlive = false;
                    }
                    else if (this.generation.population[i].y <= -Params.game_manager.BIRD_RADIUS) {
                        this.generation.population[i].isAlive = false;
                    }
                    else if (this.pipe_x_pos[this.nearest_pipe] - Params.game_manager.BIRD_INIT_X <= Params.game_manager.BIRD_RADIUS) {
                        // upper pipe
                        if (this.generation.population[i].y - Params.game_manager.BIRD_RADIUS <= this.pipe_y_height[this.nearest_pipe]){
                            this.generation.population[i].isAlive = false;
                        }
                        // lower pipe
                        else if (this.generation.population[i].y + Params.game_manager.BIRD_RADIUS >= this.pipe_y_height[this.nearest_pipe] + Params.game_manager.GAP_PIPE){
                            this.generation.population[i].isAlive = false;
                        }
                    }

                    // death count
                    if (!this.generation.population[i].isAlive) {
                        this.numAlive--;
                    }
                } else if (!this.gameover) {

                    // move back the dead bodies
                    this.generation.population[i].x -= Params.game_manager.BIRD_X_SPEED;
                }

                if (this.generation.population[i].y + Params.game_manager.BIRD_RADIUS >= Params.game_manager.PlATFORM_Y) {
                    this.generation.population[i].y = Params.game_manager.PlATFORM_Y + Params.game_manager.BIRD_RADIUS;
                }
            }
        }
    },

    _findNearestPipe: function(){
        // check against the boundary condition
        this.nearest_pipe = Params.game_manager.NUM_OF_PIPES;
        for(var i = 0; i < Params.game_manager.NUM_OF_PIPES; i++){
            if (this.pipe_x_pos[i] >= Params.game_manager.BIRD_INIT_X - Params.game_manager.WIDTH_OF_PIPE - Params.game_manager.BIRD_RADIUS && this.pipe_x_pos[i] < this.pipe_x_pos[this.nearest_pipe]){
                this.nearest_pipe = i;
            }
        }
    },

    _checkGameStatus: function(){

        if (Params.game_manager.PLAY_MODE === 0){   // human player
            if (!this.solo_bird.isAlive && !this.gameover){
                var self = this;
                setTimeout(function(){
                    clearInterval(timer);
                    self.startGame();
                });
                this.gameover = true;
            }
        }else if (Params.game_manager.PLAY_MODE === 1){     // ai player
            if(!this.numAlive && !this.gameover){
                var self = this;
                setTimeout(function(){
                    clearInterval(timer);
                    self.generation.getSummary();
                    self.startGame();                    
                });
                this.gameover = true;
            }
        }else{
            // human vs ai
            if(!this.gameover){
                if (!this.champion_ai.isAlive && !this.solo_bird.isAlive){
                    var self = this;
                    setTimeout(function(){
                        clearInterval(timer);
                        self.startGame();                    
                    });
                    this.gameover = true;

                    var colour = ['darkred','darkblue']
                    if (this.champion_ai.score > this.solo_bird.score){
                        var appendix = 'AI WON!';
                        colour.push('blue');
                    }else if (this.champion_ai.score < this.solo_bird.score){
                        var appendix = 'HUMAN WON!';
                        colour.push('red');
                    }else{
                        var appendix = 'DRAW!';
                        colour.push('green');
                    }

                    frame_updater._lastcolour = colour;
                    frame_updater._lastmsg = ['Human - ' + this.solo_bird.score.toString(), 
                                              'AI - ' + this.champion_ai.score.toString(), 
                                              'Result: ' + appendix];
                }
            }
        }
    },

    _resetGame: function(){
        var self = this;
        setTimeout(function(){
            clearInterval(timer);
            self.startGame();
        });

        this.gameover = true;
        this.generation = new Generation();
    }
}