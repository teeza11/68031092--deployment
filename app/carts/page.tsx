"use client";

import Image from "next/image";
import { useContext } from "react";
import { globalDataContext } from "../layout";

export default function Page() {
  const data = useContext(globalDataContext);

  if (!data) return null;

  const { carts, setCarts, setProducts } = data;
  const totalPrice = carts.reduce((total, product) => total + product.price, 0);

  return (
    <div className="mx-auto mt-4 max-h-[70vh] max-w-6xl overflow-y-auto rounded-xl border border-sky-200 bg-cyan-50 p-3">
      {carts.length === 0 ? (
        <p className="py-12 text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {carts.map((product, index) => (
            <article
              key={`${product.id}-${index}`}
              className="overflow-hidden rounded-xl border border-red-400 bg-white"
            >
              <div className="relative aspect-square">
                <Image
                  src={product.thumbnailUrl}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover"
                />
                <span className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
                  ${product.price.toFixed(2)}
                </span>
                <p className="absolute inset-x-0 bottom-0 line-clamp-2 bg-black/65 p-1 text-xs text-white">
                  {product.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCarts((currentCarts) =>
                    currentCarts.filter((_, cartIndex) => cartIndex !== index),
                  );
                  setProducts((currentProducts) =>
                    currentProducts.some(
                      (currentProduct) => currentProduct.id === product.id,
                    )
                      ? currentProducts
                      : [...currentProducts, product],
                  );
                }}
                className="w-full bg-red-50 px-2 py-2 text-sm text-red-700 hover:bg-red-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      )}
      <div className="sticky bottom-0 mt-3 flex justify-center gap-3 bg-cyan-50 py-2">
        <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-semibold text-white">
          Count: {carts.length} items
        </span>
        <span className="rounded-full bg-rose-500 px-3 py-1 text-sm font-semibold text-white">
          Price: ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
