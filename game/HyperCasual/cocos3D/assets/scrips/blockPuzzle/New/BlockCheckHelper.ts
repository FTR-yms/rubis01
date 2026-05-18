import { _decorator, Component, Node, Vec2, game } from 'cc';
const { ccclass, property } = _decorator;

export class GameRules
{
    public rows : number[] = [];
    public cols : number[] = [];

    public center : number[] = [];
}

@ccclass('BlockCheckHelper')
export class BlockCheckHelper extends Component {
    private widthArray : Array<number> = null;
    private heightArray : Array<number> = null;
    
    private centerArray : Array<number> = null;

    private centerWidth : number = 0;
    private centerHeight : number = 0;
    
    private widthLineMax: number = 0;
    private heightLineMax: number = 0;

    private centerMax : number = 0;

    public initSetting(tileWidth : number, tileHeight : number, centerVec : Vec2)
    {
        if (this.widthArray != null)
        {
            this.widthArray.length = 0;
            this.heightArray.length = 0;
            this.centerArray.length = 0;
        }

        this.widthArray = new Array<number>(tileWidth);
        this.heightArray = new Array<number>(tileHeight);

        for (let i = 0; i < this.widthArray.length; ++i)
        {
            this.widthArray[i] = 0;
        }

        for (let i = 0; i < this.heightArray.length; ++i)
        {
            this.heightArray[i] = 0;
        }

        this.widthLineMax = this.heightArray.length;
        this.heightLineMax = this.heightArray.length;

        this.centerWidth = tileWidth / centerVec.x;
        this.centerHeight = tileHeight / centerVec.y;

        this.centerArray = new Array<number>(this.centerWidth * this.centerHeight);
        this.centerMax = centerVec.x * centerVec.y;
        
        for (let i = 0; i < this.heightArray.length; ++i)
        {
            this.centerArray[i] = 0;
        }
    }

    public insertData(widthValue : number, heightValue : number)
    {
        this.widthArray[heightValue] += 1;
        this.heightArray[widthValue] += 1;

        this.centerArray[Math.floor(heightValue / 3) * this.centerHeight + Math.floor(widthValue / 3)] += 1;
    }

    private ruleLogic(gameRule : GameRules)
    {
        gameRule?.center.forEach(i => {
            let cols = Math.floor(i / this.centerWidth);
            let rows =  i % this.centerHeight;

            for (let x = cols * this.centerWidth; x < (cols + 1) * this.centerWidth; ++x)
            {
                this.widthArray[x] -= this.centerWidth;
            }

            for (let y = rows * this.centerHeight; y < (rows + 1) * this.centerHeight; ++y)
            {
                this.heightArray[y] -= this.centerHeight;
            }
        });

        gameRule?.rows.forEach(x => {
            for (let y = 0; y < this.heightArray.length; ++y)
            {
                this.heightArray[y] -= 1;
            }

            let cols = Math.floor((x) / this.centerWidth);

            for (let i = cols * this.centerWidth; i <  (cols + 1) * this.centerWidth; ++i)
            {
                this.centerArray[i] -= this.centerWidth;
            }
        })

        gameRule?.cols.forEach(y => {
            for (let x = 0; x < this.widthArray.length; ++x)
            {
                this.widthArray[x] -= 1;
            }

            let rows = Math.floor((y) / this.centerHeight);

            for (let i = rows; i <  this.heightArray.length; i += this.centerHeight)
            {
                this.centerArray[i] -= this.centerHeight;
            }
        })

        if (gameRule?.cols.length >= 1 && gameRule?.rows.length >= 1)
        {
            gameRule.cols.forEach(y => {
                gameRule.rows.forEach(x => {
                    let cols = Math.floor((x) / this.centerWidth);
                    let rows = Math.floor((y) / this.centerHeight);
                    for (let i = cols * this.centerWidth; i <  (cols + 1) * this.centerWidth; ++i)
                    {
                        for (let j = rows; j <  this.heightArray.length; j += this.centerHeight)
                        {
                            if (i == j)
                            {
                                this.centerArray[i] += 1;
                            }
                        }
                    }
                })
            })
        }

        
        if (gameRule?.cols.length >= 1 && gameRule?.center.length >= 1)
        {
            gameRule.cols.forEach(y => {
                gameRule.center.forEach(i => {
                    
                    let cols = Math.floor(i / this.centerWidth);

                    let checkNum = i % 3;
                    if (checkNum * 3 <= y && y < (checkNum + 1) * 3)
                    {
                        for (let x = cols * this.centerWidth; x < (cols + 1) * this.centerWidth; ++x)
                        {
                           this.widthArray[x]++;
                        }
                    }

                })
            })
        }

        if (gameRule?.rows.length >= 1 && gameRule?.center.length >= 1)
        {
            gameRule.rows.forEach(x => {
                gameRule.center.forEach(i => {
                    let rows =  i % this.centerHeight;
                    let checkNum = Math.floor(i / 3);

                    if (checkNum * 3 <= x && x < (checkNum + 1) * 3)
                    {
                        for (let y = rows * this.centerHeight; y < (rows + 1) * this.centerHeight; ++y)
                        {
                            this.heightArray[y]++;
                        }
                    }
                })
            })
        }


        gameRule?.center.forEach(i => {
            this.centerArray[i] = 0;
        })

        gameRule?.rows.forEach(i => {
            this.widthArray[i] = 0;
        })

        gameRule?.cols.forEach(i => {
            this.heightArray[i] = 0;
        })
    }

    public ruleLogicEnd()
    {
        for (let i = 0; i < this.widthArray.length; ++i)
        {
            if (this.widthArray[i] < 0)
            {
                this.widthArray[i] = 0;
            }
        }

        for (let i = 0; i < this.heightArray.length; ++i)
        {
            if (this.heightArray[i] < 0)
            {
                this.heightArray[i] = 0;
            }
        }

        for (let i = 0; i < this.centerArray.length; ++i)
        {
            if (this.centerArray[i] < 0)
            {
                this.centerArray[i] = 0;
            }
        }

    }

    public ruleCheck() : GameRules
    {
        let gameRule : GameRules = null;

        for (let x = 0; x < this.widthArray.length; ++x)
        {
            if (this.widthArray[x] >= this.widthLineMax)
            {
                if (gameRule === null)
                {
                    gameRule = new GameRules();
                }

                gameRule.rows.push(x);
            }
        }

        for (let y = 0; y < this.heightArray.length; ++y)
        {
            if (this.heightArray[y] >= this.heightLineMax)
            {
                if (gameRule === null)
                {
                    gameRule = new GameRules();
                }

                gameRule.cols.push(y);
            }
        }

        for (let i = 0; i < this.centerArray.length; ++i)
        {
            if (this.centerArray[i] >= this.centerMax)
            {
                if (gameRule === null)
                {
                    gameRule = new GameRules();
                }
               
                gameRule.center.push(i);
            }
        }

        this.ruleLogic(gameRule);
        this.ruleLogicEnd();

        // console.log("width : ", this.widthArray);
        // console.log("height : ", this.heightArray);
        // console.log("center : ", this.centerArray);

        return gameRule;
    }

}

