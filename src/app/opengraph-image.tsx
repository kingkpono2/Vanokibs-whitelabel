import { ImageResponse } from 'next/og';
import { brand } from '@/content/brand';

export const alt = `${brand.name}: technology team on demand for Canadian businesses`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: '#0a1024', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 10, background: '#1f4e8c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800 }}>V</div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>{brand.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 62, fontWeight: 600, lineHeight: 1.12 }}>IT, software and cloud services for Canadian businesses</div>
          
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#9fb4d6' }}>Monthly plans · Fixed-price projects · Hourly · Prices in CAD</div>
      </div>
    ),
    size,
  );
}
