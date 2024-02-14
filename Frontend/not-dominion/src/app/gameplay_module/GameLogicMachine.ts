import { Input } from "./Input/Input";
import { GameConfig } from "./State/GameConfig";
import { LocalState, PublicState } from "./State/GameState";


// Returns true only if input is valid and state has been successfuly altered
function ProcessInput(input : Input, publicState : PublicState, localState : LocalState, GameConfig : GameConfig) : boolean
{
    if (input.playerID != publicState.currentTurnOrder[publicState.currentTurnIndex])
    {
        return false;
    }

    return input.Execute(localState, publicState, GameConfig);
}