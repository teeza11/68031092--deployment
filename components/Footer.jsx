"use client";

import { Facebook } from "@tailgrids/icons";
import { Badge } from "./tailgrids/core/badge";
import Link from "next/link";

export default function Footer() {
  return (
    <>

    {/* footer contenter */}
    <div className="text-center">
    {/* // student */}
    <div>

        <Badge className="rounded-2 bg-blue-200 px-2 py-0.5 text-xl text-black">68031092 ธนโชติ แก้วชูฟอง</Badge>
        
        </div>
    {/* // contact */}
    <div>
     
      <div className="mt-2 flex justify-center gap-4">
        <Link href="https://web.facebook.com/share/p/1KZtsJkS3b/" target="_blank" rel="noreferrer" aria-label="Facebook">
          <Facebook className="text-blue-700" />
        </Link>
        <div className="border-l" />
        <Link href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube">
          <span className="inline-flex size-5 items-center justify-center rounded bg-red-600 text-[10px] text-white">▶</span>
        </Link>
      </div>
    </div>

    </div>
    </>
  );
}
