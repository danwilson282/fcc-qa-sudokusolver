'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //req.body.puzzle is the puzzle string
      //coordinate
      //value
      
      //check for no missing fields
      if (!req.body.puzzle || !req.body.coordinate || !req.body.value){
        res.json({ error: 'Required field(s) missing' })
      }
      else{
        //check puzzle string is valid
        let validityCheck=solver.validate(req.body.puzzle)
        if (validityCheck.error){
          res.json(validityCheck)
        }
        else{
          //check coordinate valid
          let coord = solver.coordinate(req.body.coordinate)
          if (coord.error){
            res.json(coord)
          }
          //check value valid
          if (req.body.value>9 || req.body.value<1 || isNaN(req.body.value)){
            res.json({ error: 'Invalid value' })
          }
          //check the solution
          let puzzle = solver.puzzleToArray(req.body.puzzle)
          let row = coord.row
          let column = coord.column
          let value = parseInt(req.body.value)

          let conflict = solver.checkPlacement(puzzle, row, column, value)
          if (conflict.length>0){
            res.json({valid: false, conflict: conflict})
          }
          res.json({valid: true})
          //res.json(req.body)
        }
      }
      
      //res.json(solver.validate(req.body.puzzle))
      //res.json('heello')
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      //check for missing puzzle string
      if (!req.body.puzzle){
        res.json({ error: 'Required field missing' })
      }
      else{
        let validityCheck=solver.validate(req.body.puzzle)
        if (validityCheck.error){
          res.json(validityCheck)
        }
        else{
          res.json(solver.solve(solver.puzzleToArray(req.body.puzzle)))
          //res.json({solution: solver.solve(solver.puzzleToArray(req.body.puzzle))})
        }
      }
      
      
    });
};
