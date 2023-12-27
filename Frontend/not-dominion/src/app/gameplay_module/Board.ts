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

class Town extends Location
{
    tiles : Tile[];
    // Yellow, Purple, Red = At least 2 players
    // Blue = At least 3 players
    // Green = At least 4 players
    playersRequiredForCard : number;

    constructor(name : string,
                tiles : Tile[], 
                playersRequiredForCard : number) 
    {
        super(name);
        this.tiles = tiles
        this.playersRequiredForCard = playersRequiredForCard
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

type Connection = 
{
    connectionType : ConnectionType;
    locationName : string;
}

type IndexConnection = 
{
    connectionType : ConnectionType;
    index : number;
}

export class Board 
{
    locationList : Location[];
    adjacencyList : Map<number, IndexConnection[]>;
    mineIndexes : number[];
    
    constructor(locationsAndConnections: { location : Location, connections : Connection[] }[]) 
    {
        this.locationList = locationsAndConnections.map(locationAndConnections => locationAndConnections.location);
        this.mineIndexes = [];

        this.adjacencyList = new Map<number, IndexConnection[]>();
        let nameArray : string[] = this.locationList.map(locationAndConnections => locationAndConnections.name);

        for (let i : number = 0; i < locationsAndConnections.length; i++) 
        {
            if (locationsAndConnections[i].location instanceof Mine)
            {
                this.mineIndexes.push(i);
            }

            let connectionIndexes : IndexConnection[] = [];
            for (let j : number = 0; j < locationsAndConnections[i].connections.length; j++) 
            {
                let connectionIndex : number = nameArray.indexOf(locationsAndConnections[i].connections[i].locationName);
                if (connectionIndex != -1) 
                {
                    connectionIndexes.push({
                        connectionType: locationsAndConnections[i].connections[i].connectionType,
                        index: connectionIndex});
                }
            }

            this.adjacencyList.set(i, connectionIndexes);
        }
    }
}