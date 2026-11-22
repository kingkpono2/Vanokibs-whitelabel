/** Simple "V" mark and wordmark. White-label: replace the mark or the name in brand.ts. */
export function Logo({ name, light = false }: { name: string; light?: boolean }) {
  return (
    <span className={`logo${light ? ' logo--light' : ''}`}>
      <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="6" fill={light ? '#fff' : '#1f4e8c'} />
        <text x="20" y="27.5" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="21" fontWeight="700" fill={light ? '#1f4e8c' : '#fff'}>{name.trim().charAt(0).toUpperCase()}</text>
      </svg>
      <span className="logo-text">{name}</span>
    </span>
  );
}
