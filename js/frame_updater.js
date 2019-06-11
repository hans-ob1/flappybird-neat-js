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
    this._lastmsg = 'Red: Human, Blue: AI';
    this._lastcolour = 'darkgreen';
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

        if(Params.game_manager.PLAY_MODE === 0 && game_manager.gameover)
            this._drawText("Hit 'Spacebar' to Begin!", 'darkgreen');

        if(Params.game_manager.PLAY_MODE === 2 && game_manager.gameover)
            this._drawText(this._lastmsg, this._lastcolour);

        // visualize brain if its AI
        if(Params.game_manager.PLAY_MODE >= 1){
            this._drawBrainVisual();
        }
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

            if (i == game_manager.nearest_pipe){
                this._canvas.drawImage(AssetManager.getImg("pipe_up_red"), game_manager.pipe_x_pos[i], game_manager.pipe_y_height[i] + game_manager.pipe_gap[i]);
                this._canvas.drawImage(AssetManager.getImg("pipe_down_red"), game_manager.pipe_x_pos[i], game_manager.pipe_y_height[i]-Params.game_manager.HEIGHT_OF_PIPE);                
            }
            else{
                this._canvas.drawImage(AssetManager.getImg("pipe_up"), game_manager.pipe_x_pos[i], game_manager.pipe_y_height[i] + game_manager.pipe_gap[i]);
                this._canvas.drawImage(AssetManager.getImg("pipe_down"), game_manager.pipe_x_pos[i], game_manager.pipe_y_height[i]-Params.game_manager.HEIGHT_OF_PIPE);
            }
        }
    },

    _drawBrainVisual: function(){
        // draw the current strongest brain
        var _bestBrain = game_manager.generation.getBestBrain();
        if (_bestBrain){

            var circle_start = 0;
            var circle_radius = 5;

            var out_node_x = Math.floor(Params.frame_updater.WIDTH_OF_SCREEN*0.95);
            var out_node_y = Math.floor(Params.frame_updater.HEIGHT_OF_SCREEN*0.9);

            var node_gap_y = 20;
            var node_gap_x = 60;
            var has_hidden = false;

            var _nodes_pos = [];

            // calculate first input node position
            if (Constant.NUM_INPUTS % 2){
                var first_in_node_y = out_node_y - (Math.floor(Constant.NUM_INPUTS/2) + 0.5)*node_gap_y;
            }else{
                var first_in_node_y = out_node_y - (Math.floor(Constant.NUM_INPUTS/2) + 1)*node_gap_y;
            }

            _nodes_pos[Constant.IDX_OUTPUT] = [out_node_x, out_node_y];

            // draw hidden layer
            if (_bestBrain.size_of_nodes > Constant.NUM_INPUTS+1){

                for (var i = Constant.NUM_INPUTS+1; i < _bestBrain.size_of_nodes+2; i++){
                    this._canvas.beginPath();
                    this._canvas.arc(out_node_x - node_gap_x, first_in_node_y + node_gap_y*(i-Constant.NUM_INPUTS), circle_radius, circle_start, 2*Math.PI);
                    this._canvas.stroke();
                    this._canvas.fillStyle = 'red';
                    this._canvas.fill();

                    _nodes_pos[i] = [out_node_x - node_gap_x, first_in_node_y + node_gap_y*(i-Constant.NUM_INPUTS)];
                }

                has_hidden = true;
            }

            // draw output node
            this._canvas.beginPath();
            this._canvas.arc(out_node_x, out_node_y, circle_radius, circle_start, 2*Math.PI);
            this._canvas.fillStyle = 'green';
            this._canvas.fill();

            // draw input nodes
            for (var i = 1; i < Constant.NUM_INPUTS+1; i++){
                this._canvas.beginPath();
                if (has_hidden){
                    this._canvas.arc(out_node_x - (node_gap_x*2), first_in_node_y + node_gap_y*(i-1), circle_radius, circle_start, 2*Math.PI);
                    _nodes_pos[i] = [out_node_x - (node_gap_x*2), first_in_node_y + node_gap_y*(i-1)];
                }else{
                    this._canvas.arc(out_node_x - node_gap_x, first_in_node_y + node_gap_y*(i-1), circle_radius, circle_start, 2*Math.PI);
                    _nodes_pos[i] = [out_node_x - node_gap_x, first_in_node_y + node_gap_y*(i-1)];
                }
                this._canvas.fillStyle = 'blue';
                this._canvas.fill();

            }

            // draw edges
            var edge_idx_array = Object.getOwnPropertyNames(_bestBrain._edges);
            edge_idx_array.pop();
            for (var i = 0; i < edge_idx_array.length; i++){
                var idx_from = edge_idx_array[i];

                edge_idx_array_to = Object.getOwnPropertyNames(_bestBrain._edges[idx_from]);
                edge_idx_array_to.pop();

                for(var j = 0; j < edge_idx_array_to.length; j++){
                    var idx_to = edge_idx_array_to[j];

                    this._canvas.beginPath();
                    this._canvas.moveTo(_nodes_pos[idx_from][0], _nodes_pos[idx_from][1]);
                    this._canvas.lineTo(_nodes_pos[idx_to][0], _nodes_pos[idx_to][1]);
                    this._canvas.stroke();                   
                }
            }

        }
    },

    _drawBird: function(){
        if (Params.game_manager.PLAY_MODE === 0 || Params.game_manager.PLAY_MODE === 2){   // human player
            this._canvas.save();
            this._canvas.translate(game_manager.solo_bird.x, game_manager.solo_bird.y);
            if (!game_manager.gameover){
                this._canvas.rotate(Math.min(game_manager.solo_bird.speed * 7, 90) * Math.PI /180);
            }
            this._canvas.drawImage(AssetManager.getImg("red_bird"), -24, -24);
            this._canvas.restore();

            if (Params.game_manager.PLAY_MODE === 2){
                this._canvas.save();
                this._canvas.translate(game_manager.champion_ai.x, game_manager.champion_ai.y);
                if (!game_manager.gameover){
                    this._canvas.rotate(Math.min(game_manager.champion_ai.speed * 7, 90) * Math.PI /180);
                }
                this._canvas.globalAlpha = 0.7;
                this._canvas.drawImage(AssetManager.getImg("blue_bird"), -24, -24);
                this._canvas.restore();                
            }

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

    _drawText: function(msg,colour){
        this._canvas.font = "25px Arial";
        this._canvas.fillStyle = colour;
        this._canvas.fillText(msg, Params.frame_updater.TEXT_DISPLAY_X, Params.frame_updater.TEXT_DISPLAY_Y);
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

