var Game;
(function (Game) {
    var GameObject = (function () {
        function GameObject(shape, material, scale, rotateAbout, rotation, position, velocity, angularVelocity, acceleration, angularAcceleration, rotateAboutVelocity, rotateAboutAcceleration) {
            if (scale === void 0) { scale = [1, 1, 1]; }
            if (rotateAbout === void 0) { rotateAbout = [0, 0, 0]; }
            if (rotation === void 0) { rotation = [0, 0, 0]; }
            if (position === void 0) { position = [0, 0, 0]; }
            if (velocity === void 0) { velocity = [0, 0, 0]; }
            if (angularVelocity === void 0) { angularVelocity = [0, 0, 0]; }
            if (acceleration === void 0) { acceleration = [0, 0, 0]; }
            if (angularAcceleration === void 0) { angularAcceleration = [0, 0, 0]; }
            if (rotateAboutVelocity === void 0) { rotateAboutVelocity = [0, 0, 0]; }
            if (rotateAboutAcceleration === void 0) { rotateAboutAcceleration = [0, 0, 0]; }
            this._shape = shape;
            this._mat = material;
            this._scale = scale;
            this._rotateAbout = rotateAbout;
            this._rotation = rotation;
            this._position = position;
            this._velocity = velocity;
            this._angularVelocity = angularVelocity;
            this._acceleration = acceleration;
            this._angularAcceleration = angularAcceleration;
            this._rotateAboutVelocity = rotateAboutVelocity;
            this._rotateAboutAcceleration = rotateAboutAcceleration;
            this._transform = mat4();
            this.updateState(0.0);
        }
        GameObject.prototype.updateState = function (timeElapsed) {
            if (timeElapsed != 0.0) {
                for (var i = 0; i < 3; i++) {
                    this._position[i] += this._velocity[i] * timeElapsed;
                    this._rotation[i] += this._angularVelocity[i] * timeElapsed;
                    this._rotateAbout[i] += this._rotateAboutVelocity[i] * timeElapsed;
                }
                for (var i = 0; i < 3; i++) {
                    this._velocity[i] += this._acceleration[i] * timeElapsed;
                    this._angularVelocity[i] += this._angularAcceleration[i] * timeElapsed;
                    this._rotateAboutVelocity[i] += this._rotateAboutAcceleration[i] * timeElapsed;
                }
            }
            this._transform = mult(mat4(), translation(this._position[0], this._position[1], this._position[2]));
            if (this._rotation[1] != 0)
                this._transform = mult(this._transform, rotation(this._rotation[1], 0, 1, 0));
            if (this._rotation[0] != 0)
                this._transform = mult(this._transform, rotation(this._rotation[0], 1, 0, 0));
            if (this._rotation[2] != 0)
                this._transform = mult(this._transform, rotation(this._rotation[2], 0, 0, 1));
            if (this._rotateAbout != [0, 0, 0])
                this._transform = mult(this._transform, translation(this._rotateAbout[0], this._rotateAbout[1], this._rotateAbout[2]));
            this._transform = mult(this._transform, scale(this._scale[0], this._scale[1], this._scale[2]));
        };
        GameObject.prototype.draw = function (animation) {
            this._shape.draw(animation.graphicsState, this._transform, this._mat);
        };
        return GameObject;
    }());
    var gameObjects = [];
    var gameTime = 0.0;
    // 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
    var purplePlastic = new Material(vec4(.9, .5, .9, 1), .5, .8, .8, 40, null), greyPlastic = new Material(vec4(.5, .5, .5, 1), .8, .8, .8, 20, null), lightGreyPlastic = new Material(vec4(.7, .7, .7, 1), .2, .4, .5, 20, null), brownPlastic = new Material(vec4(0.7, 0.4, 0, 1), .4, 0.1, 0.1, 20, null), greenPlastic = new Material(vec4(0.1, 0.95, 0.1), .45, .8, .8, 30, null), redPlastic = new Material(vec4(0.95, 0.1, 0.1), .45, .5, .5, 30, null), yellowPlastic = new Material(vec4(0.9, 0.9, 0.1), .45, .5, .5, 30, null), earth = new Material(vec4(.5, .5, .5, 1), .5, 1, .5, 40, "earth.gif"), stars = new Material(vec4(.5, .5, .5, 1), .5, 1, 1, 40, "stars.png"), wallTex = new Material(vec4(.5, .5, .5, 1), .7, 0.4, 0.6, 30, "wall.png");
    var s_cube;
    var s_teapot;
    var s_axis;
    var s_sphere;
    var s_fan;
    var s_strip;
    var s_cylinder;
    var s_pyramid;
    var s_wall;
    function initializeGame() {
        s_cube = new cube(null);
        s_teapot = new shape_from_file("teapot.obj");
        s_axis = new axis();
        s_sphere = new sphere(mat4(), 4);
        s_fan = new triangle_fan_full(10, mat4());
        s_strip = new rectangular_strip(1, mat4());
        s_cylinder = new cylindrical_strip(10, mat4());
        s_pyramid = new pyramid();
        s_wall = new wall();
        gameObjects.push(new GameObject(s_pyramid, stars, [3, 3, 3], [0, 2.5, 0], [-60, 0, 0], undefined, [0, 0, 0], undefined, undefined, undefined, [0, 0, -5]));
        for (var i = 0; i < 20; i++) {
            gameObjects.push(new GameObject(s_cube, earth, [40, 5, 5], [0, 0, -5 * i], [-60, 0, 0], [0, 0, 0]));
            gameObjects.push(new GameObject(s_wall, wallTex, [5, 20, 5], [22.5, 10, -5 * i], [-60, 0, 0], [0, 0, 0]));
            gameObjects.push(new GameObject(s_wall, wallTex, [5, 20, 5], [-22.5, 10, -5 * i], [-60, 0, 0], [0, 0, 0]));
        }
    }
    Game.initializeGame = initializeGame;
    function gameLoop(animation, timeElapsed) {
        if (timeElapsed != 0.0)
            simulateWorld(gameObjects, timeElapsed);
        render(animation, gameObjects);
    }
    Game.gameLoop = gameLoop;
    function simulateWorld(objects, timeElapsed) {
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var obj = objects_1[_i];
            obj.updateState(timeElapsed);
        }
        gameTime += timeElapsed;
    }
    function render(animation, objects) {
        for (var _i = 0, objects_2 = objects; _i < objects_2.length; _i++) {
            var obj = objects_2[_i];
            obj.draw(animation);
        }
    }
})(Game || (Game = {}));
//# sourceMappingURL=game.js.map