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

function FrameUpdater(){
    this._canvas = document.getElementById("canvas").getContext("2d");
    this._platform = [];
}

FrameUpdater.prototype = {

    // internal functions
    initFrame: function(){

    },

    updateFrame: function(){
        this._drawBackground();
    },

    // external functions
    _drawBackground: function(){
        this._canvas.drawImage(AssetManager.getImg('background'), 0, 0);
        this._canvas.drawImage(AssetManager.getImg('background'), 336, 0);
    }
}

