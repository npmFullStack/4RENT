/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#E6B800",
                white: "#F5F6F8" 
            },
            fontFamily: {
                logo: ["Bowlby One", "cursive"],
                sans: ["Poppins", "sans-serif"]
            }
        }
    },
    plugins: []
};