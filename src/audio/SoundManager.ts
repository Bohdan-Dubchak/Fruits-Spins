import {Howl, Howler} from "howler";

export class SoundManager {
    private sounds: Map<string, Howl> = new Map();
    private musicVolume: number = 0.3;
    private sfxVolume: number = 0.8;
    private isMuted: boolean = false;

    constructor() {
        this.loadSounds();
    }

    private loadSounds(): void {

        this.sounds.set('music', new Howl({
            src: ['/assets/audio/game.ogg'],
            loop: true,
            volume: this.musicVolume
        }));

        this.sounds.set('spin', new Howl({
            src: ['/assets/audio/startSpin.ogg'],
            volume: 1
        }));

        this.sounds.set('auto', new Howl({
            src: ['/assets/audio/startAuto.ogg'],
            volume: this.sfxVolume * 0.6
        }))

        this.sounds.set('win', new Howl({
            src: ['/assets/audio/winMini.ogg'],
            volume: this.sfxVolume
        }));

        this.sounds.set('closed', new Howl({
            src: ['/assets/audio/closed.ogg'],
            volume: this.sfxVolume * 0.5
        }))

        this.sounds.set('button', new Howl({
            src: ['/assets/audio/click.ogg'],
            volume: this.sfxVolume * 0.5
        }));

        this.sounds.set('bet', new Howl({
            src: ['/assets/audio/bet.ogg'],
            volume: this.sfxVolume * 0.4
        }))

        this.sounds.set('reelStop', new Howl({
            src: ['assets/audio/stopReel.ogg'],
            volume: this.sfxVolume
        }));

        this.sounds.set('bigWin', new Howl({
            src: ['/assets/audio/winMega.ogg'],
            volume: 1.0
        }))
    }

    play(soundName: string): void {
        if (!this.isMuted) {
            const sound = this.sounds.get(soundName);
            if (sound && !sound.playing()) {
                sound.play();
            }
        }
    }

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