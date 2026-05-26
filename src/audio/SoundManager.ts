import {Howl, Howler} from "howler";

export class SoundManager {
    private sounds: Map<string, Howl> = new Map();
    private musicVolume: number = 0.4;
    private sfxVolume: number = 0.8;
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
            src: ['/assets/audio/star.ogg'],
            volume: this.sfxVolume * 0.7
        }));

        // Звук виграшу
        this.sounds.set('win', new Howl({
            src: ['/assets/audio/jp_mini.ogg'],
            volume: this.sfxVolume
        }));

        // Звук кнопки
        this.sounds.set('closed', new Howl({
            src: ['/assets/audio/closed.mp3'],
            volume: this.sfxVolume * 0.6
        }))

        this.sounds.set('button', new Howl({
            src: ['/assets/audio/button_click.ogg'],
            volume: this.sfxVolume * 0.5
        }));

        // Звук зупинки барабану
        this.sounds.set('reelStop', new Howl({
            src: ['assets/audio/stop.mp3'],
            volume: this.sfxVolume
        }));

        // Великий виграш
        this.sounds.set('bigWin', new Howl({
            src: ['/assets/audio/jp_mega.ogg'],
            volume: 1.0
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