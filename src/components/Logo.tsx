import { brand } from '@/content/brand';

/** Wordmark with a geometric "V" mark. White-label: replace the mark or the name in brand.ts. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`logo${light ? ' logo--light' : ''}`}>
      <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="vk-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4f7cff" />
            <stop offset="1" stopColor="#13c2a3" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="url(#vk-g)" />
        <path d="M11 12l9 17 9-17" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="29.5" cy="11.5" r="2.6" fill="#ff5a5f" />
      </svg>
      <span className="logo-text">{brand.name}</span>
    </span>
  );
}
