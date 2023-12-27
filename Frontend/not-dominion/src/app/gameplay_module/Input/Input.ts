import { Card } from "../State/GameState";

enum InputType
{
    Build,
    Network,
    Develop,
    Sell,
    Loan,
    Scout
}

enum DataType
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

class Data
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

class Input
{
    cardUsed : Card;
    inputType : InputType;
    data : Data[];

    constructor(cardUsed : Card,
                inputType : InputType,
                data : Data[])
    {
        this.cardUsed = cardUsed;
        this.inputType = inputType;
        this.data = data;
    }
}