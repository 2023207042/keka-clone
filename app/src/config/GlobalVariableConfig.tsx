// Minimal config to satisfy build requirements based on existing usage
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { 
    label: 'Components', 
    href: '/components',
    children: [
      { label: 'Buttons', href: '/buttons' },
      { label: 'Inputs', href: '/inputs' }
    ]
  },
  { label: 'Settings', href: '/settings' }
];

export const NAV_BG_CLASS = "bg-[var(--color-primary-600)]";
export const SIDEBAR_BG_CLASS = "bg-[var(--color-primary-900)]";
