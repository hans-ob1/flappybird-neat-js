var timer;
var game_manager;
var frame_updater;

AssetManager.loadImg([
    'background',
    'blue_bird',
    'red_bird',
    'pipe_down',
    'pipe_up',
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
    game_manager = new GameManager();
    frame_updater = new FrameUpdater();
    game_manager.startGame();
}