import * as React from 'react';
import '../style.css';

import RedBoard from './red_board';
import BlueBoard from './blue_board';

import icon from '../img.json';
import bingo_logic from './bingo';

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
    blue_board_obj : string,
    com_select_obj : string
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
    round_start : boolean,
    red_bingo : number,
    blue_bingo : number,
    winner : string | null,
    game_end : boolean,
    block_select : boolean
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
        round_start : false, // 게임 시작 후, 라운드 시작
        red_bingo : 0,
        blue_bingo : 0,
        winner : null,
        game_end : false,
        block_select : false
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

        // 컴퓨터 랜덤 구하기
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
    _setRandomBoardNumber = (type : string) => {
        const { _updateBoard } = this.props;
        const { user_select, select_number } = this.state;
        const { _setBoardNumber } = this;

        const get_info : any = this._getGameInfo(type);

        const target_arr : any = get_info['board'];
        const target_obj : any = get_info['board_obj'];
        const com_type : string = get_info['com_type'];

        if(type === 'player') {
            this.setState({ random_selecting : true });
        }

        // 랜덤 돌리기
        const _recursion : Function = (num : number) => {
            if(num > 25) {
                return;
            }

            let row : number = Math.trunc(Math.random() * (5 - 0) + 0);
            let col : number = Math.trunc(Math.random() * (5 - 0) + 0);

            if(target_arr[row][col]['number'] === 0) {
                target_arr[row][col]['number'] = num;
                delete target_obj[row][col];

                if(Object.keys(target_obj[row]).length === 0) {
                    delete target_obj[row];
                }

                num += 1;

                if(type === 'computer') {
                    _updateBoard(com_type, JSON.stringify(target_arr), JSON.stringify(target_obj));

                    return _recursion(num);

                } else if(type === 'player') {
                    _updateBoard(user_select, JSON.stringify(target_arr), JSON.stringify(target_obj));
                    _setBoardNumber(num);

                    this.setState({ select_number : num })

                    window.setTimeout( () => {
                        return _recursion(num);
                    }, 300)
                }

            } else {
                return _recursion(num);
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
                            const first_player = Math.trunc(Math.random() * (2 - 0) + 0);
                            // const first_player : number = 1;

                            this.setState({ 'game_start' : true })
                            let turn = this.state.my_turn;
                            if(first_player === 0) {
                                // 컴퓨터 선공
                                this.setState({ 'game_notice' : '컴퓨터가 먼저 선공입니다.' });

                            } else if(first_player === 1) {
                                // 플레이어 
                                turn = true;
                                this.setState({ 'game_notice' : '플레이어가 먼저 선공입니다.' });   
                            }

                            return window.setTimeout( () => {
                                return this._setRound(turn);
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
    _setRound = (turn : boolean) => {
        const { _fade } = this.props;

        const game_result = this._gameResult(!turn);

        if(game_result['end'] === false) {
            this.setState({ "round_start" : true, "my_turn" : turn });
            _fade('#bingo_game_notice_div', true, 0.5, true, false);
            _fade('.my_turn_div', true, 0.5, true, false);
            _fade('#my_turn_image', true, 0.5, true, false);

            if(turn === true) {
                // 내 턴일 때
                this.setState({ 'game_notice' : '번호를 선택해주세요.', "block_select" : false });

            } else if(turn === false) {
                // 컴퓨터 턴일 때
                this.setState({ 'game_notice' : '컴퓨터가 번호를 선택하고 있습니다.' });

                // 컴퓨터의 번호 선택 함수
                this._selectComputerNumber();
            }

        } else {
            const winner_info = this._getGameInfo(game_result['winner']);
            const winner_type = winner_info['my_type'];
            let winner_name : string | null = null;

            if(game_result['winner'] === 'player') {
                winner_name = '플레이어';

            } else {
                winner_name = '컴퓨터';
            }

            let ment : string = '';
            ment = '<div id="game_result_notice" class="bingo_select_' + winner_type + '_board">';
            ment += winner_name + ' 의 승리입니다. </div>';

            return window.setTimeout( () => {
                _fade('#bingo_game_notice_div', true, 0.5, true, false);
                this.setState({ 'game_notice' : ment, 'winner' : winner_type });

            }, 1500)
        }
    }

    // 게임 결과
    _gameResult = (my_turn : boolean) => {
        let end = false;

        const { _fade } = this.props;
        const { red_bingo, blue_bingo, user_select } = this.state;

        let my_bingo : number = 0;
        let com_bingo : number = 0;

        if(user_select === 'red') {
            my_bingo = red_bingo;
            com_bingo = blue_bingo;

        } else if(user_select === 'blue') {
            my_bingo = blue_bingo;
            com_bingo = red_bingo;
        }

        let ment : string = '';
        let win : string | null = null;
        if(my_bingo >= 5 && com_bingo >= 3) {
            end = true;

            if(my_turn === true) {
                // 내 차례 였을 때 선 우승
                win = 'player';
                   
            } else {
                win = 'computer';
                this.setState({ "my_turn" : false })
            }

        } else if(my_bingo >= 5 || com_bingo >= 3) {
            end = true;

            if(my_bingo >= 5) {
                win = 'player';
                this.setState({ "my_turn" : true })

            } else if(com_bingo >= 3) {
                win = 'computer';
                this.setState({ "my_turn" : false })
            }
        }

        if(win === 'player') {
            ment = '플레이어가 먼저 5 빙고를 완성했습니다.';

        } else {
            ment = '컴퓨터가 먼저 3 빙고를 완성했습니다.';
        }

        this.setState({ 'game_notice' : ment, "game_end" : true });
        _fade('#bingo_game_notice_div', true, 0.5, true, false);

        const result : any = {};
        result['end'] = end;
        result['winner'] = win;

        return result;
    }

    _selectBoardNumber = async (type : string, rows : number, col : number) => {
        const { user_select, select_number, random_selecting, round_start, my_turn } = this.state;
        const { _updateBoard, _fade } = this.props;

        const get_info = this._getGameInfo('player');
        const my_board : any = get_info['board'];
        const my_board_obj : any = get_info['board_obj'];

        if(type === 'over') {
            my_board[rows][col]["cover_select"] = true;

        } else if(type === 'leave') {
            my_board[rows][col]["cover_select"] = false;

        } else if(type === 'click') {
            if(random_selecting === false) {
                if(select_number_able === false) {
                    if(my_board[rows][col]['number'] === 0) {
                        select_number_able = true;

                        my_board[rows][col]["number"] = select_number;
                        delete my_board_obj[rows][col];

                        if(Object.keys(my_board_obj[rows]).length === 0) {
                            delete my_board_obj[rows];
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
                if(my_board[rows][col]["select"] === false) {
                    my_board[rows][col]["select"] = true;
                    const select_num : number = my_board[rows][col]['number']

                    await this.setState({
                        'block_select' : true,
                        'game_notice' : '<b class="custom_color_1">'+ select_num + '</b> 번을 선택하셨습니다.'
                    });
                    _fade('#bingo_game_notice_div', true, 0.5, true, false);

                    await _updateBoard(user_select, JSON.stringify(my_board), JSON.stringify(my_board_obj))
                    this._rivalSelectedBoard('computer', select_num);

                } else {
                    return this._setAlert('※이미 선택된 자리입니다.');
                }
            }
        }

        return _updateBoard(user_select, JSON.stringify(my_board), JSON.stringify(my_board_obj))
    }

    // 상대방의 선택한 자리 구하기
    _rivalSelectedBoard = (target : string, num : number) => {
        const { _updateBoard } = this.props;

        const get_info = this._getGameInfo(target);

        const rival_board : any = get_info['board'];
        const rival_select : any = get_info['my_type'];

        rival_board.forEach( (el_1 : any, rows : number) => {
            el_1.forEach( (el_2 : any, cols : number) => {
                if(el_2['number'] === num) {
                    rival_board[rows][cols]["select"] = true;
                }
            })
        })

        _updateBoard(rival_select, JSON.stringify(rival_board))

        return this._setBingoLogic(rival_board, rival_select, target);
    }

    // 빙고 로직 작동하기
    _setBingoLogic = async (_board : any[], target : string, player : string) => {
        const { _updateBoard, _fade } = this.props;
        const { my_turn, red_bingo, blue_bingo } = this.state;

        let ment = '';
        let timer = 1000;
        let bingo_change = false;

        let my_type : any | null = null;

        let _player : string | null = null; 
        let _rival_player : string | null = null; 

        if(player === 'player') {
            my_type = 'computer';

            _player = '컴퓨터';
            _rival_player = '플레이어';

        } else if(player === 'computer') {
            my_type = 'player';

            _player = '플레이어';
            _rival_player = '컴퓨터';
        }
        
        // 내 빙고 결과 구하기
        const my_info = this._getGameInfo(my_type);
        const my_board = my_info['board'];
        const _my_type = my_info['my_type'];

        const my_bingo_result = await bingo_logic(my_board, my_type);
        _updateBoard(_my_type, JSON.stringify(my_bingo_result['board']));

        const my_bingo = _my_type === 'red' ? red_bingo : blue_bingo;

        if(my_bingo < my_bingo_result['bingo']) {
            bingo_change = true;

            timer = 2000;
            if(_my_type === 'red') {
                this.setState({ 'red_bingo' : my_bingo_result['bingo'] })
                ment += '<div class="bingo_select_red_board"> ' + _player +'가 ' + my_bingo_result['bingo'] + ' 빙고를 완성했습니다. </div>'

            } else {
                this.setState({ 'blue_bingo' : my_bingo_result['bingo'] });
                ment += '<div class="bingo_select_blue_board"> ' + _player + '가 ' + my_bingo_result['bingo'] + ' 빙고를 완성했습니다. </div>'
            }
        }

        // 상대방 빙고 결과 구하기
        const rival_info = this._getGameInfo(player);
        const rival_board = rival_info['board'];
        const rival_type = rival_info['my_type'];

        const rival_bingo_result = await bingo_logic(rival_board, player);
        _updateBoard(rival_type, JSON.stringify(rival_bingo_result['board']));

        const rival_bingo = _my_type === 'red' ? blue_bingo : red_bingo;
        if(rival_bingo < rival_bingo_result['bingo']) {
            bingo_change = true;

            timer = 2000;
            if(_my_type === 'red') {
                this.setState({ 'blue_bingo' : rival_bingo_result['bingo'] })
                ment += '<div class="bingo_select_blue_board"> ' + _rival_player + '가 ' + rival_bingo_result['bingo'] + ' 빙고를 완성했습니다. </div>'

            } else {
                this.setState({ 'red_bingo' : rival_bingo_result['bingo'] })
                ment += '<p class="bingo_select_red_board"> ' + _rival_player + '가 ' + rival_bingo_result['bingo'] + ' 빙고를 완성했습니다. </p>'
            }
        }

        if(bingo_change === true) {
            this.setState({ 'game_notice' : ment })
        } 

        return window.setTimeout( () => {
            return this._setRound(!my_turn);
        }, timer)
    }

    _selectComputerNumber = async () => {
        const { _updateBoard } = this.props;
        const get_info = this._getGameInfo('computer');

        const com_board = get_info['board'];
        const com_type = get_info['my_type'];

        const select_number = () => {
            const row : number = Math.trunc(Math.random() * (5 - 0) + 0);
            const col : number = Math.trunc(Math.random() * (5 - 0) + 0);

            const min_timer = 1000;
            let timer = 0;

            if(com_board[row][col]['select'] === false) {
                return window.setTimeout( async () => {
                    com_board[row][col]['select'] = true;
                    const select_num = com_board[row][col]['number'];

                    await _updateBoard(com_type, JSON.stringify(com_board));

                    this.setState({ 'game_notice' : '컴퓨터가 <b class="custom_color_1">' + select_num + '</b> 번을 선택했습니다.' })

                    this._rivalSelectedBoard('player', select_num);

                    // return this._setBingoLogic(com_board, com_type, 'computer');
                }, min_timer - timer)


            } else {
                return window.setTimeout( () => {
                    select_number();
                    timer += 50;
                }, 50)
            }
        }

        return select_number();
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

    // 상대방 또는 내 정보 구하기
    _getGameInfo = (target : string) => {
        const { user_select } = this.state;
        const result : any = {};
        
        result['board'] = null;
        result['board_obj'] = null;
        result['com_type'] = null
        result['rival_type'] = null
        result['my_type'] = null
        
        if(target === 'player') {
            result['my_type'] = user_select;

            // 내 정보
            if(user_select === 'red') {
                result['board'] = JSON.parse(this.props.red_board);
                result['board_obj'] = JSON.parse(this.props.red_board_obj);
                result['com_type'] = 'blue';
                result['rival_type'] = 'blue';

            } else if(user_select === 'blue') {
                result['board'] = JSON.parse(this.props.blue_board);
                result['board_obj'] = JSON.parse(this.props.blue_board_obj);
                result['com_type'] = 'red';
                result['rival_type'] = 'red';
            }

        } else if(target === 'computer') {
            result['rival_type'] = user_select;

            // 컴퓨터 정보
            if(user_select === 'red') {
                result['board'] = JSON.parse(this.props.blue_board);
                result['board_obj'] = JSON.parse(this.props.blue_board_obj);
                result['com_type'] = 'blue';
                result['my_type'] = 'blue'

            } else if(user_select === 'blue') {
                result['board'] = JSON.parse(this.props.red_board);
                result['board_obj'] = JSON.parse(this.props.red_board_obj);
                result['com_type'] = 'red';
                result['my_type'] = 'red';
            }
        }

        return result;
    }

    public render() {
        const { game_notice, game_alert, number_select, random_selecting, game_start, winner, round_start, user_select, my_turn, game_end } = this.state;
        const { _setRandomBoardNumber } = this;

        let img = icon.icon.left;
        if(user_select === 'blue') {
            if(my_turn === true) {
                img = icon.icon.right;

            } else {
                img = icon.icon.left;
            }

        } else if(user_select === 'red') {
            if(my_turn === true) {
                img = icon.icon.left;

            } else {
                img = icon.icon.right;
            }
        }

        return(
            <div id='bingo_game_play_div' className='aCenter'>
                <div id='bingo_game_notice_div'
                    dangerouslySetInnerHTML={{ __html : game_notice }}
                />
                <div id='bingo_game_alert_div'
                    dangerouslySetInnerHTML={{ __html : game_alert }}
                />

                {winner !== null
                    ? <div id='game_replay_div'> 
                        <b className='pointer' onClick={() => window.location.reload()}> 다시 하기 </b> 
                      </div>

                    : null
                }

                {game_start === true && round_start === true
                    ? <img src={img}
                        id='my_turn_image'
                    />

                    : null
                }

                {number_select === true && game_start === false ?
                <input className='pointer' type='button' value='자동 완성' title='모든 빙고판을 랜덤으로 완성합니다.'
                        id={random_selecting === true ? 'random_selecting' : undefined} name='bingo_random_select_div'
                        onClick={() => random_selecting === false ? _setRandomBoardNumber('player') : null}
                />

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
