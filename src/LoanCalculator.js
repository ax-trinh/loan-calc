import React, { useState, useEffect } from "react";

// Helper function to format numbers as Australian currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(amount);
};

const App = () => {
    const [loanAmount, setLoanAmount] = useState(500000);
    const [loanTerm, setLoanTerm] = useState(30);
    const [interestRate, setInterestRate] = useState(5.5);
    const [repaymentType, setRepaymentType] = useState("principalAndInterest");
    const [repaymentFrequency, setRepaymentFrequency] = useState("monthly");

    const [repaymentAmount, setRepaymentAmount] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalRepayments, setTotalRepayments] = useState(0);

    // Recalculate repayments whenever any input changes
    useEffect(() => {
        let monthlyRate = parseFloat(interestRate) / 100 / 12;
        let numberOfPayments = parseFloat(loanTerm) * 12;
        let monthlyRepayment = 0;

        // Adjust for repayment frequency
        let paymentsPerYear = 12;
        if (repaymentFrequency === "fortnightly") {
            paymentsPerYear = 26;
        } else if (repaymentFrequency === "weekly") {
            paymentsPerYear = 52;
        }

        const effectiveRate = parseFloat(interestRate) / 100 / paymentsPerYear;
        const effectiveTerm = parseFloat(loanTerm) * paymentsPerYear;
        let calculatedRepaymentAmount = 0;
        let calculatedTotalRepayments = 0;
        let calculatedTotalInterest = 0;

        if (repaymentType === "principalAndInterest") {
            // Principal & Interest formula
            if (effectiveRate > 0) {
                calculatedRepaymentAmount =
                    (parseFloat(loanAmount) *
                        effectiveRate *
                        Math.pow(1 + effectiveRate, effectiveTerm)) /
                    (Math.pow(1 + effectiveRate, effectiveTerm) - 1);
            } else {
                calculatedRepaymentAmount =
                    parseFloat(loanAmount) / effectiveTerm;
            }
            calculatedTotalRepayments =
                calculatedRepaymentAmount * effectiveTerm;
            calculatedTotalInterest =
                calculatedTotalRepayments - parseFloat(loanAmount);
        } else {
            // Interest Only formula (for the first termYears)
            calculatedRepaymentAmount =
                (parseFloat(loanAmount) * (parseFloat(interestRate) / 100)) /
                paymentsPerYear;
            calculatedTotalRepayments =
                calculatedRepaymentAmount * effectiveTerm;
            calculatedTotalInterest = calculatedTotalRepayments;
        }

        setRepaymentAmount(calculatedRepaymentAmount);
        setTotalRepayments(calculatedTotalRepayments);
        setTotalInterest(calculatedTotalInterest);
    }, [loanAmount, loanTerm, interestRate, repaymentType, repaymentFrequency]);

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex justify-center items-center font-sans text-gray-800">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl grid lg:grid-cols-3">
                {/* Left Section: Inputs */}
                <div className="p-6 md:p-8 sm:col-span-3 md:col-span-2">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-700">
                        Home Loan Repayment Calculator
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Estimate your home loan repayments by adjusting the
                        amount, term, and interest rate.
                    </p>

                    {/* Loan Details Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4 text-indigo-600">
                            Loan Details
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">
                                    Loan Amount ($)
                                </span>
                                <input
                                    type="text"
                                    value={loanAmount}
                                    onChange={(e) =>
                                        setLoanAmount(e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">
                                    Loan Term (years)
                                </span>
                                <input
                                    type="number"
                                    value={loanTerm}
                                    onChange={(e) =>
                                        setLoanTerm(e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">
                                    Interest Rate (%)
                                </span>
                                <input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) =>
                                        setInterestRate(e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    step="0.1"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">
                                    Repayment Type
                                </span>
                                <select
                                    value={repaymentType}
                                    onChange={(e) =>
                                        setRepaymentType(e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="principalAndInterest">
                                        Principal & Interest
                                    </option>
                                    <option value="interestOnly">
                                        Interest Only
                                    </option>
                                </select>
                            </label>
                            <label className="block sm:col-span-2">
                                <span className="text-sm font-medium text-gray-700">
                                    Repayment Frequency
                                </span>
                                <select
                                    value={repaymentFrequency}
                                    onChange={(e) =>
                                        setRepaymentFrequency(e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="monthly">Monthly</option>
                                    <option value="fortnightly">
                                        Fortnightly
                                    </option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Section: Output */}
                <div className="bg-indigo-700 text-white p-6 md:p-8 flex flex-col justify-between sm:col-span-3 md:col-span-1">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">
                            Estimated Repayment
                        </h2>
                        <p className="text-sm opacity-80 mb-6">
                            {repaymentFrequency.charAt(0).toUpperCase() +
                                repaymentFrequency.slice(1)}{" "}
                            Repayment
                        </p>
                        <div className="text-5xl sm:text-6xl font-extrabold mb-4">
                            {formatCurrency(repaymentAmount)}
                        </div>
                    </div>
                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-2">Total Costs</h3>
                        <ul className="text-sm opacity-90 space-y-2">
                            <li>
                                <span className="font-bold">
                                    Total repayments:
                                </span>{" "}
                                {formatCurrency(totalRepayments)}
                            </li>
                            <li>
                                <span className="font-bold">
                                    Total interest:
                                </span>{" "}
                                {formatCurrency(totalInterest)}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
