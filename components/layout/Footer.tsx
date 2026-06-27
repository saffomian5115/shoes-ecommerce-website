import Link from "next/link";

const footerLinks = {
  Shop: [
    { href: "/shop", label: "All Products" },
    { href: "/shop?category=running", label: "Running" },
    { href: "/shop?category=casual", label: "Casual" },
    { href: "/shop?category=sports", label: "Sports" },
    { href: "/shop?category=sneakers", label: "Sneakers" },
  ],
  Support: [
    { href: "#", label: "Contact Us" },
    { href: "#", label: "FAQs" },
    { href: "#", label: "Shipping" },
    { href: "#", label: "Returns" },
    { href: "#", label: "Size Guide" },
  ],
  Company: [
    { href: "#", label: "About Us" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Press" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold tracking-tight">SM</span>
              <span className="text-xl font-light tracking-tight text-primary">CO.</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium footwear for every step of your journey. Quality, comfort, and style — all in one place.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SM CO. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Follow us</span>
            <div className="flex gap-3">
              {["Instagram", "Twitter", "Facebook"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
