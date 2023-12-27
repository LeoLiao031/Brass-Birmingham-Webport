import { Card } from "../State/GameState";

export enum InputType
{
    Build,
    Network,
    Develop,
    Sell,
    Loan,
    Scout
}

export enum DataType
{
    // First number in the stack denotes index of location
    // Second denotes tile in the location
    Tile,
    // First denotes index of industry
    Industry,
    // Link denoted by 2 location indexes
    // Order doesn't matter
    Link
}

export class Data
{
    dataType : DataType;
    stack : number[];

    constructor(dataType : DataType,
                stack : number[])
    {
        this.dataType = dataType;
        this.stack = stack;
    }
}

export class Input
{
    cardUsed : Card;
    inputType : InputType;
    data : Data[];
    playerID : number;

    constructor(cardUsed : Card,
                inputType : InputType,
                data : Data[],
                playerID : number)
    {
        this.cardUsed = cardUsed;
        this.inputType = inputType;
        this.data = data;
        this.playerID = playerID;
    }
}