    // define game parameters
    var ctx = gameWindow.getContext("2d");
    var fps = 50;

    var bottom_bar_offset = 0;
    
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
                prestart_screen();
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

    //run the engine at certain fps
    setInterval(DrawFame, 1000/fps);
