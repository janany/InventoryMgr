(function createWorld() {
    window.physics = new Physics(document.getElementById('canvas'));
    physics.bgColor = "#000030";
    //physics.debug();
})();

(function fillSand() {
    function closeLoop(vertices) {
        var len = vertices.length,
            canvas = physics.element,
            dY = canvas.height / physics.scale;
        vertices.push({
            x: vertices[len - 1].x,
            y: dY
        }, {
            x: vertices[0].x,
            y: dY
        });

        return vertices[len - 1];
    }

    function getSandPattern() {
        var canvas = physics.element,
            maxX = canvas.width,
            minY = canvas.height * 0.1,
            maxY = canvas.height * 0.4,
            vX = 0, vY = minY,
            startX = 0, vertex,
            resetY = function(dY) {
                return (canvas.height - dY) / physics.scale;
            },
            vertices = [
                {
                    x: startX,
                    y: resetY(_.random(minY, maxY))
                }
            ], pairs = [];

        while (vX < maxX) {
            vX += _.random(15, 20);
            vY = _.random(minY, maxY);

            //vX = (vX > maxX)? maxX: vX;

            vertex = {
                x: vX / physics.scale,
                y: resetY(vY)
            };

            if(vertices.length < 2) {
                vertices.push(vertex);
            } else {
                var endPt = closeLoop(vertices);
                pairs.push(vertices);
                vertices = [endPt];
            }
        }
        if(vertices.length < 2) {
            vertices.push({
                x: maxX,
                y: resetY(_.random(minY, maxY))
            })
        }
        closeLoop(vertices);
        pairs.push(vertices);

        return pairs;
    }

    (function buildWalls() {
        /*walls*/
        new Body(physics, {
            color: "#777",
            type: "static",
            x: physics.element.width * .5 / physics.scale,
            y: physics.element.height / physics.scale,
            height: 0.01,
            width: physics.element.width / physics.scale
        });

        new Body(physics, {
            color: "#999",
            type: "static",
            x: 0,
            y: 0,
            height: 50,
            width: 0.01
        });

        new Body(physics, {
            color: "#999",
            type: "static",
            x: physics.element.width / physics.scale,
            y: 0,
            height: 50,
            width: 0.01
        });

        new Body(physics, {
            color: "#001",
            type: "static",
            x: 0,
            y: 0,
            width: 50,
            height: 0.01
        });

        /*walls end*/
    })();

    var sandBodies = [];
    (function buildSand() {
        var masterSandPattern = getSandPattern()
        window.x = masterSandPattern;
        _.each(masterSandPattern, function(vec) {
            sandBodies.push(new Body(physics, {
                type: "static",
                //color:"#865006",
                color: "rgba(222, 222, 222, 0.3)",
                //color: "#8650"+ _.random(10, 99),
                shape: "polygon",
                points: vec,
                friction: 0.2,
                restitution: 0,
                density: 10,
                name: "sand"
            }));
        });
    })();

    /*physics.element.addEventListener('click', function(e) {
     new Body(physics, {
     shape: "circle",
     x: _.random(2, 20),
     y: 1,
     radius: _.random(1, 5)/10,
     color: "#888",
     restitution: _.random(5, 12)/10,
     density: _.random(1, 10)/10
     });
     });*/

    function getTankY(x, callback) {
        physics.getBodyAtPoint(x, 14, function(details) {
            var points = details.body.m_userData.details.points;
            var line = {
                x1:points[0].x,
                y1:points[0].y,
                x2:points[1].x,
                y2:points[1].y
            };
            var m = (line.y2 - line.y1) / (line.x2 - line.x1);//Slope
            var py = line.y1 - m * (line.x1 - x);
            console.log(m);
            if (Math.abs(m) > .3 && false) {
                console.log("fixing");
                var residue = 0.1;
                if (line.y1 > line.y2) {
                    lastX = line.x1-residue;
                    py = line.y1;
                } else {
                    lastX = line.x2-residue;
                    py = line.y2;
                }
            }
            console.log(x, py);
            var angle = Math.atan(m);
            console.log(angle);

            callback(py, angle);
        });
    }

    var tanks = [],
        colors = ['red', 'green', 'blue', 'yellow', 'pink', 'grey'],
        lastX = 0;
    (function populateTanks() {
        var count = 5;
        for(var i=0; i<=count; i++) {
            lastX = lastX+_.random(2, 3);
            getTankY(lastX, function (tankY, angle) {
                tanks.push(new Tank(physics, lastX, tankY, angle, colors[i]));
            });
        }
    })();


    var currentTankIndex = 0;
    document.body.addEventListener('keydown', function(e) {
        var keyHandled = false;
        if(e.keyCode == 37 || e.keyCode == 39) {
            tanks[currentTankIndex].rotateCannon(e.keyCode == 37);
            keyHandled = true;
        }
        if(e.keyCode == 9) {
            if(currentTankIndex == tanks.length-1) {
                currentTankIndex = 0;
            } else {
                currentTankIndex++;
            }
            keyHandled = true;
        }
        if(e.keyCode == 32) {
            tanks[currentTankIndex].fire();
            keyHandled = true;
        }
        if(keyHandled) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
})();

function Tank(_physics, x, y, angle, color) {
    var vertices = [
        {
            x: 0,
            y: 2/10
        },
        {
            x: 0,
            y: 1/10
        },
        {
            x: 1/10,
            y: 0
        },
        {
            x: 3/10,
            y: 0
        },
        {
            x: 4/10,
            y: 1/10
        },
        {
            x: 4/10,
            y: 2/10
        }
    ];

    console.log("Angle: ", angle);
    this.body = new Body(_physics, {
        shape: "polygon",
        x: x,
        y: y,
        points: vertices,
        friction: 1,
        restitution: 0,
        density: 0,
        color: color,
        angle: 0,
        type: "static",
        name: "tank"

    });


    /*new Body(physics, {
        color: "#001",
        type: "static",
        x: x+0.2,
        y: y,
        width: 0.1,
        height: 1
    });

    new Body(physics, {
        color: "#001",
        type: "static",
        x: x-0.2,
        y: y,
        width: 0.1,
        height: 1
    });*/


    //this.body.body.ApplyForce(new b2Vec2(0, -1.2), this.body.body.GetWorldCenter());

    /*this.cannon = new Body(physics, {
     color: "white",
     width: 0.03,
     height: 0.30,
     x: 0,
     y: 2/10
     });*/

    /*var jointDef = new b2WeldJointDef;

     jointDef.bodyA = this.body.body;
     jointDef.bodyB = this.cannon.body;

     jointDef.localAnchorB = new b2Vec2(-2/10, 0);

     jointDef.collideConnected = false;

     this.joint = _physics.world.CreateJoint(jointDef);   */

    var self = this;
    this.rotateCannon = function(isAntiClockwise) {
        var angleStep = 1/10,
            cannon = self.cannon.body,
            currentAngle = cannon.GetAngle(),
            angle = currentAngle + (isAntiClockwise? -1: 1) * angleStep,
            diffAngle = self.body.body.GetAngle()-angle;

        if(diffAngle > 1.6) {
            angle = currentAngle;
        } else if(diffAngle < -1.6) {
            angle = currentAngle;
        }
        cannon.SetAngle(angle);
    };

    this.fire = function() {
        var body = self.cannon.body,
            pos = body.GetPosition(),
            mortar = new Body(physics, {
                shape: "circle",
                x: pos.x,
                y: pos.y,
                radius: 1/20,
                color: "#888",
                restitution: 8/10,
                density: 5/10,
                angle: body.GetAngle(),
                bullet: true,
                name: "mortar"
            });

        mortar.body.ApplyImpulse(new b2Vec2(0, 3), mortar.body.GetWorldCenter());
    };

    //jointDef.Initialize(this.body.body, this.cannon.body, this.body.body.GetWorldCenter());
    //jointDef.anchor = new b2Vec2(0, 2/10);

    var listener = new Box2D.Dynamics.b2ContactListener;
    window.collision = [];

    listener.BeginContact = function(contact) {
    }
    listener.EndContact = function(contact) {
        window.collision.push(contact.GetFixtureA().GetBody());
        if(contact.GetFixtureA().GetBody().GetUserData().details.name) {
            physics.world.DestroyBody(contact.GetFixtureA().GetBody());
        }
    }
    listener.PostSolve = function(contact, impulse) {

    }
    listener.PreSolve = function(contact, oldManifold) {

    }
    physics.world.SetContactListener(listener);
}

physics.click(function() {
    console.log(arguments);
});
