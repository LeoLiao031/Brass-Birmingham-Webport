class Tile 
{
    // 0 = House
    // 1 = Coal
    // 2 = Iron
    // 3 = Crate
    // 4 = Brewery
    // 5 = Pottery
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

export class Mine extends Location
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

enum LocationType
{
    Town,
    Mine,
    Link
}

type Connection = 
{
    locationType : LocationType;
    index : number;
}

export class Link
{
    connectionType : ConnectionType;
    connections : Connection[];

    constructor(connectionType : ConnectionType,
                connections : Connection[])
    {
        this.connectionType = connectionType;
        this.connections = connections;
    }

}

export type LinkInit = 
{
    connectionType : ConnectionType;
    locations : string[];
}

export class Board 
{
    towns : { location : Town, connections: number[] }[];
    mines : { location : Mine, connections: number[] }[];
    links : Link[];
    
    constructor(towns : Town[],
                mines : Mine[],
                linkInits : LinkInit[]) 
    {
        // Initialize towns and mines without any connections
        this.towns = towns.map(town => ({ location: town, connections : <number[]>[]}));
        this.mines = mines.map(mine => ({ location: mine, connections : <number[]>[]}));

        this.links = [];

        // Loop through linkInits and find the indexes and arrays that are referenced with strings
        for (let linkIndex : number = 0; linkIndex < linkInits.length; linkIndex++)
        {
            let connections : Connection[] | undefined = 
                this.InitializeLinkForLocations
                (
                    [
                        {locations: towns, locationType: LocationType.Town},
                        {locations: mines, locationType: LocationType.Mine},
                    ],
                    linkInits[linkIndex]
                );

            if (connections == undefined)
            {
                continue;
            }
            
            // Create the link object and create the connection in the other array(s)
            this.links.push(new Link(linkInits[linkIndex].connectionType, connections));

            for (let i = 0; i < connections.length; i++) 
            {
                this.PushNewConnection(connections[i], linkIndex);
            }
        }
    }

    private InitializeLinkForLocations(locationArrays : {locations : Location[], locationType : LocationType}[], linkInit : LinkInit) : 
        Connection[] | undefined
    {
        let connections : Connection[] = [];

        LinkInitLoop:
        for (let linkInitIndex : number = 0; linkInitIndex < linkInit.locations.length; linkInitIndex++)
        {
            for (let locationArrayIndex : number = 0; locationArrayIndex < locationArrays.length; locationArrayIndex++)
            {
                let locationArray : Location[] = locationArrays[locationArrayIndex].locations;
    
                for (let locationIndex : number = 0; locationIndex < locationArray.length; locationIndex++)
                {
                    if (linkInit.locations[linkInitIndex] == locationArray[locationIndex].name)
                    {
                        connections.push({ locationType : locationArrays[locationArrayIndex].locationType, index : locationIndex });
                        continue LinkInitLoop;
                    }
                }
            }

            console.log("Could not find location: " + linkInit.locations[linkInitIndex])
        }

        if (connections.length < linkInit.locations.length)
        {
            return undefined;
        }

        return connections;
    }

    private PushNewConnection(connection : Connection, index : number)
    {
        switch (connection.locationType) 
        {
            case LocationType.Town:
                this.towns[connection.index].connections.push(index);
                break;
            case LocationType.Mine:
                this.mines[connection.index].connections.push(index);
                break;
            default:
                break;
        }
    }
}