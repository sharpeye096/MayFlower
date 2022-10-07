import { allIndexes, getByIndex, getUnitIndexes } from "./Algo";
export function tryResolve(values: number[]): number[] {
    
    return bruteForceRecursive(values, 0);
}

const cellIndexes = Array(81).fill(0).map((c, i)=>i);

function bruteForceRecursive(values: number[], recursiveDepth: number): number[] {
    // find the cell with fewest candidate values
    const cellsCandidates = cellIndexes.map(index=>getCellCandidates(index, values));
    let fewestCandidateCellIndex = -1;
    let fewestCandidates = Array(10).fill(0);
    for(const cellIndex of cellIndexes) {
        const cellCandidates = cellsCandidates[cellIndex];
        if(cellCandidates === undefined) {
            // some cell has impossible setting
            return [];
        }
        const candidatesCountInThisCell = cellCandidates.length;
        
        if(candidatesCountInThisCell > 0 && candidatesCountInThisCell < fewestCandidates.length) {
            fewestCandidateCellIndex = cellIndex;
            fewestCandidates = cellCandidates;
        }
    }

    if(fewestCandidateCellIndex === -1) {
        // all resolved
        return values;
    }
    
    for(const candidate of fewestCandidates) {
        values[fewestCandidateCellIndex] = candidate;
        
        if(recursiveDepth === 0) {
            console.log("trying..."+candidate+" for ")
            console.log("   Candidate cell: "+fewestCandidateCellIndex);
            console.log("   All candidates: "+fewestCandidates);
        }
        const testThis = bruteForceRecursive(values, recursiveDepth+1);
        if(testThis.length) {
            return testThis;
        }
        
    }

    // reset can candidate can go back
    values[fewestCandidateCellIndex] = 0;
    return [];
}



function getCellCandidates(index: number, values: number[]): number[] | undefined {
    // already set
    if(values[index] !== 0) {
        return [];
    }

    const threeUnits = getUnitIndexes(index);
    
    const values0To9 = [0,1,2,3,4,5,6,7,8,9];    
    const alreadySetValues = threeUnits.flatMap(unit=>allIndexes[unit])
                                       .map(idx=>getByIndex(idx, values));
    alreadySetValues.forEach(value=>values0To9[value] = 0);
    const candidates = values0To9.filter(v=>v!==0);
    return candidates.length > 0 ? candidates : undefined;
    
}
