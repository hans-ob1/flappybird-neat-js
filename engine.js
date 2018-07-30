    // define game parameters
    var ctx = myCanvas.getContext("2d");
    var fps = 50;
    var jump_amt = -10;
    var max_fallspeed = +10;
    var acceleration = 1;
    var pipe_speed = -3;
    var game_mode = 'prestart';
    var time_game_last_running;
    var bottom_bar_offset = 0;

    //TODO: link up NEAT with main game engine
    var numBirds = 100;
    var bird = [];
    var pipes = [];
    
    // Sprite function
    // -------------------------------------------------------------------------------------------
    function MoveSprite(img){
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.velocity_x = 0;
        this.velocity_y = 0;

        this.MyImg = new Image();
        this.MyImg.src = img || '';

        this.visible = true;
        this.flipV = false;
        this.flipH = false;

        // bird param
        this.isDead = false;
        this.score = 0;
    }

    MoveSprite.prototype.Run_Frame_Activity = function(){
        ctx.save();
        ctx.translate(this.x + this.MyImg.width/2, this.y + this.MyImg.height/2);
        ctx.rotate(this.angle * Math.PI/180);

        //flip bird vertically
        if (this.flipV) ctx.scale(1,-1);

        //flip bird horizontially
        if (this.flipH) ctx.scale(-1,1);

        if (this.visible){
            ctx.drawImage(this.MyImg, -this.MyImg.width/2, -this.MyImg.height/2);
        }
        
        //update at the end of cycle
        if (!this.isDead)
            this.x = this.x + this.velocity_x;

        this.y = this.y + this.velocity_y;
        
        //restore back for next drawing
        ctx.restore();
    }

    // Functions ()
    // check if bird touched anything
    // -------------------------------------------------------------------------------------------
    function TouchedThings(thing1, thing2){
        if (!thing1.visible || !thing2.visible)
            return false;

        if (thing1.x >= thing2.x + thing2.MyImg.width || thing1.x + thing1.MyImg.width <= thing2.x)
            return false;

        if (thing1.y >= thing2.y + thing2.MyImg.height || thing1.y + thing1.MyImg.height <= thing2.y)
            return false;

        return true;
    }

    // flap the bird (human)
    function ManualFlap(MyEvent){
        // toggle spacebar to flap
        if (MyEvent.key === ' ' ||  MyEvent.key === 'Spacebar'){
            switch (game_mode){
                case 'prestart': {
                    game_mode = 'running';
                    break;
                }
                case 'running': {
                    // only one bird is running during manual mode
                    bird[0].velocity_y = jump_amt;
                    break;
                }
                case 'over': if (new Date() - time_game_last_running > 1000){
                    reset_game();
                    game_mode = 'running';
                    break;
                }
            }
        }
        MyEvent.preventDefault();
    }

    // flap the bird (Ai)
    function SignalFlap(idx){
        // toggle spacebar to flap
        switch (game_mode){
            case 'prestart': {
                game_mode = 'running';
                break;
            }
            case 'running': {
                bird[idx].velocity_y = jump_amt;
                break;
            }
            case 'over': if (new Date() - time_game_last_running > 1000){
                reset_game();
                game_mode = 'running'; 
                break;
            }
        }
    }

    // add player toggle (spacebar)
    addEventListener("keydown", ManualFlap);

    function bird_speedcontrol(){

        for (var i = 0; i < bird.length; i++){
            if (!bird[i].isDead){
                if (bird[i].velocity_y < max_fallspeed){
                    bird[i].velocity_y = bird[i].velocity_y + acceleration;
                }

                if (bird[i].y > myCanvas.height - bird[i].MyImg.height){
                    bird[i].velocity_y = 0;
                    bird[i].isDead = true;
                }else if(bird[i].y < 0){
                    bird[i].velocity_y = 0;
                    bird[i].isDead = true;                    
                }

            }
        }
    }

    function bird_tilt_angle(){

        for (var i = 0; i < bird.length; i++){
            if (!bird[i].isDead){
                if (bird[i].velocity_y < 0){
                    bird[i].angle = -15;
                }else if (bird[i].angle < 70){
                    bird[i].angle = bird[i].angle + 4;
                }
            }
        }
    }

    // Game layout
    function add_pipe(x_pos, top_of_gap, gap_width){
        var top_pipe = new MoveSprite();
        top_pipe.MyImg = pipe_piece;
        top_pipe.x = x_pos;
        top_pipe.y = top_of_gap - pipe_piece.height;
        top_pipe.velocity_x = pipe_speed;
        pipes.push(top_pipe);

        var bottom_pipe = new MoveSprite();
        bottom_pipe.MyImg = pipe_piece;
        bottom_pipe.flipV = true;
        bottom_pipe.x = x_pos;
        bottom_pipe.y = top_of_gap + gap_width;
        bottom_pipe.velocity_x = pipe_speed;
        pipes.push(bottom_pipe);
    }

    function show_pipes(){
        for (var i = 0; i < pipes.length; i++){
            pipes[i].Run_Frame_Activity();
        }
    }

    function gameover_checker(){

        var numDead = 0;

        for (var i = 0; i < bird.length; i++){
    
            if (!bird[i].isDead){
                for (var j = 0; j < pipes.length; j++){
                    if (TouchedThings(bird[i], pipes[j])){
                        bird[i].isDead = true;
                        numDead += 1;
                        break;
                    }
                }
            }else{
                numDead += 1;
            }
        }

        console.log(numDead);
    
        if (numDead === bird.length){
            game_mode = "over";
        }
    }

    function update_score(){
        for (var i = 0; i < bird.length; i++){

            if (!bird[i].isDead){
                var temp = 0;
                for (var j = 0; j < pipes.length; j++){
                    if (pipes[j].x < bird[i].x)
                        temp = temp + 0.5;
                }
                bird[i].score = temp;
            }
        }
    }

    function show_gameover(){

        var displayScore = [];
        for (var i = 0; i < bird.length; i++){
            displayScore.push(bird[i].score);
        }

        console.log(displayScore);

        ctx.font = "30px Arial";
        ctx.fillStyle = "green";
        ctx.textAlign = "center";
        ctx.fillText("Game over", myCanvas.width/2, 100);
        //ctx.fillText("Score: " + score[0], myCanvas.width/2, 150);
        ctx.font = "20px Arial";
        ctx.fillText("Click or press any key to play again", myCanvas.width/2, 300);
    }

    function display_bottom(){
        if (bottom_bar_offset < -23) bottom_bar_offset = 0;
        ctx.drawImage(bottom_bar, bottom_bar_offset, myCanvas.height - bottom_bar.height);
    }

    function reset_game(){
        for(var i = 0; i < bird.length; i++){
            bird[i].isDead = false;
            bird[i].y = myCanvas.height/2;
            bird[i].angle = 0;
        }

        pipes=[];
        add_all_pipes();
    }

    function add_all_pipes(){
        // set the number of pipes (100)
        add_pipe(500,  100, 140);
        add_pipe(800,   50, 140);
        add_pipe(1000, 250, 140);
        add_pipe(1200, 150, 120);
        add_pipe(1600, 100, 120);
        add_pipe(1800, 150, 120);
        add_pipe(2000, 200, 120);
        add_pipe(2200, 250, 120);
        add_pipe(2400,  30, 100);
        add_pipe(2700, 300, 100);
        add_pipe(3000, 100,  80);
        add_pipe(3300, 250,  80);
        add_pipe(3600,  50,  60);
        add_pipe(3800,  100,  60);
        add_pipe(4000,  150,  60);
    
        var finish_line = new MoveSprite("assets/img/endline.png");
        finish_line.x = 4300;
        finish_line.velocity_x = pipe_speed;
        pipes.push(finish_line);        
    }

    var pipe_piece = new Image();
    pipe_piece.onload = add_all_pipes;
    pipe_piece.src = "assets/img/pipe.png";

    // center control
    function DrawFame(){
        ctx.clearRect(0,0,myCanvas.width,myCanvas.height);

        ai_engine();

        for (var i = 0; i < bird.length; i++){
            if (!bird[i].isDead){
                bird[i].Run_Frame_Activity();
            }
        }

        display_bottom();

        switch(game_mode){
            case 'prestart': {
                break;
            }
            case 'running':{
                time_game_last_running = new Date();
                bottom_bar_offset = bottom_bar_offset + pipe_speed;
                show_pipes();
                bird_tilt_angle();
                bird_speedcontrol();
                update_score();
                gameover_checker();
                break;
            }
            case 'over':{
                bird_speedcontrol();
                show_gameover();
                break;
            }
        }
    }

    // display the floor
    var bottom_bar = new Image();
    bottom_bar.src = "assets/img/base.png";

    // initialize birds
    for (var i = 0; i < numBirds; i++){
        bird.push(new MoveSprite("assets/img/bird.png"));
        bird[i].x = myCanvas.width/3;
        bird[i].y = myCanvas.height/2;
    }

    //run the engine at certain fps
    setInterval(DrawFame, 1000/fps);