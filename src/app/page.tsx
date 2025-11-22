import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#cf302b] flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl aspect-[16/9]">
        <Image
          src="/images/home-banner.png"
          alt="대조시장체 폰트 체험하기"
          fill
          className="object-contain"
          priority
        />
        <Link
          href="/experience"
          className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[30%] h-[12%] cursor-pointer hover:bg-white/10 rounded-full transition-colors"
          aria-label="폰트 체험하기"
        >
          <span className="sr-only">폰트 체험하기</span>
        </Link>
      </div>
    </main>
  );
}
