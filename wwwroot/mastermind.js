var mastermindApp = angular.module("mastermindApp", ["ang-drag-drop"]);

mastermindApp.controller("mastermindController", ["$scope", function (scope) {
    var i, j, row;

    scope.gameState = "playing"; //"playing", "won", "lost"

    scope.board = {
        numRows: 10,
        numPegs: 4,
        rows: [],
        solutions: []
    };

    scope.pegColors = [
        "red",
        "green",
        "white",
        "blue",
        "orange",
        "purple"
    ];

    //fill the board with empty rows
    for (i = 0; i < scope.board.numRows; i++) {
        row = {
            guessPegs: [],
            indicators: [],
            active: false
        };

        for (j = 0; j < scope.board.numPegs; j++) {
            row.guessPegs.push({color: "grey"});
            row.indicators.push({ color: "grey"});
        }

        scope.board.rows.push(row);
    }

    //set the solution
    scope.board.solutions.push({color: "red"});    
    scope.board.solutions.push({color: "blue"});    
    scope.board.solutions.push({color: "green"});    
    scope.board.solutions.push({color: "red"});    

    scope.board.rows[0].active=true;

    scope.dropValidate = function (row) {
        return row.active;
    };
    
    scope.onDrop = function (peg, color) {
        peg.color = color;
    };

    scope.unusedPegCount = function (row) {
        var count = 0;
        row.guessPegs.forEach(function(peg) {
            if (peg.color == "grey") {
                count++;
            } 
        });
        return count;
    };
    
    scope.check = function (rowIndex) {
        var i;
        var row = scope.board.rows[rowIndex];

        //first reset all the guess pegs to be unused
        row.guessPegs.forEach(function(peg) {
            //peg.used = false;
            peg.result = "none";  //"none", "color-only", "color-and-position"
        });
        //first reset all thesolution pegs to be unused
        scope.board.solutions.forEach(function(solution) {
            solution.used = false;
        });

        //first pass, look for right color in right place
        for(i=0; i < scope.board.numPegs; i++) {
            if (row.guessPegs[i].color === scope.board.solutions[i].color) {
                scope.board.solutions[i].used = true;
                row.guessPegs[i].result = "color-and-position";
            } 
        }

        //second pass, check failures for color only
        row.guessPegs.forEach(function(peg) {
            if (peg.result == "none") {
                //look for a matching color in the solution
                scope.board.solutions.forEach(function(solution) {
                    if (solution.used == false && solution.color == peg.color) {
                        solution.used = true;
                        peg.result = "color-only";
                    }
                });
            }
        });

        //count the number of successes
        var redCount = 0;
        var whiteCount = 0;

        row.guessPegs.forEach(function(peg) {
            if (peg.result === "color-and-position") {
                redCount++;
            }
            if (peg.result === "color-only") {
                whiteCount++;
            }
        });

        if (redCount === scope.board.numPegs) {
            scope.gameState = "won";
        }

        //finally set the indicators
        var index = 0;

        while (redCount > 0) {
            row.indicators[index].color = "red";
            redCount--;
            index++;
        }

        while (whiteCount > 0) {
            row.indicators[index].color = "white";
            whiteCount--;
            index++;
        }

        //now move to the next row
        row.active = false;
        if (rowIndex + 1 < scope.board.numRows) {
            scope.board.rows[rowIndex + 1].active = true;
        } else {
            if (scope.gameState != "won") {
                scope.gameState = "lost";
            }
        }
    };
}]);
