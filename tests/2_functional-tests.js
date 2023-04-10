const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    let puzzleIn = '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'
    let puzzleOut = '827549163531672894649831527496157382218396475753284916962415738185763249374928651'
    //Solve a puzzle with valid puzzle string: POST request to /api/solve
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: puzzleIn})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.solution, puzzleOut);
            done();
          });
      });
    //Solve a puzzle with missing puzzle string: POST request to /api/solve
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: ''})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field missing');
            done();
          });
      });
    //Solve a puzzle with invalid characters: POST request to /api/solve
    test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: 'g2..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
      });
    //Solve a puzzle with incorrect length: POST request to /api/solve
    test('Solve a puzzle with invalid length: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: '2..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
      });
    //Solve a puzzle that cannot be solved: POST request to /api/solve
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
        chai
          .request(server)
          .post('/api/solve')
          .send({puzzle: '22..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Puzzle cannot be solved');
            done();
          });
      });
    //Check a puzzle placement with all fields: POST request to /api/check
    test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({puzzle: puzzleIn, coordinate: 'A3', value: 7})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.valid, true);
            done();
          });
      });
    //Check a puzzle placement with single placement conflict: POST request to /api/check
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({puzzle: puzzleIn, coordinate: 'A3', value: 4})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.conflict.length, 1);
            done();
          });
      });
    //Check a puzzle placement with multiple placement conflicts: POST request to /api/check
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({puzzle: puzzleIn, coordinate: 'A3', value: 1})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isAtLeast(res.body.conflict.length, 1);
            done();
          });
      });
    //Check a puzzle placement with single placement conflict: POST request to /api/check
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({puzzle: puzzleIn, coordinate: 'B1', value: 1})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isAtLeast(res.body.conflict.length, 2);
            done();
          });
      });
    //Check a puzzle placement with missing required fields: POST request to /api/check
    test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({puzzle: puzzleIn, coordinate: '', value: 1})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Required field(s) missing');
            done();
          });
      });
    //Check a puzzle placement with invalid characters: POST request to /api/check
    test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({puzzle: 'g2..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51', coordinate: 'B1', value: 1})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid characters in puzzle');
            done();
          });
      });
    //Check a puzzle placement with incorrect length: POST request to /api/check
    test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({puzzle: '2..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51', coordinate: 'B1', value: 1})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
            done();
          });
      });
    //Check a puzzle placement with invalid placement coordinate: POST request to /api/check
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({puzzle: puzzleIn, coordinate: 'ZZ', value: 1})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid coordinate');
            done();
          });
      });
    //Check a puzzle placement with invalid placement value: POST request to /api/check
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
        chai
          .request(server)
          .post('/api/check')
          .send({puzzle: puzzleIn, coordinate: 'B1', value: 199})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'Invalid value');
            done();
          });
      });
});

