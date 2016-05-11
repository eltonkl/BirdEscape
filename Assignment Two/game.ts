module Game {
    type Vec3 = [number, number, number];
    
    class GameObject {
        _scale: Vec3;
        _rotateAbout: Vec3;
        _rotation: Vec3;
        _position: Vec3;
        
        _velocity: Vec3;
        _angularVelocity: Vec3;
        _acceleration: Vec3;
        _angularAcceleration: Vec3;
        _rotateAboutVelocity: Vec3;
        _rotateAboutAcceleration: Vec3;
        
        _shape: any;
        _mat: any;
        _transform: any;

        constructor(shape: any, material: any,
                    scale: Vec3 = [1, 1, 1],
                    rotateAbout: Vec3 = [0, 0, 0],
                    rotation: Vec3 = [0, 0, 0],
                    position: Vec3 = [0, 0, 0], 
                    velocity: Vec3 = [0, 0, 0], angularVelocity: Vec3 = [0, 0, 0],
                    acceleration: Vec3 = [0, 0, 0], angularAcceleration: Vec3 = [0, 0, 0],
                    rotateAboutVelocity: Vec3 = [0, 0, 0], rotateAboutAcceleration: Vec3 = [0, 0, 0]) {
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

        
        updateState(timeElapsed: number): void {
            if (timeElapsed != 0.0) {
                for (let i = 0; i < 3; i++) {
                    this._position[i] += this._velocity[i] * timeElapsed;
                    this._rotation[i] += this._angularVelocity[i] * timeElapsed;
                    this._rotateAbout[i] += this._rotateAboutVelocity[i] * timeElapsed;
                }
                for (let i = 0; i < 3; i++) {
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
        }

        draw(animation: any): void {
            this._shape.draw(animation.graphicsState, this._transform, this._mat);
        }   
    }

    let gameObjects: GameObject[] = [];
    let gameTime: number = 0.0;

    // 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
    let purplePlastic = new Material(vec4(.9, .5, .9, 1), .5, .8, .8, 40, null),
        greyPlastic = new Material(vec4(.5, .5, .5, 1), .8, .8, .8, 20, null),
        lightGreyPlastic = new Material(vec4(.7, .7, .7, 1), .2, .4, .5, 20, null),
        brownPlastic = new Material(vec4(0.7, 0.4, 0, 1), .4, 0.1, 0.1, 20, null),
        greenPlastic = new Material(vec4(0.1, 0.95, 0.1), .45, .8, .8, 30, null),
        redPlastic = new Material(vec4(0.95, 0.1, 0.1), .45, .5, .5, 30, null),
        yellowPlastic = new Material(vec4(0.9, 0.9, 0.1), .45, .5, .5, 30, null),
        earth = new Material(vec4(.5, .5, .5, 1), .5, 1, .5, 40, "earth.gif"),
        stars = new Material(vec4(.5, .5, .5, 1), .5, 1, 1, 40, "stars.png"),
        wallTex = new Material(vec4(.5, .5, .5, 1), .7, 0.4, 0.6, 30, "wall.png");

    let s_cube;
    let s_teapot;
    let s_axis;
    let s_sphere;
    let s_fan;
    let s_strip;
    let s_cylinder;
    let s_pyramid;
    let s_wall;

    export function initializeGame() {
        s_cube = new cube(null);
        s_teapot = new shape_from_file("teapot.obj")
        s_axis = new axis();
        s_sphere = new sphere(mat4(), 4);
        s_fan = new triangle_fan_full(10, mat4());
        s_strip = new rectangular_strip(1, mat4());
        s_cylinder = new cylindrical_strip(10, mat4());
        s_pyramid = new pyramid();
        s_wall = new wall();
        
        gameObjects.push(new GameObject(s_pyramid, stars, [3, 3, 3], [0, 2.5, 0], [-60, 0, 0],
                                        undefined, [0, 0, 0], undefined, undefined, undefined, [0, 0, -5]));
        for (let i = 0; i < 20; i++) {
            gameObjects.push(new GameObject(s_cube, earth, [40, 5, 5], [0, 0, -5*i], [-60, 0, 0], [0, 0, 0]));
            gameObjects.push(new GameObject(s_wall, wallTex, [5, 20, 5], [22.5, 10, -5*i], [-60, 0, 0], [0, 0, 0]));
            gameObjects.push(new GameObject(s_wall, wallTex, [5, 20, 5], [-22.5, 10, -5*i], [-60, 0, 0], [0, 0, 0]));
        }
    }

    export function gameLoop(animation: any, timeElapsed: number) {
        if (timeElapsed != 0.0)
            simulateWorld(gameObjects, timeElapsed);
        render(animation, gameObjects);
    }

    function simulateWorld(objects: GameObject[], timeElapsed: number): void {
        for (let obj of objects) {
            obj.updateState(timeElapsed);
        }
        gameTime += timeElapsed;
    }

    function render(animation: any, objects: GameObject[]): void {
        for (let obj of objects) {
            obj.draw(animation);
        }
    }
}