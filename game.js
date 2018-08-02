// game engine
// https://phaser.io/tutorials/making-your-first-phaser-3-game/part7

var config = {
    width: Params.frame.FRAME_WIDTH,
    height: Params.frame.FRAME_HEIGHT,
    renderer: Phaser.AUTO,
    physics: {
        default: 'arcade',
    },
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // game environment
    this.load.image('background','assets/background.png');
    this.load.image('platform','assets/platform.png');

    // obstacles
    this.load.image('pipe_down','assets/pipe_down.png');
    this.load.image('pipe_up','assets/pipe_up.png');

    // bird
    this.load.spritesheet('red_bird',
                          'assets/red_bird.png',
                          { frameWidth: Params.game.BIRD_RADIUS, frameHeight: Params.game.BIRD_RADIUS });

    this.load.spritesheet('blue_bird',
                          'assets/blue_bird.png',
                          { frameWidth: Params.game.BIRD_RADIUS, frameHeight: Params.game.BIRD_RADIUS });

    // number
    this.load.image('0','assets/0.png');
    this.load.image('1','assets/1.png');
    this.load.image('2','assets/2.png');
    this.load.image('3','assets/3.png');
    this.load.image('4','assets/4.png');
    this.load.image('5','assets/5.png');
    this.load.image('6','assets/6.png');
    this.load.image('7','assets/7.png');
    this.load.image('8','assets/8.png');
    this.load.image('9','assets/9.png');
}

var platforms;

function create() {
    //this.physics.startSystem(Phaser.Physics.ARCADE);
    this.add.image(Params.frame.FRAME_WIDTH/2,Params.frame.FRAME_HEIGHT/2,'background');
    
    platforms = this.physics.add.staticGroup();
    platforms.create(Params.frame.GRD_POSX, Params.frame.GRD_POSY,'platform');


}
function update() {}