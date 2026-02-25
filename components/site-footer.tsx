const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M13.5 8.5V6.8c0-.8.2-1.3 1.3-1.3H16V2.2c-.6-.1-1.4-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.2H7v3.7h2.3V22h4.2v-9.8H16l.4-3.7h-2.9z" />
      </svg>
    )
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2.5A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h10a2.5 2.5 0 0 0 2.5-2.5V7A2.5 2.5 0 0 0 17 4.5H7zm5 3.2A4.3 4.3 0 1 1 7.7 12 4.3 4.3 0 0 1 12 7.7zm0 2.5a1.8 1.8 0 1 0 1.8 1.8 1.8 1.8 0 0 0-1.8-1.8zm4.8-3.1a1 1 0 1 0 1 1 1 1 0 0 0-1-1z" />
      </svg>
    )
  },
  {
    name: "Email",
    href: "mailto:thukha@example.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm9 7L3 7.5V17h18V7.5L12 12z" />
      </svg>
    )
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M14 3h3.2a4.9 4.9 0 0 0 3.8 3.4V10a8.4 8.4 0 0 1-3.8-.9v6.4a5.8 5.8 0 1 1-5.8-5.8c.3 0 .7 0 1 .1v3.2a2.6 2.6 0 1 0 1.6 2.4V3z" />
      </svg>
    )
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M4.9 3.5a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8zM3 9h3.8v12H3V9zm6.1 0h3.6v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.7 2.6 4.7 6V21h-3.8v-5.6c0-1.3 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9.1V9z" />
      </svg>
    )
  }
] as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-8 text-center text-white/85">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <span className="h-6 w-[2px] bg-white/75" />
        <div className="relative w-full rounded-2xl border border-white/35 bg-[#4f86f7] px-5 py-5 shadow-[0_20px_50px_rgba(8,12,28,0.5)] md:px-8">
          <span className="absolute left-1/2 top-[-10px] h-3 w-3 -translate-x-1/2 rounded-full border border-white/80 bg-white/35" />
          <span className="pointer-events-none absolute right-2 top-2 h-4 w-7 rotate-[18deg] rounded-full bg-gradient-to-r from-green-200/80 to-green-500/10" />
          <span className="pointer-events-none absolute right-5 top-5 h-3 w-6 rotate-[44deg] rounded-full bg-gradient-to-r from-green-200/70 to-green-500/10" />
          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.16),transparent_24%)]" />
          <div className="relative flex flex-col items-center justify-between gap-4 md:flex-row md:gap-6">
            <p className="text-sm text-white md:text-base">Developed by Thu Kha</p>
            <div className="flex items-center justify-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"}
              aria-label={link.name}
              className="focusable rounded-full border border-white/30 bg-white/10 p-2 text-white/90 transition hover:border-white/70 hover:bg-white/20 hover:text-white"
            >
              {link.icon}
            </a>
          ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
