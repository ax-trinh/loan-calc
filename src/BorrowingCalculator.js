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

// Simplified HEM figures from publicly available data for indicative purposes
const getHemExpenses = (adults, children) => {
    // Base HEM for a single adult
    let hem = 25000;

    if (adults === 2) {
        hem = 35000;
    }

    // Add for children
    if (children > 0) {
        hem += children * 5000;
    }

    return hem;
};

const BorrowingCalculator = () => {
    const [individualIncome, setIndividualIncome] = useState();
    const [otherIncome, setOtherIncome] = useState();
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [existingRepayments, setExistingRepayments] = useState();
    const [creditCardLimit, setCreditCardLimit] = useState();
    const [calculatedHem, setCalculatedHem] = useState(getHemExpenses(1, 0));
    const [borrowingCapacity, setBorrowingCapacity] = useState(0);

    // Constants for the calculation
    const interestRate = 0.06; // Indicative interest rate (6.00%)
    const rateBuffer = 0.03; // Serviceability buffer (3.00%)
    const termYears = 30;
    const serviceabilityRate = interestRate + rateBuffer;

    // Recalculate borrowing capacity whenever inputs change
    useEffect(() => {
        // Total Annual Income
        const totalIncome =
            parseFloat(individualIncome) +
            parseFloat(
                !otherIncome || otherIncome === undefined ? 0 : otherIncome
            );

        // Calculate HEM based on family size
        const hem = getHemExpenses(adults, children);
        setCalculatedHem(hem);

        // Total Annual Expenses
        // Lenders typically service at 3% of the credit card limit.
        const creditCardRepayments =
            parseFloat(
                !creditCardLimit || creditCardLimit === undefined
                    ? 0
                    : creditCardLimit
            ) * 0.03;
        const totalExpenses =
            hem +
            parseFloat(
                !existingRepayments || existingRepayments === undefined
                    ? 0
                    : existingRepayments
            ) +
            creditCardRepayments;

        console.log(totalIncome, hem, creditCardRepayments, totalExpenses);

        // Net disposable income for loan repayments
        const netIncomeForRepayments = totalIncome - totalExpenses;

        console.log(netIncomeForRepayments);

        // Check for negative net income
        if (netIncomeForRepayments <= 0) {
            setBorrowingCapacity(0);
            return;
        }

        // Loan calculation formula: A = P * [((1+r)^n) - 1] / [r*(1+r)^n]
        // A = Principal (loan amount)
        // P = Monthly payment (net income for repayments / 12)
        // r = Monthly interest rate (serviceabilityRate / 12)
        // n = Total number of payments (termYears * 12)

        const monthlyPayment = netIncomeForRepayments / 12;
        const monthlyRate = serviceabilityRate / 12;
        const numberOfPayments = termYears * 12;

        const numerator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
        const denominator =
            monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
        const maxBorrowing = monthlyPayment * (numerator / denominator);

        const borrowingC = Math.max(0, maxBorrowing);

        setBorrowingCapacity(Number.isNaN(borrowingC) ? 0 : borrowingC);
    }, [
        individualIncome,
        otherIncome,
        adults,
        children,
        existingRepayments,
        creditCardLimit,
    ]);

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl grid grid-cols-2">
            {/* Left Section: Inputs */}
            <div className="p-6 md:p-8 col-span-2 md:col-span-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900">
                    How much can I borrow?
                </h1>
                <p className="text-gray-600 mb-8">
                    This calculator provides an estimate of your maximum
                    borrowing capacity. The figures are indicative and should
                    not be considered a loan offer.
                </p>

                {/* Income Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">
                        Your Income
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Your Annual Income (before tax)
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                        $
                                    </div>
                                    <input
                                        type="number"
                                        value={individualIncome}
                                        onChange={(e) => {
                                            e.target.value.length < 9 &&
                                                setIndividualIncome(
                                                    e.target.value
                                                );
                                        }}
                                        placeholder="e.g. 90000"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        maxLength={8}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Other Income (e.g. rental, bonuses)
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                        $
                                    </div>
                                    <input
                                        type="number"
                                        value={otherIncome}
                                        onChange={(e) => {
                                            e.target.value.length < 6 &&
                                                setOtherIncome(e.target.value);
                                        }}
                                        placeholder="e.g. 5000"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Expenses and Debts Section */}
                <div className="mb-2">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">
                        Your Expenses & Debts
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Adults
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <input
                                        type="number"
                                        value={adults}
                                        onChange={(e) =>
                                            setAdults(
                                                Math.max(
                                                    1,
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            )
                                        }
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Children
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <input
                                        type="number"
                                        value={children}
                                        onChange={(e) =>
                                            setChildren(
                                                Math.max(
                                                    0,
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            )
                                        }
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="price"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Monthly Loan Repayments
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                        $
                                    </div>
                                    <input
                                        type="number"
                                        value={existingRepayments}
                                        onChange={(e) =>
                                            setExistingRepayments(
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        placeholder="e.g. 500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="price"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Total Credit Card Limit
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                        $
                                    </div>
                                    <input
                                        type="number"
                                        value={creditCardLimit}
                                        onChange={(e) =>
                                            setCreditCardLimit(
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        placeholder="e.g. 10000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button class="bg-slate-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Calculate
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Section: Output */}
            <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col justify-between sm:col-span-2 md:col-span-1">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">
                        Your Estimated Borrowing Power
                    </h2>
                    <p className="text-sm opacity-80 mb-6">
                        This is an estimate of the maximum amount you may be
                        able to borrow.
                    </p>
                    <div className="text-5xl sm:text-6xl font-extrabold mb-4">
                        {formatCurrency(borrowingCapacity)}
                    </div>
                </div>
                <div className="mt-8">
                    <p className="text-sm opacity-90 space-y-1">
                        <strong>Note on HEM:</strong> The calculator uses a
                        simplified Melbourne Institute Household Expenditure
                        Measure (HEM) to estimate your living expenses. Based on
                        your family size, we've estimated your annual expenses
                        to be{" "}
                        <span className="font-bold text-slate-900">
                            {formatCurrency(calculatedHem)}
                        </span>
                        .
                    </p>
                    <br />
                    <h3 className="text-lg font-bold mb-2">Assumptions</h3>
                    <ul className="text-sm opacity-90 space-y-1">
                        <li>
                            An indicative interest rate of{" "}
                            {Math.round(interestRate * 100)}% plus a
                            serviceability buffer of{" "}
                            {Math.round(rateBuffer * 100)}%.
                        </li>
                        <li>A loan term of {termYears} years.</li>
                        <li>
                            A simplified HEM model is used to estimate living
                            expenses.
                        </li>
                        <li>
                            Credit card limits are serviced at 3% of the limit.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BorrowingCalculator;
