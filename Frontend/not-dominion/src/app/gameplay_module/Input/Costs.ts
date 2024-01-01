import { GameConfig } from "../State/GameConfig";
import { LocalState, PublicState } from "../State/GameState";
import { BuildInput, Input } from "./Input";

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
    CanPayCost (input : BuildInput, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        if (!input.cardUsed)
        {
            return false;
        }

        if (localState.hand.indexOf(input.cardUsed) == -1)
        {
            return false;
        }

        if (input.townID.locationIndex >= gameConfig.board.towns.length)
        {
            return false;
        }

        if (input.townID.tileIndex >= gameConfig.board.towns[input.townID.locationIndex].location.tiles.length)
        {
            return false
        }

        if (gameConfig.board.towns[input.townID.tileIndex].location.tiles[input.townID.tileIndex].allowedIndustries.indexOf(input.industryIndex) == -1)
        {
            return false;
        }

        if (!publicState.IsTileEmpty(input.townID))
        {
            return false;
        }

        return true;
    }
    
    PayCost(input : BuildInput, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        let index : number = localState.hand.indexOf(input.cardUsed);
        localState.hand = localState.hand.splice(index, 1);
        
        publicState.publicPlayerData[input.playerID].discardPile.push(input.cardUsed);
    }
}

export class BuildMoneyCost implements Cost
{
    CanPayCost (input : BuildInput, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        const amount = this.GetAmountToPay(input, localState, publicState, gameConfig);

        if (amount < 0)
        {
            return false;
        }

        if (publicState.publicPlayerData[input.playerID].money < amount)
        {
            return false;
        }

        return true;
    };
    
    PayCost(input : BuildInput, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        const amount = this.GetAmountToPay(input, localState, publicState, gameConfig);
        publicState.publicPlayerData[input.playerID].money -= amount;
    }

    GetAmountToPay(input : BuildInput, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : number
    {
        for (let i : number = 0; i < publicState.publicPlayerData[input.playerID].playerArea.section[input.industryIndex].counts.length; i++)
        {
            if (publicState.publicPlayerData[input.playerID].playerArea.section[input.industryIndex].counts[i] != 0)
            {
                return gameConfig.industries[input.industryIndex].industryLevels[i].moneyCost;
            }
        }

        return -1;
    }
}