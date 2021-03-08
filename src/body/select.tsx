import * as React from 'react';
import '../style.css';

import RedBoard from './red_board';
import BlueBoard from './blue_board';

interface SelectProps {
    my_board : string,
    com_board : string,
    start : boolean,
    user_select : number | null
}

interface SelectState {

}

class Select extends React.Component<SelectProps, SelectState> {
    public state = {
        start: false,
    };
  
    constructor(props: SelectProps) {
      super(props);
    }

    public render() {
        return(
            <div id='bingo_select_div'>
                <h4 className='aCenter'> 플레이를 원하는 빙고판을 선택해주세요. </h4>
            </div>
        )
    }
}

export default Select;
