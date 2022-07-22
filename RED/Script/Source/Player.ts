namespace Script {

    export let MAX_HEALTH: number = 100;

    // Player Node
    export class Player extends Actor {

        // Player Stats
        speed: number;
        MAX_SPEED: number;
        attackDamage: number;
        acceleration: number;
        // Physics
        rigidbody: ƒ.ComponentRigidbody;
        // External Data
        config: CustomJson;
        // Custome Death Sprite for Game Over
        deathAnimationSpriteNode: ƒAid.NodeSprite;

        constructor() {
            super("Player", MAX_HEALTH, 2, "avatar", 2, 1);
            // External Data
            this.loadFile()
            // Player Stats
            this.attackDamage = 10;
            this.speed = 0.005;
            // Adding Component to Node
            this.addComponent(new ƒ.ComponentTransform());
            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            this.addComponent(new ƒ.ComponentMesh(mesh));
            let material: ƒ.Material = new ƒ.Material("Player", ƒ.ShaderLit, new ƒ.CoatColored());
            let _material: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);
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

        public update() {
            this.stopAttackAnimation();
            this.move();
            this.timeout--;
        }

        public updateDirection() {
            this.direction.x = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT], [ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]);
            this.direction.y = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);

            if (this.direction.x != 0 || this.direction.y != 0) {
                this.lookingDirection = this.direction.clone;

                if (this.speed < this.MAX_SPEED) {
                    this.speed += this.acceleration;
                }
            } else {
                this.speed = 0;
                if (this.isStanding()) {
                    return;
                }
            }
            this.changeSprite();
        }

        public async die() {
            this.deactivateAllSprites();
            this.deathAnimationSpriteNode.activate(true);
        }

        private move() {
            // Map edges: Restrict player's movement
            let _translation = new ƒ.Vector3(this.speed * this.direction.x, this.speed * this.direction.y, 0);
            let _new_position = this.getPosition().toVector3();
            _new_position.add(_translation);

            if (Math.abs(_new_position.x) >= MAP_X_LIMIT) {
                this.direction.x = 0;
            }
            if (Math.abs(_new_position.y) >= MAP_Y_LIMIT) {
                this.direction.y = 0;
            }

            if (this.direction.x != 0 || this.direction.y != 0) {
                this.mtxLocal.translate(new ƒ.Vector3(this.speed * this.direction.x, this.speed * this.direction.y, 0));

                if (!this.soundMoving.isPlaying) {
                    this.soundMoving.play(true);
                }

            } else {
                this.mtxLocal.translate(ƒ.Vector3.ZERO());
                this.rigidbody.setVelocity(ƒ.Vector3.ZERO());
                this.soundMoving.play(false);
            }
        }

        private async loadSprite() {
            this.standRightSpriteNode = await createSpriteNode("Assets/avatar.png", [0, 704, 64, 64], 1, 64, "standRightSpriteNode", 10);
            this.standLeftSpriteNode = await createSpriteNode("Assets/avatar.png", [0, 576, 64, 64], 1, 64, "standLeftSpriteNode", 10);
            this.standTopSpriteNode = await createSpriteNode("Assets/avatar.png", [0, 512, 64, 64], 1, 64, "standTopSpriteNode", 10);
            this.standDownSpriteNode = await createSpriteNode("Assets/avatar.png", [0, 640, 64, 64], 1, 64, "standDownSpriteNode", 10);

            this.moveRightSpriteNode = await createSpriteNode("Assets/avatar.png", [64, 704, 64, 64], 8, 64, "moveRightSpriteNode", 10);
            this.moveLeftSpriteNode = await createSpriteNode("Assets/avatar.png", [64, 576, 64, 64], 8, 64, "moveLeftSpriteNode", 10);
            this.moveTopSpriteNode = await createSpriteNode("Assets/avatar.png", [64, 512, 64, 64], 8, 64, "moveTopSpriteNode", 10);
            this.moveDownSpriteNode = await createSpriteNode("Assets/avatar.png", [64, 640, 64, 64], 8, 64, "moveDownSpriteNode", 10);

            this.attackRightSpriteNode = await createSpriteNode("Assets/avatar.png", [0, 1920, 192, 192], 6, 192, "attackRightSpriteNode", 15);
            this.attackLeftSpriteNode = await createSpriteNode("Assets/avatar.png", [0, 1536, 192, 192], 6, 192, "attackLeftSpriteNode", 15);
            this.attackTopSpriteNode = await createSpriteNode("Assets/avatar.png", [0, 1344, 192, 192], 6, 192, "attackTopSpriteNode", 15);
            this.attackDownSpriteNode = await createSpriteNode("Assets/avatar.png", [0, 1728, 192, 192], 6, 192, "attackDownSpriteNode", 15);

            this.deathAnimationSpriteNode = await createSpriteNode("Assets/avatar.png", [3*64, 1280, 64, 64], 1, 64, "deathAnimationSpriteNode", 15);
            this.addChild(this.deathAnimationSpriteNode);
            
            this.standMoveSpriteList = [this.standRightSpriteNode, this.standLeftSpriteNode, this.standTopSpriteNode, this.standDownSpriteNode,
            this.moveRightSpriteNode, this.moveLeftSpriteNode, this.moveTopSpriteNode, this.moveDownSpriteNode];
            this.attackSpriteList = [this.attackRightSpriteNode, this.attackLeftSpriteNode, this.attackTopSpriteNode, this.attackDownSpriteNode];

            this.addSprites();
            // Can be used for coloring the buffed/debuffed enemy
            //let color = new ƒ.Color(255,0,0);
            //this.attackRightAnimation.spritesheet.color = color;
        }

        async loadFile(): Promise<void> {
            let file: Response = await fetch("config.json");
            this.config = await file.json();
            this.MAX_SPEED = this.config["MAX_SPEED"]
            this.acceleration = this.config["acceleration"]
        }
    }
}