import { platformGroups, logoFor } from '@/content/platforms';

export function PlatformGrid() {
  return (
    <div className="platforms">
      {platformGroups.map((g) => (
        <div key={g.title} className="platforms__group">
          <h3>{g.title}</h3>
          <ul>
            {g.items.map((p) => (
              <li key={p.name}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/logos/${p.logo}.svg`} alt="" width={28} height={28} loading="lazy" />
                <span>{p.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Technology chips, with the platform logo when we have one. */
export function StackChips({ items }: { items: string[] }) {
  return (
    <ul className="chips">
      {items.map((t) => {
        const logo = logoFor(t);
        return (
          <li key={t}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo && <img src={`/logos/${logo}.svg`} alt="" width={18} height={18} loading="lazy" />}
            {t}
          </li>
        );
      })}
    </ul>
  );
}
