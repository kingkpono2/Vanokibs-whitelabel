import type { IconName } from '@/content/services';

const paths: Record<IconName, string> = {
  support: 'M4 13v-1a8 8 0 0 1 16 0v1M4 13a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2v1zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1zM17 15v1a4 4 0 0 1-4 4h-2',
  code: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14',
  cloud: 'M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 10a4 4 0 0 1 0 8H7z',
  cart: 'M3 4h2l2.4 10.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2M10 20.5h.01M17 20.5h.01',
  bank: 'M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18',
  erp: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM16.5 13v7M13 16.5h7',
  odoo: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-4.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  magento: 'M12 3l8 4.6v9.2L17 18.5V9.4l-5-2.9-5 2.9v9.1l-3-1.7V7.6L12 3zm0 6.5l2 1.2v9.1L12 21l-2-1.2v-9.1l2-1.2z',
  wordpress: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 8.5L8.5 20M7 8.5h4.5M9 8.5l3.6 10.3L16 8.5M14.5 8.5H18M20.3 9a8 8 0 0 1-3.8 10.6',
  mobile: 'M7 3h10a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  shield: 'M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3zM9 12l2 2 4-4',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  maple: 'M12 2l1.7 3.6 2.1-1-1 4.6 3.4-2.6.6 1.8 2.7-.4-1 2.8 1.4.9-4.6 3.8.7 1.6-4.5-.6L13 21h-2l-.5-5.9-4.5.6.7-1.6L2.1 10.3l1.4-.9-1-2.8 2.7.4.6-1.8 3.4 2.6-1-4.6 2.1 1L12 2z',
  users: 'M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20M10 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3M15 4.6a3.5 3.5 0 0 1 0 6.8',
  rocket: 'M5 15c-1.5 1.3-2 4-2 6 2 0 4.7-.5 6-2M9 18l-3-3c1-4 4.5-9.5 12-12-2.5 7.5-8 11-12 12M14.5 9.5h.01M10 13.5l-3 .5M10.5 14l-.5 3',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  calendar: 'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6',
  chat: 'M5 5h14v10H9l-4 4V5z',
  factory: 'M3 20V10l6 3V10l6 3V6l6-2v16H3zM7 16h2M12 16h2M17 16h2',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
};

export function Icon({ name, size = 24, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={paths[name]} />
    </svg>
  );
}
