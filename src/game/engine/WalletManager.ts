export class WalletManager {
    private balance: number;
    private bet: number;
    private readonly MIN_BET: number;

    constructor(initialBalance: number = 100, initialBet: number = 5, minBet: number = 5) {
        this.balance = initialBalance;
        this.bet = initialBet;

        this.MIN_BET = minBet;

        this.clampBet();
    }

    public getBalance(): number {
        return this.balance;
    }

    public getBet(): number {
        return this.bet;
    }

    public getMinBet(): number {
        return this.MIN_BET;
    }

    public increaseBet(step: number = 5): void {
        if (this.balance < this.MIN_BET) return;

        this.bet += step;

        this.clampBet();
    }

    public decreaseBet(step: number = 5): void {
        if (this.balance < this.MIN_BET) return;

        this.bet -= step;

        this.clampBet();
    }

    private clampBet(): void {
        if (this.balance < this.MIN_BET) {
            this.bet = 0;
            return;
        }

        this.bet = Math.min(Math.max(this.bet, this.MIN_BET), this.balance);
    }

    public canSpin(): boolean {
        return (this.balance >= this.MIN_BET && this.bet > 0 && this.balance >= this.bet);
    }

    public spendBet(): boolean {
        if (!this.canSpin()) {
            return false;
        }

        this.balance -= this.bet;

        this.clampBet();

        return true;
    }

    public addWin(amount:number): void {
        if (amount <= 0) return;

        this.balance += amount;

        this.clampBet();
    }
}