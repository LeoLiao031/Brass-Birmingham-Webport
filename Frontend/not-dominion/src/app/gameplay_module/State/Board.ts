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

export enum LocationType
{
    Town,
    Mine,
}

export type Connection = 
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

    AreLocationsConnected(connections : number[], locationToReach : string) : boolean
    {
        let traverser : Traverser = new Traverser(this, connections);

        let currentLink : Link | undefined = traverser.GetNextLink();
        while (currentLink != undefined)
        {
            for (let i : number = 0; i < currentLink.connections.length; i++)
            {
                let connection : Connection = currentLink.connections[i];

                if ((connection.locationType == LocationType.Town &&
                    this.towns[connection.index].location.name == locationToReach)
                    ||
                    (connection.locationType == LocationType.Mine &&
                    this.mines[connection.index].location.name == locationToReach))
                {
                    return true;
                }
            }

            currentLink = traverser.GetNextLink();
        }

        return false;
    }
    
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

export enum TraversalType
{
    BreadthFirst,
    DepthFirst
} 

export class Traverser
{
    board : Board;
    toDoList : number[];
    alreadyDoneList : number[];

    GetNextLink() : Link | undefined 
    {
        return undefined
    };

    constructor(board : Board, startingConnections : number[], traversalType : TraversalType = TraversalType.BreadthFirst)
    {
        this.board = board;
        this.toDoList = startingConnections;
        this.alreadyDoneList = [];

        if (traversalType = TraversalType.BreadthFirst)
        {
            this.GetNextLink = this.BreadthFirstTraversal;
        } else if (traversalType = TraversalType.DepthFirst) 
        {
            this.GetNextLink = this.DepthFirstTraversal;
        }
    }

    BreadthFirstTraversal() : Link | undefined
    {
        let currentConnection = this.toDoList.shift();
        return this.TraverseWithCurrentConnection(currentConnection);

    }

    DepthFirstTraversal() : Link | undefined
    {
        let currentConnection = this.toDoList.pop();
        return this.TraverseWithCurrentConnection(currentConnection);
    }

    TraverseWithCurrentConnection(currentConnection: number | undefined)
    {
        if (currentConnection == undefined)
        {
            return undefined;
        }
        this.alreadyDoneList.push(currentConnection);

        return this.board.links[currentConnection];
    }
}