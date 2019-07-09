const NUM_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var square = [[0,0,0],[0,0,0],[0,0,0]];
var board = square.slice(0).map(row => row.slice(0).map(s => square.slice(0).map(sr => [0, 0, 0])));
var rowList, colList, squareList;
var done = false;
var reset;
while(!done){
  reset = false;
  rowList = square.slice(0).map(row =>row.slice(0).map(s => new Set(NUM_LIST)));
  colList = square.slice(0).map(row =>row.slice(0).map(s => new Set(NUM_LIST)));
  squareList = square.slice(0).map(row =>row.slice(0).map(s => new Set(NUM_LIST)));
  for (boardRow = 0; boardRow < 3; boardRow++){
    if (reset) break;
    for (boardCol = 0; boardCol < 3; boardCol++){
      if (reset) break;
      for (squareRow = 0; squareRow < 3; squareRow++){
        if (reset) break;
        for (squareCol = 0; squareCol < 3; squareCol++){
          let vals = [...rowList[boardRow][squareRow].values()]
          .filter(val => [...colList[boardCol][squareCol].values()].includes(val))
          .filter(val2 => [...squareList[boardRow][boardCol].values()].includes(val2));
          console.log(vals);
          if (vals.length == 0) {
            reset = true;
            break;
          }
          let next = vals[Math.floor(Math.random() * vals.length)];
          board[boardRow][boardCol][squareRow][squareCol] = next;
          rowList[boardRow][squareRow].delete(next);
          colList[boardCol][squareCol].delete(next);
          squareList[boardRow][boardCol].delete(next);
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