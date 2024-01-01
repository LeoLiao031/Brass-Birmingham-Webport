import { GameConfig } from "../State/GameConfig";
import { LocalState, PublicState } from "../State/GameState";
import { BuildInput, Input, InputType } from "./Input";

export interface Cost
{
    CanPayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean;
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void;
}

export class CostTemplate implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        return true;
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        
    }
}

export class CardCost implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        if (!input.cardUsed)
        {
            return false;
        }

        if (localState.hand.indexOf(input.cardUsed) == -1)
        {
            return false;
        }

        return true;
    }

    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        let index : number = localState.hand.indexOf(input.cardUsed);
        localState.hand = localState.hand.splice(index, 1);
        
        publicState.publicPlayerData[input.playerID].discardPile.push(input.cardUsed);
    }
}

export class AppropriateCardCost implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        if (input.inputType != InputType.Build)
        {
            return false;
        }

        let buildInput : BuildInput = input as BuildInput;

        // TODO Oscar: This is unfinished. There's like 10 more conditions.
        if (buildInput.townID.locationIndex >= gameConfig.board.towns.length)
        {
            return false;
        }

        if (buildInput.townID.tileIndex >= gameConfig.board.towns[buildInput.townID.locationIndex].location.tiles.length)
        {
            return false
        }

        if (gameConfig.board.towns[buildInput.townID.tileIndex].location.tiles[buildInput.townID.tileIndex].allowedIndustries.indexOf(buildInput.industryIndex) == -1)
        {
            return false;
        }

        if (!publicState.IsTileEmpty(buildInput.townID))
        {
            return false;
        }

        return new CardCost().CanPayCost(input, localState, publicState, gameConfig);
    }
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        new CardCost().PayCost(input, localState, publicState, gameConfig);
    }
}

export class MoneyCost implements Cost
{
    amount : number;
    constructor(amount :number)
    {
        this.amount = amount;
    }

    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        if (publicState.publicPlayerData[input.playerID].money < this.amount)
        {
            return false;
        }

        return true;
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        publicState.publicPlayerData[input.playerID].money -= this.amount;
    }
}

export class BuildMoneyCost implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        const amount = this.GetAmountToPay(input, localState, publicState, gameConfig);
        if (amount < 0)
        {
            return false;
        }
        return new MoneyCost(amount).CanPayCost(input, localState, publicState, gameConfig);
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        const amount = this.GetAmountToPay(input, localState, publicState, gameConfig);
        new MoneyCost(amount).PayCost(input, localState, publicState, gameConfig);
    }

    GetAmountToPay(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : number
    {
        if (input.inputType != InputType.Build)
        {
            return -1;
        }

        let buildInput : BuildInput = input as BuildInput;

        let nextSectionIndex : number = publicState.publicPlayerData[input.playerID].playerArea.section[buildInput.industryIndex].GetNextSectionIndex();
        if (nextSectionIndex > 0)
        {
            return gameConfig.industries[buildInput.industryIndex].industryLevels[nextSectionIndex].moneyCost;
        }

        return -1;
    }
}