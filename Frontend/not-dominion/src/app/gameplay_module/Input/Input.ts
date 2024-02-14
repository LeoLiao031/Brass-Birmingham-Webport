import { GameConfig } from "../State/GameConfig";
import { Card, Link, LocalState, PublicState, TileOnBoard, TownID } from "../State/GameState";
import { AppropriateCardCost, Cost, MoneyCost, CoalCost, IronCost, ResponseType, CardCost } from "./Costs";

export enum InputType
{
    Build,
    Network,
    Develop,
    Sell,
    Loan,
    Scout
}

export class Input
{
    cardUsed : Card;
    inputType : InputType;
    playerID : number;

    constructor(cardUsed : Card,
                inputType : InputType,
                playerID : number)
    {
        this.cardUsed = cardUsed;
        this.inputType = inputType;
        this.playerID = playerID;
    }

    // Override this to add costs
    GetCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : Cost[]
    {
        return [];
    }

    // Override this to add costs that are payed in Execute()
    ExtraCheck(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : boolean
    {
        return true;
    }

    IsValidInput(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : boolean
    {
        let costs : Cost[] = this.GetCosts(localState, publicState, gameConfig);
        let moneyCost : number = 0; 

        for (let i : number = 0; i < costs.length; i++)
        {
            let response = costs[i].CanPayCost(this, localState, publicState, gameConfig);

            if (response.responseType == ResponseType.Failure)
            {
                return false;
            }
            else if (response.responseType == ResponseType.Conditional)
            {
                moneyCost += response.additionalMoneyRequired;
            }
        }

        if (publicState.publicPlayerData[this.playerID].money < moneyCost)
        {
            return false;
        }

        return this.ExtraCheck(localState, publicState, gameConfig);
    }

    PayAllCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : void
    {
        let costs : Cost[] = this.GetCosts(localState, publicState, gameConfig);

        for (let i : number = 0; i < costs.length; i++)
        {
            costs[i].PayCost(this, localState, publicState, gameConfig);
        }
    }

    // Override this to implement execution
    Execute(localState : LocalState, publicState : PublicState, gameConfig : GameConfig) : boolean
    {
        if (!this.IsValidInput)
        {
            return false;
        }

        this.PayAllCosts(localState, publicState, gameConfig);

        return true;
    }
}

export class BuildInput extends Input
{
    townID : TownID;
    industryIndex : number;

    constructor(cardUsed : Card,
                playerID : number,
                townID : TownID,
                industryIndex : number)
    {
        super(cardUsed, InputType.Build, playerID);

        this.townID = townID;
        this.industryIndex = industryIndex;
    }

    GetPrice(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : number
    {
        let nextSectionIndex = 
            publicState.publicPlayerData[this.playerID].playerArea.section[this.industryIndex].GetNextSectionIndex();

        if (nextSectionIndex != undefined)
        {
            return gameConfig.industries[this.industryIndex].industryLevels[nextSectionIndex].moneyCost;
        }

        return 0;
    }

    GetCoalCost(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : number
    {
        let nextIndustrySection = publicState.publicPlayerData[this.playerID].
            playerArea.section[this.industryIndex].GetNextSectionIndex();
        if (nextIndustrySection == undefined)
        {
            return 0;
        }
        let amount : number = gameConfig.industries[this.industryIndex].industryLevels[nextIndustrySection].coalCost;
        return amount;
    }

    GetIronCost(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : number
    {
        let nextIndustrySection = publicState.publicPlayerData[this.playerID].
            playerArea.section[this.industryIndex].GetNextSectionIndex();
        if (nextIndustrySection == undefined)
        {
            return 0;
        }
        let amount : number = gameConfig.industries[this.industryIndex].industryLevels[nextIndustrySection].ironCost;
        return amount;
    }
    
    override GetCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): Cost[] 
    {
        let costs : Cost[] = 
        [
            new AppropriateCardCost(), 
            new MoneyCost(this.GetPrice(localState, publicState, gameConfig)),
            new CoalCost(this.GetCoalCost(localState, publicState, gameConfig),
                [this.townID.locationIndex]),
            new IronCost(this.GetIronCost(localState, publicState, gameConfig), 
                this.townID.locationIndex)
        ];

        return costs;
    }

    override ExtraCheck(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): boolean 
    {
        if (publicState.publicPlayerData[this.playerID].playerArea.section[this.industryIndex].GetNextSectionIndex() == -1)
        {
            return false;
        }
        
        return true;
    }

    override Execute(localState: LocalState, publicState: PublicState, gameConfig: GameConfig) : boolean 
    {
        if (!super.Execute(localState, publicState, gameConfig))
        {
            return false;
        }

        let industryLevel = publicState.publicPlayerData[this.playerID].playerArea.section[this.industryIndex].GetNextSectionIndex();
        if (industryLevel == undefined)
        {
            return false;
        }
        publicState.publicPlayerData[this.playerID].playerArea.section[this.industryIndex].counts[industryLevel]--;

        let coalGenerated : number = gameConfig.industries[this.industryIndex].industryLevels[industryLevel].coalGenerated;
        let coalMarketSlotsOpen = (gameConfig.coalMarketPrices.length - 1) - publicState.coalMarketCount;
        let coalToSell = Math.min(coalGenerated, coalMarketSlotsOpen);
        let coalRemaining : number = coalGenerated - coalToSell;
        publicState.coalMarketCount += coalToSell;

        let ironGenerated : number = gameConfig.industries[this.industryIndex].industryLevels[industryLevel].ironGenerated;
        let ironMarketSlotsOpen = (gameConfig.ironMarketPrices.length - 1) - publicState.ironMarketCount;
        let ironToSell = Math.min(ironGenerated, ironMarketSlotsOpen);
        let ironRemaining : number = ironGenerated - ironToSell;
        publicState.ironMarketCount += ironToSell;

        let isFlipped : boolean =
            (coalGenerated > 0 && coalGenerated == coalToSell) ||
            (ironGenerated > 0 && ironGenerated == ironToSell);

        publicState.tilesOnBoard.push(new TileOnBoard
        (
            this.townID,
            this.industryIndex, 
            industryLevel, 
            coalRemaining,
            ironRemaining,
            publicState.isRailEra ?
                gameConfig.industries[this.industryIndex].industryLevels[industryLevel].beerGeneratedRail :
                gameConfig.industries[this.industryIndex].industryLevels[industryLevel].beerGeneratedCanal,
            isFlipped,
            this.playerID
        ));

        if (isFlipped)
        {
            publicState.publicPlayerData[this.playerID].victoryPoints += 
                gameConfig.industries[this.industryIndex].industryLevels[industryLevel].victoryPoints;
        }

        return true;
    }
}

export class NetworkInput extends Input
{
    linkLocation : number;

    constructor(cardUsed : Card,
                playerID : number,
                linkLocation : number)
    {
        super(cardUsed, InputType.Build, playerID);

        this.linkLocation = linkLocation;
    }

    override GetCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): Cost[] 
    {
        if (!publicState.isRailEra)
        {
            return [new CardCost(), new MoneyCost(3)];
        }

        let locationsInNetwork : number[] = [];
        gameConfig.board.links[this.linkLocation].connections.forEach(connection => 
        {
            if (publicState.IsLocationInNetwork(connection, this.playerID))
            {
                locationsInNetwork.push(connection);
            }
        });

        return [new CardCost(), new MoneyCost(5), new CoalCost(5, locationsInNetwork)];    
    }

    override ExtraCheck(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): boolean 
    {
        if (publicState.DoesLinkExist(this.linkLocation))
        {
            return false;
        }    

        return true;
    }

    override Execute(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): boolean 
    {
        if (!super.Execute(localState, publicState, gameConfig))
        {
            return false;
        }

        publicState.links.push(new Link(this.linkLocation, this.playerID));
        return true;
    }
}

export class FlipInput extends Input
{
    tileLocation : TownID;

    constructor(cardUsed : Card,
                playerID : number,
                tileLocation : TownID)
    {
        super(cardUsed, InputType.Build, playerID);

        this.tileLocation = tileLocation;
    }

    override GetCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): Cost[] 
    {
        return [new CardCost()];    
    }

    Execute(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): boolean 
    {
        if (!super.Execute(localState, publicState, gameConfig))
        {
            return false;
        }

        for(let i : number = 0; i < publicState.tilesOnBoard.length; i++)
        {
            if (this.tileLocation = publicState.tilesOnBoard[i].townID)
            {
                publicState.tilesOnBoard[i].isFlipped = true;
                break;
            }
        }

        return true;
    }
}

export class DevelopInput extends Input
{
    industry : number;
    amountToDevelop : number;

    constructor(cardUsed : Card,
                playerID : number,
                industry : number,
                developTwice : boolean)
    {
        super(cardUsed, InputType.Build, playerID);

        this.industry = industry;
        this.amountToDevelop = developTwice ? 2 : 1;
    }

    override GetCosts(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): Cost[] 
    {
        return [new CardCost(), new IronCost(this.amountToDevelop, 0)]
    }

    override ExtraCheck(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): boolean 
    {
        let nextSectionIndex = 
            publicState.publicPlayerData[this.playerID].playerArea.section[this.industry].GetNextSectionIndex();

        if (nextSectionIndex == undefined)
        {
            return false;
        }
        if (!gameConfig.industries[this.industry].industryLevels[nextSectionIndex].developable)
        {
            return false;
        }

        if (this.amountToDevelop == 2)
        {
            if (publicState.publicPlayerData[this.playerID].playerArea.section[this.industry].counts[nextSectionIndex] == 1 && 
                nextSectionIndex == publicState.publicPlayerData[this.playerID].playerArea.section[this.industry].counts.length - 1)
            {
                return false;
            }

            if (!gameConfig.industries[this.industry].industryLevels[nextSectionIndex+1].developable)
            {
                return false;
            }
        }
        
        return true;
    }

    override Execute(localState: LocalState, publicState: PublicState, gameConfig: GameConfig): boolean 
    {
        if (!super.Execute(localState, publicState, gameConfig))
        {
            return false;
        }

        for (let i : number = 0; i < this.amountToDevelop; i++)
        {
            let nextSectionIndex = 
                publicState.publicPlayerData[this.playerID].playerArea.section[this.industry].GetNextSectionIndex();
            if (nextSectionIndex == undefined)
            {
                return false;
            }
            publicState.publicPlayerData[this.playerID].playerArea.section[this.industry].counts[nextSectionIndex]--;
        }

        return true;
    }
}