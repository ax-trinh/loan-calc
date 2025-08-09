import logo from "./logo.svg";
import "./App.css";
import LoanCalculator from "./LoanCalculator";
import BorrowingCalculator from "./BorrowingCalculator";
import StampDutyCalculator from "./StampDutyCalculator";

function App() {
    const [calcOption, setCalcOption] = useState(1);

    return (
        <div className="App">
            <div></div>
            {calcOption === 2 ? (
                <LoanCalculator />
            ) : calcOption === 3 ? (
                <StampDutyCalculator />
            ) : (
                <BorrowingCalculator />
            )}
        </div>
    );
}

export default App;
