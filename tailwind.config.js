import { text } from "stream/consumers";


/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			palanquin: [
  				'Palanquin',
  				'sans-serif'
  			],
  			montserrat: [
  				'Montserrat',
  				'sans-serif'
  			],
  			poppins: [
  				'Poppins',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			xs: [
  				'12px',
  				'16px'
  			],
  			sm: [
  				'14px',
  				'20px'
  			],
  			base: [
  				'16px',
  				'19.5px'
  			],
  			lg: [
  				'18px',
  				'21.94px'
  			],
  			xl: [
  				'20px',
  				'24.38px'
  			],
  			'2xl': [
  				'24px',
  				'29.26px'
  			],
  			'3xl': [
  				'28px',
  				'50px'
  			],
  			'4xl': [
  				'48px',
  				'58px'
  			],
  			'8xl': [
  				'96px',
  				'106px'
  			]
  		},
  		backgroundImage: {
        hero: "url('/assets')",
      },
  		keyframes: {
  			scaleUpCenter: {
  				'0%': {
  					transform: 'scale(0.5)'
  				},
  				'100%': {
  					transform: 'scale(1)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			},
  			fadeIn: {
  				from: {
  					opacity: 0
  				},
  				to: {
  					opacity: 1
  				}
  			}
  		},
  		animation: {
  			scaleUpCenter: 'scaleUpCenter 0.4s cubic-bezier(0.39, 0.575, 0.565, 1.000) both',
  			'accordion-down': 'accordion-down 0.3s ease-out',
  			'accordion-up': 'accordion-up 0.3s ease-out',
  			'fade-in': 'fadeIn 1s ease-in-out'
  		},
  		transitionDelay: {
  			'200': '200ms',
  			'300': '300ms',
  			'500': '500ms',
  			'700': '700ms',
  			'1000': '1000ms'
  		},
  		boxShadow: {
  			'3xl': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: '#f5f5f4',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: '#0891b2',
  				foreground: 'hsl(var(--primary-foreground))',
  				light: '#eef2ff'
  			},
  			secondary: {
  				DEFAULT: '#22c55e',
  				foreground: 'hsl(var(--secondary-foreground))',
  				light: '#e0f2fe'
  			},
  			blue: {
  				DEFAULT: '#3629B7'
  			},
  			textColor: {
  				DEFAULT: '#1C1F37'
  			},
  			muted: {
  				DEFAULT: '#6b7280',
  				foreground: 'hsl(var(--muted-foreground))',
  				dark: '#7C7C7C',
  				light: '#F6F6F6',
  				lighter: '#9A9A9A',
  				slate: '#7B81A6'
  			},
  			destructive: {
  				DEFAULT: '#F05746',
  				foreground: 'hsl(var(--destructive-foreground))',
  				light: '#ffe4e6'
  			},
  			border: '#DADADA',
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))'
  			}
  		}
  	},
  	screens: {
  		xs: '475px',
  		sm: '640px',
  		md: '768px',
  		lg: '1024px',
  		xl: '1280px',
  		'2xl': '1536px'
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
