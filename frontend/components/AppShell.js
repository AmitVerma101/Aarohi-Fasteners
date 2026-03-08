'use client';

import ClientEffects from './ClientEffects';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

export default function AppShell({ children }) {
  return (
    <>
      <SiteHeader />
      <div className="page-content">{children}</div>
      <SiteFooter />
      <ClientEffects />
    </>
  );
}
