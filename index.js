import React, { useCallback, useState, useMemo } from "react";
import ReactDOM from 'react-dom/client';
import './index.css';

const getNewId = () => {
    return `id-${Math.random()}`;
}
const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

const Square = ({ onClick, value }) => (
        <button className="square" onClick={onClick}>
            {value}
        </button>
    );

const Board = ({ squares, onClick }) => {
    const renderSquare = useCallback((number, row, column) => (
            <Square
                key={getNewId()}
                value={squares[number]}
                squares={squares}
                number={number}
                onClick={() => onClick(number, row, column)}
            />
        ), [squares, onClick]);

    const columns = useMemo(() => Array(3).fill(null), []);
    const rows = useMemo( () => Array(3).fill(null), []);
    let idx = 0;
    return (
        <div>
            {rows.map((item, index) => (<div key={getNewId()} className="board-row">
                {columns.map((item2, index2) => {
                    const itemIdx = idx;
                    idx = idx + 1;
                    return renderSquare(itemIdx, index, index2)
                })}
            </div>))}
        </div>
    );
}

const Game = () => {
    const [history, setHistory] = useState([
        {
            squares: Array(9).fill(null),
            currentMove: null
        }
    ]);
    const [stepNumber,setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);

    const handleClick = useCallback((i, row, column) => {
        const story = history.slice(0, stepNumber + 1);
        const current = story[story.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? "X" : "O";
        setHistory(story.concat([
            {
                squares: squares,
                currentMove: `${row}-${column}`
            }
        ]));
        setStepNumber(story.length);
        setXIsNext(!xIsNext);
    }, [history, stepNumber, xIsNext]);

    const jumpTo = useCallback((step) => {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }, []);

    const current = useMemo(() => history[stepNumber], [stepNumber, history]);
    const winner = useMemo(() => calculateWinner(current.squares), [current]);
    const moves = useMemo(() => history.map((step, move) => {
        const desc = move ?
            'Back to move into position: ' + step.currentMove:
            'Back to start';
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    }), [history, jumpTo]);

    const start = useMemo(() => moves.shift(), [moves]);

    const status = useMemo(() => {
        if (winner) {
            return "Winner: " + winner;
        } else {
            return "Next player: " + (xIsNext ? "X" : "O");
        }
    }, [winner, xIsNext]);

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={handleClick}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ul>{start}</ul>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}
// ========================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);