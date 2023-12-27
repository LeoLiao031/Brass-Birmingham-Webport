import { Input, Data, InputType} from "./Input"
import { PublicState, LocalState, Card } from "../State/GameState";

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
    }

    return true;
}

function ValidateBuild(publicState : PublicState, input : Input) : boolean
{
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