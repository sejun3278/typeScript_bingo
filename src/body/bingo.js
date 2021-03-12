const left_check = {
    "player" : [],
    "computer" : []
};

const right_check = {
    "player" : [],
    "computer" : []
};

let left_check_overlap = false;
let right_check_overlap = false;

const bingo_logic = (board, player) => {
    left_check_overlap = false;
    right_check_overlap = false;

    const result = {};
    result['bingo'] = 0;

    let row_check = {};
    board.forEach( (rows, key_1) => {
        let cover_board = JSON.parse(JSON.stringify(board));
        let col_check = 0;

        rows.forEach( (cols, key_2) => {
            if(row_check[key_2] === undefined) {
                row_check[key_2] = [];
            }

            if(cols.select === true) {
                col_check += 1;

                row_check[key_2].push(key_1);
            }

            if(col_check === 5) {
                for(let i = 0; i < rows.length; i++) {
                    cover_board[key_1][i]['bingo'] = true;
                }

                result['bingo'] += 1;
                board = cover_board;
            }

            if(row_check[key_2].length === 5) {
                for(let l = 0; l < row_check[key_2].length; l++) {
                    cover_board[l][key_2]['bingo'] = true;
                }
                
                result['bingo'] += 1;
                board = cover_board;
            }

            // 대각선 체크하기
            const diagonal = check_diagonal(key_1, key_2, board, player);

            if(diagonal['left_bingo'] === true ) {
                if(left_check_overlap === false) {
                    left_check_overlap = true;
                    result['bingo'] += 1;

                    board = diagonal['board'];
                }
            }

            if(diagonal['right_bingo'] === true) {
                if(right_check_overlap === false) {
                    right_check_overlap = true;

                    result['bingo'] += 1;

                    board = diagonal['board'];
                }
            }
        })
    })

    result['board'] = board;

    return result;
}

// 대각선 체크하기
const check_diagonal = (rows, cols, board, player) => {

    let left_bingo = false;
    let right_bingo = false;

    let _right_able = false;
    if(board[rows][cols]['select'] === true) {
        if(rows === cols) {
            // 왼쪽 체크하기
            // rows 와 cols 값이 동일하면 array 에 push

            if(!left_check[player].includes(rows)) {
                left_check[player].push(rows);
            }

            if(rows === 2 && cols === 2) {
                if(!right_check[player].includes(rows)) {
                    right_check[player].push(rows);
                }
            }

        } else {
            // 오른쪽 체크하기
            if(rows === 0) {
                if(cols === 4) {
                    _right_able = true;
                }

            } else if(rows === 1) {
                if(cols === 3) {
                    _right_able = true;
                }

            } else if(rows === 3) {
                if(cols === 1) {
                    _right_able = true;
                }

            } else if(rows === 4) {
                if(cols === 0) {
                    _right_able = true;
                }
            }
        }
    }

    if(_right_able === true) {
        if(!right_check[player].includes(rows)) {
            right_check[player].push(rows);
        }
    }

    if(left_check[player].length === 5) {
        left_check[player].forEach( (el) => {
            board[el][el]['bingo'] = true;
        })

        left_bingo = true;
    }

    if(right_check[player].length === 5) {
        const cover_arr = right_check[player].sort();

        cover_arr.forEach( (el, idx) => {
            board[el][cover_arr[(cover_arr.length - 1) - idx]]['bingo'] = true;
        })

        right_bingo = true;
    } 

    const result = {};
    result['board'] = board;
    result['left_bingo'] = left_bingo;
    result['right_bingo'] = right_bingo;

    return result;
}

export default bingo_logic