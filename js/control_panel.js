function ControlPanel(){

    // mode
    this._mode = document.getElementsByName("mode");
    for (var i = 0; i < this._mode.length; i++) {
        this._mode[i].addEventListener('change', function() {
            if (this.value === 'human'){
                Params.game_manager.PLAY_MODE = 0;
            }else if (this.value === 'ai'){
                Params.game_manager.PLAY_MODE = 1;
            }else{
                Params.game_manager.PLAY_MODE = 2;

                frame_updater._lastmsg = ['Red: Human (Hit SPACE to Begin)', 'Blue: Champion AI'];;
                frame_updater._lastcolour = ['darkred','darkblue'];
            }
            game_manager._resetGame();
        });
    }

    // difficulty
    this._level = document.getElementsByName("level");
    for (var i = 0; i < this._level.length; i++) {
        this._level[i].addEventListener('change', function() {
            if (this.value === 'normal'){
                Params.game_manager.ADVERSE_MODE = 0;
            }else if (this.value === 'impossible'){
                Params.game_manager.ADVERSE_MODE = 1;
            }
        });
    }

    // setting
    this._framespeed = document.getElementById("frame-speed");
    this._framespeed.options[2].selected = true;
    this._framespeed.onchange = function(){
        for (var i = 0; i < this.options.length; i++){
            if (this.options[i].selected){
                Params.frame_updater.FRAME_RATE = this.options[i].value
            }
        }
    }

    // harvest the best brain
    this._freezebrain = document.getElementById("freeze-btn");
    this._freezebrain.onclick = function(){
        Params.game_manager.PRINT_BRAIN = true;
    }

}