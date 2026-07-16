import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "@/components/ui/scroll-reveal";
import {
  User,
  Package,
  Heart,
  Settings,
  MapPin,
  CreditCard,
  LogOut,
} from "lucide-react";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const user = session.user;

  return (
    <FadeIn>
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-bold">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {user.name}
            </h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* My Orders */}
        <Link
          href="/account/orders"
          className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-md hover:border-border transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">My Orders</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            View and track your order history
          </p>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-md hover:border-border transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Heart className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">Wishlist</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Items you&apos;ve saved for later
          </p>
        </Link>

        {/* Addresses */}
        <Link
          href="/account/addresses"
          className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-md hover:border-border transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">Addresses</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your shipping addresses
          </p>
        </Link>

        {/* Payment Methods */}
        <Link
          href="/account/payment"
          className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-md hover:border-border transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">Payment Methods</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage your saved payment methods
          </p>
        </Link>

        {/* Account Settings */}
        <Link
          href="/account/settings"
          className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-md hover:border-border transition-all duration-200"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Settings className="h-5 w-5" />
            </div>
            <h2 className="font-semibold">Account Settings</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Update your profile and preferences
          </p>
        </Link>

        {/* Sign Out */}
        <form
          action={async () => {
            "use server";
            const { signOut } = await import("@/auth");
            await signOut({ redirectTo: "/" });
          }}
          className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-md hover:border-destructive/30 hover:bg-destructive/5 transition-all duration-200"
        >
          <button type="submit" className="w-full text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <LogOut className="h-5 w-5" />
              </div>
              <h2 className="font-semibold">Sign Out</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Sign out of your account
            </p>
          </button>
        </form>
      </div>
    </div>
    </FadeIn>
  );
}
