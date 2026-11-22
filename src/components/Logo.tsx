import { brand } from '@/content/brand';

/** Simple "V" mark and wordmark. White-label: replace the mark or the name in brand.ts. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`logo${light ? ' logo--light' : ''}`}>
      <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="6" fill={light ? '#fff' : '#1f4e8c'} />
        <path d="M11 11l9 18 9-18" fill="none" stroke={light ? '#1f4e8c' : '#fff'} strokeWidth="3.4" strokeLinejoin="round" />
      </svg>
      <span className="logo-text">{brand.name}</span>
    </span>
  );
}
