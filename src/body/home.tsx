import * as React from 'react';
import '../style.css';

import GamePlay from './game_play';

import RedBoard from './red_board';
import BlueBoard from './blue_board';


let game_start : boolean = false;
interface HomeProps {

}

interface HomeState {
    start: boolean,
    red_board : string,
    blue_board : string,
    red_board_obj : string,
    blue_board_obj : string
}

interface obj {
    columns : number[]
}

class Home extends React.Component<HomeProps, HomeState> {
    public state = {
        start: false,
        red_board : JSON.stringify([]),
        blue_board : JSON.stringify([]),
        red_board_obj : JSON.stringify({}),
        blue_board_obj : JSON.stringify({})
    };
  
    constructor(props: HomeProps) {
      super(props);
        // this.state.start = false
    }

    componentDidMount() {
        // 빙고판 만들기
        this._getBoard();
    }

    // 게임 스타트 및 마우스 컨트롤
    public _gameStart = (bool : string) => {
        const target:any = document.getElementById('bingo_game_start_button');

        if(bool === 'click') {
            // 게임 시작
            if(game_start === false) {
                game_start = true

                this._fade('#bingo_game_start_button', false, 0.5, false, false);

                window.setTimeout( () => {
                    this.setState({ start: true });

                    return window.setTimeout( () => {
                        this._fade('#bingo_game_play_div', true, 0.5, false, false);
                    })
                }, 600)
            }

        } else if(bool === 'over') {
            target.style.color = 'black'
            target.style.borderColor = 'black'

        } else if(bool === 'leave') {
            target.style.color = '#ababab'
            target.style.borderColor = '#ababab'
        }
    };

    // Fadeout & FadeIn
    public _fade = (target : string, bool : boolean, second : number, twinkle : boolean, limit : false | number) => {
        const $target : any = document.querySelectorAll(target);
        const start_op : number = bool === false ? 1.4 : 0.2;

        let limit_ : number = 0;
        limit_ = bool === false ? 0.2 : 1.4;
        limit_ = limit !== false ? limit : limit_;

        const recursion = (target_ : any, bool_ : boolean, op_ : number, second : number) => {

            if(bool_ === false) {
                if(op_ < limit_) {
                    if(twinkle === true) {
                        bool_ = true;
                        limit_ = 1.4;

                    } else {
                        return true;
                    }
                }
                
                op_ = op_ - 0.2;

            } else if(bool_ === true) {
                if(op_ >= limit_) {
                    return true;
                }

                op_ = op_ + 0.2;
            }
            
            window.setTimeout( () => {
                if(target_.length > 1) {
                    target_.forEach( (el : any) => {
                        el.style.opacity = op_;
                    })

                } else {
                    target_[0].style.opacity = op_;
                }

                return recursion(target_, bool_, op_, second)

            }, second)
        }

        return recursion($target, bool, start_op, second * 100);
    }

    // 빙고판 만들기
    _getBoard = () => {
        const arr : any[] = [];
        const obj : any = {}

        for(let i : number = 0; i < 5; i++) {
            arr.push([]);
            obj[i] = {}

            for(let l : number = 0; l < 5; l++) {
                arr[i].push({ 'number' : 0, 'select' : false, 'cover_select' : false });
                obj[i][l] = false
            }
        }
        const board_arr : string = JSON.stringify(arr); 
        const board_obj : string = JSON.stringify(obj);

        this.setState({
            red_board : board_arr,
            blue_board : board_arr,
            red_board_obj : board_obj,
            blue_board_obj : board_obj
        })
    }

    // 빙고판 업데이트
    _updateBoard = (type : string, data : string, obj : string) => {
        if(type === 'red') {
            this.setState({ red_board : data, red_board_obj : obj })

        } else if(type === 'blue') {
            this.setState({ blue_board : data, blue_board_obj : obj })
        }
    }

    public render() {
        const { start } = this.state;
        const { _gameStart } = this;

        return(
            <div id='bingo_home_div'>
                {start === false
                    ? <div id='bingo_start_div' className='aCenter'>
                        <h3 className='recipe_korea pointer gray' title='게임을 시작합니다.'
                            id='bingo_game_start_button'
                            onMouseOver={() => _gameStart('over')}
                            onMouseLeave={() => _gameStart('leave')}
                            onClick={() => _gameStart('click')}
                        > 
                            Game Start 
                        </h3>
                    </div>

                        : <div>
                            <GamePlay {...this.state} {...this} />
                          </div>
                    }

            </div>
        )
    }
}

// function Home() {
//   const [start, setValue] = useState<Boolean>(false);


//   const game_start = () => setValue(!start);

//   return (
    // <div id='bingo_home_div'>
    //     {start === false
    //         ? <div id='bingo_start_div' className='aCenter'>
    //             <h3 className='recipe_korea pointer gray' title='게임을 시작합니다.'
    //                 onClick={() => game_start()}
    //             > 
    //                 Game Start 
    //             </h3>
    //           </div>


    //         : null
    //     }

    // </div>
//   );
// }

export default Home;
