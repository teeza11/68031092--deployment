"use client";

import "./globals.css";

import Link from "next/link";
import { createContext, useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button, buttonStyles } from "@/components/tailgrids/core/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/tailgrids/core/badge";
import { products as initialProducts, type Product } from "@/data/products";
import { doLogout } from "@/utils/login";
import LoginDialog from "@/components/LoginDialog";

function subscribeToCredential(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("credential-change", onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("credential-change", onChange);
  };
}

function getCredentialSnapshot() {
  return window.localStorage.getItem("credential");
}

function getServerCredentialSnapshot() {
  return null;
}

function hasValidCredential(credentialString: string | null) {
  if (!credentialString) return false;

  try {
    const credential = JSON.parse(credentialString);
    return Boolean(
      credential?.token &&
        credential?.email &&
        credential?.name &&
        credential?.role
    );
  } catch {
    return false;
  }
}

export const globalDataContext = createContext<{
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  carts: Product[];
  setCarts: React.Dispatch<React.SetStateAction<Product[]>>;
} | null>(null);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const credentialString = useSyncExternalStore(
    subscribeToCredential,
    getCredentialSnapshot,
    getServerCredentialSnapshot
  );
  const isAuthenticated = hasValidCredential(credentialString);
  const shouldShowLogin = !isAuthenticated && pathname !== "/login";
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [carts, setCarts] = useState<Product[]>([]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      localStorage.setItem("returnPath", pathname);
    }
  }, [isAuthenticated, pathname]);

  useEffect(() => {
    console.log("carts updated:", carts);
  }, [carts]);

const handleLogout = () => {
    doLogout(router, '/login');
  }
  const navLinkClass = (href: string) =>
    buttonStyles({
      appearance: pathname === href ? "fill" : "outline",
      variant: "primary",
      size: "xs",
      className: "h-8 gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[11px]",
    });

  return (
    <globalDataContext.Provider value={{ products, setProducts, carts, setCarts }}>
    <html>
      <body>
        <div
          className={!isAuthenticated ? "pointer-events-none select-none blur-sm" : undefined}
          aria-hidden={!isAuthenticated || undefined}
        >
        <Header />

        <nav className="flex flex-wrap justify-center gap-1 mt-2">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>

          <Link href="/animation" className={navLinkClass("/animation")}>
            Animation
          </Link>

          <Link href="/calculator" className={navLinkClass("/calculator")}>
            Calculator
          </Link>

          <Link href="/todos" className={navLinkClass("/todos")}>
            Todos
          </Link>

          <Link href="/products" className={navLinkClass("/products")}>
            Products({products.length})
          </Link>

          <div className="relative">
            <Link href="/carts" className={navLinkClass("/carts")}>
              Carts
            </Link>
            <Badge
              size={"sm"}
              className="absolute -top-2 -right-2 bg-red-500 text-white"
            >
              {carts.length}
            </Badge>
          </div>



<Button
            appearance='outline'
            variant='danger'
            size='xs'
            className='ml-1 h-8 gap-1 whitespace-nowrap rounded-md px-2 py-1 text-[11px]'
            onPress={handleLogout}
          >Logout</Button>

        </nav>

        <main>{children}</main>
        <Footer />
        </div>
        {!isAuthenticated && (
          <div className="pointer-events-none fixed inset-0 bg-black/50" aria-hidden="true" />
        )}
        {shouldShowLogin && <LoginDialog />}
      </body>
    </html>
    </globalDataContext.Provider>
  );
}
