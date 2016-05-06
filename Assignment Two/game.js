var Game;
(function (Game) {
    var GameObject = (function () {
        function GameObject(initialPos, initialVel, scale, shape, material) {
            if (initialPos === void 0) { initialPos = [0, 0, 0]; }
            if (initialVel === void 0) { initialVel = [0, 0, 0]; }
            if (scale === void 0) { scale = [1, 1, 1]; }
            this.pos = initialPos;
            this.vel = initialVel;
            this.scale = scale;
            this.shape = shape;
            this.mat = material;
        }
        return GameObject;
    }());
    var gameObjects = [];
    var gameTime = 0.0;
    // 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
    var purplePlastic = new Material(vec4(.9, .5, .9, 1), .2, .5, .8, 40, null), greyPlastic = new Material(vec4(.5, .5, .5, 1), .2, .8, .5, 20, null), lightGreyPlastic = new Material(vec4(.7, .7, .7, 1), .2, .4, .5, 20, null), brownPlastic = new Material(vec4(0.7, 0.4, 0, 1), .4, 0.1, 0.1, 20, null), greenPlastic = new Material(vec4(0.1, 0.95, 0.1), .45, .8, .8, 30, null), redPlastic = new Material(vec4(0.95, 0.1, 0.1), .45, .5, .5, 30, null), yellowPlastic = new Material(vec4(0.9, 0.9, 0.1), .45, .5, .5, 30, null), earth = new Material(vec4(.5, .5, .5, 1), .5, 1, .5, 40, "earth.gif"), stars = new Material(vec4(.5, .5, .5, 1), .5, 1, 1, 40, "stars.png");
    var s_cube;
    var s_teapot;
    var s_axis;
    var s_sphere;
    var s_fan;
    var s_strip;
    var s_cylinder;
    var s_pyramid;
    function initializeGame() {
        s_cube = new cube(null);
        s_teapot = new shape_from_file("teapot.obj");
        s_axis = new axis();
        s_sphere = new sphere(mat4(), 4);
        s_fan = new triangle_fan_full(10, mat4());
        s_strip = new rectangular_strip(1, mat4());
        s_cylinder = new cylindrical_strip(10, mat4());
        s_pyramid = new pyramid();
        gameObjects.push(new GameObject([0, 0, 0], [1, 1, 0], [5, 5, 5], s_pyramid, redPlastic));
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
            for (var i = 0; i < 3; i++) {
                obj.pos[i] += obj.vel[i] * timeElapsed;
            }
        }
        gameTime += timeElapsed;
    }
    function render(animation, objects) {
        for (var _i = 0, objects_2 = objects; _i < objects_2.length; _i++) {
            var obj = objects_2[_i];
            var obj_transform = translation(obj.pos[0], obj.pos[1], obj.pos[2]);
            obj_transform = mult(obj_transform, scale(obj.scale[0], obj.scale[1], obj.scale[2]));
            obj.shape.draw(animation.graphicsState, obj_transform, earth);
        }
    }
})(Game || (Game = {}));
//# sourceMappingURL=game.js.map