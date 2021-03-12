import * as React from 'react';
import '../style.css';

interface RedBoardProps {
    red_board : string
    _boardSelect : any,
    user_select : string | null,
    select_type : string | null,
    select_border : React.CSSProperties,
    number_select : boolean,
    _selectBoardNumber : Function,
    com_ready : boolean,
    game_start : boolean,
    round_start : boolean,
    my_turn : boolean,
    red_bingo : number,
    winner : string,
    block_select : boolean
}

interface RedBoardState {
    select_style : React.CSSProperties,
}

class RedBoard extends React.Component<RedBoardProps, RedBoardState> {
    public state : any = {
        select_style : {
            "color" : "#ffaec0",
            "fontWeight" : "bold"
        }
    };
  
    constructor(props: RedBoardProps) {
      super(props);
    }

    public render() {
        const { 
            _boardSelect, user_select, select_type, select_border, number_select, block_select,
            _selectBoardNumber, com_ready, game_start, my_turn, round_start, red_bingo, winner
        } = this.props;

        const { select_style } = this.state;

        const red_board = JSON.parse(this.props.red_board);

        let red_name = '';
        if(user_select !== null) {
            if(user_select === 'red') {
                red_name = '나';

            } else {
                red_name = '컴퓨터';
            }
        }

        const select_able = number_select === true && user_select === 'red'

        let condition = false;
        let select_condition = false;

        if(select_type === 'red') {
            condition = true;

            if(round_start === true) {
                if(my_turn === false) {
                    condition = false;

                } else {
                    select_condition = true;
                }
            }

        } else {
            if(round_start === true) {
                if(my_turn === false) {
                    condition = true;
                }
            }
        }

        let limit : string | number = '-'; 
        if(user_select !== null) {
            if(user_select === 'red') {
                limit = 5;

            } else {
                limit = 3;
            }
        }

        let my_turn_able : Boolean = false;
        if(round_start === true) {
            if(user_select === 'red') {
                if(my_turn === true) {
                    my_turn_able = true;
                }
                
            } else {
                if(my_turn === false) {
                    my_turn_able = true;
                }
            }
        }

        return(
            <div id='bingo_red_board_div' className='bingo_board_divs aCenter'>

                {winner !== null 
                    ? winner === 'red'
                        ? <div className='game_result_div win_div' id='red_plyer_win'>
                            Win !
                        </div>

                        : <div className='game_result_div lose_div' id='red_plyer_lose'>
                            Lose                      
                        </div>

                    : my_turn_able === true
                        ? <div className='my_turn_div'>
                            My Turn
                        </div>

                    : null
                }

                <div className='bingo_state_other_div gray'
                    id='bingo_state_red_div'
                    style={condition ? select_style : null}
                >
                    <h4> 레드 팀 ( {red_name} ) </h4>
                    <p> 빙고 : {red_bingo} / {limit} </p>
                </div>

                <div className='bingo_board_game_div pointer aLeft'
                    onMouseEnter={() => user_select === null ? _boardSelect('over', 'red') : null}
                    onMouseLeave={() => user_select === null ? _boardSelect('leave', 'red') : null}
                    onClick={() => user_select === null ? _boardSelect('click', 'red') : null}
                >
                    {red_board.map( (el : boolean[], key : number) => {

                        return(
                            <div key={key} className='bingo_board_cols_divs aLeft'
                                style={select_type === 'red' ? select_border : undefined}
                            >
                                {el.map( (cu : any, key_2 : number) => {
                                    let class_col = 'bingo_each_board_div pointer'

                                    if(cu.bingo === true) {
                                        class_col += ' bingo_complate_red_board';

                                    } else if(cu.select === true) {
                                        class_col += ' bingo_select_red_board';
                                    }

                                    return(
                                        <div className={class_col} key={key_2}
                                            id={cu.cover_select === true ? 'selecting_red' : undefined}
                                            onMouseOver={() => (select_able && cu.number === 0) || (select_condition && cu.bingo === false) && block_select === false ? _selectBoardNumber('over', key, key_2) : undefined}
                                            onMouseLeave={() => select_able || (select_condition && cu.bingo === false) && block_select === false ? _selectBoardNumber('leave', key, key_2) : undefined}
                                            onClick={() => (select_able || select_condition) && block_select === false && block_select === false ? _selectBoardNumber('click', key, key_2) : undefined}
                                        >
                                            <div> {cu.number > 0 && select_type === 'red' || cu.select === true ? cu.number : "　"} </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>

                {number_select === true && user_select === 'blue' && game_start === false
                    ? <div className='bingo_selecting_div'>
                        <h2 className='bingo_selecting_ment'  id='bingo_selecting_red_ment'>
                            {com_ready === false ? "번호 선택 중..." : "번호 선택 완료"}  

                            {com_ready === true
                                ? <div className='bingo_computer_ready_div'>
                                    Ready
                                  </div>

                                : null}
                        </h2>

                      </div>

                    : null
                }
            </div>
        )
    }
}

export default RedBoard;
