declare namespace Script {
    import ƒAid = FudgeAid;
    class Actor extends ƒ.Node {
        health: number;
        attackRange: number;
        direction: ƒ.Vector2;
        lookingDirection: ƒ.Vector2;
        previousDirection: ƒ.Vector2;
        timeout: number;
        soundMoving: ƒ.ComponentAudio;
        soundAttacking: ƒ.ComponentAudio;
        soundGettingHit: ƒ.ComponentAudio;
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
        constructor(name: string, health: number, attackRange: number, spriteName: string, gettingHitSoundNumber: number, hittingSoundNumber: number, movingSoundNumber?: number);
        getHealth(): number;
        getPosition(): ƒ.Vector2;
        attack(angle?: number): Polygon;
        receiveDamage(damage: number): number;
        protected loadSpawn(_row: number, _col: number): Promise<void>;
        protected addSprites(): void;
        protected changeSprite(): Promise<void>;
        private deactivateAnimations;
        private deactivateAttack;
        protected deactivateAllSprites(): Promise<void>;
        private attackAnimation;
        protected stopAttackAnimation(): Promise<void>;
        protected isStanding(): boolean;
        protected checkAttackAnimation(): boolean;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    enum ACTION {
        WALK_TOWARDS = 0,
        REPOSITION = 1
    }
    class Enemy extends Actor {
        foe: Player;
        stateMachine: StateMachine;
        damage: number;
        speed: number;
        MAX_SPEED: number;
        acceleration: number;
        attackSpeed: number;
        leftRight: boolean;
        constructor(name: string, foe: Player, health: number, damage: number, attackSpeed: number, speed: number);
        update(): void;
        moveTowards(sideward?: boolean): void;
        private loadSprite;
    }
}
declare namespace Script {
    let canvas: HTMLCanvasElement;
}
declare namespace Script {
    interface CustomJson {
        [name: string]: number;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let graph: ƒ.Node;
    let viewport: ƒ.Viewport;
    let playerControl: Player;
    let MAP_X_LIMIT: number;
    let MAP_Y_LIMIT: number;
    let vui: VisualUserInterface;
    let difficulty: number;
    function hndPress(_event: ƒ.EventKeyboard): void;
    function attack(): void;
    function update(_event: Event): void;
}
declare namespace Script {
    let MAX_HEALTH: number;
    class Player extends Actor {
        speed: number;
        MAX_SPEED: number;
        attackDamage: number;
        acceleration: number;
        rigidbody: ƒ.ComponentRigidbody;
        config: CustomJson;
        deathAnimationSpriteNode: ƒAid.NodeSprite;
        constructor();
        update(): void;
        updateDirection(): void;
        die(): Promise<void>;
        private move;
        private loadSprite;
        loadFile(): Promise<void>;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class RandomStartPositionScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        generateRandomPosition(): void;
    }
}
declare namespace Script {
    import ƒAid = FudgeAid;
    function createSpriteNode(_location: RequestInfo, _position: number[], _frames: number, _offset: number, _name: string, _framrate: number): Promise<ƒAid.NodeSprite>;
}
declare namespace Script {
    import ƒAid = FudgeAid;
    class StateMachine extends ƒAid.ComponentStateMachine<ACTION> {
        private static instructions;
        constructor();
        static setupStateMachine(): ƒAid.StateMachineInstructions<ACTION>;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class VisualUserInterface extends ƒ.Mutable {
        health: number;
        level: number;
        score: number;
        constructor();
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    class Polygon {
        points: ƒ.Vector2[];
        constructor(x?: ƒ.Vector2[]);
        pnpoly(test: ƒ.Vector2): boolean;
    }
}
