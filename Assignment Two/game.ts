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

    class Bee extends GameObject {
        constructor(scale: Vec3 = [1, 1, 1],
                    rotateAbout: Vec3 = [0, 0, 0],
                    rotation: Vec3 = [0, 0, 0],
                    position: Vec3 = [0, 0, 0], 
                    velocity: Vec3 = [0, 0, 0], angularVelocity: Vec3 = [0, 0, 0],
                    acceleration: Vec3 = [0, 0, 0], angularAcceleration: Vec3 = [0, 0, 0],
                    rotateAboutVelocity: Vec3 = [0, 0, 0], rotateAboutAcceleration: Vec3 = [0, 0, 0]) {
            super(null, null, scale, rotateAbout, rotation, position, velocity, angularVelocity, acceleration, angularAcceleration, rotateAboutVelocity, rotateAboutAcceleration);
        }
        
        updateState(timeElapsed: number): void {
            let minIndex = 0;
            playerObjects.forEach(function(obj: GameObject, index: number) {
                if (obj._position[2] < playerObjects[minIndex]._position[2])
                    minIndex = index;
            });
            this._position[0] = playerObjects[minIndex]._position[0];
            if (this._velocity[2] > -(PLAYER_DEFAULT_Z_VELOCITY + BEE_MAXIMUM_Z_DELTA))
                this._velocity[2] = -(PLAYER_DEFAULT_Z_VELOCITY + BEE_MAXIMUM_Z_DELTA);
            super.updateState(timeElapsed);
        }
        
        drawBody(animation, model_transform, headMaterial, tailMaterial, bodyMaterial): void
        {
            var base_transform = model_transform;
            // Base of the body
            model_transform = mult(model_transform, scale(2.0, 1, 1));
            s_cube.draw(animation.graphicsState, model_transform, bodyMaterial);

            model_transform = base_transform;
            // Tail
            model_transform = mult(model_transform, translation(2.5, 0, 0));
            model_transform = mult(model_transform, scale(1.5, 0.55, 0.55));
            s_sphere.draw(animation.graphicsState, model_transform, tailMaterial);

            model_transform = base_transform;
            // Head
            model_transform = mult(model_transform, translation(-1.5, 0, 0));
            model_transform = mult(model_transform, scale(0.5, 0.5, 0.5));
            s_sphere.draw(animation.graphicsState, model_transform, headMaterial);
        }

        drawWings(animation, model_transform, wingMaterial) : void
        {
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
        }

        drawPairOfLegs(animation, model_transform, legMaterial) : void
        {
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
        }

        drawBee(animation, model_transform, headMaterial, tailMaterial, bodyMaterial, legMaterial, wingMaterial) : void
        {
            // move up and down
	        var y = 1.5 * Math.sin(animation.graphicsState.animation_time / 750);
	        model_transform = mult(model_transform, translation(0, y, 0));
            // face the direction of motion
            model_transform = mult(model_transform, rotation(-90, 0, 1, 0));

            var base_transform = model_transform;

            this.drawBody(animation, model_transform, headMaterial, tailMaterial, bodyMaterial);
            this.drawWings(animation, model_transform, wingMaterial);
            this.drawPairOfLegs(animation, model_transform, legMaterial);
            model_transform = mult(model_transform, translation(0.5, 0, 0));
            this.drawPairOfLegs(animation, model_transform, legMaterial);
            model_transform = base_transform;
            model_transform = mult(model_transform, translation(-0.5, 0, 0));
            this.drawPairOfLegs(animation, model_transform, legMaterial);
        }
        
        draw(animation: any): void {
            this.drawBee(animation, this._transform, purplePlastic, yellowPlastic, greyPlastic, greyPlastic, lightGreyPlastic);
        }
    }

    let playerObjects: GameObject[] = [];
    let wallObjects: GameObject[] = [];
    let gameObjects: GameObject[] = [];
    let bee: Bee;
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

    const BEE_MAXIMUM_Z_DELTA: number = 0.5;
    const PLAYER_DEFAULT_Z_VELOCITY: number = 10;
    const MAX_HORIZONTAL_VELOCITY: number = 45;
    let CUR_HORIZONTAL_VELOCITY: number = MAX_HORIZONTAL_VELOCITY;
    const ACCELERATION: number = 800;
    const FLOOR_WIDTH: number = 75;
    const MAX_HORIZONTAL_POSITION: number = (FLOOR_WIDTH / 2) - 2.5;
    let camera_pos: Vec3 = [0, 55, 65];
    let last_z_pos: number;
    let previousWall: number;

    export function initializeGame(animation: any) {
        s_cube = new cube(null);
        s_teapot = new shape_from_file("teapot.obj")
        s_axis = new axis();
        s_sphere = new sphere(mat4(), 4);
        s_fan = new triangle_fan_full(10, mat4());
        s_strip = new rectangular_strip(1, mat4());
        s_cylinder = new cylindrical_strip(10, mat4());
        s_pyramid = new pyramid();
        s_wall = new wall();
        
        animation.graphicsState.camera_transform = lookAt(camera_pos, [0, 10, 0], [0, 1, 0]);
        playerObjects.push(new GameObject(s_sphere, earth, [2.5, 2.5, 2.5], undefined, undefined,
                                        [0, 5, 0], [0, 0, -PLAYER_DEFAULT_Z_VELOCITY], undefined, undefined, undefined));
        last_z_pos = 0;
        bee = new Bee([1, 1, 1], undefined, undefined, [0, 8, 30], [0, 0, -4], undefined, [0, 0, -0.01]);
        for (let i = 40; i > -15; i--) {
            wallObjects.push(new GameObject(s_cube, redPlastic, [FLOOR_WIDTH, 5, 5], undefined, undefined, [0, 0, -5*i]));
            wallObjects.push(new GameObject(s_wall, wallTex, [5, 20, 5], undefined, undefined, [FLOOR_WIDTH/2 + 2.5, 10, -5*i]));
            wallObjects.push(new GameObject(s_wall, wallTex, [5, 20, 5], undefined, undefined, [-(FLOOR_WIDTH/2 + 2.5), 10, -5*i]));
        }
    }

    export function keyPressed(key: string): void {
        switch (key) {
            case "ALT+q": playerObjects.forEach(function(obj) {
                if (obj._velocity[0] > 0)
                    obj._velocity[0] = 0;
                obj._acceleration[0] = -ACCELERATION; }); break;
            case "ALT+e": playerObjects.forEach(function(obj) {
                if (obj._velocity[0] < 0)
                    obj._velocity[0] = 0;
                obj._acceleration[0] = ACCELERATION; }); break;
        }
    }

    export function gameLoop(animation: any, timeElapsed: number) {
        if (timeElapsed != 0.0)
            simulateWorld(animation, timeElapsed);
        render(animation);
    }
    
    function simulateWorld(animation: any, timeElapsed: number): void {
        let maxIndex = 0;
        playerObjects.forEach(function(obj: GameObject, index: number) {
            if (obj._position[2] > playerObjects[maxIndex]._position[2])
                maxIndex = index;
        });
        
        let currentWall: number = Math.floor(playerObjects[maxIndex]._position[2]);
        if (currentWall % 5 == 0 && currentWall != previousWall) {
            previousWall = currentWall;
            let new_z = wallObjects[0]._position[2] - 5;
            for (let i = 0; i < 3; i++) {
                let cur = wallObjects.pop();
                cur._position[2] = new_z;
                cur.updateState(0.0);
                wallObjects.unshift(cur);
            }
        }
        for (let obj of playerObjects) {
            obj.updateState(timeElapsed);
        }
        for (let obj of gameObjects) {
            obj.updateState(timeElapsed);
        }
        for (let obj of playerObjects) {
            obj._acceleration[0] = 0;
            
            if (obj._velocity[0] > CUR_HORIZONTAL_VELOCITY)
                obj._velocity[0] = CUR_HORIZONTAL_VELOCITY;
            else if (obj._velocity[0] < -CUR_HORIZONTAL_VELOCITY)
                obj._velocity[0] = -CUR_HORIZONTAL_VELOCITY;
            if (Math.abs(obj._position[0]) > MAX_HORIZONTAL_POSITION) {
                if (obj._position[0] > MAX_HORIZONTAL_POSITION)
                    obj._position[0] = MAX_HORIZONTAL_POSITION;
                else if (obj._position[0] < -MAX_HORIZONTAL_POSITION)
                    obj._position[0] = -MAX_HORIZONTAL_POSITION;
                obj._velocity[0] = 0;
                obj._acceleration[0] = 0;
            }
            obj.updateState(0.0);
        }
        bee.updateState(timeElapsed);

       var newObj = playerObjects.filter(function(obj: GameObject) {
            //console.log((Math.abs(obj._position[2] - bee._position[2])));
            //console.log(obj._position[2]);
            //console.log(bee._position[2]);
            if ((Math.abs(obj._position[2] - bee._position[2]) < 5) && (Math.abs(obj._position[0] - bee._position[0]) < 2))
                return false;
            return true;
        });
        if (newObj.length == 0)
        {
            console.log("ha");
            asdf;
        }
        
        let pos_diff = playerObjects[0]._position[2] - last_z_pos;
        last_z_pos = playerObjects[0]._position[2];
        camera_pos[2] += pos_diff;
        animation.graphicsState.camera_transform = lookAt(camera_pos, [playerObjects[0]._position[0]/2, playerObjects[0]._position[1] - 5, playerObjects[0]._position[2]], [0, 1, 0]);
        gameTime += timeElapsed;
    }

    function render(animation: any): void {
        for (let obj of playerObjects) {
            obj.draw(animation);
        }
        for (let obj of wallObjects) {
            obj.draw(animation);
        }
        bee.draw(animation);
        for (let obj of gameObjects) {
            obj.draw(animation);
        }
    }
}