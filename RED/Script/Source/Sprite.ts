namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    // Function to create Node Sprites from Informations
    export async function createSpriteNode( _location: RequestInfo, _position: number[], _frames: number, _offset: number, _name: string, _framrate: number): Promise<ƒAid.NodeSprite> {
        // Create Animation
        let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheet.load(_location);
        let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("Animation", coat);
        animation.generateByGrid(ƒ.Rectangle.GET(_position[0], _position[1], _position[2], _position[3]), _frames, 32, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(_offset));
        // Add Animation to NodeSprite
        let sprite: ƒAid.NodeSprite = new ƒAid.NodeSprite(_name);
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = _framrate;
        sprite.activate(false);
        return sprite; 
    }
}