import { Container } from "pixi.js";
import { gsap } from "gsap";

export class SceneManager {

    private currentScene: Container | null = null;
    private isTransitioning = false;
    private stage: Container;

    constructor(stage: Container) {
        this.stage = stage;
    }

    public async changeScene(newScene: Container): Promise<void> {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        if (this.currentScene) {
            await this.fade(this.currentScene, 0);

            this.stage.removeChild(this.currentScene);

            this.currentScene.destroy({
                children: true
            });
        }

        this.currentScene = newScene;

        newScene.alpha = 0;

        this.stage.addChild(newScene);

        await this.fade(newScene, 1);

        this.isTransitioning = false;
    }

    private fade(target: Container, alpha: number): Promise<void> {
        return new Promise(resolve => {
            gsap.to(target, {
                alpha,
                duration: 0.3,
                onComplete: () => resolve()
            });
        });
    }
}