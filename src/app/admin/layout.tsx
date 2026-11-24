/** Admin chrome lives in AdminApp (top bar with account menu and sign out, sidebar navigation). */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main id="main" className="adm-root">{children}</main>;
}
