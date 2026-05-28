import {WinText} from "../ui/display/WinText.ts";
import {gsap} from "gsap";

export class WinTextAnimation {

    public static play(text: WinText): void {

        gsap.killTweensOf(text);
        gsap.killTweensOf(text.scale);

        text.visible = true;
        text.alpha = 0;
        text.scale.set(0.5);

        gsap.timeline()
            .to(text, {
                alpha: 1,
                duration: 0.25,
            })

            .to(text.scale, {
                x: 1,
                y: 1,
                duration: 0.35,
                ease: "back.out(2)",
            }, 0)

            .to(text, {
                alpha: 0,
                duration: 0.4,
                delay: 1.2,

                onComplete: () => {
                    text.visible = false;
                }
            });
    }
}