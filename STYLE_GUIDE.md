# App Style Guide

Use this guide when building or updating UI in the app.

## Color Scheme
- Base background: `bg-zinc-950` or `bg-gray-950`
- Surface/card background: `bg-zinc-900`
- Secondary surface: `bg-zinc-800` or `bg-zinc-950/50`
- Border color: `border-zinc-800`
- Primary text: `text-zinc-100`
- Secondary text: `text-zinc-300`
- Muted text: `text-zinc-500` or `text-zinc-600`
- Primary accent: `blue` (`bg-blue-600`, `text-blue-500`, `border-blue-500/20`)
- Error state: `red` (`bg-red-500/10`, `text-red-400`, `border-red-500/20`)

## Style Format
- Prefer Tailwind utility classes directly in `className`.
- Keep components dark, modern, and minimal.
- Use rounded corners: `rounded-lg` or `rounded-xl`.
- Use subtle shadow/glow effects for primary actions.
- Keep transitions smooth: `transition-all duration-200`.
- Use hover feedback on interactive elements.
- Use spacing consistently with `p-4`, `p-6`, `gap-2`, `gap-4`, `mt-6`.

## Component Rules
- **Buttons**: use the shared `Button` component when possible.
- **Inputs**: use the shared `Input` component for labels, borders, and focus states.
- **Cards**: use dark surfaces with borders and soft shadows.
- **Navbar**: keep it sticky, blurred, and slightly transparent.
- **Auth screens**: center content on a dark full-screen background.

## Typography
- Use `font-semibold` for headings and important labels.
- Use `text-sm` for helper text and actions.
- Keep labels muted and readable.

## Focus and Accessibility
- Always include visible focus styles.
- Use `aria-label` for icon-only buttons.
- Keep contrast high on dark backgrounds.

## Examples
- Primary button: `bg-blue-600 text-white hover:bg-blue-500`
- Card: `bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl`
- Page background: `bg-zinc-950 text-zinc-100`
- Error panel: `bg-red-500/10 border border-red-500/20 text-red-400`

## Don't
- Don't use bright/light backgrounds unless it's a special icon like Google.
- Don't mix random colors outside the app palette.
- Don't add heavy gradients or loud animations.
- Don't create new style patterns if an existing shared component already fits.
