import React, { useState, useEffect } from "react";

// --- Shadcn UI Component Mocks (for demonstration) ---
// In a real shadcn/ui setup, you'd import these from your library
const Card = ({ className, children }) => (
    <div
        className={`border bg-card text-card-foreground shadow-sm rounded-lg ${className}`}
    >
        {children}
    </div>
);
const CardHeader = ({ className, children }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
        {children}
    </div>
);
const CardTitle = ({ className, children }) => (
    <h3
        className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    >
        {children}
    </h3>
);
const CardDescription = ({ className, children }) => (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);
const CardContent = ({ className, children }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);
const Label = ({ className, children, ...props }) => (
    <label
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
        {...props}
    >
        {children}
    </label>
);
const Input = ({ className, type, ...props }) => (
    <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);
// --- End Shadcn UI Component Mocks ---

// --- Helper Function for Currency Formatting ---
const formatCurrency = (value) => {
    if (isNaN(value) || !isFinite(value)) {
        return "$0.00";
    }
    return value.toLocaleString("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

// --- Main Loan Calculator Component ---
function LoanCalculator() {
    // State variables for user inputs
    const [loanAmount, setLoanAmount] = useState(300000); // Default example value
    const [interestRate, setInterestRate] = useState(6.5); // Default example value (annual %)
    const [loanTerm, setLoanTerm] = useState(30); // Default example value (years)

    // State variables for calculated results
    const [monthlyPayment, setMonthlyPayment] = useState(0); // Principal + Interest
    const [monthlyInterestOnly, setMonthlyInterestOnly] = useState(0);

    // Effect hook to recalculate when inputs change
    useEffect(() => {
        // Get numeric values from state, provide defaults if NaN
        const principal = Number(loanAmount) || 0;
        const annualRate = Number(interestRate) || 0;
        const years = Number(loanTerm) || 0;

        // Basic validation
        if (principal <= 0 || annualRate <= 0 || years <= 0) {
            setMonthlyPayment(0);
            setMonthlyInterestOnly(0);
            return; // Exit if inputs are invalid or zero
        }

        // Calculate monthly interest rate
        const monthlyRate = annualRate / 100 / 12;

        // Calculate number of payments (months)
        const numberOfPayments = years * 12;

        // --- Calculate Monthly Principal & Interest Payment ---
        // Using the standard loan payment formula: M = P [ r(1 + r)^n ] / [ (1 + r)^n – 1]
        const factor = Math.pow(1 + monthlyRate, numberOfPayments);
        const calculatedMonthlyPayment =
            (principal * (monthlyRate * factor)) / (factor - 1);
        setMonthlyPayment(calculatedMonthlyPayment);

        // --- Calculate Monthly Interest-Only Payment ---
        // Formula: I = P * r
        const calculatedInterestOnly = principal * monthlyRate;
        setMonthlyInterestOnly(calculatedInterestOnly);
    }, [loanAmount, interestRate, loanTerm]); // Dependency array: recalculate when these change

    // --- Event Handlers for Input Changes ---
    const handleInputChange = (setter) => (event) => {
        // Allow only numbers and a single decimal point
        const value = event.target.value;
        // Basic validation to allow numeric input including decimals
        if (/^\d*\.?\d*$/.test(value) || value === "") {
            setter(value);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl text-center">
                        Loan Calculator
                    </CardTitle>
                    <CardDescription className="text-center">
                        Estimate your monthly payments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        {/* Loan Amount Input */}
                        <div className="space-y-2">
                            <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                            <Input
                                id="loanAmount"
                                type="text" // Use text to allow better handling of numeric input
                                inputMode="decimal" // Hint for mobile keyboards
                                placeholder="e.g., 300000"
                                value={loanAmount}
                                onChange={handleInputChange(setLoanAmount)}
                                className="appearance-none" // Tries to hide number spinners
                            />
                        </div>

                        {/* Interest Rate Input */}
                        <div className="space-y-2">
                            <Label htmlFor="interestRate">
                                Annual Interest Rate (%)
                            </Label>
                            <Input
                                id="interestRate"
                                type="text"
                                inputMode="decimal"
                                placeholder="e.g., 6.5"
                                value={interestRate}
                                onChange={handleInputChange(setInterestRate)}
                                className="appearance-none"
                            />
                        </div>

                        {/* Loan Term Input */}
                        <div className="space-y-2">
                            <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                            <Input
                                id="loanTerm"
                                type="text"
                                inputMode="numeric" // Hint for mobile keyboards
                                placeholder="e.g., 30"
                                value={loanTerm}
                                onChange={handleInputChange(setLoanTerm)}
                                className="appearance-none"
                            />
                        </div>

                        {/* Results Display */}
                        <div className="pt-4 space-y-3">
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                                <span className="text-sm font-medium text-gray-600">
                                    Monthly P&I Payment:
                                </span>
                                <span className="text-lg font-semibold text-gray-800">
                                    {formatCurrency(monthlyPayment)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                                <span className="text-sm font-medium text-gray-600">
                                    Monthly Interest-Only:
                                </span>
                                <span className="text-lg font-semibold text-gray-800">
                                    {formatCurrency(monthlyInterestOnly)}
                                </span>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

// --- Main App Component ---
// This wraps the calculator and is the default export
export default LoanCalculator;
