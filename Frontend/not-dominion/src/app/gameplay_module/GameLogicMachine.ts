import { Input } from "./Input/Input";
import { GameConfig } from "./State/GameConfig";
import { LocalState, PublicState } from "./State/GameState";

function ProcessInput(input : Input, publicState : PublicState, localState : LocalState, GameConfig : GameConfig) : void
{
    input.PayAllCosts(localState, publicState, GameConfig);
    input.Execute(localState, publicState, GameConfig);
}