
import * as React from 'react';
import {connect} from 'react-redux';
import { Dispatch } from 'redux';
import { onStickClick, toProps } from './StateToProps';

import { Chessboard, Position, StickState } from './Stick';

export interface IProps extends Chessboard {
    selectStick?:(pos?: Position)=> void,
    moveTo?:(pos: Position)=> void
};

const chessboardWidth = 512;

const points = [[0, 0], [512, 512],
                [512, 0], [0, 512],
                [0, 128], [512, 128],
                [0, 384], [512, 384],
                [128, 0], [128, 512],
                [256, 0], [256, 512],
                [384, 0], [384, 512],
                [256, 512], [256, 512],
                [512, 0], [512, 512],
                [640, 128], [640, 384],
                [512, 256], [768, 256]              
];

class Chess extends React.PureComponent<IProps> {
    public componentWillUnmount() {
        console.log(this.props);
    }

    public componentDidMount() {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');
        if(!ctx) {
            return;
        }

        ctx.moveTo(0,256);
        ctx.lineTo(512,256);
        ctx.lineTo(256,0);
        ctx.lineTo(0,256);
        ctx.lineTo(256,512);
        ctx.lineTo(512,256);

        for(let i=0;i<points.length;i+=2) {
            ctx.moveTo(points[i][0], points[i][1]);
            ctx.lineTo(points[i+1][0], points[i+1][1]);
        }
        ctx.lineTo(640,128);
        ctx.lineTo(512,256);
        ctx.lineTo(640,384);
        ctx.lineTo(768,256);

        ctx.strokeStyle="#d3d3d3";
        ctx.stroke();
    }

    public componentDidUpdate() {
        
    }

    public render() {
        const chess = this.props.sticks;
        
        const allSticks = chess.flatMap((line, lineNo)=>{
            const x = lineNo;
            return line.map((stick, colNo)=>{
                return {
                    stick: stick,
                    x: x,
                    y: colNo
                };
            })
        })
        
        return (<>
            <div className="chessOuter">
                <canvas id="canvas" className="chessCanvas" width="768px" height="512px"></canvas>
                {allSticks.map(stick=>this.generateStick(stick.stick, stick.x, stick.y))}
            </div>
        </>);
    }

    private generateStick(stick: StickState, x: number, y: number):JSX.Element {
        const top = Math.round(32+x*(chessboardWidth/4));
        const left = Math.round(32+y*(chessboardWidth/4));
        const color = (stick && bgColor[stick]) || "black";
        const isSelected = (this.props.selectedStick && this.props.selectedStick.x === x && this.props.selectedStick.y === y);
        const classname = `stick ${stick ? "" : "stickEmpty"} ${isSelected ? "stickSelected" : ""}`
        const onclick=()=>onStickClick(this.props, {x: x, y: y});
        return (<div 
            className={classname} 
            style={{top: `${top}px`, left: `${left}px`, background:`${color}`}}
            onClick={onclick}></div>);
    }
}

const bgColor = {
    r: "red",
    w: "white",
    p: ""
};

const mapStateToProps = toProps;

const mapDispatchToProps = (dispatch: Dispatch) => ({
    selectStick:(pos: Position)=>dispatch({type: "select", payload: pos}),
    moveTo: (pos: Position)=>dispatch({type: "move", payload: pos})
});

export default connect(mapStateToProps, mapDispatchToProps)(Chess);