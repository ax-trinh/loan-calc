import React, { useState, useEffect } from "react";

import BorrowingCalculator from "./BorrowingCalculator";

// Helper function to format numbers as Australian currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    }).format(amount);
};

// ========================================================================
// STAMP DUTY CALCULATOR COMPONENT
// ========================================================================

// Simplified stamp duty calculation for Victoria, Australia
const calculateStampDuty = (propertyValue, isFirstHomeBuyer) => {
    let duty = 0;

    // First Home Buyer exemption/concession thresholds (indicative)
    if (isFirstHomeBuyer) {
        if (propertyValue <= 600000) {
            return 0; // Full exemption
        } else if (propertyValue > 600000 && propertyValue <= 750000) {
            // Concession applies, but we'll use a simplified model for the calculator
        }
    }

    // Standard stamp duty rates (indicative)
    if (propertyValue <= 25000) {
        duty = (propertyValue / 100) * 1.4;
    } else if (propertyValue <= 130000) {
        duty = 350 + ((propertyValue - 25000) / 100) * 2.4;
    } else if (propertyValue <= 960000) {
        duty = 2870 + ((propertyValue - 130000) / 100) * 6;
    } else {
        duty = 55070 + ((propertyValue - 960000) / 100) * 6.5;
    }

    return duty;
};

const StampDutyCalculator = () => {
    const [propertyValue, setPropertyValue] = useState(600000);
    const [isFirstHomeBuyer, setIsFirstHomeBuyer] = useState(false);
    const [stampDuty, setStampDuty] = useState(0);

    useEffect(() => {
        const duty = calculateStampDuty(propertyValue, isFirstHomeBuyer);
        setStampDuty(duty);
    }, [propertyValue, isFirstHomeBuyer]);

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl">
            {/* Main Section */}
            <div className="p-6 md:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900">
                    Stamp Duty Calculator
                </h1>
                <p className="text-gray-600 mb-8">
                    Estimate the stamp duty on your property purchase. This
                    calculator uses indicative rates for Victoria, Australia.
                </p>

                {/* Inputs */}
                <div className="mb-8">
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">
                            Property Value
                        </label>
                        <div className="mt-2">
                            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 w-1/2">
                                <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                    $
                                </div>
                                <input
                                    type="number"
                                    value={propertyValue}
                                    onChange={(e) =>
                                        setPropertyValue(e.target.value)
                                    }
                                    placeholder="e.g. 90000"
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                    maxLength={8}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center mt-2">
                        <input
                            type="checkbox"
                            checked={isFirstHomeBuyer}
                            onChange={(e) =>
                                setIsFirstHomeBuyer(e.target.checked)
                            }
                            className="rounded text-slate-900 focus:ring-indigo-500"
                        />
                        <label
                            htmlFor="isFirstHomeBuyer"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Are you a first home buyer?
                        </label>
                    </div>
                </div>
            </div>

            {/* Output */}
            <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col justify-between rounded-b-xl">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold">
                        Estimated Stamp Duty
                    </h2>
                    <div className="text-4xl sm:text-5xl font-extrabold">
                        {formatCurrency(stampDuty)}
                    </div>
                </div>
                <p className="text-sm opacity-80 mt-4">
                    Note: This is a simplified calculation for indicative
                    purposes only. For a precise figure, please consult a
                    professional or the official SRO website.
                </p>
                {isFirstHomeBuyer && propertyValue <= 600000 && (
                    <p className="text-sm opacity-90 mt-2 p-2 bg-indigo-800 rounded-md">
                        Congratulations! As a first home buyer with a property
                        value under $600,000, you are likely exempt from stamp
                        duty in Victoria.
                    </p>
                )}
            </div>
        </div>
    );
};

// ========================================================================
// REPAYMENT CALCULATOR COMPONENT
// ========================================================================

const RepaymentCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(500000);
    const [loanTerm, setLoanTerm] = useState(30);
    const [interestRate, setInterestRate] = useState(6.5);
    const [repaymentType, setRepaymentType] = useState("principalAndInterest");
    const [repaymentFrequency, setRepaymentFrequency] = useState("monthly");

    const [repaymentAmount, setRepaymentAmount] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalRepayments, setTotalRepayments] = useState(0);

    useEffect(() => {
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
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl grid grid-cols-3">
            <div className="p-6 md:p-8 col-span-3 md:col-span-2">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900">
                    Home Loan Repayment Calculator
                </h1>
                <p className="text-gray-600 mb-8">
                    Estimate your home loan repayments by adjusting the amount,
                    term, and interest rate.
                </p>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-slate-900">
                        Loan Details
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Loan Amount
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                        $
                                    </div>
                                    <input
                                        type="number"
                                        value={loanAmount}
                                        onChange={(e) =>
                                            setLoanAmount(e.target.value)
                                        }
                                        placeholder="e.g. 90000"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        maxLength={8}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Loan Term
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                        Years
                                    </div>
                                    <input
                                        type="number"
                                        value={loanTerm}
                                        onChange={(e) =>
                                            setLoanTerm(e.target.value)
                                        }
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        maxLength={4}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Interest Rate
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                                        %
                                    </div>
                                    <input
                                        type="number"
                                        value={interestRate}
                                        onChange={(e) =>
                                            setInterestRate(e.target.value)
                                        }
                                        placeholder="e.g. 90000"
                                        className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        maxLength={3}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Repayment Type
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-1 pr-1 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <select
                                        value={repaymentType}
                                        onChange={(e) =>
                                            setRepaymentType(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded-md  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 pr-3 pl-1 text-sm"
                                    >
                                        <option value="principalAndInterest">
                                            Principal & Interest
                                        </option>
                                        <option value="interestOnly">
                                            Interest Only
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Repayment Frequency
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-1 pr-1 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                                    <select
                                        value={repaymentFrequency}
                                        onChange={(e) =>
                                            setRepaymentFrequency(
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-1.5 pr-3 pl-1 text-sm"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="fortnightly">
                                            Fortnightly
                                        </option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-col col-span-3 md:col-span-1 justify-between rounded-b-xl">
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
                            <span className="font-bold">Total repayments:</span>{" "}
                            {formatCurrency(totalRepayments)}
                        </li>
                        <li>
                            <span className="font-bold">Total interest:</span>{" "}
                            {formatCurrency(totalInterest)}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// ========================================================================
// MAIN APPLICATION COMPONENT WITH NAVIGATION
// ========================================================================

const App = () => {
    const [activeTab, setActiveTab] = useState("borrowing");

    let activeComponent;
    if (activeTab === "borrowing") {
        activeComponent = <BorrowingCalculator />;
    } else if (activeTab === "repayment") {
        activeComponent = <RepaymentCalculator />;
    } else {
        activeComponent = <StampDutyCalculator />;
    }

    const activeTabClass =
        "inline-block p-4 text-white bg-slate-900 rounded-t-lg active border-b-2 border-indigo-500 font-bold";
    const inactiveTabClass =
        "inline-block p-4 rounded-t-lg hover:text-slate-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-slate-200 cursor-pointer";

    return (
        <div className="bg-white min-h-screen p-4 sm:p-8 flex flex-col items-center font-sans text-gray-800">
            <div className="w-full max-w-4xl">
                <div className="text-sm font-medium text-center text-slate-700 border-b border-gray-200 rounded-t-xl bg-gray-50 ">
                    <ul className="flex flex-wrap -mb-px">
                        <li className="mr-2">
                            <button
                                onClick={() => setActiveTab("borrowing")}
                                className={
                                    activeTab === "borrowing"
                                        ? activeTabClass
                                        : inactiveTabClass
                                }
                            >
                                Borrowing
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                onClick={() => setActiveTab("repayment")}
                                className={
                                    activeTab === "repayment"
                                        ? activeTabClass
                                        : inactiveTabClass
                                }
                            >
                                Repayments
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                onClick={() => setActiveTab("stampDuty")}
                                className={
                                    activeTab === "stampDuty"
                                        ? activeTabClass
                                        : inactiveTabClass
                                }
                            >
                                Stamp Duty
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div>{activeComponent}</div>
        </div>
    );
};

export default App;
