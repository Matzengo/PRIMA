namespace Script {

    import ƒAid = FudgeAid;

    export class Actor extends ƒ.Node {

        // game specific
        health: number;
        attackRange: number;
        direction: ƒ.Vector2;
        lookingDirection: ƒ.Vector2;
        previousDirection: ƒ.Vector2;
        timeout: number;

        // Sounds
        soundMoving: ƒ.ComponentAudio;
        soundAttacking: ƒ.ComponentAudio;
        soundGettingHit: ƒ.ComponentAudio;

        // Sprite Animation
        spriteName: string;
        spawnSpriteNode: ƒAid.NodeSprite;

        standRightSpriteNode: ƒAid.NodeSprite;
        standLeftSpriteNode: ƒAid.NodeSprite;
        standTopSpriteNode: ƒAid.NodeSprite;
        standDownSpriteNode: ƒAid.NodeSprite;

        moveRightSpriteNode: ƒAid.NodeSprite;
        moveLeftSpriteNode: ƒAid.NodeSprite;
        moveTopSpriteNode: ƒAid.NodeSprite;
        moveDownSpriteNode: ƒAid.NodeSprite;

        attackRightSpriteNode: ƒAid.NodeSprite;
        attackLeftSpriteNode: ƒAid.NodeSprite;
        attackTopSpriteNode: ƒAid.NodeSprite;
        attackDownSpriteNode: ƒAid.NodeSprite;

        standMoveSpriteList: ƒAid.NodeSprite[];
        attackSpriteList: ƒAid.NodeSprite[];

        constructor(name: string, health: number, attackRange: number, spriteName: string, gettingHitSoundNumber: number, hittingSoundNumber: number, movingSoundNumber: number = 0) {
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
            this.soundMoving = graph.getChildrenByName("Sounds")[0].getComponents(ƒ.ComponentAudio)[movingSoundNumber];
            this.soundAttacking = graph.getChildrenByName("Sounds")[0].getComponents(ƒ.ComponentAudio)[hittingSoundNumber];
            this.soundGettingHit = graph.getChildrenByName("Sounds")[0].getComponents(ƒ.ComponentAudio)[gettingHitSoundNumber];
        }

        public getHealth(): number {
            return this.health;
        }

        public getPosition(): ƒ.Vector2 {
            return this.mtxLocal.translation.toVector2();
        }

        public attack(angle: number = Math.PI / 3): Polygon {
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

                let leftRotatedDirection: ƒ.Vector2 = new ƒ.Vector2(currentDirection.x * Math.cos(angle) - currentDirection.y * Math.sin(angle), currentDirection.x * Math.sin(angle) + currentDirection.y * Math.cos(angle));
                let leftLimit = new ƒ.Vector2(leftRotatedDirection.x, leftRotatedDirection.y);
                leftLimit.scale(this.attackRange);
                leftLimit.add(lowerLimit);

                let rightRotatedDirection: ƒ.Vector2 = new ƒ.Vector2(currentDirection.x * Math.cos(angle) - currentDirection.y * Math.sin(-1 * angle), currentDirection.x * Math.sin(-1 * angle) + currentDirection.y * Math.cos(angle))
                let rightLimit = new ƒ.Vector2(rightRotatedDirection.x, rightRotatedDirection.y);
                rightLimit.scale(this.attackRange);
                rightLimit.add(lowerLimit);

                return new Polygon([lowerLimit, leftLimit, topLimit, rightLimit]);
            } else {
                return new Polygon();
            }
        }

        public receiveDamage(damage: number): number {
            this.health -= damage;
            //console.log("Ouch! " + this.name + " received " + damage + " damage. Am now at " + this.health + "health");
            this.soundGettingHit.play(true);
            return this.health;
        }

        protected async loadSpawn(_row: number, _col: number) {
            this.spawnSpriteNode = await createSpriteNode("Assets/" + this.spriteName + ".png", [_row * 64, _col * 64, 64, 64], 1, 64, "spawnSpriteNode", 10)
            this.addChild(this.spawnSpriteNode);
            this.spawnSpriteNode.activate(true);
        }

        protected addSprites() {
            this.standMoveSpriteList.forEach(sprite => this.addChild(sprite));
            this.attackSpriteList.forEach(sprite => this.addChild(sprite));
        }

        protected async changeSprite() {
            if (this.direction.equals(ƒ.Vector2.ZERO()) && !this.checkAttackAnimation()) {

                if (+this.previousDirection.y.toPrecision(1) == 1) {
                    this.deactivateAnimations();
                    this.standTopSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                } else if (+this.previousDirection.y.toPrecision(1) == -1) {
                    this.deactivateAnimations();
                    this.standDownSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                } else if (this.previousDirection.x >= 0) {
                    this.deactivateAnimations();
                    this.standRightSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                } else if (this.previousDirection.x < 0) {
                    this.deactivateAnimations();
                    this.standLeftSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }

            } else if (!this.checkAttackAnimation()) {
                this.deactivateAnimations();
                if (+this.direction.y.toPrecision(1) == 1) {
                    this.moveTopSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                } else if (+this.direction.y.toPrecision(1) == -1) {
                    this.moveDownSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                } else if (this.direction.x >= 0) {
                    this.moveRightSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                } else if (this.direction.x < 0) {
                    this.moveLeftSpriteNode.activate(true);
                    this.spawnSpriteNode.activate(false);
                }
            }
            this.previousDirection.set(this.direction.x, this.direction.y);
        }

        private async deactivateAnimations() {
            this.standMoveSpriteList.forEach(sprite => sprite.activate(false));
        }

        private async deactivateAttack() {
            this.attackSpriteList.forEach(sprite => sprite.activate(false));
        }

        protected async deactivateAllSprites() {
            this.deactivateAnimations();
            this.deactivateAttack();
        }

        private async attackAnimation() {

            if (this.timeout < 1) {
                if (this.direction.equals(ƒ.Vector2.ZERO())) {
                    this.deactivateAnimations();
                    if (+this.lookingDirection.y.toPrecision(1) == 1) {
                        this.attackTopSpriteNode.activate(true);
                    } else if (+this.lookingDirection.y.toPrecision(1) == -1) {
                        this.attackDownSpriteNode.activate(true);
                    } else if (this.lookingDirection.x >= 0) {
                        this.attackRightSpriteNode.activate(true);
                    } else if (this.lookingDirection.x < 0) {
                        this.attackLeftSpriteNode.activate(true);
                    }
                } else {
                    this.deactivateAnimations();
                    if (+this.direction.y.toPrecision(1) == 1) {
                        this.attackTopSpriteNode.activate(true);
                    } else if (+this.direction.y.toPrecision(1) == -1) {
                        this.attackDownSpriteNode.activate(true);
                    } else if (this.direction.x >= 0) {
                        this.attackRightSpriteNode.activate(true);
                    } else if (this.direction.x < 0) {
                        this.attackLeftSpriteNode.activate(true);
                    }
                }
            }
        }

        protected async stopAttackAnimation() {
            if (!this.checkAttackAnimation()) {
                return;
            }
            if (this.attackTopSpriteNode.getCurrentFrame == 5 && +this.lookingDirection.y.toPrecision(1) == 1) {
                this.deactivateAttack();
                this.standTopSpriteNode.activate(true);
            } else if (this.attackDownSpriteNode.getCurrentFrame == 5 && +this.lookingDirection.y.toPrecision(1) == -1) {
                this.deactivateAttack();
                this.standDownSpriteNode.activate(true);
            } else if (this.attackRightSpriteNode.getCurrentFrame == 5 && this.lookingDirection.x >= 0) {
                this.deactivateAttack();
                this.standRightSpriteNode.activate(true);
            } else if (this.attackLeftSpriteNode.getCurrentFrame == 5 && this.lookingDirection.x < 0) {
                this.deactivateAttack();
                this.standLeftSpriteNode.activate(true);
            }
        }

        protected isStanding(): boolean {
            return this.standDownSpriteNode.isActive || this.standTopSpriteNode.isActive || this.standLeftSpriteNode.isActive || this.standRightSpriteNode.isActive;
        }

        protected checkAttackAnimation(): boolean {
            return this.attackSpriteList.filter(sprite => sprite.isActive).length > 0;
        }
    }
}