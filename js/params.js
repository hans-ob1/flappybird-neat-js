var Params = {

    frame_updater: {
        WIDTH_OF_SCREEN: 672,
        HEIGHT_OF_SCREEN: 512,
        NUM_OF_PLATFORM: 4,
        FRAME_RATE: 12, //milliseconds

        // score
        SCORE_DISPLAY_Y: 20,
        SCORE_DISPLAY_WIDTH: 24,
        SCORE_DISPLAY_GAP: 2,

        // text
        TEXT_DISPLAY_Y: 230,
        TEXT_DISPLAY_X: 200,
        TEXT_DISPLAY_OFFSET: 40,

        LABEL_DISPLAY_Y: 380,
        LABEL_DISPLAY_X: 550,
        LABEL_DISPLAY_OFFSET: 30
    },

    game_manager: {
        NUM_OF_PIPES: 6,
        WIDTH_OF_PIPE: 52,
        HEIGHT_OF_PIPE: 500,
        POS_MIN_Y_PIPE: 100,
        POS_MAX_Y_PIPE: 305,
        GAP_PIPE: 100,

        // adversarial params
        ADVERSE_MODE: 0,                // 1 - ON, 0 - OFF
        MOVE_PIPE_PROB: 0.5,
        PIPE_SPACING_PERCENTAGE: 0.3, // relative to screen width 
        PIPE_Y_SPEED: 3,

        PlATFORM_Y: 495,

        BIRD_INIT_X: 100,
        BIRD_INIT_Y: 200,
        BIRD_RADIUS: 12,
        BIRD_Y_SPEED: 4.2,
        BIRD_X_SPEED: 2, // x-coord of the bird

        BIRD_HOVER_MAX_Y: 250,
        BIRD_HOVER_MIN_Y: 150,
        BIRD_HOVER_SPEED: 1,
        BIRD_HOVER_GRAVITY: 0.04,

        GRAVITY: 0.22,

        PLAY_MODE: 2, // 0 - human, 1 - NEAT, 2 - human vs AI
        PRINT_BRAIN: false
    }

};