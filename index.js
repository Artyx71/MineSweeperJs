
let grid = document.getElementById("grid");
window.addEventListener("contextmenu", e => e.preventDefault());


class Grid{

    constructor(numBombs,rows,columns){
        this.numBombs = numBombs;
        this.rows = rows;
        this.columns = columns;
        this.numCorrect = 0;

        this.generateGrid();
    }

    generateGrid(){
        for (let i = 0; i < this.rows; i++){
            let row = grid.insertRow(i);
            for (let j = 0; j < this.columns; j++){
                let cell = row.insertCell(j);

                let numRow = this.rows;
                let numCol = this.columns;

                cell.onclick = function(){ clickCell(this,numRow,numCol); }
                cell.onmousedown = function(event){
                    if (event.which == 3){
                        rightClickCell(this);
                    }
                }

                
                let isMine = document.createAttribute("isMine");
                isMine.value = "false";
                cell.setAttributeNode(isMine);

                cell.style.backgroundColor = "#999999"

                let isFlagged = document.createAttribute("isFlagged");
                isFlagged.value = false;
                cell.setAttributeNode(isFlagged);

                let isSearched = document.createAttribute("isSearched");
                isSearched.value = false;
                cell.setAttributeNode(isSearched);

            
            }
        }

        this.generateBombs(35);
        this.calcNumOfBombs();
    }

    generateBombs(){

        for (let i = 0; i < this.numBombs; i++){
            let row = Math.floor(Math.random() * this.rows);
            let column = Math.floor(Math.random() * this.columns);

            let cell = grid.rows[row].cells[column];
            cell.setAttribute("isMine", true);
            cell.setAttribute("isSearched",true);
        }   
    }

    calcNumOfBombs(){
        for (let i = 0; i < this.rows; i ++){
            for (let j = 0; j < this.columns; j++){
                let count = 0;
                let cell =  grid.rows[i].cells[j];
                
                for (let k = -1; k < 2; k++){
                    for (let q = -1; q < 2; q++){
                        if ((k !== 0 || q !== 0) && (i+k>=0) && (j+q>=0) && (i+k < this.rows) && (j+q < this.columns)){
                            
                            if (grid.rows[i+k].cells[j+q].getAttribute("isMine") == "true"){
                                count++
                            }
                            
                        }
                    }
                }

                let adjBombs = document.createAttribute("adjBombs");
                adjBombs.value = count;
                cell.setAttributeNode(adjBombs);
            }
        }
    }
}


function clickCell(cell,rows,columns){
    let isMine = cell.getAttribute("isMine");
    let mineCount = cell.getAttribute("adjBombs");
    
    if (isMine == "true"){
    
        for (let i = 0; i < rows; i ++){
            for (let j = 0; j < columns; j++){
                let bomb =  grid.rows[i].cells[j];
                if (bomb.getAttribute("isMine") == "true"){
                    bomb.style.backgroundColor = "red";
                }
            }
        }
    } else {
        cell.innerHTML = mineCount;
        cell.setAttribute("isSearched","true");
        revealEmptyCells(cell,rows,columns);
        checkGameOver(rows,columns);
        
    }

}

function rightClickCell(cell){
    
    if (cell.getAttribute("isFlagged") == "false"){
        cell.style.backgroundColor = "lightGreen";
        cell.setAttribute("isFlagged","true");
    } else {
        cell.style.backgroundColor = "#999999"
        cell.setAttribute("isFlagged","false");
    }
}

function revealEmptyCells(cell,rows,columns){
    if (cell.getAttribute("adjBombs") == "0"){
        cell.setAttribute("isSearched","true");
        let i = cell.parentNode.rowIndex;
        let j = cell.cellIndex;

        for (let k = -1; k < 2; k++){
            for (let q = -1; q < 2; q++){
                if ((k !== 0 || q !== 0) && (i+k>=0) && (j+q>=0) && (i+k < rows) && (j+q < columns)){
                    let newCell = grid.rows[i+k].cells[j+q];
                    newCell.innerHTML = newCell.getAttribute("adjBombs");
                    
                    if (newCell.getAttribute("adjBombs") == "0" && newCell.getAttribute("isSearched") == "false"){
                        revealEmptyCells(newCell,rows,columns)
                    }
                    newCell.setAttribute("isSearched",true);
                }
            }
        }
    }
}



function checkGameOver(rows,columns){
    for (let i = 0; i < rows; i ++){
        for (let j = 0; j < columns; j++){
            let cell =  grid.rows[i].cells[j];
            if (cell.getAttribute("isSearched") == "false"){
                return;
            }
        }
    }
    alert("you win");
}




let newGrid = new Grid(20,10,10);

