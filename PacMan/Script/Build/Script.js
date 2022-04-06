"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
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
    var ƒ = FudgeCore;
    //import ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let pacman;
    let grid;
    let direction = ƒ.Vector2.ZERO();
    let speed = 0.05;
    let waka;
    /*
    let animations: ƒAid.SpriteSheetAnimations;
    let sprite: ƒAid.NodeSprite;
    */
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        console.log(viewport.camera);
        viewport.camera.mtxPivot.translateZ(-10);
        viewport.camera.mtxPivot.rotateY(0);
        viewport.camera.mtxPivot.translateX(-2);
        viewport.camera.mtxPivot.translateY(2);
        let graph = viewport.getBranch();
        pacman = graph.getChildrenByName("Pacman")[0];
        grid = graph.getChildrenByName("Grid")[0];
        console.log(pacman);
        ƒ.AudioManager.default.listenTo(graph);
        waka = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[1];
        // Old Viewport
        /*
        let graph: ƒ.Node = viewport.getBranch();
        pacman = graph.getChildrenByName("Pacman")[0];
        console.log(pacman);
        */
        //createSprite();
        //loadSprites();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        let posPacman = pacman.mtxLocal.translation;
        let nearestGridPoint = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
        let nearGridPoint = posPacman.toVector2().equals(nearestGridPoint, 0.05 * speed);
        if (nearGridPoint) {
            let directionOld = direction.clone;
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
                direction.set(1, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]))
                direction.set(-1, 0);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]))
                direction.set(0, 1);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]))
                direction.set(0, -1);
            if (blocked(ƒ.Vector2.SUM(nearestGridPoint, direction)))
                if (direction.equals(directionOld)) // did not turn
                    direction.set(0, 0); // full stop
                else {
                    if (blocked(ƒ.Vector2.SUM(nearestGridPoint, directionOld))) // wrong turn and dead end
                        direction.set(0, 0); // full stop
                    else
                        direction = directionOld; // don't turn but continue ahead
                }
            if (!direction.equals(directionOld) || direction.equals(ƒ.Vector2.ZERO()))
                pacman.mtxLocal.translation = nearestGridPoint.toVector3();
            if (direction.equals(ƒ.Vector2.ZERO()))
                waka.play(false);
            else if (!waka.isPlaying)
                waka.play(true);
        }
        pacman.mtxLocal.translate(ƒ.Vector2.SCALE(direction, speed).toVector3());
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function blocked(_posCheck) {
        let check = grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
        return (!check || check.name == "Wall");
    }
    /*
    function createSprite(): void {
      sprite = new ƒAid.NodeSprite("Sprite");
      sprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
      sprite.setAnimation(<ƒAid.SpriteSheetAnimation>animations["pacman"]);
      sprite.setFrameDirection(1);
      sprite.mtxLocal.translateZ(0.5);
      sprite.framerate = 15;
  
      pacman.addChild(sprite);
      pacman.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
      sprite.mtxLocal.rotateZ(90);
    }
  
    async function loadSprites(): Promise<void> {
      let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
      await imgSpriteSheet.load("Assets/PacMan64x64.png");
  
      let spriteSheet: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);
      generateSprite(spriteSheet);
    }
  
    function generateSprite(_spritesheet: ƒ.CoatTextured): void {
      animations = {};
      let name: string = "pacman";
  
      let sprite: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
      sprite.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 3, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
  
      animations[name] = sprite;
    }
    */
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map