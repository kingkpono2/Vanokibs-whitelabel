import { ImageResponse } from 'next/og';
import { brand } from '@/content/brand';

export const alt = `${brand.name}: technology team on demand for Canadian businesses`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg, #0a1024 0%, #13204a 60%, #0d3b4a 100%)', color: '#fff', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #4f7cff, #13c2a3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800 }}>V</div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>{brand.name}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Your senior tech team, on demand.</div>
          <div style={{ fontSize: 30, marginTop: 24, color: '#b8c6ff' }}>IT support · Software · DevOps · Ecommerce · ERP · Cloud email</div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#4ee6c8' }}>Subscriptions · Fixed projects · On-demand hours · Across Canada (CAD)</div>
      </div>
    ),
    size,
  );
}
