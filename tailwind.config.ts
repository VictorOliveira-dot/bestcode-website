
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#301860',
					50: '#ede7f8',
					100: '#d3c4ec',
					200: '#b69fdf',
					300: '#997ad2',
					400: '#7d56c5',
					500: '#301860',
					600: '#301860',
					700: '#381b6e',
					800: '#251249',
					900: '#140824',
					950: '#0a0412',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: '#430177',
					50: '#f4e6fc',
					100: '#e5c4f9',
					200: '#d39df5',
					300: '#c076f1',
					400: '#ae50ec',
					500: '#430177',
					600: '#430177',
					700: '#381b6e',
					800: '#251249',
					900: '#140824',
					950: '#0a0412',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				accent: {
					DEFAULT: '#430177',
					50: '#f4e6fc',
					100: '#e5c4f9',
					200: '#d39df5',
					300: '#c076f1',
					400: '#ae50ec',
					500: '#430177',
					600: '#430177',
					700: '#381b6e',
					800: '#251249',
					900: '#140824',
					950: '#0a0412',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				bestcode: {
					50: '#ede7f8',
					100: '#d3c4ec',
					200: '#b69fdf',
					300: '#997ad2',
					400: '#7d56c5',
					500: '#301860',
					600: '#4c2593',
					700: '#381b6e',
					800: '#251249',
					900: '#140824',
					950: '#0a0412',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(100px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideRight: {
					'0%': { transform: 'translateX(-100px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				fadeIn: 'fadeIn 0.5s ease-in-out',
				slideUp: 'slideUp 0.5s ease-out',
				slideRight: 'slideRight 0.5s ease-out',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
