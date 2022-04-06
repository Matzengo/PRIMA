namespace Script {
  import ƒ = FudgeCore;
  //import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let pacman: ƒ.Node;
  let grid: ƒ.Node;
  let direction: ƒ.Vector2 = ƒ.Vector2.ZERO();
  let speed: number = 0.05;
  let waka: ƒ.ComponentAudio;

  /*
  let animations: ƒAid.SpriteSheetAnimations;
  let sprite: ƒAid.NodeSprite;
  */

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    console.log(viewport.camera);
    viewport.camera.mtxPivot.translateZ(-10);
    viewport.camera.mtxPivot.rotateY(0);
    viewport.camera.mtxPivot.translateX(-2);
    viewport.camera.mtxPivot.translateY(2);

    let graph: ƒ.Node = viewport.getBranch();
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

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    let posPacman: ƒ.Vector3 = pacman.mtxLocal.translation;
    let nearestGridPoint: ƒ.Vector2 = new ƒ.Vector2(Math.round(posPacman.x), Math.round(posPacman.y));
    let nearGridPoint: boolean = posPacman.toVector2().equals(nearestGridPoint, 0.05 * speed);

    if (nearGridPoint) {
      let directionOld: ƒ.Vector2 = direction.clone;
      if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]))
        direction.set(1, 0 );
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
  
  function blocked(_posCheck: ƒ.Vector2): boolean {
    let check: ƒ.Node = grid.getChild(_posCheck.y)?.getChild(_posCheck.x)?.getChild(0);
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
}