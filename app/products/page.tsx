"use client";

import Image from "next/image";
import { useContext } from "react";
import { globalDataContext } from "../layout";

export default function Page() {
  const data = useContext(globalDataContext);

  if (!data) return null;

  const { products, setProducts, setCarts } = data;

  return (
    <div className="mx-auto mt-4 max-h-[70vh] max-w-6xl overflow-y-auto rounded-xl border border-sky-200 bg-cyan-50 p-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-xl border border-emerald-400 bg-white"
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
                setProducts((currentProducts) =>
                  currentProducts.filter(
                    (currentProduct) => currentProduct.id !== product.id,
                  ),
                );
                setCarts((currentCarts) => [...currentCarts, product]);
              }}
              className="w-full bg-emerald-50 px-2 py-2 text-sm text-emerald-700 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
            >
              Add to Carts
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
