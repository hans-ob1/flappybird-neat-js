// manage image assets
var AssetManager = {
    img_list: [],

    loadComplete: function() {},

    loadImg: function(arr){
        var length = arr.length
        var loaded_imgs = 0;

        function imgLoaded(){
            loaded_imgs++;
            if (loaded_imgs == length){
                AssetManager.loadComplete();
            }
        }

        // ensure that all images are loaded
        for (var i = 0; i < length; i++){
            AssetManager.img_list[arr[i]] = new Image();
            AssetManager.img_list[arr[i]].src = "assets/" + arr[i] + ".png";
            AssetManager.img_list[arr[i]].onload = imgLoaded;
        }
    },

    getImg: function(img_name){
        return AssetManager.img_list[img_name]
    }
}

// update frame controller
function FrameUpdater(){
    this._canvas = document.getElementById("canvas").getContext("2d");
    this._platform = [];
}

FrameUpdater.prototype = {

    // internal functions
    initFrame: function(){
        for (var i = 0; i < Params.frame_updater.NUM_OF_PLATFORM; i++){
            this._platform[i] = (Params.frame_updater.WIDTH_OF_SCREEN/2) * i
        }
    },

    updateFrame: function(){
        this._movePlatform();
        this._drawBackground();
        this._drawPipes();
        this._drawPlatform();
        this._drawBird();
        this._drawScore();
    },

    // external functions
    _drawBackground: function(){
        this._canvas.drawImage(AssetManager.getImg('background'), 0, 0);
        this._canvas.drawImage(AssetManager.getImg('background'), 336, 0);
    },

    _drawPlatform: function(){
        for (var i = 0; i < Params.frame_updater.NUM_OF_PLATFORM; i++){
            this._canvas.drawImage(AssetManager.getImg("platform"), this._platform[i], Params.game_manager.PlATFORM_Y);
        }
    },

    _drawPipes: function(){
        for (var i = 0; i < Params.game_manager.NUM_OF_PIPES; i++){
            this._canvas.drawImage(AssetManager.getImg("pipe_up"), game_manager.pipe_x_pos[i], game_manager.pipe_y_height[i]+Params.game_manager.GAP_PIPE);
            this._canvas.drawImage(AssetManager.getImg("pipe_down"), game_manager.pipe_x_pos[i], game_manager.pipe_y_height[i]-Params.game_manager.HEIGHT_OF_PIPE);
        }
    },

    _drawBird: function(){
        if (Params.game_manager.PLAY_MODE === 0){   // human player
            this._canvas.save();
            this._canvas.translate(game_manager.solo_bird.x, game_manager.solo_bird.y);
            if (!game_manager.gameover){
                this._canvas.rotate(Math.min(game_manager.solo_bird.speed * 7, 90) * Math.PI /180);
            }
            this._canvas.drawImage(AssetManager.getImg("red_bird"), -24, -24);
            this._canvas.restore();
        }else if (Params.game_manager.PLAY_MODE === 1){     // ai player

            for (var i = 0; i < Constant.POPULATION; i++){
                this._canvas.save();
                this._canvas.translate(game_manager.generation.population[i].x, game_manager.generation.population[i].y);
                this._canvas.rotate(Math.min(game_manager.generation.population[i].speed * 7, 90) * Math.PI /180);
                this._canvas.drawImage(AssetManager.getImg("blue_bird"), -24, -24);
                this._canvas.restore();
            }
        }
    },

    _drawScore: function(){
        var numeric_score = game_manager.curr_score;
        var display_width = 0;
        var display_score = 0;

        if (numeric_score == 0){
            var x_coord = (Params.frame_updater.WIDTH_OF_SCREEN - Params.frame_updater.SCORE_DISPLAY_GAP)/2
            var y_coord = Params.frame_updater.SCORE_DISPLAY_Y;
            this._canvas.drawImage(AssetManager.getImg("0"), x_coord, y_coord);
        } else{
            while (numeric_score > 0){
                display_width += Params.frame_updater.SCORE_DISPLAY_GAP + Params.frame_updater.SCORE_DISPLAY_WIDTH;
                numeric_score = Math.floor(numeric_score/10);
            }
            display_width -= Params.frame_updater.SCORE_DISPLAY_GAP;
            numeric_score = game_manager.curr_score;
            display_score = (Params.frame_updater.WIDTH_OF_SCREEN + display_width)/2 - display_width;

            while (numeric_score > 0){
                this._canvas.drawImage(AssetManager.getImg(numeric_score % 10), display_score, Params.frame_updater.SCORE_DISPLAY_Y);
                display_score -= Params.frame_updater.SCORE_DISPLAY_WIDTH + Params.frame_updater.SCORE_DISPLAY_GAP;
                numeric_score = Math.floor(numeric_score/10);
            }
        }
    },

    _movePlatform: function(){
        for (var i = 0; i < Params.frame_updater.NUM_OF_PLATFORM; i++){
            if (!game_manager.gameover){
                this._platform[i] -= Params.game_manager.BIRD_X_SPEED;
                if (this._platform[i] <= -Params.frame_updater.WIDTH_OF_SCREEN){
                    this._platform[i] += Params.frame_updater.WIDTH_OF_SCREEN * 2;
                }
            }
        }
    }
}

