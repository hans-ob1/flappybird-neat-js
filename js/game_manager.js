function GameManager(){
    this.gameover = false;
    this.curr_score = 0;
}

GameManager.prototype = {
    startGame: function() {
        this.gameover = false;
        this.curr_score = 0;

        this.timerGame();
        frame_updater.initFrame();
    },

    updateGame: function(){
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
            Params.frame_updater.FRAME_RATE
        )
    }
}