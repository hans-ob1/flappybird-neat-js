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
            this._platform[i] = Params.frame_updater.WIDTH_OF_SCREEN * i
        }
    },

    updateFrame: function(){
        this._movePlatform();
        this._drawBackground();
        this._drawPlatform();
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

    _movePlatform: function(){
        for (var i = 0; i < Params.frame_updater.NUM_OF_PLATFORM; i++){
            if (!game_manager.gameover){
                this._platform[i] -= Params.game_manager.BIRD_X_SPEED;
                if (this._platform[i] <= -Params.game_manager.WIDTH_OF_SCREEN){
                    this._platform[i] += Params.game_manager.WIDTH_OF_SCREEN * 2;
                }
            }
        }
    }
}

