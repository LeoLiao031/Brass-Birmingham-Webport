import { Game } from "../gameplay_module/State/Game";
import { IndustryLevel } from "../gameplay_module/State/Industry";

export const numberToRoman = new Map<number, string>([
    [1, 'I'],
    [2, 'II'],
    [3, 'III'],
    [4, 'IV'],
    [5, 'V'],
    [6, 'VI'],
    [7, 'VII'],
    [8, 'VIII'],
    [9, 'IX'],
    [10, 'X'],
]);

export function IndustryDataFromTile(game : Game, tileIndex : number) : IndustryLevel | undefined
{
    let tile = game.publicState.tilesOnBoard.at(tileIndex);
    if (tile == undefined)
    {
        return undefined;
    }
    return game.gameConfig.industries[tile.industryIndex].industryLevels[tile.industryLevel];
}