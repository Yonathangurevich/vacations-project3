import { NavLink } from "react-router-dom";
import "./page404.css";

// Each digit is drawn on a 3x5 grid of blocks. 1 = a block, 0 = empty.
// The blocks fall from the sky and assemble into "404":
const FOUR = [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1]
];

const ZERO = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1]
];

const DIGITS = [FOUR, ZERO, FOUR];

export function Page404() {

    return (
        <div className="Page404">

            <div className="blocks">

                {DIGITS.map((digit, digitIndex) =>

                    <div className="digit" key={digitIndex}>

                        {digit.map((row, rowIndex) =>
                            row.map((cell, cellIndex) =>

                                <span
                                    key={`${rowIndex}-${cellIndex}`}
                                    className={cell ? "block" : "block empty"}

                                    // Blocks land one after another, left to right,
                                    // top to bottom - so the digits build up:
                                    style={{
                                        animationDelay:
                                            `${(digitIndex * 15 + rowIndex * 3 + cellIndex) * 0.06}s`
                                    }}
                                />
                            )
                        )}

                    </div>
                )}

            </div>

            <p className="message">The page you are looking for does not exist.</p>

            <NavLink to="/vacations">Back to the vacations</NavLink>

        </div>
    );
}
