import { Input, Data, InputType, DataType} from "./Input"
import { PublicState, LocalState, Card, CardType } from "../State/GameState";

function ValidateInput(input : Input,
                       publicState : PublicState, 
                       localState : LocalState | undefined = undefined) : boolean
{
    if (localState != undefined && !localState.HasCard(input.cardUsed))
    {
        return false;
    }

    switch (input.inputType) 
    {
        case InputType.Build:
            return ValidateBuild(publicState, input);
        case InputType.Network:
            return ValidateNetwork(publicState, input);
        case InputType.Develop:
            return ValidateDevelop(publicState, input);
        case InputType.Sell:
            return ValidateSell(publicState, input);
        case InputType.Loan:
            return ValidateLoan(publicState, input);
        case InputType.Scout:
            return ValidateScout(publicState, input);
        default:
            return false;
    }
}

function ValidateBuild(publicState : PublicState, input : Input) : boolean
{
    let industryIndex : number = -1;
    let townIndex : number = -1;
    let tileIndex : number = -1;

    // Read input //////////////////////////////////////////////////////
    for (let i = 0; i < input.data.length; i++) 
    {
        switch (input.data[i].dataType) 
        {
            case DataType.Industry:
                if (input.data.length >= 1)
                {
                    industryIndex = input.data[i].stack[0];
                }
                break;
            case DataType.Tile:
                if (input.data.length >= 2)
                {
                    townIndex = input.data[i].stack[0];
                    tileIndex = input.data[i].stack[1];
                }
                break;
        }
    }

    if (industryIndex < 0 || townIndex < 0 || tileIndex < 0)
    {
        return false;
    }

    // Check for appropriate card ///////////////////////////////
    if (input.cardUsed.type == CardType.Location && !input.cardUsed.isWild)
    {
        let canBuildInLocation : boolean = false;
        for (let i : number = 0; i < input.cardUsed.indexes.length; i++)
        {
            if (input.cardUsed.indexes[i] == townIndex)
            {
                canBuildInLocation = true;
                break;
            }
        }

        if (!canBuildInLocation)
        {
            return false;
        }
    }
    else if (input.cardUsed.type == CardType.Industry)
    {
        if (!input.cardUsed.isWild)
        {
            let canBuildIndustry : boolean = false;
            for (let i : number = 0; i < input.cardUsed.indexes.length; i++)
            {
                if (input.cardUsed.indexes[i] == industryIndex)
                {
                    canBuildIndustry = true;
                    break;
                }
            }
    
            if (!canBuildIndustry)
            {
                return false;
            }
        }

        // Check if in network 
    }

    // Check if tile is empty

    // Check if tile can hold building
    
    // Check for enough money

    // Check for enough coal

    // Check for enough iron

    return true;
}

function ValidateNetwork(publicState : PublicState, input : Input) : boolean
{
    return true;
}

function ValidateDevelop(publicState : PublicState, input : Input) : boolean
{
    return true;
}

function ValidateSell(publicState : PublicState, input : Input) : boolean
{
    return true;
}

function ValidateLoan(publicState : PublicState, input : Input) : boolean
{
    return true;
}

function ValidateScout(publicState : PublicState, input : Input) : boolean
{
    return true;
}