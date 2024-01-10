import { GameConfig } from "./GameConfig"

export type TownID = 
{
    locationIndex : number;
    tileIndex : number;
}

class IndustrySection 
{
    counts : number[];
    
    constructor(counts : number[])
    {
        this.counts = counts;
    }

    GetNextSectionIndex() : number
    {
        for (let i : number = 0; i < this.counts.length; i++)
        {
            if (this.counts[i] > 0)
            {
                return i;
            }
        }

        return -1;
    }
} 

class PlayerArea 
{
    section : IndustrySection[] = [];

    constructor(gameConfig : GameConfig)
    {
        for (let i : number = 0; i < gameConfig.industries.length; i++) 
        {
            let startingAmount : number[] = [];

            for (let level : number = 0; level < gameConfig.industries[i].industryLevels.length; level++)
            {
                startingAmount.push(
                    gameConfig.industries[i].industryLevels[level].startingAmount);
            }

            this.section.push(new IndustrySection(startingAmount));
        }
    }
}

export class PublicPlayerData
{
    money : number;
    moneySpentInCurrentRound : number;
    victoryPoints : number;
    income : number;
    playerArea : PlayerArea;
    discardPile : Card[];

    constructor(gameConfig : GameConfig,
                money : number,
                income : number)
    {
        this.money = money;
        this.moneySpentInCurrentRound = 0;
        this.victoryPoints = 0;
        this.income = income;
        this.playerArea = new PlayerArea(gameConfig);
        this.discardPile = [];
    }
}

export class TileOnBoard
{
    townID : TownID;
    industryIndex : number;
    industryLevel : number;
    coal : number;
    iron : number;
    beer : number;
    isFlipped : boolean;
    ownerID : number;

    constructor(townID : TownID,
                industryIndex : number,
                industryLevel : number,
                coal : number,
                iron : number,
                beer : number,
                isFlipped : boolean,
                ownerID : number)
    {
        this.townID = townID;
        this.industryIndex = industryIndex;
        this.industryLevel = industryLevel;
        this.coal = coal;
        this.iron = iron;
        this.beer = beer;
        this.isFlipped = isFlipped;
        this.ownerID = ownerID;
    }
}

class Link
{
    index : number;
    ownerID : number;

    constructor(index : number, ownerID : number)
    {
        this.index = index;
        this.ownerID = ownerID;
    }
}

export class PublicState 
{
    tilesOnBoard : TileOnBoard[];
    isBeerOnMerchantTiles : boolean[];
    links : Link[];

    numberOfCardsLeftInDeck : number;

    currentTurnOrder : number[];
    currentTurnIndex : number;

    publicPlayerData : PublicPlayerData[];

    coalMarketCount : number;
    ironMarketCount : number;

    actionsRemainingInCurrentTurn : number;

    isRailEra : boolean;

    constructor(gameConfig : GameConfig,
                privateState : PrivateState,
                startingPlayerData : PublicPlayerData,
                coalMarketCount : number,
                ironMarketCount : number)
    {
        this.tilesOnBoard = [];
        this.isBeerOnMerchantTiles = Array(gameConfig.board.mines.length).fill(true);
        this.links = [];
        
        this.numberOfCardsLeftInDeck = privateState.deck.length;

        this.currentTurnOrder = Array.from(Array(gameConfig.numberOfPlayers).keys());
        this.currentTurnIndex = 0;

        this.publicPlayerData = Array(gameConfig.numberOfPlayers).fill(startingPlayerData);

        this.coalMarketCount = coalMarketCount;
        this.ironMarketCount = ironMarketCount;

        this.actionsRemainingInCurrentTurn = 2;

        this.isRailEra = false;
    }

    IsTileEmpty(townID : TownID) : boolean
    {
        for (let i : number = 0; i < this.tilesOnBoard.length; i++)
        {
            if (this.tilesOnBoard[i].townID.locationIndex != townID.locationIndex)
            {
                continue;
            }

            if (this.tilesOnBoard[i].townID.tileIndex != townID.tileIndex)
            {
                continue;
            }

            return false;
        }

        return true;
    }

    DoesLinkExist(index : number) : boolean
    {
        for (let i : number = 0; i < this.links.length; i++)
        {
            if (this.links[i].index == index)
            {
                return true;
            }
        }

        return false;
    }
}

export enum CardType
{
    Location,
    Industry
}

export type Card =
{
    type : CardType;
    indexes : number[];
    isWild : boolean;     
}

export class PrivateState
{
    deck : Card[];

    Shuffle() : void
    {
        this.deck.sort(() => Math.random() - 0.5); 
    }

    Draw() : Card | undefined
    {
        return this.deck.pop();
    }

    DrawMultiple(amount : number) : Card[]
    {
        let cards : Card[] = [];
        for (let i : number = 0; i < amount; i++)
        {
            let card = this.Draw();
            if (card == undefined)
            {
                return cards;
            }
            cards.push(card);
        }

        return cards;
    }

    constructor(gameConfig : GameConfig) 
    {
        this.deck = [];

        let numberOfPlayersIndex : number = gameConfig.numberOfPlayers - 2;

        for (let i : number = 0; i < gameConfig.board.towns.length; i++)
        {
            let town = gameConfig.board.towns[i];
            if (town != undefined && town.location.cardCountForPlayerCounts.length >= (gameConfig.numberOfPlayers-1))
            {
                let copiesOfCard = town.location.cardCountForPlayerCounts[numberOfPlayersIndex];
                for (let j : number = 0; j < copiesOfCard; j++)
                {
                    this.deck.push({type: CardType.Location, indexes: [i], isWild: false});
                }
            }
        }

        for (let i : number = 0; i < gameConfig.industryCards.length; i++)
        {
            if (gameConfig.industryCards[i].cardCountForPlayerCounts.length >= (gameConfig.numberOfPlayers-1)) 
            {
                let copiesOfCard = gameConfig.industryCards[i].cardCountForPlayerCounts[numberOfPlayersIndex];
                for (let j : number = 0; j < copiesOfCard; j++)
                {
                    this.deck.push({type: CardType.Industry, indexes: gameConfig.industryCards[i].industries, isWild: false});
                }
            }
        }

        this.Shuffle();
    }
}

export class LocalState
{
    hand : Card[];

    constructor(hand : Card[]) 
    {
        this.hand = hand;
    }
}