module Game {
    type Vec3 = [number, number, number];
    class GameObject {
        pos: Vec3;
        vel: Vec3;
        scale: Vec3;
        shape: any;
        mat: any;

        constructor(initialPos: Vec3 = [0, 0, 0], initialVel: Vec3 = [0, 0, 0],
                    scale: Vec3 = [1, 1, 1],
                    shape: any, material: any) {
            this.pos = initialPos;
            this.vel = initialVel;
            this.scale = scale;
            this.shape = shape;
            this.mat = material;
        }
    }

    let gameObjects: GameObject[] = [];
    let gameTime: number = 0.0;

    // 1st parameter:  Color (4 floats in RGBA format), 2nd: Ambient light, 3rd: Diffuse reflectivity, 4th: Specular reflectivity, 5th: Smoothness exponent, 6th: Texture image.
    let purplePlastic = new Material(vec4(.9, .5, .9, 1), .2, .5, .8, 40, null),
        greyPlastic = new Material(vec4(.5, .5, .5, 1), .2, .8, .5, 20, null),
        lightGreyPlastic = new Material(vec4(.7, .7, .7, 1), .2, .4, .5, 20, null),
        brownPlastic = new Material(vec4(0.7, 0.4, 0, 1), .4, 0.1, 0.1, 20, null),
        greenPlastic = new Material(vec4(0.1, 0.95, 0.1), .45, .8, .8, 30, null),
        redPlastic = new Material(vec4(0.95, 0.1, 0.1), .45, .5, .5, 30, null),
        yellowPlastic = new Material(vec4(0.9, 0.9, 0.1), .45, .5, .5, 30, null),
        earth = new Material(vec4(.5, .5, .5, 1), .5, 1, .5, 40, "earth.gif"),
        stars = new Material(vec4(.5, .5, .5, 1), .5, 1, 1, 40, "stars.png");

    let s_cube;
    let s_teapot;
    let s_axis;
    let s_sphere;
    let s_fan;
    let s_strip;
    let s_cylinder;
    let s_pyramid;

    export function initializeGame() {
        s_cube = new cube(null);
        s_teapot = new shape_from_file("teapot.obj")
        s_axis = new axis();
        s_sphere = new sphere(mat4(), 4);
        s_fan = new triangle_fan_full(10, mat4());
        s_strip = new rectangular_strip(1, mat4());
        s_cylinder = new cylindrical_strip(10, mat4());
        s_pyramid = new pyramid();
        
        gameObjects.push(new GameObject([0, 0, 0], [1, 1, 0], [5, 5, 5], s_pyramid, redPlastic));
    }

    export function gameLoop(animation: any, timeElapsed: number) {
        if (timeElapsed != 0.0)
            simulateWorld(gameObjects, timeElapsed);
        render(animation, gameObjects);
    }

    function simulateWorld(objects: GameObject[], timeElapsed: number): void {
        for (let obj of objects) {
            for (let i = 0; i < 3; i++) {
                obj.pos[i] += obj.vel[i] * timeElapsed;
            }
        }
        gameTime += timeElapsed;
    }

    function render(animation: any, objects: GameObject[]): void {
        for (let obj of objects) {
            let obj_transform = translation(obj.pos[0], obj.pos[1], obj.pos[2]);
            obj_transform = mult(obj_transform, scale(obj.scale[0], obj.scale[1], obj.scale[2]));
            obj.shape.draw(animation.graphicsState, obj_transform, earth);
        }
    }
}