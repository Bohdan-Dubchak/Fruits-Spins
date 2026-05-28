import type {Sprite} from "pixi.js";
import {gsap} from "gsap";

export function animationSymbols (symbols: Sprite[]): void {
    symbols.forEach((sprite) => {
        gsap.killTweensOf(sprite);

        const originalRotation = sprite.rotation;

        const tl = gsap.timeline();

        tl.to(sprite, {
            rotation: originalRotation + 0.10,
            duration: 0.08,
            ease: "sine.inOut"
        })
            .to(sprite, {
                rotation: originalRotation - 0.10,
                duration: 0.16,
                ease: "sine.inOut"
            })
            .to(sprite, {
                rotation: originalRotation + 0.03,
                duration: 0.16,
                ease: "sine.inOut"
            })
            .to(sprite, {
                rotation: originalRotation - 0.03,
                duration: 0.16,
                ease: "sine.inOut"
            })
            .to(sprite, {
                rotation: originalRotation,
                duration: 0.1,
                ease: "sine.inOut"
            });
    });
}