namespace Script {
    import ƒAid = FudgeAid;

    // State Machine for the Enemies
    export class StateMachine extends ƒAid.ComponentStateMachine<ACTION>  {
        private static instructions: ƒAid.StateMachineInstructions<ACTION> = StateMachine.setupStateMachine();
        public constructor() {
            super();
            this.instructions = StateMachine.instructions;
        }

        public static setupStateMachine(): ƒAid.StateMachineInstructions<ACTION> {
            let setup: ƒAid.StateMachineInstructions<ACTION> = new ƒAid.StateMachineInstructions();
            // Define State of walking towards Avatar
            setup.setAction(ACTION.WALK_TOWARDS, (_machine) => {
                let container: Enemy = <Enemy>(<ƒAid.ComponentStateMachine<ACTION>>_machine).node;
                //console.log("StateMachine :: Walking " + container.name);
                if (ƒ.Random.default.getRange(0, 1) > 0.95 + difficulty / 100)
                    _machine.transit(ACTION.REPOSITION);
                container.moveTowards(false);
            });
            // Define State of repositioning
            setup.setAction(ACTION.REPOSITION, (_machine) => {
                let container: Enemy = <Enemy>(<ƒAid.ComponentStateMachine<ACTION>>_machine).node;
                //console.log("StateMachine :: Transitioning from reposition to walk " + container.name);
                container.moveTowards(true);
                if (ƒ.Random.default.getRange(0, 1) > 0.95 - difficulty / 100)
                    _machine.transit(ACTION.WALK_TOWARDS);
            });
            return setup;
        }
    }
}
