import { GameConfig } from "./GameConfig"

class IndustrySection 
{
    industryID : number;
    counts : number[];
    
    constructor(industryID : number, counts : number[])
    {
        this.industryID = industryID;
        this.counts = counts;
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

            for (let level : number = 0; level < gameConfig.industries.length; level++)
            {
                startingAmount.push(
                    gameConfig.industries[i].industryLevels[level].startingAmount);
            }

            this.section.push(new IndustrySection(i, startingAmount));
        }
    }
}

class PublicPlayerData
{
    money : number;
    moneySpentInCurrentRound : number;
    victoryPoints : number;
    income : number;
    playerArea : PlayerArea;
    discardPile : Card[];

    constructor(money : number, 
                moneySpentInCurrentRound : number, 
                victoryPoints : number,
                income : number,
                discardPile : Card[])
    {
        this.money = money;
        this.moneySpentInCurrentRound = moneySpentInCurrentRound;
        this.victoryPoints = victoryPoints;
        this.income = income;
        this.playerArea = new PlayerArea(new GameConfig());
        this.discardPile = discardPile;
    }
}

class TileOnBoard
{
    townIndex : number;
    tileIndex : number;
    industryIndex : number;
    industryLevel : number;
    coal : number;
    iron : number;
    beer : number;
    isFlipped : boolean;
    ownerID : number;

    constructor(townIndex : number,
                tileIndex : number,
                industryIndex : number,
                industryLevel : number,
                coal : number,
                iron : number,
                beer : number,
                isFlipped : boolean,
                ownerID : number)
    {
        this.townIndex = townIndex;
        this.tileIndex = tileIndex;
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
    locationIndexA : number;
    locationIndexB : number;
    ownerID : number;

    constructor(locationIndexA : number,
            locationIndexB : number,
            ownerID : number)
    {
        this.locationIndexA = locationIndexA;
        this.locationIndexB = locationIndexB;
        this.ownerID = ownerID;
    }
}

class PublicState 
{
    tilesOnBoard : TileOnBoard[];
    isBeerOnMerchantTiles : boolean[];
    links : Link[];

    wildLocationCardsLeft : number;
    wildIndustryCardsLeft : number;
    numberOfCardsLeftInDeck : number;

    currentTurnOrder : number[];
    currentTurnIndex : number;

    publicPlayerData : PublicPlayerData[];

    coalMarketCount : number;
    ironMarketCount : number;

    actionsRemainingInCurrentTurn : number;

    isRailEra : boolean;

    constructor(tilesOnBoard : TileOnBoard[],
                links : Link[],
                wildLocationCardsLeft : number,
                wildIndustryCardsLeft : number,
                numberOfCardsLeftInDeck : number,
                currentTurnOrder : number[],
                currentTurnIndex : number,
                publicPlayerData : PublicPlayerData[],
                coalMarketCount : number,
                ironMarketCount : number,
                actionsRemainingInCurrentTurn: number,
                isRailEra : boolean)
    {
        this.tilesOnBoard = tilesOnBoard;
        this.isBeerOnMerchantTiles = Array(new GameConfig().board.mineIndexes.length).fill(true);
        this.links = links;
        
        this.wildLocationCardsLeft = wildLocationCardsLeft;
        this.wildIndustryCardsLeft = wildIndustryCardsLeft;
        this.numberOfCardsLeftInDeck = numberOfCardsLeftInDeck;

        this.currentTurnOrder = currentTurnOrder;
        this.currentTurnIndex = currentTurnIndex;

        this.publicPlayerData = publicPlayerData;

        this.coalMarketCount = coalMarketCount;
        this.ironMarketCount = ironMarketCount;

        this.actionsRemainingInCurrentTurn = actionsRemainingInCurrentTurn;

        this.isRailEra = isRailEra;
    }
}

enum CardType
{
    Location,
    Industry
}

type Card =
{
    type : CardType;
    indexes : number[];     
}

class PrivateState
{
    deck : Card[];

    Shuffle() : void
    {
        this.deck.sort(() => Math.random() - 0.5); 
    }

    constructor(gameConfig : GameConfig) 
    {
        this.deck = [];

        for (let i : number = 0; i < gameConfig.board.locationAndConnections.length; i++)
        {
            let Town = gameConfig.board.GetAsTown(i);
            if (Town != undefined && Town.name)
            {
                this.deck.push({type: CardType.Location, indexes: [i]})
            }
        }

        for (let i : number = 0; i < gameConfig.industryCards.length; i++)
        {
            this.deck.push({type: CardType.Industry, indexes: gameConfig.industryCards[i]})
        }
    }
}

class LocalState
{
    hand : Card[];

    constructor(hand : Card[]) 
    {
        this.hand = hand;
    }
}