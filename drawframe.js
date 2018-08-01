// animating

function DrawFrame(canvasID){
    this._canvas = document.getElementById(canvasID).getContext("2d");
}

DrawFrame.prototype ={

    updateFrame: function(){
        this._canvas.clearRect(0,0,Params.DrawFrame.FRAME_WIDTH,Params.DrawFrame.FRAME_HEIGHT);
        this._drawBackground();
        this._drawBottom();
        //this._drawPipes();
        //this._drawBird();
        //this._drawScore();
    },

    _drawBackground: function(){
        this._canvas.drawImage(ImgLoader.getImage('background'), 0, 0);
    },

    _drawBottom: function(){
        this._canvas.drawImage(ImgLoader.getImage('land'), 0, Params.DrawFrame.GROUND_POS);
    }

}

var gameDraw = new DrawFrame('gameWindow');

function Draw(){
    gameDraw.updateFrame();
}

setInterval(Draw, 25);