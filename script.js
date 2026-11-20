/**
 * Author: Alyssa DaCosta
 * Date: November 19, 2026
 * Assignment: Advanced JavaScript and Tailwind CSS
 * 
 * This program converts between metric and imperial units for weight, distance, and temperature.
 * Users can enter a simple numeric value or a comma-separated list of values. A higher-order
 * function selects the appropriate conversion formula based on the selected units.
 * The program validates user input and performs the requested conversions using JavaScript.
 * Results are displayed in a responsive interface styled with Tailwind CSS. 
 */

// Creates a conversion function based on selected units
function createConverter(fromUnit, toUnit) {
    const convert = (value) => {
        if (fromUnit === "kg" && toUnit === "lb") {
            return value * 2.20462;
        }

        if (fromUnit === "lb" && toUnit === "kg") {
            return value / 2.20462;
        }

        // Distance conversions
        if (fromUnit === "km" && toUnit == "mi") {
            return value / 1.609344;
        }

        if (fromUnit === "mi" && toUnit === "km") {
            return value * 1.609344;
        }

        // Temp conversions
        if (fromUnit === "C" && toUnit === "F") {
            return (value * 9/5) + 32;
        }

        if (fromUnit === "F" && toUnit === "C") {
            return (value - 32) * 5 / 9;
        }
    };

    // Handle both individual values and arrays
    return (input) => {
        if (Array.isArray(input)) {
            return input.map(convert);
        }

        return convert(input);
    };
}

const tabs = {
    weight: {
        title: "Weight Converter",
        description: "Convert between kilograms and pounds.",
        units: [
            { value: "kg", label: "Kilograms (kg)" },
            { value: "lb", label: "Pounds (lb)" }
        ]
    },
    distance: {
        title: "Distance Converter",
        description: "Convert between kilometres and miles.",
        units: [
            { value: "km", label: "Kilometres (km)" },
            { value: "mi", label: "Miles (mi "}
        ]
    },
    temperature: {
        title: "Temperature Converter",
        description: "Convert between Celsius and Fahrenheit.",
        units: [
            { value: "C", label: "Celsius (°C)" },
            { value: "F", label: "Fahrenheit (°F)" }
        ]
    }
};

// Get references to our HTML elements
const converterContent = document.getElementById("converter-content");

const tabButtons = {
    weight: document.getElementById("weight-tab"),
    distance: document.getElementById("distance-tab"),
    temperature: document.getElementById("temperature-tab")
};

// Switch the active conversion category
function switchTab(category) {
    const selectedTab = tabs[category];

    // Update the heading and description
    document.getElementById("converter-title").textContent = selectedTab.title;

    document.getElementById("converter-description").textContent = selectedTab.description;

    // Populate the unit dropdowns
    const fromUnit = document.getElementById("from-unit");
    const toUnit = document.getElementById("to-unit");

    const options = selectedTab.units.map((unit) => `
        <option value="${unit.value}">${unit.label}</option>`).join("");

    fromUnit.innerHTML = options;
    toUnit.innerHTML = options;

    // Default to converting metric to imperial
    fromUnit.selectedIndex = 0;
    toUnit.selectedIndex = 1;

    // Clear previous results when switching categories
    document.getElementById("conversion-input").value = "";

    const result = document.getElementById("conversion-result");
    result.textContent = "";
    result.classList.add("hidden");

    // Update tab styling
    Object.entries(tabButtons).forEach(([name, button]) => {
        const isActive = name === category;

        button.classList.toggle("bg-indigo-600", isActive);
        button.classList.toggle("text-white", isActive);
        button.classList.toggle("bg-slate-100", !isActive);
        button.classList.toggle("text-slate-700", !isActive);

        button.setAttribute("aria-pressed", String(isActive));
    });
}

// Attach click events to each tab
Object.entries(tabButtons).forEach(([category, button]) => {
    button.addEventListener("click", () => switchTab(category));
});

// Set the initial active tab
switchTab("weight");

// Handle conversion form submissions
document.getElementById("conversion-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const input = document.getElementById("conversion-input").value;
    const fromUnit = document.getElementById("from-unit").value;
    const toUnit = document.getElementById("to-unit").value;
    const result = document.getElementById("conversion-result");

    // Parse one number or a comma-separated list
    const inputValues = input.split(",").map((value) => value.trim());

    // Reject empty or invalid entries
    if (inputValues.some((value) => value === "" || !Number.isFinite(Number(value)))) {
        result.textContent = "Please enter valid numbers separated by commas.";
        result.classList.remove("hidden");
        return;
    }

    const numbers = inputValues.map(Number);
    const valuesToConvert = numbers.length === 1 ? numbers[0] : numbers;

    // Call our higher-order conversion function
    const converter = createConverter(fromUnit, toUnit);
    const convertedValues = converter(valuesToConvert);

    // Format results to 4 decimal places where necessary
    const formatNumber = (number) => Number(number.toFixed(4)).toString();

    const formattedResult = Array.isArray(convertedValues)
        ? convertedValues.map(formatNumber).join(", ")
        : formatNumber(convertedValues);

    result.textContent = `${input} ${fromUnit} = ${formattedResult} ${toUnit}`;
    result.classList.remove("hidden");
});