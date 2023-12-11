const w = 800,
    h = 800,
    ground_x = w / 2,
    ground_y = h - 10,
    ground_w = w,
    ground_h = 20,
    beam_w = w - 200,
    beam_h = 20,
    beam_x = w / 2,
    beam_y = h / 2,
    ball_x = 450,
    ball_y = 350,
    ball_rad = 20,
    FPS = 60,
    dt = 1000 / FPS

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Bodies = Matter.Bodies

// create engine
var engine = Engine.create(),
    world = engine.world

// create renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: w,
        height: h,
        wireframes: false,
        showAngleIndicator: true,
    },
})

// create runner
var runner = Runner.create({
    isFixed: true,
    delta: dt,
})

Runner.run(runner, engine)
Render.run(render)

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            // allow bodies on mouse to rotate
            angularStiffness: 0,
            render: {
                visible: false,
            },
        },
    })

Composite.add(world, mouseConstraint)

// keep the mouse in sync with rendering
render.mouse = mouse

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: w, y: h },
})

// main
var ground = Bodies.rectangle(ground_x, ground_y, ground_w, ground_h, {
    isStatic: true,
})

var beam = Bodies.rectangle(beam_x, beam_y, beam_w, beam_h, {
    render: { fillStyle: 'white' },
})
var ball = Bodies.circle(ball_x, ball_y, ball_rad, {
    render: { fillStyle: 'red' },
})

var constraint = Constraint.create({
    pointA: { x: beam_x, y: beam_y },
    bodyB: beam,
    length: 0,
})

let composite = Composite.add(world, [ground, beam, ball, constraint])

let err = 0
let set_point = 0

function reset(){
    Composite.clear(composite, deep=true)

    ground = Bodies.rectangle(ground_x, ground_y, ground_w, ground_h, {
        isStatic: true,
    })
    
    beam = Bodies.rectangle(beam_x, beam_y, beam_w, beam_h, {
        render: { fillStyle: 'white' },
    })
    ball = Bodies.circle(ball_x, ball_y, ball_rad, {
        render: { fillStyle: 'red' },
    })
    
    constraint = Constraint.create({
        pointA: { x: beam_x, y: beam_y },
        bodyB: beam,
        length: 0,
    })
    
    composite = Composite.add(world, [ground, beam, ball, constraint])

}

let controller = new PIDController(0.01, 0, 0, 1 / FPS, -10, 10)

const gui = new dat.GUI({ name: 'Ball Beam' })

gui.add(controller, 'kp', 0, 0.1, 0.001).onFinishChange(reset)
gui.add(controller, 'ki', 0, 0.1, 0.001).onFinishChange(reset)
gui.add(controller, 'kd', 0, 0.1, 0.001).onFinishChange(reset)
// gui.add({reset}, 'reset')


gui.open()

// callback
function tick(e) {
    err = ball.position.x - beam_x

    if (ball.position.y < 600) {
        let output = controller.compute(err, set_point)
        Body.applyForce(beam, { x: beam_x + 2, y: beam_y }, { x: 0, y: output })
    }

    // if (ball.position.y > 600) {
    //     console.log(err)
        
    // }

    // apply output as torque to beam

    // console.log(e.timestamp)
}

Matter.Events.on(runner, 'beforeTick', tick)
