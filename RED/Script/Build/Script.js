"use strict";
var Script;
(function (Script) {
    class Actor extends ƒ.Node {
        // game specific
        health;
        attackRange;
        direction;
        lookingDirection;
        previousDirection;
        timeout;
        // Sounds
        soundMoving;
        soundAttacking;
        soundGettingHit;
        // Sprite Animation
        spriteName;
        spawnSpriteNode;
        standRightSpriteNode;
        standLeftSpriteNode;
        standTopSpriteNode;
        standDownSpriteNode;
        moveRightSpriteNode;
        moveLeftSpriteNode;
        moveTopSpriteNode;
        moveDownSpriteNode;
        attackRightSpriteNode;
        attackLeftSpriteNode;
        attackTopSpriteNode;
        attackDownSpriteNode;
        standMoveSpriteList;
        attackSpriteList;
        constructor(name, health, attackRange, spriteName, gettingHitSoundNumber, hittingSoundNumber, movingSoundNumber = 0) {
            super(name);
            // Stats
            this.health = health;
            this.attackRange = attackRange;
            this.timeout = 0;
            // Directions
            this.direction = ƒ.Vector2.ZERO();
            this.lookingDirection = ƒ.Vector2.ZERO();
            this.previousDirection = ƒ.Vector2.ZERO();
            // Sprite
            this.spriteName = spriteName;
            // Audio
            this.soundMoving = Script.graph.getChildrenByName("Sounds")[0].getComponents(ƒ.ComponentAudio)[movingSoundNumber];
            this.soundAttacking = Script.graph.getChildrenByName("Sounds")[0].getComponents(ƒ.ComponentAudio)[hittingSoundNumber];
            this.soundGettingHit = Script.graph.getChildrenByName("Sounds")[0].getComponents(ƒ.ComponentAudio)[gettingHitSoundNumber];
        }
        getHealth() {
            return this.health;
        }
        getPosition() {
            return this.mtxLocal.translation.toVector2();
        }
        attack(angle = Math.PI / 3) {
            if (this.timeout < 1) {
                this.attackAnimation();
                this.timeout = 60;
                let lowerLimit = new ƒ.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y);
                let currentDirection = this.lookingDirection;
                //https://matthew-brett.github.io/teaching/rotation_2d.html
                // x'= x cos(α) - y sin(α) | α in radians
                // y'= x sin(α) + y cos(α) | α in radians
                //        /^\  <-- direction vector
                //       /_|_\  <-- polygon = attack range
                // calculate top point of drawing
                let topLimit = new ƒ.Vector2(currentDirection.x, currentDirection.y);
                topLimit.scale(this.attackRange);
                topLimit.add(lowerLimit);
                let leftRotatedDirection = new ƒ.Vector2(currentDirection.x * Math.cos(angle) - currentDirection.y * Math.sin(angle), currentDirection.x * Math.sin(angle) + currentDirection.y * Math.cos(angle));
                let leftLimit = new ƒ.Vector2(leftRotatedDirection.x, leftRotatedDirection.y);
                leftLimit.scale(this.attackRange);
                leftLimit.add(lowerLimit);
                let rightRotatedDirection = new ƒ.Vector2(currentDirection.x * Math.cos(angle) - currentDirection.y * Math.sin(-1 * angle), currentDirection.x * Math.sin(-1 * angle) + currentDirection.y * Math.cos(angle));
                let rightLimit = new ƒ.Vector2(rightRotatedDirection.x, rightRotatedDirection.y);
                rightLimit.scale(this.attackRange);
                rightLimit.add(lowerLimit);
                return new Script.Polygon([lowerLimit, leftLimit, topLimit, rightLimit]);
            }
            else {
                return new Script.Polygon();
            }
        }
        receiveDamage(damage) {
            this.health -= damage;
            //console.log("Ouch! " + this.name + " received " + damage + " damage. Am now at " + this.health + "health");
            this.soundGettingHit.play(true);
            return this.health;
        }
        async loadSpawn(_row, _col) {
            this.spawnSpriteNode = await Script.createSpriteNode("Assets/" + this.spriteName + ".png", [_row * 64, _col * 64, 64, 64], 1, 64, "spawnSpriteNode", 10);
            this.addChild(this.spawnSpriteNode);
            this.spawnSpriteNode.activate(true);
        }
        addSprites() {
            this.standMoveSpriteList.forEach(sprite => this.addChild(sprite));
            this.attackSpriteList.forEach(sprite => this.addChild(sprite));
        }
        async changeSprite() {
            if (this.direction.equals(ƒ.Vector2.ZERO()) && !this.checkAttackAnimation()) {
                if (+this.previousDirection.y.toPrecision(1) == 1) {
                    this.deactivateAnimations();
                    this.standTopSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }
                else if (+this.previousDirection.y.toPrecision(1) == -1) {
                    this.deactivateAnimations();
                    this.standDownSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }
                else if (this.previousDirection.x >= 0) {
                    this.deactivateAnimations();
                    this.standRightSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }
                else if (this.previousDirection.x < 0) {
                    this.deactivateAnimations();
                    this.standLeftSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }
            }
            else if (!this.checkAttackAnimation()) {
                this.deactivateAnimations();
                if (+this.direction.y.toPrecision(1) == 1) {
                    this.moveTopSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }
                else if (+this.direction.y.toPrecision(1) == -1) {
                    this.moveDownSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }
                else if (this.direction.x >= 0) {
                    this.moveRightSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }
                else if (this.direction.x < 0) {
                    this.moveLeftSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }
            }
            this.previousDirection.set(this.direction.x, this.direction.y);
        }
        async deactivateAnimations() {
            this.standMoveSpriteList.forEach(sprite => sprite.activate(false));
        }
        async deactivateAttack() {
            this.attackSpriteList.forEach(sprite => sprite.activate(false));
        }
        async deactivateAllSprites() {
            this.deactivateAnimations();
            this.deactivateAttack();
        }
        async attackAnimation() {
            if (this.timeout < 1) {
                if (this.direction.equals(ƒ.Vector2.ZERO())) {
                    this.deactivateAnimations();
                    if (+this.lookingDirection.y.toPrecision(1) == 1) {
                        this.attackTopSpriteNode.activate(true);
                    }
                    else if (+this.lookingDirection.y.toPrecision(1) == -1) {
                        this.attackDownSpriteNode.activate(true);
                    }
                    else if (this.lookingDirection.x >= 0) {
                        this.attackRightSpriteNode.activate(true);
                    }
                    else if (this.lookingDirection.x < 0) {
                        this.attackLeftSpriteNode.activate(true);
                    }
                }
                else {
                    this.deactivateAnimations();
                    if (+this.direction.y.toPrecision(1) == 1) {
                        this.attackTopSpriteNode.activate(true);
                    }
                    else if (+this.direction.y.toPrecision(1) == -1) {
                        this.attackDownSpriteNode.activate(true);
                    }
                    else if (this.direction.x >= 0) {
                        this.attackRightSpriteNode.activate(true);
                    }
                    else if (this.direction.x < 0) {
                        this.attackLeftSpriteNode.activate(true);
                    }
                }
            }
        }
        async stopAttackAnimation() {
            if (!this.checkAttackAnimation()) {
                return;
            }
            if (this.attackTopSpriteNode.getCurrentFrame == 5 && +this.lookingDirection.y.toPrecision(1) == 1) {
                this.deactivateAttack();
                this.standTopSpriteNode.activate(true);
            }
            else if (this.attackDownSpriteNode.getCurrentFrame == 5 && +this.lookingDirection.y.toPrecision(1) == -1) {
                this.deactivateAttack();
                this.standDownSpriteNode.activate(true);
            }
            else if (this.attackRightSpriteNode.getCurrentFrame == 5 && this.lookingDirection.x >= 0) {
                this.deactivateAttack();
                this.standRightSpriteNode.activate(true);
            }
            else if (this.attackLeftSpriteNode.getCurrentFrame == 5 && this.lookingDirection.x < 0) {
                this.deactivateAttack();
                this.standLeftSpriteNode.activate(true);
            }
        }
        isStanding() {
            return this.standDownSpriteNode.isActive || this.standTopSpriteNode.isActive || this.standLeftSpriteNode.isActive || this.standRightSpriteNode.isActive;
        }
        checkAttackAnimation() {
            return this.attackSpriteList.filter(sprite => sprite.isActive).length > 0;
        }
    }
    Script.Actor = Actor;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    // -----Default CustomComponentScript was not used----
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    let ACTION;
    (function (ACTION) {
        ACTION[ACTION["WALK_TOWARDS"] = 0] = "WALK_TOWARDS";
        ACTION[ACTION["REPOSITION"] = 1] = "REPOSITION";
    })(ACTION = Script.ACTION || (Script.ACTION = {}));
    class Enemy extends Script.Actor {
        // foe
        foe;
        // State machine
        stateMachine;
        // Enemy Stats
        damage;
        speed;
        MAX_SPEED;
        acceleration = 0.01;
        attackSpeed;
        // For repositioning
        leftRight;
        constructor(name, foe, health, damage, attackSpeed, speed) {
            let attackRange = 1.3;
            super(name, health, attackRange, "enemy", 3, 1);
            // initialize state machine
            this.foe = foe;
            // own stats
            this.damage = damage;
            this.attackSpeed = attackSpeed;
            this.MAX_SPEED = speed;
            this.speed = 0;
            // Adding Component to Node
            this.addComponent(new ƒ.ComponentTransform());
            let mesh = new ƒ.MeshCube();
            this.addComponent(new ƒ.ComponentMesh(mesh));
            let material = new ƒ.Material("Enemy", ƒ.ShaderLit, new ƒ.CoatColored());
            let _material = new ƒ.ComponentMaterial(material);
            _material.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(_material);
            // sprites
            this.loadSpawn(0, 3);
            this.loadSprite();
            // Adding StateMachine to Enemy
            this.stateMachine = new Script.StateMachine();
            this.addComponent(this.stateMachine);
            this.stateMachine.stateCurrent = ACTION.REPOSITION;
            this.leftRight = true;
            // Use Component Script to generate Spawn Position
            let startPositionScript = new Script.RandomStartPositionScript();
            this.addComponent(startPositionScript);
        }
        update() {
            this.getComponent(Script.StateMachine).act();
            this.stopAttackAnimation();
            this.timeout--;
        }
        // Let the enemy move towards a target
        moveTowards(sideward = false) {
            let target = this.foe.getPosition();
            // console.log("moving towards player at position: " + target.x + " " + target.y);
            // √[(x2 – x1)^2 + (y2 – y1)^2]
            let currentDirection = new ƒ.Vector2(this.mtxLocal.translation.x, this.mtxLocal.translation.y);
            if (Math.sqrt(Math.pow(target.x - currentDirection.x, 2) + Math.pow(target.y - currentDirection.y, 2)) > this.attackRange) {
                let _direction = target.clone;
                _direction.subtract(currentDirection);
                _direction.normalize();
                let _new_position = this.getPosition();
                _new_position.add(_direction);
                if (Math.abs(_new_position.x) >= Script.MAP_X_LIMIT) {
                    if (sideward) {
                        _direction.y = 0;
                    }
                    else {
                        _direction.x = 0;
                    }
                }
                if (Math.abs(_new_position.y) >= Script.MAP_Y_LIMIT) {
                    if (sideward) {
                        _direction.x = 0;
                    }
                    else {
                        _direction.y = 0;
                    }
                }
                if (sideward) {
                    if (this.leftRight) {
                        this.mtxLocal.translate(new ƒ.Vector3(this.speed * -_direction.y, this.speed * _direction.x, 0));
                    }
                    else {
                        this.mtxLocal.translate(new ƒ.Vector3(this.speed * _direction.y, this.speed * -_direction.x, 0));
                    }
                }
                else {
                    this.mtxLocal.translate(new ƒ.Vector3(this.speed * _direction.x, this.speed * _direction.y, 0));
                    this.leftRight = !this.leftRight;
                }
                this.direction.set(_direction.x, _direction.y);
                if (this.direction.x != 0 || this.direction.y != 0) {
                    this.lookingDirection = this.direction.clone;
                    if (this.speed < this.MAX_SPEED) {
                        this.speed += this.acceleration;
                    }
                }
            }
            else {
                this.direction.set(0, 0);
                this.speed = 0;
                if (this.attack(Math.PI / 3).pnpoly(this.foe.getPosition())) {
                    this.foe.receiveDamage(this.damage);
                }
                if (this.isStanding()) {
                    return;
                }
            }
            this.changeSprite();
        }
        async loadSprite() {
            this.standRightSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [0, 704, 64, 64], 1, 64, "standRightSpriteNode", 10);
            this.standLeftSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [0, 576, 64, 64], 1, 64, "standLeftSpriteNode", 10);
            this.standTopSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [0, 512, 64, 64], 1, 64, "standTopSpriteNode", 10);
            this.standDownSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [0, 640, 64, 64], 1, 64, "standDownSpriteNode", 10);
            this.moveRightSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [64, 704, 64, 64], 8, 64, "moveRightSpriteNode", 10);
            this.moveLeftSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [64, 576, 64, 64], 8, 64, "moveLeftSpriteNode", 10);
            this.moveTopSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [64, 512, 64, 64], 8, 64, "moveTopSpriteNode", 10);
            this.moveDownSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [64, 640, 64, 64], 8, 64, "moveDownSpriteNode", 10);
            this.attackRightSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [0, 448, 64, 64], 7, 64, "attackRightSpriteNode", 15);
            this.attackLeftSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [0, 320, 64, 64], 7, 64, "attackLeftSpriteNode", 15);
            this.attackTopSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [0, 256, 64, 64], 7, 64, "attackTopSpriteNode", 15);
            this.attackDownSpriteNode = await Script.createSpriteNode("Assets/Enemy.png", [0, 384, 64, 64], 7, 64, "attackDownSpriteNode", 15);
            this.standMoveSpriteList = [this.standRightSpriteNode, this.standLeftSpriteNode, this.standTopSpriteNode, this.standDownSpriteNode,
                this.moveRightSpriteNode, this.moveLeftSpriteNode, this.moveTopSpriteNode, this.moveDownSpriteNode];
            this.attackSpriteList = [this.attackRightSpriteNode, this.attackLeftSpriteNode, this.attackTopSpriteNode, this.attackDownSpriteNode];
            this.addSprites();
        }
    }
    Script.Enemy = Enemy;
})(Script || (Script = {}));
var Script;
(function (Script) {
    window.addEventListener("load", init);
    let dialog;
    function init(_event) {
        dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            startInteractiveViewport();
        });
        //@ts-ignore
        dialog.showModal();
    }
    // setup and start interactive viewport
    async function startInteractiveViewport() {
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // pick the graph to show
        let graph = ƒ.Project.resources["Graph|2022-03-17T14:08:06.227Z|66368"];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        // setup the viewport
        let cmpCamera = new ƒ.ComponentCamera();
        Script.canvas = document.querySelector("canvas");
        let viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, Script.canvas);
        ƒ.Debug.log("Viewport:", viewport);
        // hide the cursor when interacting, also suppressing right-click menu
        //canvas.addEventListener("mousedown", canvas.requestPointerLock);
        //canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });
        // make the camera interactive (complex method in FudgeAid)
        //let cameraOrbit = FudgeAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        // setup audio
        //let cmpListener = new ƒ.ComponentAudioListener();
        //cmpCamera.node.addComponent(cmpListener);
        //FudgeCore.AudioManager.default.listenWith(cmpListener);
        //FudgeCore.AudioManager.default.listenTo(graph);
        //FudgeCore.Debug.log("Audio:", FudgeCore.AudioManager.default);
        // draw viewport once for immediate feedback
        //FudgeCore.Render.prepare(cameraOrbit);
        viewport.draw();
        Script.canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", {
            bubbles: true,
            detail: viewport
        }));
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let cameraNode;
    let playerModel;
    let enemies;
    let amt_enemies = 1;
    Script.difficulty = 1;
    let enemyModelTemplate;
    let level = 0;
    ƒ.Debug.info("Main Program Template running!");
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Script.MAP_X_LIMIT = 8.675;
        Script.MAP_Y_LIMIT = 5.75;
        Script.viewport = _event.detail;
        Script.graph = Script.viewport.getBranch();
        //Camera
        setCamera();
        //Player
        playerModel = Script.graph.getChildrenByName("Avatar")[0];
        Script.playerControl = new Script.Player();
        playerModel.addChild(Script.playerControl);
        enemyModelTemplate = Script.graph.getChildrenByName("EnemyTemplate")[0];
        startNextLevel();
        //Console Log
        //console.log(playerModel);
        //console.log(viewport.camera);
        //Vui
        Script.vui = new Script.VisualUserInterface();
        Script.vui.score = 0;
        ƒ.AudioManager.default.listenTo(Script.graph);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        // Event for 
        Script.viewport.addEventListener("\u0192keydown" /* DOWN */, hndPress);
        Script.viewport.activateKeyboardEvent("\u0192keydown" /* DOWN */, true);
        Script.viewport.setFocus(true);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    // Event for Attacks
    function hndPress(_event) {
        if ([ƒ.KEYBOARD_CODE.SPACE.toString()].includes(_event.code)) {
            attack();
        }
    }
    Script.hndPress = hndPress;
    function attack() {
        if (Script.playerControl.timeout < 1) {
            Script.playerControl.soundAttacking.play(true);
        }
        let damagePolygon = Script.playerControl.attack();
        enemies.forEach(enemy => {
            // for each enemy: if enemy.mtxLocal.translation is in damagePolygon, apply damage to it
            if (damagePolygon.pnpoly(enemy.getPosition())) {
                if (enemy.receiveDamage(Script.playerControl.attackDamage) <= 0) {
                    enemies.splice(enemies.indexOf(enemy), 1);
                    Script.vui.score += 50;
                    Script.graph.getChildrenByName("EnemyTemplate")[0].removeChild(enemy);
                }
                // but: what about enemies hitbox? would just be middle of enemy... need to find hitbox algorithm (2 polygons intersect check)
            }
        });
        if (enemies.length == 0) {
            startNextLevel();
        }
    }
    Script.attack = attack;
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        // Update Player
        Script.playerControl.update();
        Script.playerControl.updateDirection();
        // updating VUI
        Script.vui.health = (Script.playerControl.getHealth() / Script.MAX_HEALTH) * 1000;
        Script.vui.level = level;
        // Change Light depending on Players current health
        let _currentHealth = Script.playerControl.getHealth();
        Script.graph.getChildrenByName("Light")[0].getComponents(ƒ.ComponentLight)[0].light.color = new ƒ.Color(255, _currentHealth / Script.MAX_HEALTH, _currentHealth / Script.MAX_HEALTH);
        if (_currentHealth <= 0) {
            stopGame();
        }
        // Update Enemy
        enemies.forEach(enemy => {
            enemy.update();
        });
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    Script.update = update;
    function startNextLevel() {
        level += 1;
        Script.difficulty += 0.5;
        amt_enemies += 1;
        enemies = [];
        for (let index = 0; index < amt_enemies; index++) {
            let enemy = new Script.Enemy("Enemy " + index, Script.playerControl, 20 + 10 * level, 5 * level, 120, 0.05);
            enemies.push(enemy);
            enemyModelTemplate.addChild(enemies[index]);
        }
    }
    function stopGame() {
        Script.playerControl.die();
        let endScreen = document.querySelector("#endScreen");
        endScreen.style.display = "block";
        let p = document.createElement("p");
        p.innerHTML = "You died<br>Score: " + Script.vui.score;
        endScreen.appendChild(p);
        ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.stop();
    }
    function setCamera() {
        cameraNode = new ƒ.Node("camNode");
        let cameraComponent = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        Script.viewport.camera = cameraComponent;
        Script.viewport.camera.projectCentral(canvas.clientWidth / canvas.clientHeight, 5);
        Script.viewport.camera.mtxPivot.rotateY(180);
        Script.viewport.camera.mtxPivot.translateZ(-250);
        cameraNode.addComponent(cameraComponent);
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    Script.MAX_HEALTH = 100;
    // Player Node
    class Player extends Script.Actor {
        // Player Stats
        speed;
        MAX_SPEED;
        attackDamage;
        acceleration;
        // Physics
        rigidbody;
        // External Data
        config;
        // Custome Death Sprite for Game Over
        deathAnimationSpriteNode;
        constructor() {
            super("Player", Script.MAX_HEALTH, 2, "avatar", 2, 1);
            // External Data
            this.loadFile();
            // Player Stats
            this.attackDamage = 10;
            this.speed = 0.005;
            // Adding Component to Node
            this.addComponent(new ƒ.ComponentTransform());
            let mesh = new ƒ.MeshCube();
            this.addComponent(new ƒ.ComponentMesh(mesh));
            let material = new ƒ.Material("Player", ƒ.ShaderLit, new ƒ.CoatColored());
            let _material = new ƒ.ComponentMaterial(material);
            _material.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(_material);
            // sprites
            this.loadSpawn(0, 3);
            this.loadSprite();
            // Adding rigid body
            this.rigidbody = new ƒ.ComponentRigidbody();
            this.addComponent(this.rigidbody);
            this.rigidbody.effectRotation = ƒ.Vector3.ZERO();
            this.rigidbody.friction = 0;
            this.rigidbody.effectGravity = 0;
            this.rigidbody.setVelocity(ƒ.Vector3.ZERO());
        }
        update() {
            this.stopAttackAnimation();
            this.move();
            this.timeout--;
        }
        updateDirection() {
            this.direction.x = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
            this.direction.y = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
            if (this.direction.x != 0 || this.direction.y != 0) {
                this.lookingDirection = this.direction.clone;
                if (this.speed < this.MAX_SPEED) {
                    this.speed += this.acceleration;
                }
            }
            else {
                this.speed = 0;
                if (this.isStanding()) {
                    return;
                }
            }
            this.changeSprite();
        }
        async die() {
            this.deactivateAllSprites();
            this.deathAnimationSpriteNode.activate(true);
        }
        move() {
            // Map edges: Restrict player's movement
            let _translation = new ƒ.Vector3(this.speed * this.direction.x, this.speed * this.direction.y, 0);
            let _new_position = this.getPosition().toVector3();
            _new_position.add(_translation);
            if (Math.abs(_new_position.x) >= Script.MAP_X_LIMIT) {
                this.direction.x = 0;
            }
            if (Math.abs(_new_position.y) >= Script.MAP_Y_LIMIT) {
                this.direction.y = 0;
            }
            if (this.direction.x != 0 || this.direction.y != 0) {
                this.mtxLocal.translate(new ƒ.Vector3(this.speed * this.direction.x, this.speed * this.direction.y, 0));
                if (!this.soundMoving.isPlaying) {
                    this.soundMoving.play(true);
                }
            }
            else {
                this.mtxLocal.translate(ƒ.Vector3.ZERO());
                this.rigidbody.setVelocity(ƒ.Vector3.ZERO());
                this.soundMoving.play(false);
            }
        }
        async loadSprite() {
            this.standRightSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [0, 704, 64, 64], 1, 64, "standRightSpriteNode", 10);
            this.standLeftSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [0, 576, 64, 64], 1, 64, "standLeftSpriteNode", 10);
            this.standTopSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [0, 512, 64, 64], 1, 64, "standTopSpriteNode", 10);
            this.standDownSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [0, 640, 64, 64], 1, 64, "standDownSpriteNode", 10);
            this.moveRightSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [64, 704, 64, 64], 8, 64, "moveRightSpriteNode", 10);
            this.moveLeftSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [64, 576, 64, 64], 8, 64, "moveLeftSpriteNode", 10);
            this.moveTopSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [64, 512, 64, 64], 8, 64, "moveTopSpriteNode", 10);
            this.moveDownSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [64, 640, 64, 64], 8, 64, "moveDownSpriteNode", 10);
            this.attackRightSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [0, 1920, 192, 192], 6, 192, "attackRightSpriteNode", 15);
            this.attackLeftSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [0, 1536, 192, 192], 6, 192, "attackLeftSpriteNode", 15);
            this.attackTopSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [0, 1344, 192, 192], 6, 192, "attackTopSpriteNode", 15);
            this.attackDownSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [0, 1728, 192, 192], 6, 192, "attackDownSpriteNode", 15);
            this.deathAnimationSpriteNode = await Script.createSpriteNode("Assets/avatar.png", [3 * 64, 1280, 64, 64], 1, 64, "deathAnimationSpriteNode", 15);
            this.addChild(this.deathAnimationSpriteNode);
            this.standMoveSpriteList = [this.standRightSpriteNode, this.standLeftSpriteNode, this.standTopSpriteNode, this.standDownSpriteNode,
                this.moveRightSpriteNode, this.moveLeftSpriteNode, this.moveTopSpriteNode, this.moveDownSpriteNode];
            this.attackSpriteList = [this.attackRightSpriteNode, this.attackLeftSpriteNode, this.attackTopSpriteNode, this.attackDownSpriteNode];
            this.addSprites();
            // Can be used for coloring the buffed/debuffed enemy
            //let color = new ƒ.Color(255,0,0);
            //this.attackRightAnimation.spritesheet.color = color;
        }
        async loadFile() {
            let file = await fetch("config.json");
            this.config = await file.json();
            this.MAX_SPEED = this.config["MAX_SPEED"];
            this.acceleration = this.config["acceleration"];
        }
    }
    Script.Player = Player;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    // Using Component Script to generate Randome Spawn postion for Enemies
    class RandomStartPositionScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(Script.CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.generateRandomPosition);
        }
        generateRandomPosition() {
            this.node.mtxLocal.translate(new ƒ.Vector3(ƒ.Random.default.getRange(-Script.MAP_X_LIMIT + 1, Script.MAP_X_LIMIT - 1), ƒ.Random.default.getRange(-Script.MAP_Y_LIMIT + 1, Script.MAP_Y_LIMIT - 1)));
        }
    }
    Script.RandomStartPositionScript = RandomStartPositionScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    // Function to create Node Sprites from Informations
    async function createSpriteNode(_location, _position, _frames, _offset, _name, _framrate) {
        // Create Animation
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load(_location);
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        let animation = new ƒAid.SpriteSheetAnimation("Animation", coat);
        animation.generateByGrid(ƒ.Rectangle.GET(_position[0], _position[1], _position[2], _position[3]), _frames, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(_offset));
        // Add Animation to NodeSprite
        let sprite = new ƒAid.NodeSprite(_name);
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = _framrate;
        sprite.activate(false);
        return sprite;
    }
    Script.createSpriteNode = createSpriteNode;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒAid = FudgeAid;
    // State Machine for the Enemies
    class StateMachine extends ƒAid.ComponentStateMachine {
        static instructions = StateMachine.setupStateMachine();
        constructor() {
            super();
            this.instructions = StateMachine.instructions;
        }
        static setupStateMachine() {
            let setup = new ƒAid.StateMachineInstructions();
            // Define State of walking towards Avatar
            setup.setAction(Script.ACTION.WALK_TOWARDS, (_machine) => {
                let container = _machine.node;
                //console.log("StateMachine :: Walking " + container.name);
                if (ƒ.Random.default.getRange(0, 1) > 0.95 + Script.difficulty / 100)
                    _machine.transit(Script.ACTION.REPOSITION);
                container.moveTowards(false);
            });
            // Define State of repositioning
            setup.setAction(Script.ACTION.REPOSITION, (_machine) => {
                let container = _machine.node;
                //console.log("StateMachine :: Transitioning from reposition to walk " + container.name);
                container.moveTowards(true);
                if (ƒ.Random.default.getRange(0, 1) > 0.95 - Script.difficulty / 100)
                    _machine.transit(Script.ACTION.WALK_TOWARDS);
            });
            return setup;
        }
    }
    Script.StateMachine = StateMachine;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    // Virtual User Interface for HP, Level and Sccore
    class VisualUserInterface extends ƒ.Mutable {
        health;
        level;
        score;
        constructor() {
            super();
            const domVui = document.querySelector("div#vui");
            console.log("VUI", new ƒUi.Controller(this, domVui));
        }
        reduceMutator(_mutator) {
        }
    }
    Script.VisualUserInterface = VisualUserInterface;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Polygon {
        points;
        constructor(x = []) {
            this.points = x;
        }
        pnpoly(test) {
            let c = false;
            for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
                if (((this.points[i].y > test.y) != (this.points[j].y > test.y)) &&
                    (test.x < (this.points[j].x - this.points[i].x) * (test.y - this.points[i].y) / (this.points[j].y - this.points[i].y) + this.points[i].x))
                    c = !c;
            }
            return c;
        }
    }
    Script.Polygon = Polygon;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map