var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            if (this._rotation[0] != 0)
                this._transform = mult(this._transform, rotation(this._rotation[0], 1, 0, 0));
            if (this._rotation[2] != 0)
                this._transform = mult(this._transform, rotation(this._rotation[2], 0, 0, 1));
            if (this._rotation[1] != 0)
                this._transform = mult(this._transform, rotation(this._rotation[1], 0, 1, 0));
            if (this._rotateAbout != [0, 0, 0])
                this._transform = mult(this._transform, translation(this._rotateAbout[0], this._rotateAbout[1], this._rotateAbout[2]));
            this._transform = mult(this._transform, scale(this._scale[0], this._scale[1], this._scale[2]));
        };
        GameObject.prototype.draw = function (animation) {
            this._shape.draw(animation.graphicsState, this._transform, this._mat);
        };
        return GameObject;
    }());
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(shape, material, scale, rotateAbout, rotation, position, velocity, angularVelocity, acceleration, angularAcceleration, rotateAboutVelocity, rotateAboutAcceleration) {
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
            _super.call(this, shape, material, scale, rotateAbout, rotation, position, velocity, angularVelocity, acceleration, angularAcceleration, rotateAboutVelocity, rotateAboutAcceleration);
        }
        Player.prototype.updateState = function (timeElapsed) {
            var oldZ = this._position[2];
            var oldXRotation = this._rotation[0];
            this._velocity[2] = -PLAYER_CURRENT_Z_VELOCITY;
            for (var i = wallObjects.length - 1; i > 0; i--) {
                var rightX = wallObjects[i]._position[0] + wallObjects[i]._scale[0] / 2;
                var leftX = wallObjects[i]._position[0] - wallObjects[i]._scale[0] / 2;
                if (Math.abs(wallObjects[i]._position[2] - this._position[2]) < 2.5) {
                    if ((leftX - this._position[0]) < 3 && (leftX - this._position[0]) > 0 && this._velocity[0] > 0) {
                        this._velocity[0] = 0;
                        break;
                    }
                    else if ((this._position[0] - rightX) < 3 && (this._position[0] - rightX) > 0 && this._velocity[0] < 0) {
                        this._velocity[0] = 0;
                        break;
                    }
                }
            }
            _super.prototype.updateState.call(this, timeElapsed);
            for (var i = 0; i < wallObjects.length && wallObjects[i]._position[2] < this._position[2]; i++) {
                var rightX = wallObjects[i]._position[0] + wallObjects[i]._scale[0] / 2;
                var leftX = wallObjects[i]._position[0] - wallObjects[i]._scale[0] / 2;
                if ((wallObjects[i]._position[2] - this._position[2]) > -3) {
                    if (this._position[0] > leftX - 2.5 && this._position[0] < rightX + 2.5)
                        this._position[2] = oldZ;
                }
            }
            this._acceleration[0] = 0;
            if (this._velocity[0] > CUR_HORIZONTAL_VELOCITY)
                this._velocity[0] = CUR_HORIZONTAL_VELOCITY;
            else if (this._velocity[0] < -CUR_HORIZONTAL_VELOCITY)
                this._velocity[0] = -CUR_HORIZONTAL_VELOCITY;
            if (Math.abs(this._position[0]) > MAX_HORIZONTAL_POSITION) {
                if (this._position[0] > MAX_HORIZONTAL_POSITION)
                    this._position[0] = MAX_HORIZONTAL_POSITION;
                else if (this._position[0] < -MAX_HORIZONTAL_POSITION)
                    this._position[0] = -MAX_HORIZONTAL_POSITION;
                this._velocity[0] = 0;
                this._acceleration[0] = 0;
            }
            if (this._velocity[0] < 0)
                this._rotation[1] += -180 * timeElapsed;
            else if (this._velocity[0] > 0)
                this._rotation[1] += 180 * timeElapsed;
            this._rotation[0] = oldXRotation + (180 / Math.PI * (this._position[2] - oldZ) / 2.5);
            _super.prototype.updateState.call(this, 0.0);
        };
        return Player;
    }(GameObject));
    var Wall = (function (_super) {
        __extends(Wall, _super);
        function Wall(shape, material, scale, position) {
            if (scale === void 0) { scale = [1, 1, 1]; }
            if (position === void 0) { position = [0, 0, 0]; }
            _super.call(this, shape, material, scale, undefined, undefined, position, undefined, undefined, undefined, undefined, undefined, undefined);
        }
        Wall.prototype.updateState = function (timeElapsed) {
            _super.prototype.updateState.call(this, timeElapsed);
        };
        return Wall;
    }(GameObject));
    var PowerupType;
    (function (PowerupType) {
        PowerupType[PowerupType["Duplicate"] = 0] = "Duplicate";
        PowerupType[PowerupType["Speedup"] = 1] = "Speedup";
    })(PowerupType || (PowerupType = {}));
    var Powerup = (function (_super) {
        __extends(Powerup, _super);
        function Powerup(shape, material, scale, position, type) {
            if (scale === void 0) { scale = [1, 1, 1]; }
            if (position === void 0) { position = [0, 0, 0]; }
            _super.call(this, shape, material, scale, undefined, undefined, position, undefined, undefined, undefined, undefined, undefined, undefined);
            this._type = type;
            this._timeLeft = 7;
            this._activated = false;
        }
        Powerup.prototype.enablePowerup = function (z) {
            if (this._activated)
                return;
            this._activated = true;
            switch (this._type) {
                case PowerupType.Duplicate:
                    playerObjects.push(new Player(s_sphere, this._mat, [2.5, 2.5, 2.5], undefined, undefined, [0, 5, z + 5], [0, 0, -PLAYER_DEFAULT_Z_VELOCITY], undefined, undefined, undefined));
                    break;
                case PowerupType.Speedup:
                    CUR_HORIZONTAL_VELOCITY = MAX_HORIZONTAL_VELOCITY;
                    PLAYER_CURRENT_Z_VELOCITY = PLAYER_MAX_Z_VELOCITY;
                    break;
            }
        };
        Powerup.prototype.disablePowerup = function () {
            switch (this._type) {
                case PowerupType.Duplicate:
                    break;
                case PowerupType.Speedup:
                    for (var i = 0; i < powerupObjects.length; i++) {
                        if (powerupObjects[i]._type == PowerupType.Speedup && powerupObjects[i]._timeLeft > 0 && powerupObjects[i]._activated)
                            return;
                    }
                    CUR_HORIZONTAL_VELOCITY = NORMAL_HORIZONTAL_VELOCITY;
                    PLAYER_CURRENT_Z_VELOCITY = PLAYER_DEFAULT_Z_VELOCITY;
                    break;
            }
        };
        return Powerup;
    }(GameObject));
    var Bird = (function (_super) {
        __extends(Bird, _super);
        function Bird(scale, rotateAbout, rotation, position, velocity, angularVelocity, acceleration, angularAcceleration, rotateAboutVelocity, rotateAboutAcceleration) {
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
            _super.call(this, null, null, scale, rotateAbout, rotation, position, velocity, angularVelocity, acceleration, angularAcceleration, rotateAboutVelocity, rotateAboutAcceleration);
        }
        Bird.prototype.updateState = function (timeElapsed) {
            var minIndex = 0;
            playerObjects.forEach(function (obj, index) {
                if (obj._position[2] > playerObjects[minIndex]._position[2])
                    minIndex = index;
            });
            this._position[0] = playerObjects[minIndex]._position[0];
            if (this._velocity[2] < -(PLAYER_DEFAULT_Z_VELOCITY + BIRD_MAXIMUM_Z_DELTA))
                this._velocity[2] = -(PLAYER_DEFAULT_Z_VELOCITY + BIRD_MAXIMUM_Z_DELTA);
            _super.prototype.updateState.call(this, timeElapsed);
        };
        Bird.prototype.drawBody = function (animation, model_transform, headMaterial, tailMaterial, bodyMaterial) {
            var base_transform = model_transform;
            // Base of the body
            model_transform = mult(model_transform, scale(2.0, 1, 1));
            s_cube.draw(animation.graphicsState, model_transform, bodyMaterial);
            model_transform = base_transform;
            // Head
            model_transform = mult(model_transform, translation(-1.5, 0, 0));
            model_transform = mult(model_transform, scale(0.5, 0.5, 0.5));
            s_sphere.draw(animation.graphicsState, model_transform, headMaterial);
            model_transform = base_transform;
            model_transform = mult(model_transform, translation(-1.85, 0, 0));
            model_transform = mult(model_transform, rotation(-270, 0, 0, 1));
            model_transform = mult(model_transform, scale(0.5, 0.75, 0.5));
            s_pyramid.draw(animation.graphicsState, model_transform, tailMaterial);
        };
        Bird.prototype.drawWings = function (animation, model_transform, wingMaterial) {
            var base_transform = model_transform;
            var angle = 45.0 * Math.sin(animation.graphicsState.animation_time / 150);
            // Left wing
            model_transform = mult(model_transform, translation(0, 0.5, 0.5));
            model_transform = mult(model_transform, rotation(angle, 1, 0, 0));
            model_transform = mult(model_transform, translation(0, 0, 1));
            model_transform = mult(model_transform, scale(0.75, 0.1, 2.0));
            s_cube.draw(animation.graphicsState, model_transform, wingMaterial);
            model_transform = base_transform;
            // Right wing
            model_transform = mult(model_transform, translation(0, 0.5, -0.5));
            model_transform = mult(model_transform, rotation(-angle, 1, 0, 0));
            model_transform = mult(model_transform, translation(0, 0, -1));
            model_transform = mult(model_transform, scale(0.75, 0.1, 2.0));
            s_cube.draw(animation.graphicsState, model_transform, wingMaterial);
        };
        Bird.prototype.drawPairOfLegs = function (animation, model_transform, legMaterial) {
            var angle = 12.5 + (12.5 * Math.sin(animation.graphicsState.animation_time / 150));
            var orig_transform = model_transform;
            // Left upper leg
            model_transform = mult(model_transform, translation(0, -0.5, 0.575));
            model_transform = mult(model_transform, rotation(angle, 1, 0, 0));
            model_transform = mult(model_transform, translation(0, -0.5, 0));
            var scale_transform = mult(model_transform, scale(0.25, 1, 0.15));
            s_cube.draw(animation.graphicsState, scale_transform, legMaterial);
            // Left lower leg
            model_transform = mult(model_transform, translation(0, -0.5, 0));
            model_transform = mult(model_transform, rotation(angle, 1, 0, 0));
            model_transform = mult(model_transform, translation(0, -0.5, 0));
            scale_transform = mult(model_transform, scale(0.25, 1, 0.15));
            s_cube.draw(animation.graphicsState, scale_transform, legMaterial);
            // Right upper leg
            model_transform = orig_transform;
            model_transform = mult(model_transform, translation(0, -0.5, -0.575));
            model_transform = mult(model_transform, rotation(-angle, 1, 0, 0));
            model_transform = mult(model_transform, translation(0, -0.5, 0));
            scale_transform = mult(model_transform, scale(0.25, 1, 0.15));
            s_cube.draw(animation.graphicsState, scale_transform, legMaterial);
            //Right lower leg
            model_transform = mult(model_transform, translation(0, -0.5, 0));
            model_transform = mult(model_transform, rotation(-angle, 1, 0, 0));
            model_transform = mult(model_transform, translation(0, -0.5, 0));
            scale_transform = mult(model_transform, scale(0.25, 1, 0.15));
            s_cube.draw(animation.graphicsState, scale_transform, legMaterial);
        };
        Bird.prototype.drawBird = function (animation, model_transform, headMaterial, tailMaterial, bodyMaterial, legMaterial, wingMaterial) {
            // move up and down
            var y = 1.5 * Math.sin(animation.graphicsState.animation_time / 750);
            model_transform = mult(model_transform, translation(0, y, 0));
            // face the direction of motion
            model_transform = mult(model_transform, rotation(-90, 0, 1, 0));
            var base_transform = model_transform;
            this.drawBody(animation, model_transform, headMaterial, tailMaterial, bodyMaterial);
            this.drawWings(animation, model_transform, wingMaterial);
            this.drawPairOfLegs(animation, model_transform, legMaterial);
        };
        Bird.prototype.draw = function (animation) {
            this.drawBird(animation, this._transform, purplePlastic, yellowPlastic, greyPlastic, greyPlastic, lightGreyPlastic);
        };
        return Bird;
    }(GameObject));
    var playerObjects = [];
    var sidewallObjects = [];
    var powerupObjects = [];
    var wallObjects = [];
    var bird;
    var gameTime = 0.0;
    // 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
    var purplePlastic = new Material(vec4(.9, .5, .9, 1), .5, .8, .8, 40, null), greyPlastic = new Material(vec4(.5, .5, .5, 1), .8, .8, .8, 20, null), lightGreyPlastic = new Material(vec4(.7, .7, .7, 1), .2, .4, .5, 20, null), brownPlastic = new Material(vec4(0.7, 0.4, 0, 1), .4, 0.1, 0.1, 20, null), greenPlastic = new Material(vec4(0.1, 0.95, 0.1), .45, .8, .8, 30, null), redPlastic = new Material(vec4(0.95, 0.1, 0.1), .45, .5, .5, 30, null), yellowPlastic = new Material(vec4(0.9, 0.9, 0.1), .45, .5, .5, 30, null), earth = new Material(vec4(.5, .5, .5, 1), .5, 1, .5, 40, "earth.gif"), stars = new Material(vec4(.5, .5, .5, 1), .5, 1, 1, 40, "stars.png"), wallTex = new Material(vec4(.5, .5, .5, 1), .5, 0.4, 0.2, 30, "wall.png"), ballTex = new Material(vec4(.5, .5, .5, 1), .7, 0.4, 0.6, 30, "ball.png"), speedTex = new Material(vec4(.5, .5, .5, 1), .9, 0.6, 0.9, 30, "speed.png");
    var s_cube;
    var s_teapot;
    var s_axis;
    var s_sphere;
    var s_fan;
    var s_strip;
    var s_cylinder;
    var s_pyramid;
    var s_wall;
    var BIRD_MAXIMUM_Z_DELTA = 5;
    var PLAYER_DEFAULT_Z_VELOCITY = 15;
    var PLAYER_MAX_Z_VELOCITY = 30;
    var PLAYER_CURRENT_Z_VELOCITY = PLAYER_DEFAULT_Z_VELOCITY;
    var MAX_HORIZONTAL_VELOCITY = 55;
    var NORMAL_HORIZONTAL_VELOCITY = 30;
    var CUR_HORIZONTAL_VELOCITY = NORMAL_HORIZONTAL_VELOCITY;
    var ACCELERATION = 800;
    var FLOOR_WIDTH = 75;
    var MAX_HORIZONTAL_POSITION = (FLOOR_WIDTH / 2) - 2.5;
    var camera_pos = [0, 55, 65];
    var last_z_pos;
    var previousWall;
    function randomInclusive(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }
    function createPowerup(z) {
        switch (randomInclusive(0, 1)) {
            case 0:
                switch (randomInclusive(1, 5)) {
                    case 1:
                        var tex = stars;
                        break;
                    case 2:
                        var tex = earth;
                        break;
                    case 3:
                        var tex = purplePlastic;
                        break;
                    case 4:
                        var tex = lightGreyPlastic;
                        break;
                    case 5:
                        var tex = yellowPlastic;
                        break;
                }
                powerupObjects.push(new Powerup(s_pyramid, tex, [4, 4, 4], [randomInclusive(-30, 30), 4, z], PowerupType.Duplicate));
                break;
            case 1:
                powerupObjects.push(new Powerup(s_cube, speedTex, [4, 4, 4], [randomInclusive(-30, 30), 4, z], PowerupType.Speedup));
                break;
        }
    }
    var previousType = 0;
    function generateWalls(z) {
        var length;
        var currentType;
        while ((currentType = randomInclusive(0, 4)) == previousType)
            continue;
        previousType = currentType;
        switch (currentType) {
            case 0:
                length = randomInclusive(45, FLOOR_WIDTH - 8);
                return [new Wall(s_cube, brownPlastic, [length, 3, 1], [-(MAX_HORIZONTAL_POSITION + 2.5 - length / 2), 4, z])];
            case 1:
                length = randomInclusive(45, FLOOR_WIDTH - 8);
                return [new Wall(s_cube, brownPlastic, [length, 3, 1], [MAX_HORIZONTAL_POSITION + 2.5 - length / 2, 4, z])];
            case 2:
                length = randomInclusive(35, 45);
                return [new Wall(s_cube, brownPlastic, [length, 3, 1], [-(MAX_HORIZONTAL_POSITION + 2.5 - length / 2), 4, z]),
                    new Wall(s_cube, brownPlastic, [length / 2, 3, 1], [MAX_HORIZONTAL_POSITION + 2.5 - length / 4, 4, z])];
            case 3:
                length = randomInclusive(35, 45);
                return [new Wall(s_cube, brownPlastic, [length, 3, 1], [MAX_HORIZONTAL_POSITION + 2.5 - length / 2, 4, z]),
                    new Wall(s_cube, brownPlastic, [length / 2, 3, 1], [-(MAX_HORIZONTAL_POSITION + 2.5 - length / 4), 4, z])];
            case 4:
                length = randomInclusive(30, 60);
                return [new Wall(s_cube, brownPlastic, [length, 3, 1], [0, 4, z])];
        }
    }
    function initializeGame(animation) {
        s_cube = new cube(null);
        s_teapot = new shape_from_file("teapot.obj");
        s_axis = new axis();
        s_sphere = new sphere(mat4(), 4);
        s_fan = new triangle_fan_full(10, mat4());
        s_strip = new rectangular_strip(1, mat4());
        s_cylinder = new cylindrical_strip(10, mat4());
        s_pyramid = new pyramid();
        s_wall = new wall();
        animation.graphicsState.camera_transform = lookAt(camera_pos, [0, 0, 0], [0, 1, 0]);
        playerObjects.push(new Player(s_sphere, ballTex, [2.5, 2.5, 2.5], undefined, undefined, [0, 5, 0], [0, 0, -PLAYER_DEFAULT_Z_VELOCITY], undefined, undefined, undefined));
        last_z_pos = 0;
        bird = new Bird([1, 1, 1], undefined, undefined, [0, 8, 15], [0, 0, -7], undefined, [0, 0, -0.75]);
        for (var i = 40; i > -15; i--) {
            sidewallObjects.push(new GameObject(s_cube, redPlastic, [FLOOR_WIDTH, 5, 5], undefined, undefined, [0, 0, -5 * i]));
            sidewallObjects.push(new GameObject(s_wall, wallTex, [5, 10, 5], undefined, undefined, [FLOOR_WIDTH / 2 + 2.5, 10, -5 * i]));
            sidewallObjects.push(new GameObject(s_wall, wallTex, [5, 10, 5], undefined, undefined, [-(FLOOR_WIDTH / 2 + 2.5), 10, -5 * i]));
        }
        for (var i = 10; i > -5; i--) {
            Array.prototype.push.apply(wallObjects, generateWalls(-25 * i + 12.5));
        }
        for (var i = 1; i < 15; i++) {
            createPowerup(-100 * i);
        }
    }
    Game.initializeGame = initializeGame;
    function keyPressed(key) {
        switch (key) {
            case "ALT+q":
                playerObjects.forEach(function (obj) {
                    if (obj._velocity[0] > 0)
                        obj._velocity[0] = 0;
                    obj._acceleration[0] = -ACCELERATION;
                });
                break;
            case "ALT+e":
                playerObjects.forEach(function (obj) {
                    if (obj._velocity[0] < 0)
                        obj._velocity[0] = 0;
                    obj._acceleration[0] = ACCELERATION;
                });
                break;
        }
    }
    Game.keyPressed = keyPressed;
    function gameLoop(animation, timeElapsed) {
        if (timeElapsed != 0.0)
            simulateWorld(animation, timeElapsed);
        render(animation);
    }
    Game.gameLoop = gameLoop;
    function simulateWorld(animation, timeElapsed) {
        for (var _i = 0, playerObjects_1 = playerObjects; _i < playerObjects_1.length; _i++) {
            var obj = playerObjects_1[_i];
            obj.updateState(timeElapsed);
        }
        for (var _a = 0, powerupObjects_1 = powerupObjects; _a < powerupObjects_1.length; _a++) {
            var obj = powerupObjects_1[_a];
            obj.updateState(timeElapsed);
        }
        bird.updateState(timeElapsed);
        for (var _b = 0, wallObjects_1 = wallObjects; _b < wallObjects_1.length; _b++) {
            var obj = wallObjects_1[_b];
            obj.updateState(timeElapsed);
        }
        var maxIndex = 0;
        var minIndex = 0;
        playerObjects.forEach(function (obj, index) {
            if (obj._position[2] < playerObjects[maxIndex]._position[2])
                maxIndex = index;
            if (obj._position[2] > playerObjects[maxIndex]._position[2])
                minIndex = index;
        });
        var min = 0;
        for (var i = sidewallObjects.length - 1; i >= min;) {
            if (sidewallObjects[i]._position[2] > playerObjects[maxIndex]._position[2] + 75) {
                min += 3;
                var new_z = sidewallObjects[0]._position[2] - 5;
                for (var j = 0; j < 3; j++) {
                    var cur = sidewallObjects.pop();
                    cur._position[2] = new_z;
                    cur.updateState(0.0);
                    sidewallObjects.unshift(cur);
                }
            }
            else
                break;
        }
        for (var i = wallObjects.length - 1; wallObjects[i]._position[2] > playerObjects[maxIndex]._position[2] + 75; i = wallObjects.length - 1) {
            var currentZ = wallObjects[i]._position[2];
            while (wallObjects[wallObjects.length - 1]._position[2] == currentZ)
                wallObjects.pop();
            Array.prototype.unshift.apply(wallObjects, generateWalls(wallObjects[0]._position[2] - 25));
        }
        var pos_diff = playerObjects[maxIndex]._position[2] - last_z_pos;
        last_z_pos = playerObjects[maxIndex]._position[2];
        camera_pos[2] += pos_diff;
        animation.graphicsState.camera_transform = lookAt(camera_pos, [playerObjects[maxIndex]._position[0] / 2, playerObjects[maxIndex]._position[1] - 5, playerObjects[maxIndex]._position[2]], [0, 1, 0]);
        for (var _c = 0, playerObjects_2 = playerObjects; _c < playerObjects_2.length; _c++) {
            var obj = playerObjects_2[_c];
            for (var _d = 0, powerupObjects_2 = powerupObjects; _d < powerupObjects_2.length; _d++) {
                var obj2 = powerupObjects_2[_d];
                if ((Math.abs(obj._position[2] - obj2._position[2]) < 3) && (Math.abs(obj._position[0] - obj2._position[0]) < 3)) {
                    obj2.enablePowerup(obj._position[2]);
                    obj2._position[2] = -500000;
                    obj2._position[1] = -50;
                }
            }
        }
        for (var i = 0; i < powerupObjects.length; i++) {
            if (powerupObjects[i]._type == PowerupType.Duplicate && powerupObjects[i]._activated == true) {
                powerupObjects.splice(i, 1);
                createPowerup(powerupObjects[powerupObjects.length - 1]._position[2] - 150);
                i = 0;
            }
            else if (powerupObjects[i]._type == PowerupType.Speedup && powerupObjects[i]._activated == true) {
                powerupObjects[i]._timeLeft -= timeElapsed;
                if (powerupObjects[i]._timeLeft < 0) {
                    powerupObjects[i].disablePowerup();
                    powerupObjects.splice(i, 1);
                    createPowerup(powerupObjects[powerupObjects.length - 1]._position[2] - 150);
                    i = 0;
                }
            }
            if (powerupObjects[i]._position[2] > playerObjects[minIndex]._position[2] + 250) {
                powerupObjects.splice(i, 1);
                createPowerup(powerupObjects[powerupObjects.length - 1]._position[2] - 150);
            }
        }
        playerObjects = playerObjects.filter(function (obj) {
            if ((Math.abs(obj._position[2] - bird._position[2]) < 5) && (Math.abs(obj._position[0] - bird._position[0]) < 2)) {
                bird._velocity[2] = -10;
                return false;
            }
            return true;
        });
        if (playerObjects.length == 0) {
            alert("You died. Press okay to restart.");
            location.reload();
        }
        gameTime += timeElapsed;
    }
    function render(animation) {
        for (var _i = 0, playerObjects_3 = playerObjects; _i < playerObjects_3.length; _i++) {
            var obj = playerObjects_3[_i];
            obj.draw(animation);
        }
        for (var _a = 0, powerupObjects_3 = powerupObjects; _a < powerupObjects_3.length; _a++) {
            var obj = powerupObjects_3[_a];
            obj.draw(animation);
        }
        for (var _b = 0, sidewallObjects_1 = sidewallObjects; _b < sidewallObjects_1.length; _b++) {
            var obj = sidewallObjects_1[_b];
            obj.draw(animation);
        }
        bird.draw(animation);
        for (var _c = 0, wallObjects_2 = wallObjects; _c < wallObjects_2.length; _c++) {
            var obj = wallObjects_2[_c];
            obj.draw(animation);
        }
    }
})(Game || (Game = {}));
//# sourceMappingURL=game.js.map