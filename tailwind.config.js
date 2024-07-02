/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    screens: {
      pn: "130px",
      vs: "200px",
      ss: "360px",
      pp: "500px",
      sm: "821px",
      md: "1180px",
      lg: "1440px",
      xl: "1536px",
      txl: "1600px",
    },
    extend: {
      backgroundImage: {
        chats: "url('./assets/Header.png')",
        mobilechats: "url('./assets/mobilechat.png')",
        loginbg: "url('./assets/backlogin.png')",
        piclogin: "url('./assets/piclogin.png')",
        lightlogin: "url('./assets/lightlogin.png')",
        lightpiclogin: "url('./assets/lightpiclogin.png')"
      },
      boxShadow: {
        'custom-lg': '0 10px 15px -3px rgba(255, 255, 255, 0.07), 0 4px 6px -2px rgba(255, 255, 255, 0.07)',
      },
      fontFamily: {
        plus_jakarta_sans: ['var(--font-plus_jakarta_sans)'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        bluedark: "hsl(var(--bluedark))",
        selectlight: "hsl(var(--selectlight))",
        graylight: "hsl(var(--graylight))",

        bluelight: "hsl(var(--bluelight))",
        navdark: "hsl(var(--navdark))",
        selectdark: "hsl(var(--selectdark))",
        graydark: "hsl(var(--graydark))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
