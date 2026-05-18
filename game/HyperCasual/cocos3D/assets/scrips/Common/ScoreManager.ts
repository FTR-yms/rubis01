import { _decorator, Component, Label, Node } from 'cc';
import { Singleton } from '../Common/Singleton';
const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Singleton<ScoreManager>() {
    @property(Label)
    private label: Label = null;

    private score: number = 0;

    public get Score(): number {
        return this.score;
    }

    public setScore(value: number): void {
        this.score = value;

        if (this.label !== null)
            this.label.string = this.score.toString();
    }

    public addScore(value: number): void {
        this.score += value;

        if (this.label !== null)
            this.label.string = this.score.toString();
    }

    public reset() {
        this.setScore(0);
    }
}


