class SudokuSolver {
  //change string into array
  puzzleToArray(puzzleString){
    let puzzleArray = []
    let row = []
    for (let i=0;i<9;i++){
      row = []
      for (let j=0;j<9;j++){
        if (puzzleString[(9*i)+j]==="."){
          row[j]=0
        }
        else{
          row[j] = parseInt(puzzleString[(9*i)+j])
        }
        
      }
      puzzleArray[i]=row
    }
    return puzzleArray
  }

  boardToString(board){
    let returnString = ''
    for (let i=0;i<9;i++){
      for (let j=0;j<9;j++){
        returnString = returnString+board[i][j]
      }
    }
    return returnString
  }

  //scroll through board looking for empty cells
  nextEmptySpot(board) {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (board[i][j] === 0) 
                return [i, j];
        }
    }
    return [-1, -1];
}

checkValue(board, row, column, value) {
  if(this.checkRowPlacement(board, row, column, value) &&
    this.checkColPlacement(board, row, column, value) &&
    this.checkRegionPlacement(board, row, column, value)) {
      return true;
  }
  
  return false; 
};

coordinate(coord){
  let retVal = {error: 'Invalid coordinate'}
  let xOut
  let yOut
  if (coord.length==2){
    let x = coord[0].toLowerCase()
    if (x=='a'){
      yOut=0
    }
    else if (x=='b'){
      yOut=1
    }
    else if (x=='c'){
      yOut=2
    }
    else if (x=='d'){
      yOut=3
    }
    else if (x=='e'){
      yOut=4
    }
    else if (x=='f'){
      yOut=5
    }
    else if (x=='g'){
      yOut=6
    }
    else if (x=='h'){
      yOut=7
    }
    else if (x=='i'){
      yOut=8
    }

    if (coord[1]>0 && coord[1]<10){
      xOut = coord[1]-1
    }
    if (xOut!==undefined && yOut!==undefined){
      retVal = {column: xOut, row: yOut}
    }
  }
  return retVal
}

//check initial puzzle string is solveable
checkValid(board, row, column, value) {
  if(this.checkRowPlacement(board, row, column, value)==false ||
    this.checkColPlacement(board, row, column, value)==false ||
    this.checkRegionPlacement(board, row, column, value)==false) {
      return false;
  }
  
  return true; 
};

//return invalid logic
checkPlacement(puzzle, row, column, value){
  //let puzzle = solver.puzzleToArray(req.body.puzzle)
          //let row = coord.row
          //let column = coord.column
          //let value = parseInt(req.body.value)
          let conflict = []
          if (this.checkRowPlacement(puzzle, row, column, value)==false){
            conflict.push("row")
          }
          if (this.checkColPlacement(puzzle, row, column, value)==false){
            conflict.push("column")
          }
          if (this.checkRegionPlacement(puzzle, row, column, value)==false){
            conflict.push("region")
          }
          return conflict;
}

  validate(puzzleString) {
    let regex = /^[0-9.]+$/
    let output = {valid: true}
    let checkString = regex.test(puzzleString)
    
    if (puzzleString.length!=81){
      output= { error: 'Expected puzzle to be 81 characters long' }
      return output;
    }
    if (puzzleString.length==0){
      output= { error: 'Expected puzzle to be 81 characters long' }
      return output;
    }
    if (checkString==false){
      output = { error: 'Invalid characters in puzzle' }
      return output;
    }
    //check original string is valid
    let board = this.puzzleToArray(puzzleString)
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
          if (board[i][j] !== 0) {
            if (this.checkValid(board, i, j, board[i][j])==false){
              //console.log(i, j, board[i][j])
              //console.log(this.checkRegionPlacement(board, i, j, board[i][j]))
              output = { error: 'Puzzle cannot be solved' }
              return output;
            }
          }
              
      }
  }
    return output
  }

  checkRowPlacement(board, row, column, value) {
    for(var i = 0; i < board[row].length; i++) {
      if(board[row][i] === value && i!==column) {
          return false;
      }
  }
 
  return true;
  }

  checkColPlacement(board, row, column, value) {
    for(var i = 0; i < board.length; i++) {
      if(board[i][column] === value && row!==i) {
          return false;
      }
  }

  return true;
  }

  checkRegionPlacement(board, row, column, value) {
    let boxRow = Math.floor(row / 3) * 3;
    let boxCol = Math.floor(column / 3) * 3;
    for (var r = 0; r < 3; r++){
        for (var c = 0; c < 3; c++){
            //if (board[boxRow + r][boxCol + c] === value && row!==(boxRow+r) && column!==(boxCol+c))
            if (board[boxRow + r][boxCol + c] === value && row!==(boxRow+r) && column!==(boxCol+c))
                return false;
        }
    }

    return true;
  }

  solve2(board) {
    let emptySpot = this.nextEmptySpot(board);
    let row = emptySpot[0];
    let col = emptySpot[1];
    // there is no more empty spots
    if (row === -1){
        //return board;
        let retString = this.boardToString(board)
        return({solution: retString})
    }
    
    for(let num = 1; num<=9; num++){
        if (this.checkValue(board, row, col, num)){
            board[row][col] = num;
            this.solve2(board);
        }
    }
    if (this.nextEmptySpot(board)[0] !== -1){
      board[row][col] = 0;
      return board
    }
        
    
    return false
    //let retString = this.boardToString(board)
    //return({solution: retString})
    //return({solution: '769235418851496372432178956174569283395842761628713549283657194516924837947381625'})
  }
  solve(board){

    this.solve2(board)
    if (this.solve2(board).solution!=undefined){
      return this.solve2(board)
    }
    //return;
  }
}

module.exports = SudokuSolver;

