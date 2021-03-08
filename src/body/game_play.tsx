import * as React from 'react';
import '../style.css';

import RedBoard from './red_board';
import BlueBoard from './blue_board';

let select_able : boolean = false;
let select_number_able : boolean = false;
let select_alert : boolean = false;
let infinite_flash : any | null = null;
let select_complate : boolean = false;

interface GamePlayProps {
    red_board : string,
    blue_board : string,
    start : boolean,
    _fade : Function,
    _updateBoard : Function,
    red_board_obj : string,
    blue_board_obj : string
}

interface GamePlayState {
    game_start : boolean,
    my_turn : boolean,
    select_type : string | null,
    select_border : React.CSSProperties,
    game_notice : string | number,
    user_select : string | null,
    number_select : boolean,
    select_number : number,
    game_alert : string,
    com_ready : boolean,
    random_selecting : boolean,
    round_start : boolean
}

class GamePlay extends React.Component<GamePlayProps, GamePlayState> {
    public state : any = {
        game_start: false,
        game_notice : "플레이를 원하는 빙고판을 선택해주세요. ",
        my_turn : false,
        select_type : null,
        user_select : null,
        select_border : {
            'backgroundColor' : 'white'
        },
        number_select : false,
        select_number : 1,
        game_alert : "",
        com_ready : false,
        random_selecting : false,
        round_start : false // 게임 시작 후, 라운드 시작
    };
  
    constructor(props: GamePlayProps) {
      super(props);
    }

    _boardSelect = (type : string, team : string) => {
        const { _fade } = this.props;

        if(select_able === false) { 
            if(type === 'over') {
                // 마우스 Over
                this.setState({ select_type : team })

            } else if(type === 'leave') {
                // 마우스 Leave
                this.setState({ select_type : null })

            } else if(type === 'click') {
                // 선택 완료
                select_able = true;

                const team_name : string = team === 'blue' ? '블루' : '레드';

                _fade('.bingo_state_other_div', false, 0.5, true, false);

                this.setState({ 'game_notice' : team_name + ' 팀을 선택하셨습니다.', })
                window.setTimeout( () => {
                    this.setState({ 'user_select' : team })

                    return window.setTimeout( () => {
                        _fade('#bingo_game_notice_div', false, 0.3, true, false); 
                        this.setState({ 'game_notice' : '숫자 1 번 부터 빙고 자리를 지정하겠습니다.' })

                        return window.setTimeout( () => {

                            this.setState({ 'number_select' : true })
                            _fade('.bingo_selecting_div', false, 0.3, false, 0.6);

                            this._setComputerNumber();

                            return this._setBoardNumber(1);
                        }, 1000)
                    }, 1000)
                }, 500)
            }
        }
    }

    // 무한 플래쉬 효과
    _infiniteFlash = (target : string) => {
        const { _fade } = this.props;

        infinite_flash = window.setInterval( () => {
            _fade(target, false, 0.5, false, false);

            return window.setTimeout( () => {
                _fade(target, true, 0.5, false, false);
            }, 700)

        }, 1500);
    }

    // 컴퓨터 자리 지정하기
    _setComputerNumber = () => {
        const { user_select } = this.state;
        const { _fade } = this.props;
        this._infiniteFlash('.bingo_selecting_ment');

        let com_target : any = '';
        if(user_select === 'red') {
            com_target = document.getElementById('bingo_selecting_blue_ment');

        } else if(user_select === 'blue') {
            com_target = document.getElementById('bingo_selecting_red_ment');
        }

        this._setRandomBoardNumber('computer');

        return window.setTimeout( () => {
            window.clearInterval(infinite_flash);

            return window.setTimeout( () => {
                _fade('.bingo_selecting_ment', true, 0.5, true, false);
            
                this.setState({ com_ready : true })
            }, 400)
        }, 10000)
    }

    // 랜덤으로 숫자 지정하기
    _setRandomBoardNumber : Function = (type : string) => {
        const { _updateBoard } = this.props;
        const { user_select, select_number } = this.state;
        const { _setBoardNumber } = this;
        let target_arr : any, target_obj : any = '';

        let com_type : string = "";
        if(type === 'computer') {
            if(user_select === 'red') {
                target_arr = JSON.parse(this.props.blue_board);
                target_obj = JSON.parse(this.props.blue_board_obj);
                com_type = "blue";
    
            } else if(user_select === 'blue') {
                target_arr = JSON.parse(this.props.red_board);
                target_obj = JSON.parse(this.props.red_board_obj);
                com_type = 'red';
            }

        } else if(type === 'my') {
            this.setState({ random_selecting : true });

            if(user_select === 'red') {
                target_arr = JSON.parse(this.props.red_board);
                target_obj = JSON.parse(this.props.red_board_obj);
    
            } else if(user_select === 'blue') {
                target_arr = JSON.parse(this.props.blue_board);
                target_obj = JSON.parse(this.props.blue_board_obj);
            }
        }

        // 랜덤 돌리기
        const _recursion : Function = (num : number) => {
            if(type === 'computer') {
                if(Object.keys(target_obj).length === 0) {
                    return;
                }

            } else if(type === 'my') {
                if(num > 25) {
                    return;
                }
            }

            let col : number = Math.trunc(Math.random() * (5 - 0) + 0);
            let column : number = Math.trunc(Math.random() * (5 - 0) + 0);

            if(target_arr[col][column]['number'] === 0) {
                target_arr[col][column]['number'] = num;
                delete target_obj[col][column];

                if(Object.keys(target_obj[col]).length === 0) {
                    delete target_obj[col];
                }

                num += 1;

                if(type === 'computer') {
                    _updateBoard(com_type, JSON.stringify(target_arr), JSON.stringify(target_obj));

                    return _recursion(num);

                } else if(type === 'my') {
                    _updateBoard(user_select, JSON.stringify(target_arr), JSON.stringify(target_obj));
                    _setBoardNumber(num);

                    this.setState({ select_number : num })

                    window.setTimeout( () => {
                        return _recursion(num);
                    }, 300)
                }

            } else {
                if(type === 'my') {
                    return _recursion(num);
                }
            }
        }

        return _recursion(select_number);
    }

    // 숫자 지정하기
    _setBoardNumber = (num : number) => {
        const { _fade } = this.props;

        _fade('#bingo_game_notice_div', false, 0.3, true, false);
        
        let ment = '';

        if(num < 25) {
            ment = '<b class="custom_color_1">' + num + '</b> 번 자리를 지정해주세요.';

        } else if(num === 25) {
            ment = '<b class="custom_color_1"> 마지막 ' + num + '</b> 번 자리를 지정해주세요.';   
              
        } else if(num > 25) {
            _fade('#bingo_game_notice_div', true, 0.5, true, false);
            ment = '번호 선택이 완료되었습니다.';

            select_complate = true;

            this.setState({ random_selecting : true });

            window.clearInterval(infinite_flash);
            this.setState({ com_ready : true })

            this.setState({ 'game_notice' : ment })

            return window.setTimeout( () => {

                const _gameCount : Function = (timer : number) => {

                    this.setState({ 'game_notice' : timer + ' 초 후, 게임을 시작합니다.' });
                    _fade('#bingo_game_notice_div', true, 0.5, true, false);

                    if(timer === 0) {
                        _fade('#bingo_game_notice_div', true, 0.5, true, false);
                        this.setState({ 'game_notice' : '게임을 시작합니다.' });

                        _fade('#random_selecting', false, 0.5, false, false);
                        _fade('.bingo_selecting_div', false, 0.5, false, false);

                        return window.setTimeout( () => {
                            // 0 은 컴퓨터 선공, 1 은 플레이어 선공
                            // const first_player = Math.trunc(Math.random() * (2 - 0) + 0);
                            const first_player : number = 1;

                            this.setState({ 'game_start' : true })
                            if(first_player === 0) {
                                // 컴퓨터 선공
                                this.setState({ 'game_notice' : '컴퓨터가 먼저 선공입니다.' });

                            } else if(first_player === 1) {
                                // 플레이어 
                                this.setState({ 'game_notice' : '플레이어가 먼저 선공입니다.', 'my_turn' : true });   
                            }

                            return window.setTimeout( () => {
                                return this._setRound();
                            }, 2000)

                        }, 1500)
                    }

                    return window.setTimeout( () => {
                        return _gameCount(timer - 1)
                    }, 1000)
                }

                _gameCount(3);
            }, 1000)
        }

        select_number_able = false;

        this.setState({ 'game_notice' : ment })
    }

    // 라운드 시작하기
    _setRound = () => {
        const { round_start, my_turn } = this.state;

        this.setState({ "round_start" : true });

        if(my_turn === true) {
            // 내 턴일 때
            this.setState({ 'game_notice' : '번호를 선택해주세요.' });


        } else if(my_turn === false) {
            // 컴퓨터 턴일 때
            this.setState({ 'game_notice' : '컴퓨터가 번호를 선택하고 있습니다.' });

        }
    }

    _selectBoardNumber = (type : string, cols : number, column : number) => {
        const { user_select, select_number, random_selecting, round_start, my_turn } = this.state;
        const { _updateBoard, _fade } = this.props;
        let my_board;
        let my_board_obj;

        if(user_select === 'red') {
            my_board = JSON.parse(this.props.red_board);
            my_board_obj = JSON.parse(this.props.red_board_obj);

        } else if(user_select === 'blue') {
            my_board = JSON.parse(this.props.blue_board);
            my_board_obj = JSON.parse(this.props.blue_board_obj);
        }

        if(type === 'over') {
            my_board[cols][column]["cover_select"] = true;

        } else if(type === 'leave') {
            my_board[cols][column]["cover_select"] = false;

        } else if(type === 'click') {
            if(random_selecting === false) {
                if(select_number_able === false) {
                    if(my_board[cols][column]['number'] === 0) {
                        select_number_able = true;

                        my_board[cols][column]["number"] = select_number;
                        delete my_board_obj[cols][column];

                        if(Object.keys(my_board_obj[cols]).length === 0) {
                            delete my_board_obj[cols];
                        }

                        this.setState({ select_number : select_number + 1 });
                        this._setBoardNumber(select_number + 1);

                    } else {
                        // alert 띄우기
                        return this._setAlert('※이미 선택된 자리입니다.');
                    }
                }

            } else if(random_selecting === true && select_complate === false) {
                return this._setAlert('※랜덤 배치 중입니다.');

            } else if(round_start === true && my_turn === true) {
                my_board[cols][column]["select"] = true;

                this.setState({ 
                    'my_turn' : false, 'round_start' : false,
                    'game_notice' : "　"
                });
                _fade('#bingo_game_notice_div', true, 0.5, true, false);
            }
        }

        return _updateBoard(user_select, JSON.stringify(my_board), JSON.stringify(my_board_obj))
    }

    // 알림 띄우기
    _setAlert = (ment : string) => {
        this.setState({ game_alert : ment });
        const { _fade } = this.props;
        const target : any = document.getElementById('bingo_game_alert_div');

        if(select_alert === false) {
            select_alert = true;

            return window.setTimeout( () => {
                _fade('#bingo_game_alert_div', false, 0.5, false, false);

                return window.setTimeout( () => {
                    this.setState({ game_alert : "" });

                    target.style.opacity = 1.4;
                    select_alert = false;
                }, 400)
            }, 700)
        }
    }

    public render() {
        const { game_notice, game_alert, number_select, random_selecting, game_start } = this.state;
        const { _setRandomBoardNumber } = this;

        return(
            <div id='bingo_game_play_div' className='aCenter'>
                <div id='bingo_game_notice_div'
                    dangerouslySetInnerHTML={{ __html : game_notice }}
                />
                <div id='bingo_game_alert_div'
                    dangerouslySetInnerHTML={{ __html : game_alert }}
                />

                {number_select === true && game_start === false ?
                <div id='bingo_random_select_div'>
                    <div> 
                        <input className='pointer' type='button' value='자동 완성' title='모든 빙고판을 랜덤으로 완성합니다.'
                                id={random_selecting === true ? 'random_selecting' : undefined}
                                onClick={() => random_selecting === false ? _setRandomBoardNumber('my') : null}
                        /> 
                    </div>
                </div>

                : null}

                <div id='select_bingo_board_div'>
                    <RedBoard {...this.props} {...this.state } {...this} />
                    <BlueBoard {...this.props} {...this.state } {...this} />
                </div>
            </div>
        )
    }
}

export default GamePlay;
