namespace Script {

  import ƒ = FudgeCore;

  let cameraNode: ƒ.Node;
  export let graph: ƒ.Node
  export let viewport: ƒ.Viewport;

  export let playerControl: Player;
  export let MAP_X_LIMIT: number;
  export let MAP_Y_LIMIT: number;
  // VUI
  export let vui : VisualUserInterface;

  let playerModel: ƒ.Node;
  let enemies: Enemy[];
  let amt_enemies: number = 1;
  export let difficulty: number = 1;
  let enemyModelTemplate: ƒ.Node;
  let level: number = 0;

  ƒ.Debug.info("Main Program Template running!");

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    MAP_X_LIMIT = 8.675;
    MAP_Y_LIMIT = 5.75;
    viewport = _event.detail;
    graph = viewport.getBranch();
    //Camera
    setCamera();

    //Player
    playerModel = graph.getChildrenByName("Avatar")[0];
    playerControl = new Player();
    playerModel.addChild(playerControl);
    enemyModelTemplate = graph.getChildrenByName("EnemyTemplate")[0];
    startNextLevel();

    //Console Log
    //console.log(playerModel);
    //console.log(viewport.camera);

    //Vui
    vui = new VisualUserInterface();
    vui.score = 0;

    ƒ.AudioManager.default.listenTo(graph);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  export function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    playerControl.update();
    vui.health = playerControl.getHealth();
    vui.level = level;

    let _currentHealth = playerControl.getHealth();
    graph.getChildrenByName("Light")[0].getComponents(ƒ.ComponentLight)[0].light.color = new ƒ.Color(255, _currentHealth / MAX_HEALTH, _currentHealth / MAX_HEALTH);
    if (_currentHealth <= 0) {
      stopGame();
    }
    enemies.forEach(enemy => {
      enemy.update();
    });
    let damagePolygon: Polygon;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {

      damagePolygon = playerControl.attack();

      //console.log("XXXXXXXX" + damagePolygon.points.toLocaleString());

      enemies.forEach(enemy => {
        // for each enemy: if enemy.mtxLocal.translation is in damagePolygon, apply damage to it
        if (damagePolygon.pnpoly(enemy.getPosition())) {
          if (enemy.receiveDamage(playerControl.attackDamage) <= 0) {
            enemies.splice(enemies.indexOf(enemy), 1);
            graph.getChildrenByName("EnemyTemplate")[0].removeChild(enemy);
          }
          // but: what about enemies hitbox? would just be middle of enemy... need to find hitbox algorithm (2 polygons intersect check)
        }
      });
      if (enemies.length == 0) {
        vui.score = vui.score + amt_enemies * 100;
        startNextLevel();
      }
    }
    viewport.draw();

    ƒ.AudioManager.default.update();
  }

  function startNextLevel() {
    level += 1;
    difficulty += 0.5;
    amt_enemies += 1;
    enemies = [];

    for (let index = 0; index < amt_enemies; index++) {

      let enemy = new Enemy("Enemy " + index, playerControl, 20 + 10 * level, 5 * level, 120, 0.05);
      enemies.push(enemy);
      enemyModelTemplate.addChild(enemies[index]);
    }
  }

  function stopGame() {
    graph.removeChild(playerModel);
    ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.stop();
  }

  function setCamera(): void {
    cameraNode = new ƒ.Node("camNode");
    let cameraComponent: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector("canvas");
    viewport.camera = cameraComponent;
    viewport.camera.projectCentral(canvas.clientWidth / canvas.clientHeight, 5);
    viewport.camera.mtxPivot.rotateY(180);
    viewport.camera.mtxPivot.translateZ(-250);
    cameraNode.addComponent(cameraComponent);
  }
}
