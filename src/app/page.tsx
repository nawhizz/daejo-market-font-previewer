import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/images/home-banner.svg"
        alt="대조시장체 폰트 체험하기"
        fill
        className="object-cover"
        priority
      />
      <Link
        href="/experience"
        className="absolute top-[54%] left-1/2 -translate-x-1/2 z-10 w-[25vw] transition-transform hover:scale-105 active:scale-95"
        aria-label="은평대조어울림체 체험하기"
      >
        <Image
          src="/images/home-cta.svg"
          alt="은평대조어울림체 체험하기"
          width={320}
          height={85}
          className="h-auto w-full"
          priority
        />
      </Link>
    </main>
  );
}
