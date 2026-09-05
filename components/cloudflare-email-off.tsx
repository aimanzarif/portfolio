export function CloudflareEmailOff({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: "<!--email_off-->" }} />
      {children}
      <span dangerouslySetInnerHTML={{ __html: "<!--email_on-->" }} />
    </>
  );
}
