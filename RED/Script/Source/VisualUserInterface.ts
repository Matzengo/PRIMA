namespace Script {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;

    export class VisualUserInterface extends ƒ.Mutable {
        public health: number; 
        public level: number;
        public score: number;

        public constructor() {
          super();
          const domVui: HTMLDivElement = document.querySelector("div#vui");
          console.log("VUI", new ƒUi.Controller(this, domVui));
        }

        protected reduceMutator(_mutator: ƒ.Mutator): void { 
        }
      }


}
