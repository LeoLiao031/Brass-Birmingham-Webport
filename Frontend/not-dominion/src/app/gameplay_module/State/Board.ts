class Tile 
{
    // 1 = House
    // 2 = Coal
    // 3 = Iron
    // 4 = Crate
    // 5 = Brewery
    // 6 = Pottery
    allowedIndustries : number[];

    constructor(allowedIndustries : number[]) 
    {
        this.allowedIndustries = allowedIndustries;
    }
}

class Location 
{
    name : string;

    constructor(name : string) 
    {
        this.name = name;
    }
}

export class Town extends Location
{
    tiles : Tile[];
    // Starting from 2 players
    cardCountForPlayerCounts : number[];

    constructor(name : string,
                tiles : Tile[], 
                cardCountForPlayerCounts : number[]) 
    {
        super(name);
        this.tiles = tiles
        this.cardCountForPlayerCounts = cardCountForPlayerCounts
    }
}

enum MineRewardType 
{
    Develop,
    Income,
    VictoryPoints,
    Money
}

enum ConnectionType
{
    Canal,
    Rail,
    Both
}

class Mine extends Location
{
    linkPoints : number;
    rewardType : MineRewardType;
    rewardValue : number;
    merchantTilesCount : number;

    constructor(name : string,
                linkPoints : number,
                rewardType : MineRewardType,
                rewardValue : number,
                merchantTilesCount : number)
    {
        super(name);
        this.linkPoints = linkPoints;
        this.rewardType = rewardType;
        this.rewardValue = rewardValue;
        this.merchantTilesCount = merchantTilesCount;
    }
}

type IndexConnection = 
{
    connectionType : ConnectionType;
    index : number;
}

type LocationAndConnections =
{
    location : Location;
    connectionIndexes : IndexConnection[];
}

export type LocationInit = 
{
    location : Location;
    connections : 
    { 
        connectionType : ConnectionType;
        locationName : string;
    }[] 
}

export class Board 
{
    locationAndConnections : LocationAndConnections[];
    mineIndexes : number[];

    GetAsTown(index : number) : Town | undefined
    {
        if (this.locationAndConnections[index].location instanceof Town)
        {
            this.locationAndConnections[index].location as Town
        }
        
        return undefined;
    }

    GetAsMine(index : number) : Mine | undefined
    {
        if (this.locationAndConnections[index].location instanceof Mine)
        {
            this.locationAndConnections[index].location as Mine
        }
        
        return undefined;
    }
    
    constructor(boardInit : LocationInit[]) 
    {
        this.locationAndConnections = [];
        this.mineIndexes = [];

        let nameArray : string[] = this.locationAndConnections.map(
            locationAndConnections => locationAndConnections.location.name);

        for (let i : number = 0; i < boardInit.length; i++) 
        {
            if (boardInit[i].location instanceof Mine)
            {
                this.mineIndexes.push(i);
            }

            let connectionIndexes : IndexConnection[] = [];
            for (let j : number = 0; j < boardInit[i].connections.length; j++) 
            {
                let connectionIndex : number = nameArray.indexOf(boardInit[i].connections[i].locationName);
                if (connectionIndex != -1) 
                {
                    connectionIndexes.push({
                        connectionType: boardInit[i].connections[i].connectionType,
                        index: connectionIndex});
                }
            }

            this.locationAndConnections[i].connectionIndexes = connectionIndexes;
        }
    }
}