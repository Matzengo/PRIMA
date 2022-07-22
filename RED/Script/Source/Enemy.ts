namespace Script {

    export enum ACTION {
        WALK_TOWARDS, REPOSITION
    }

    export class Enemy extends Actor {
        // foe
        foe: Player;
        // State machine
        stateMachine: StateMachine;
        // Enemy Stats
        damage: number;
        speed: number;
        MAX_SPEED: number;
        acceleration: number = 0.01;
        attackSpeed: number;
        // For repositioning
        leftRight: boolean;

        constructor(name: string, foe: Player, health: number, damage: number, attackSpeed: number, speed: number) {
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
            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            this.addComponent(new ƒ.ComponentMesh(mesh));
            let material: ƒ.Material = new ƒ.Material("Enemy", ƒ.ShaderLit, new ƒ.CoatColored());
            let _material: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
            _material.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(_material);
            // sprites
            this.loadSpawn(0, 3);
            this.loadSprite();
            // Adding StateMachine to Enemy
            this.stateMachine = new StateMachine();
            this.addComponent(this.stateMachine);
            this.stateMachine.stateCurrent = ACTION.REPOSITION;
            this.leftRight = true;
            // Use Component Script to generate Spawn Position
            let startPositionScript: ƒ.Component  = new RandomStartPositionScript();
            this.addComponent(startPositionScript);
        }

        public update() {
            this.getComponent(StateMachine).act();
            this.stopAttackAnimation();
            this.timeout--;
        }


        // Let the enemy move towards a target
        public moveTowards(sideward: boolean = false) {
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

                if (Math.abs(_new_position.x) >= MAP_X_LIMIT) {
                    if (sideward) {
                        _direction.y = 0;
                    } else {
                        _direction.x = 0;
                    }
                }
                if (Math.abs(_new_position.y) >= MAP_Y_LIMIT) {
                    if (sideward) {
                        _direction.x = 0;
                    } else {
                        _direction.y = 0;
                    }
                }

                if (sideward) {
                    if (this.leftRight) {
                        this.mtxLocal.translate(new ƒ.Vector3(this.speed * -_direction.y, this.speed * _direction.x, 0));
                    } else {
                        this.mtxLocal.translate(new ƒ.Vector3(this.speed * _direction.y, this.speed * -_direction.x, 0));
                    }
                } else {
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

            } else {
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

        private async loadSprite() {
            this.standRightSpriteNode = await createSpriteNode("Assets/Enemy.png", [0, 704, 64, 64], 1, 64, "standRightSpriteNode", 10)
            this.standLeftSpriteNode = await createSpriteNode("Assets/Enemy.png", [0, 576, 64, 64], 1, 64, "standLeftSpriteNode", 10)
            this.standTopSpriteNode = await createSpriteNode("Assets/Enemy.png", [0, 512, 64, 64], 1, 64, "standTopSpriteNode", 10)
            this.standDownSpriteNode = await createSpriteNode("Assets/Enemy.png", [0, 640, 64, 64], 1, 64, "standDownSpriteNode", 10)

            this.moveRightSpriteNode = await createSpriteNode("Assets/Enemy.png", [64, 704, 64, 64], 8, 64, "moveRightSpriteNode", 10)
            this.moveLeftSpriteNode = await createSpriteNode("Assets/Enemy.png", [64, 576, 64, 64], 8, 64, "moveLeftSpriteNode", 10)
            this.moveTopSpriteNode = await createSpriteNode("Assets/Enemy.png", [64, 512, 64, 64], 8, 64, "moveTopSpriteNode", 10)
            this.moveDownSpriteNode = await createSpriteNode("Assets/Enemy.png", [64, 640, 64, 64], 8, 64, "moveDownSpriteNode", 10)

            this.attackRightSpriteNode = await createSpriteNode("Assets/Enemy.png", [0, 448, 64, 64], 7, 64, "attackRightSpriteNode", 15)
            this.attackLeftSpriteNode = await createSpriteNode("Assets/Enemy.png", [0, 320, 64, 64], 7, 64, "attackLeftSpriteNode", 15)
            this.attackTopSpriteNode = await createSpriteNode("Assets/Enemy.png", [0, 256, 64, 64], 7, 64, "attackTopSpriteNode", 15)
            this.attackDownSpriteNode = await createSpriteNode("Assets/Enemy.png", [0, 384, 64, 64], 7, 64, "attackDownSpriteNode", 15)

            this.standMoveSpriteList = [this.standRightSpriteNode, this.standLeftSpriteNode, this.standTopSpriteNode, this.standDownSpriteNode,
            this.moveRightSpriteNode, this.moveLeftSpriteNode, this.moveTopSpriteNode, this.moveDownSpriteNode];
            this.attackSpriteList = [this.attackRightSpriteNode, this.attackLeftSpriteNode, this.attackTopSpriteNode, this.attackDownSpriteNode];

            this.addSprites();
        }
    }
}
