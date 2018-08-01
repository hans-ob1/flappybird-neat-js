function Game(){

    this.curr_score = 0;
    this.isOver = false;

    this.pipesUpper = [];
    this.pipesLower = [];

    // number of alive birds
    this._numOfAlive = Data.AI.NUM_BIRDS;

    this.frameUpdater = new DrawFrame('gameWindow');
}   

Game.prototype ={
    resetGame: function(){
        // set the number of pipes
        var i;
        for (i = 0; i < Params.Game.NUM_PIPES; i++){
            this.pipesLower[i] = (Params.DrawFrame.FRAME_WIDTH + Data.Game.PIPE_WIDTH) * (1.5 + i * 0.5);
            this.pipesUpper[i] = Math.floor(Math.random() * (Params.Game.PIPE_MAX_Y - Params.Game.PIPE_MIN_Y)) + Params.Game.PIPE_MIN_Y;
        }

        this._numOfAlive = Data.AI.NUM_BIRDS;
        this.curr_score = 0;
        this.isOver = false;
    },

    updateGame: function(){
        if (!this.isOver)
            this._shiftPipe();

        this._shiftBird();
        this._gameoverChecker();
        this.frameUpdater.updateFrame();
    },

    gameTimer: function(){
        var self = this;
        
    }
}

