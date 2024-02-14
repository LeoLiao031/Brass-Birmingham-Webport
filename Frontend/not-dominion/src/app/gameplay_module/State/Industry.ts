/*
Represents the stats of a level of an industry
*/
export class IndustryLevel
{
    moneyCost: number; 
    coalCost: number;
    ironCost: number;

    beerCostToFlip: number;
    victoryPoints: number;
    linkPoints: number;
    incomeBonus: number;

    coalGenerated : number;
    ironGenerated : number;
    beerGeneratedCanal : number;
    beerGeneratedRail : number;

    isOnlyInRail : boolean;
    developable : boolean;
    startingAmount : number;

	constructor(moneyCost : number,
                coalCost : number,
                ironCost : number,
                beerCostToFlip : number,
                victoryPoints : number,
                linkPoints : number,
                incomeBonus: number,
                coalGenerated : number,
                ironGenerated : number,
                beerGeneratedCanal : number,
                beerGeneratedRail : number,
                isOnlyInRail : boolean,
                developable : boolean,
                startingAmount : number)
    {
        this.moneyCost = moneyCost;
        this.coalCost = coalCost;
        this.ironCost = ironCost;

        this.beerCostToFlip = beerCostToFlip;
        this.victoryPoints = victoryPoints;
        this.linkPoints = linkPoints;
        this.incomeBonus = incomeBonus;

        this.coalGenerated = coalGenerated;
        this.ironGenerated = ironGenerated;
        this.beerGeneratedCanal = beerGeneratedCanal;
        this.beerGeneratedRail = beerGeneratedRail;

        this.isOnlyInRail = isOnlyInRail;
        this.developable = developable;
        this.startingAmount = startingAmount;
	}
    
}

export class Industry
{
    name : string;
    industryLevels : IndustryLevel[];

    constructor (name : string,
                 industryLevels : IndustryLevel[])
    {
        this.name = name;
        this.industryLevels = industryLevels;
    }
}