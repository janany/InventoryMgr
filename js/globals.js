var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
    b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint,
    b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
    b2WeldJointDef = Box2D.Dynamics.Joints.b2WeldJointDef;
    b2LineJointDef = Box2D.Dynamics.Joints.b2LineJointDef;

var Physics = function(element, scale) {
    var gravity = new b2Vec2(0, 9.8);
    //var gravity = new b2Vec2(0, 0);
    var world = this.world = new b2World(gravity, true);

    this.element = element;
    var context = this.context = element.getContext("2d");
    scale = this.scale = scale || 30;

    this.dtRemaining = 0;
    this.stepAmount = 1/60;

    window.fixDef = new b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;


    var physics = this,
        lastFrame = new Date().getTime();

    var gameLoop = function() {
        var tm = new Date().getTime();
        requestAnimFrame(gameLoop);
        var dt = (tm - lastFrame) / 1000;
        if(dt > 1/15) { dt = 1/15; }
        physics.step(dt);
        lastFrame = tm;
    };

    gameLoop();
};


Physics.prototype.debug = function() {
    this.debugDraw = new b2DebugDraw();
    this.debugDraw.SetSprite(this.context);
    console.log(this.scale);
    this.debugDraw.SetDrawScale(this.scale);
    this.debugDraw.SetFillAlpha(1);
    this.debugDraw.SetLineThickness(1.0);
    this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(this.debugDraw);
};

Physics.prototype.step = function(dt) {
    this.dtRemaining += dt;
    while(this.dtRemaining > this.stepAmount) {
        this.dtRemaining -= this.stepAmount;
        this.world.Step(this.stepAmount,
            10, // velocity iterations
            10);// position iterations
    }
    if(this.debugDraw) {
        this.world.DrawDebugData();
    } else {
        var obj = this.world.GetBodyList();
        this.context.clearRect(0, 0, this.element.width, this.element.height);

        if(this.bgColor) {
            this.context.setFillColor(this.bgColor);
            this.context.fillRect(0, 0, this.element.width, this.element.height);
        }

        this.context.save();
        this.context.scale(this.scale,this.scale);
        while(obj) {
            var body = obj.GetUserData();
            if(body) {  body.draw(this.context); }

            obj = obj.GetNext();
        }
        this.context.restore();
    }
};

Physics.prototype.getBodyAtPoint = function(x, y, callback) {
    var point = {
        x: x,
        y: y
    };

    this.world.QueryPoint(function(fixture) {
        callback({
            body: fixture.GetBody(),
            fixture: fixture,
            point: point
        });
    }, point);
};
Physics.prototype.click = function(callback) {
    var self = this;

    function handleClick(e) {
        e.preventDefault();
        var point = {
            x: (e.offsetX || e.layerX) / self.scale,
            y: (e.offsetY || e.layerY) / self.scale
        };

        self.world.QueryPoint(function(fixture) {
            callback(fixture.GetBody(),
                fixture,
                point);
        },point);
    }

    this.element.addEventListener("click",handleClick);
    this.element.addEventListener("touchstart",handleClick);
};


window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
        };
})();