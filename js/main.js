var timer;
var game_manager;
var frame_updater;

AssetManager.loadImg([
    'background',
    'blue_bird',
    'red_bird',
    'pipe_down',
    'pipe_up',
    'pipe_down_red',
    'pipe_up_red',
    'platform',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
])

AssetManager.loadComplete = function(){
    console.log("Images Loaded");
    control_panel = new ControlPanel();
    game_manager = new GameManager();
    frame_updater = new FrameUpdater();
    game_manager.startGame();


    // detect spacebar keystroke
    document.body.onkeydown = function(e){
        if(e.keyCode == 32 && (Params.game_manager.PLAY_MODE === 0 || Params.game_manager.PLAY_MODE === 2)){
            if (game_manager.gameover){
                game_manager.gameover = false;
                game_manager.startGame();
            }

            game_manager.solo_bird.flap(true);
        }
    }   
} 

