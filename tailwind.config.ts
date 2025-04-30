
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'montserrat': ['Montserrat', 'system-ui', 'sans-serif'],
				'noto': ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
				'sans': ['Roboto', 'Open Sans', 'system-ui', 'sans-serif'],
				'roboto': ['Roboto', 'system-ui', 'sans-serif'],
				'opensans': ['Open Sans', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				status: {
					active: 'hsl(var(--status-active))',
					warning: 'hsl(var(--status-warning))',
					error: 'hsl(var(--status-error))',
					inactive: 'hsl(var(--status-inactive))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
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
						height: '0'
					}
				},
				'fade-in': {
					from: {
						opacity: '0'
					},
					to: {
						opacity: '1'
					}
				},
				'slide-up': {
					from: {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					to: {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-from-right': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'slide-out-to-right': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(100%)'
					}
				},
				'collapse-dialog': {
					from: {
						opacity: '1',
						transform: 'scale(1)'
					},
					to: {
						opacity: '0',
						transform: 'scale(0.5) translate(calc(var(--origin-x) - 50vw), calc(var(--origin-y) - 50vh))'
					}
				},
				'expand-dialog': {
					from: {
						opacity: '0',
						transform: 'scale(0.5) translate(calc(var(--origin-x) - 50vw), calc(var(--origin-y) - 50vh))'
					},
					to: {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'float-up': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'card-hover': {
					'0%': {
						transform: 'translateY(0) rotate(0)'
					},
					'100%': {
						transform: 'translateY(-5px) rotate(1deg)'
					}
				},
				'nav-underline': {
					'0%': {
						width: '0%',
						left: '50%'
					},
					'100%': {
						width: '100%',
						left: '0%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.2s ease-out',
				'slide-up': 'slide-up 0.2s ease-out',
				'slide-in-from-right-full': 'slide-in-from-right 0.3s ease-out',
				'slide-out-to-right-full': 'slide-out-to-right 0.3s ease-out',
				'collapse': 'collapse-dialog 0.3s ease-in forwards',
				'expand': 'expand-dialog 0.3s ease-out forwards',
				'float': 'float-up 3s ease-in-out infinite',
				'card-hover': 'card-hover 0.3s ease-out forwards',
				'nav-underline': 'nav-underline 0.3s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
