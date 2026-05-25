import {Howl, Howler} from "howler";

export class SoundManager {
    private sounds: Map<string, Howl> = new Map();
    private musicVolume: number = 0.7;
    private sfxVolume: number = 0.1;
    private isMuted: boolean = false;

    constructor() {
        this.loadSounds();
    }

    private loadSounds(): void {
        // Фонова музика
        this.sounds.set('music', new Howl({
            src: ['/assets/audio/game.mp3'],
            loop: true,
            volume: this.musicVolume
        }));

        // Звук обертання
        this.sounds.set('spin', new Howl({
            src: ['/assets/audio/start.mp3'],
            volume: this.musicVolume
        }));

        // Звук виграшу
        this.sounds.set('win', new Howl({
            src: ['/assets/audio/jp_mini.ogg'],
            volume: this.musicVolume
        }));

        // Звук кнопки
        this.sounds.set('button', new Howl({
            src: ['/assets/audio/button_click.ogg'],
            volume: this.sfxVolume * 0.5
        }));

        // Звук зупинки барабану
        this.sounds.set('reelStop', new Howl({
            src: ['assets/audio/stop.mp3'],
            volume: this.sfxVolume * 0.7
        }));

        // Великий виграш
        this.sounds.set('bigWin', new Howl({
            src: ['/assets/audio/jp_mega.ogg'],
            volume: this.sfxVolume
        }))
    }

    // Відтворити звук
    play(soundName: string): void {
        if (!this.isMuted) {
            const sound = this.sounds.get(soundName);
            if (sound) {
                sound.play();
            }
        }
    }

    // Зупинити звук
    stop(soundName: string): void {
        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.stop();
        }
    }

    toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        Howler.mute(this.isMuted);
        return this.isMuted;
    }

    destroy(): void {
        this.sounds.clear();
    }
}