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

// Simplified stamp duty calculation for Victoria, Australia
// Reference: https://www.sro.vic.gov.au/land-transfer-duty
const calculateStampDuty = (propertyValue, isFirstHomeBuyer) => {
    let duty = 0;

    // First Home Buyer exemption/concession thresholds (indicative)
    if (isFirstHomeBuyer) {
        if (propertyValue <= 600000) {
            return 0; // Full exemption
        } else if (propertyValue > 600000 && propertyValue <= 750000) {
            // Concession applies, but we'll use a simplified model for the calculator
            // For this calculator, we'll assume standard rates apply after the threshold
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

const App = () => {
    const [propertyValue, setPropertyValue] = useState(600000);
    const [isFirstHomeBuyer, setIsFirstHomeBuyer] = useState(false);
    const [stampDuty, setStampDuty] = useState(0);

    useEffect(() => {
        const duty = calculateStampDuty(propertyValue, isFirstHomeBuyer);
        setStampDuty(duty);
    }, [propertyValue, isFirstHomeBuyer]);

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex justify-center items-center font-sans text-gray-800">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-2xl">
                {/* Main Section */}
                <div className="p-6 md:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-indigo-700">
                        Stamp Duty Calculator
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Estimate the stamp duty on your property purchase. This
                        calculator uses indicative rates for Victoria,
                        Australia.
                    </p>

                    {/* Inputs */}
                    <div className="mb-8">
                        <label className="block mb-6">
                            <span className="text-sm font-medium text-gray-700">
                                Property Value ($)
                            </span>
                            <input
                                type="number"
                                value={propertyValue}
                                onChange={(e) =>
                                    setPropertyValue(e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={isFirstHomeBuyer}
                                onChange={(e) =>
                                    setIsFirstHomeBuyer(e.target.checked)
                                }
                                className="rounded text-indigo-600 focus:ring-indigo-500"
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
                <div className="bg-indigo-700 text-white p-6 md:p-8 flex flex-col justify-between rounded-b-xl">
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
                            Congratulations! As a first home buyer with a
                            property value under $600,000, you are likely exempt
                            from stamp duty in Victoria.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
