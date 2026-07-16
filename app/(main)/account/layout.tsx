import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "My Account",
    template: "%s | SM CO.",
  },
  description: "Manage your account, view orders, and update settings at SM CO.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
