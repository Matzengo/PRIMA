namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    // Using Component Script to generate Randome Spawn postion for Enemies
    export class RandomStartPositionScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        public message: string = "CustomComponentScript added to ";

        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.generateRandomPosition);
        }

        public generateRandomPosition(): void {
            this.node.mtxLocal.translate(new ƒ.Vector3(ƒ.Random.default.getRange(-MAP_X_LIMIT + 1, MAP_X_LIMIT - 1), ƒ.Random.default.getRange(-MAP_Y_LIMIT + 1, MAP_Y_LIMIT - 1)))
        }
    }
}