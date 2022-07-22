namespace Script {
    window.addEventListener("load", init);
    export let canvas: HTMLCanvasElement;

    let dialog: HTMLDialogElement;
    function init(_event: Event): void {
        dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event: Event): void {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            startInteractiveViewport();
        });
        //@ts-ignore
        dialog.showModal();
    }

    // setup and start interactive viewport
    async function startInteractiveViewport(): Promise<void> {
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);

        // pick the graph to show
        let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-03-17T14:08:06.227Z|66368"];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }

        // setup the viewport
        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        canvas = document.querySelector("canvas");
        let viewport: ƒ.Viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);

        // hide the cursor when interacting, also suppressing right-click menu
        //canvas.addEventListener("mousedown", canvas.requestPointerLock);
        //canvas.addEventListener("mouseup", function () { document.exitPointerLock(); });

        // make the camera interactive (complex method in FudgeAid)
        //let cameraOrbit = FudgeAid.Viewport.expandCameraToInteractiveOrbit(viewport);

        // setup audio
        //let cmpListener = new ƒ.ComponentAudioListener();
        //cmpCamera.node.addComponent(cmpListener);
        //FudgeCore.AudioManager.default.listenWith(cmpListener);
        //FudgeCore.AudioManager.default.listenTo(graph);
        //FudgeCore.Debug.log("Audio:", FudgeCore.AudioManager.default);

        // draw viewport once for immediate feedback
        //FudgeCore.Render.prepare(cameraOrbit);
        viewport.draw();
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", {
            bubbles: true, 
            detail: viewport
        }));
    }
}