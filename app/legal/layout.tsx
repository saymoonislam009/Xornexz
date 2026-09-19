import Link from "next/link";
;
import { FileText, Shield, Cookie } from "lucide-react";
;

const legalLinks = [
  {
    name: "Privacy Policy",
    href: "/legal/privacy",
    icon: Shield,
  },
  {
    name: "Terms of Service",
    href: "/legal/terms",
    icon: FileText,
  },
  {
    name: "Cookie Policy",
    href: "/legal/cookies",
    icon: Cookie,
  },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold tracking-tight mb-6">Legal</h2>
            <nav className="flex flex-col space-y-2">
              {legalLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground text-muted-foreground"
                  >
                    <Icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 prose prose-slate dark:prose-invert max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
