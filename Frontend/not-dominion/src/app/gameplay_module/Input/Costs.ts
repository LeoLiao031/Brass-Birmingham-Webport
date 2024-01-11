import { ConnectedTraverser, Town, TraversalType, Traverser } from "../State/Board";
import { GameConfig } from "../State/GameConfig";
import { LocalState, PublicState, TileOnBoard } from "../State/GameState";
import { Cast } from "../Utils";
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
        if (buildInput.townID.locationIndex >= gameConfig.board.locations.length)
        {
            return false;
        }

        let town = Cast<Town>(gameConfig.board.locations[buildInput.townID.locationIndex]);

        if (town == undefined)
        {
            return false;
        }

        if (buildInput.townID.tileIndex >= town.tiles.length)
        {
            return false
        }

        if (town.tiles[buildInput.townID.tileIndex].allowedIndustries.indexOf(buildInput.industryIndex) == -1)
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

export class CoalCost implements Cost
{
    amount : number;
    startingLocationIndex : number;
    constructor(amount : number,
                startingLocationIndex : number)
    {
        this.amount = amount;
        this.startingLocationIndex = startingLocationIndex;
    }

    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        let amountRemaining : number = this.amount;

        let traverser : ConnectedTraverser = new ConnectedTraverser(
            gameConfig.board, this.startingLocationIndex, publicState);

        let currentLocation = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            publicState.tilesOnBoard.forEach((tileOnBoard : TileOnBoard) => 
            {
                if (tileOnBoard.townID.locationIndex == currentLocation &&
                    tileOnBoard.coal > amountRemaining)
                {
                    amountRemaining -= tileOnBoard.coal;

                    if (amountRemaining <= 0)
                    {
                        return true;
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }

        return false;
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        let amountRemaining : number = this.amount;

        let traverser : ConnectedTraverser = new ConnectedTraverser(
            gameConfig.board, this.startingLocationIndex, publicState);
        
        let currentLocation = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            publicState.tilesOnBoard.forEach((tileOnBoard : TileOnBoard) => 
            {
                if (tileOnBoard.townID.locationIndex == currentLocation &&
                    tileOnBoard.coal > amountRemaining)
                {
                    let amountToConsume : number = Math.min(tileOnBoard.coal, amountRemaining)
                    amountRemaining -= amountToConsume
                    tileOnBoard.coal -= amountToConsume;

                    if (amountRemaining <= 0)
                    {
                        return;
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }
    }
}

export class BuildCoalCost implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        let coalCost = this.CreateCoalCost(input, publicState, gameConfig);
        if (coalCost == undefined)
        {
            return false;
        }
        return coalCost.CanPayCost(input, localState, publicState, gameConfig);
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        let coalCost = this.CreateCoalCost(input, publicState, gameConfig);
        if (coalCost == undefined)
        {
            return;
        }
        coalCost.PayCost(input, localState, publicState, gameConfig);
    }

    CreateCoalCost(input : Input, publicState : PublicState, gameConfig : GameConfig) : CoalCost | undefined
    {
        if (input.inputType != InputType.Build)
        {
            return undefined;
        }
        let buildInput : BuildInput = input as BuildInput;

        let nextIndustrySection : number = publicState.publicPlayerData[input.playerID].
            playerArea.section[buildInput.industryIndex].GetNextSectionIndex();
        let amount : number = gameConfig.industries[buildInput.industryIndex].industryLevels[nextIndustrySection].coalCost;
        let location : number = buildInput.townID.locationIndex;
        return new CoalCost(amount, location);
    }
}

export class IronCost implements Cost
{
    amount : number;
    startingLocationIndex : number;
    constructor(amount : number,
                startingLocationIndex : number)
    {
        this.amount = amount;
        this.startingLocationIndex = startingLocationIndex;
    }

    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        let amountRemaining : number = this.amount;

        let traverser : Traverser = new Traverser(
            gameConfig.board, this.startingLocationIndex);

        let currentLocation = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            publicState.tilesOnBoard.forEach((tileOnBoard : TileOnBoard) => 
            {
                if (tileOnBoard.townID.locationIndex == currentLocation &&
                    tileOnBoard.iron > amountRemaining)
                {
                    amountRemaining -= tileOnBoard.iron;

                    if (amountRemaining <= 0)
                    {
                        return true;
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }

        return false;
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        let amountRemaining : number = this.amount;

        let traverser : ConnectedTraverser = new ConnectedTraverser(
            gameConfig.board, this.startingLocationIndex, publicState);
        
        let currentLocation = traverser.GetNextLocationIndex();
        while (currentLocation != undefined)
        {
            publicState.tilesOnBoard.forEach((tileOnBoard : TileOnBoard) => 
            {
                if (tileOnBoard.townID.locationIndex == currentLocation &&
                    tileOnBoard.iron > amountRemaining)
                {
                    let amountToConsume : number = Math.min(tileOnBoard.iron, amountRemaining)
                    amountRemaining -= amountToConsume
                    tileOnBoard.iron -= amountToConsume;

                    if (amountRemaining <= 0)
                    {
                        return;
                    }
                }
            })

            currentLocation = traverser.GetNextLocationIndex();
        }
    }
}

export class BuildIronCost implements Cost
{
    CanPayCost (input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean 
    {
        let ironCost = this.CreateIronCost(input, publicState, gameConfig);
        if (ironCost == undefined)
        {
            return false;
        }
        return ironCost.CanPayCost(input, localState, publicState, gameConfig);
    };
    
    PayCost(input : Input, localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : void
    {
        let ironCost = this.CreateIronCost(input, publicState, gameConfig);
        if (ironCost == undefined)
        {
            return;
        }
        ironCost.PayCost(input, localState, publicState, gameConfig);
    }

    CreateIronCost(input : Input, publicState : PublicState, gameConfig : GameConfig) : IronCost | undefined
    {
        if (input.inputType != InputType.Build)
        {
            return undefined;
        }
        let buildInput : BuildInput = input as BuildInput;

        let nextIndustrySection : number = publicState.publicPlayerData[input.playerID].
            playerArea.section[buildInput.industryIndex].GetNextSectionIndex();
        let amount : number = gameConfig.industries[buildInput.industryIndex].industryLevels[nextIndustrySection].ironCost;
        let location : number = buildInput.townID.locationIndex;
        return new IronCost(amount, location);
    }
}