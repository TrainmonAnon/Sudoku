const NUM_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const BOARD_ROW = 0;
const SQUARE_ROW = 1;
const BOARD_COL = 2;
const SQUARE_COL = 3;
var square = [[0,0,0],[0,0,0],[0,0,0]];

const generatePuzzle = () => {
  var board = square.slice(0).map(row => row.slice(0).map(s => square.slice(0).map(sr => [0, 0, 0])));
  var rowList, colList, squareList;
  var done = false;
  var reset;
  
  while(!done) {
    reset = false;
    rowList = square.slice(0).map(row =>row.slice(0).map(s => new Set(NUM_LIST)));
    colList = square.slice(0).map(row =>row.slice(0).map(s => new Set(NUM_LIST)));
    squareList = square.slice(0).map(row =>row.slice(0).map(s => new Set(NUM_LIST)));
    
    for (br = 0; br < 3; br++) {
      if (reset) break;
      for (sr = 0; sr < 3; sr++) {
        if (reset) break;
        for (bc = 0; bc < 3; bc++) {
          if (reset) break;
          for (sc = 0; sc < 3; sc++) {
            let vals = [...rowList[br][sr].values()]
            .filter(val => [...colList[bc][sc].values()].includes(val))
            .filter(val2 => [...squareList[br][bc].values()].includes(val2));
            // vals = getSquareVals(rowList, colList, squareList, [br, sr, bc, sc]);
            if (vals.length == 0) {
              reset = true;
              break;
            }
            let next = vals[Math.floor(Math.random() * vals.length)];
            board[br][sr][bc][sc] = next;
            rowList[br][sr].delete(next);
            colList[bc][sc].delete(next);
            squareList[br][bc].delete(next);
          }
        }
      }
    }
    if (reset) continue;
    done = true;
  }
  console.log(board[0]);
  console.log(board[1]);
  console.log(board[2]);
  return board;
}
//wip
const getSquareVals = (rowL, colL, squareL, loc) => {
  return [...rowL[loc[BOARD_ROW]][loc[SQUARE_ROW]]]
  .filter(val => [...colL[loc[BOARD_COL]][loc[SQUARE_COL]]].includes(val))
  .filter(val2 => [...squareL[loc[SQUARE_ROW]][loc[SQUARE_COL]]].includes(val2));
}

const hidePuzzle = (board) => {
  var rowHidden = square.slice(0).map(row =>row.slice(0).map(s => new Set()));
  var colHidden = square.slice(0).map(row =>row.slice(0).map(s => new Set()));
  var squareHidden = square.slice(0).map(row =>row.slice(0).map(s => new Set()));

  var hiddenList = [];
  var hiddenBoard = board.slice(0).map(s => s.slice(0).map(s2 => s2.slice(0).map(s3 => s3.slice(0))));

  var loc = [0,0,0,0];
  while (hiddenList.length < 20) {
    let invalid = false;
    loc = loc.map(val => Math.floor(Math.random() * 3));
    let locVal = board[loc[BOARD_ROW]][loc[BOARD_COL]][loc[SQUARE_ROW]][loc[SQUARE_COL]];
    if (!hiddenList.some(prevLoc => loc.every((n, i) => n == prevLoc[0][i]))) {
      rowHidden[loc[BOARD_ROW]][loc[SQUARE_ROW]].add(locVal);
      colHidden[loc[BOARD_COL]][loc[SQUARE_COL]].add(locVal);
      squareHidden[loc[BOARD_ROW]][loc[BOARD_COL]].add(locVal);
      hiddenList.unshift([loc, locVal]);
      let posLocVals = [...rowHidden[loc[BOARD_ROW]][loc[SQUARE_ROW]].values()]
      .filter(val => [...colHidden[loc[BOARD_COL]][loc[SQUARE_COL]].values()].includes(val))
      .filter(val2 => [...squareHidden[loc[BOARD_ROW]][loc[BOARD_COL]].values()].includes(val2));
      //let posLocVals = getSquareVals(rowHidden, colHidden, squareHidden, loc);

      //check to make sure there's only 1 solution
      if (posLocVals.length > 1) {
        let steps = new Array(hiddenList.length).fill(0);
        let step = 0;
        let numSolutions = 0;
        while (steps[0] <= posLocVals.length) {
          let rowSolve = rowHidden.slice(0).map(sr => sr.slice(0).map(sVals => new Set(sVals)));
          let colSolve = colHidden.slice(0).map(sr => sr.slice(0).map(sVals => new Set(sVals)));
          let squareSolve = squareHidden.slice(0).map(sr => sr.slice(0).map(sVals => new Set(sVals)));
          
          for (step = 0; step < hiddenList.length; step++) {
            let stepLoc = hiddenList[step][0];
            let stepLocVals = [...rowHidden[stepLoc[BOARD_ROW]][stepLoc[SQUARE_ROW]].values()]
            .filter(val => [...colHidden[stepLoc[BOARD_COL]][stepLoc[SQUARE_COL]].values()].includes(val))
            .filter(val2 => [...squareHidden[stepLoc[BOARD_ROW]][stepLoc[BOARD_COL]].values()].includes(val2));
            //let stepLocVals = getSquareVals(rowSolve, colSolve, squareSolve, stepLoc);
            if (steps[step] >= stepLocVals.length){
              break;
            }
            let stepVal = stepLocVals[steps[step]];
            rowSolve[stepLoc[BOARD_ROW]][stepLoc[SQUARE_ROW]].delete(stepVal);
            colSolve[stepLoc[BOARD_COL]][stepLoc[SQUARE_COL]].delete(stepVal);
            squareSolve[stepLoc[BOARD_ROW]][stepLoc[BOARD_COL]].delete(stepVal);
          }
          if (step > 0){
            steps[step - 1] += 1;
            steps[step] = 0;
          } else {
            break;
          }
          if (step == hiddenList.length) {
            numSolutions++;
            if (numSolutions > 1) {
              invalid = true;
              break;
            }
          }

        }
      }
      if (invalid) {
        rowHidden[loc[BOARD_ROW]][loc[SQUARE_ROW]].delete(locVal);
        colHidden[loc[BOARD_COL]][loc[SQUARE_COL]].delete(locVal);
        squareHidden[loc[BOARD_ROW]][loc[BOARD_COL]].delete(locVal);
        hiddenList.shift();
        continue;
      }
    }
    
  }
  hiddenList.forEach(h => {
    hiddenBoard[h[0][BOARD_ROW]][h[0][SQUARE_ROW]][h[0][BOARD_COL]][h[0][SQUARE_COL]] = 0;
  });
  console.log(board[0]);
  console.log(board[1]);
  console.log(board[2]);
  return hiddenBoard;
}

let solution = generatePuzzle();
let start = hidePuzzle(solution);
