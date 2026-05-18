import { _decorator, Component, Node, Label, clamp } from 'cc';
import store from '../Data/Store';
import { Singleton } from '../../Common/Singleton';
import { FlowManager_BlockPuzzle } from './FlowManager_BlockPuzzle';
import { GameManager_BlockPuzzle, GameState } from './GameManager_BlockPuzzle';
const { ccclass, property } = _decorator;

@ccclass('TimeManager_BlockPuzzle')
export class TimeManager_BlockPuzzle extends Singleton<TimeManager_BlockPuzzle>() {

    private timer : number = 0;
    private intTimer : number = 0;
    private prevTimer : number = 0;

    private flowTime : number = 0;

    @property (Label)
    private timerLabel : Label = null;

    @property
    private startTime : number = 0;

    public get FlowTime()
    {
        return this.flowTime;
    }

    public get TimeScore()
    {
        return this.FlowTime * store.timeScore;
    }

    public startTimer() : void
    {
        this.timer = this.startTime;
        this.flowTime = this.startTime;
    }

    public addTime(time : number) : void
    {
        this.timer += time;
        this.flowTime += time;

        if (this.timer > this.startTime)
        {
            this.timer = this.startTime;
        }

        this.writeTime();        
    }

    private flowingTime(value : number)
    {
        if (this.timer > 0)
        {
            this.timer -= value;
        }

        this.timer = clamp(this.timer, 0, this.startTime);

        this.intTimer = Math.floor(this.timer);

        if (this.prevTimer != this.intTimer)
        {
            this.prevTimer = this.intTimer;
            this.writeTime();
        }
    }

    public update(dt : number) : void
    {
        if (GameState.Start === GameManager_BlockPuzzle.instance.state)
        {
            this.flowingTime(dt);

            if (this.timer <= 0)
            {
                FlowManager_BlockPuzzle.instance.node.emit(FlowManager_BlockPuzzle.gameOverStr);
            }
        }
        else if (GameState.Over === GameManager_BlockPuzzle.instance.state)
        {
            this.flowingTime(dt * 45);            
        }
    }

    private writeTime() : void
    {
        this.timerLabel.string = this.prevTimer.toString();
    }

}

