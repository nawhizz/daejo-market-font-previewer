import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/images/home-banner.png"
        alt="대조시장체 폰트 체험하기"
        fill
        className="object-cover"
        priority
      />
      <Link
        href="/experience"
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label="폰트 체험하기"
      >
        <span className="sr-only">폰트 체험하기</span>
      </Link>
    </main>
  );
}
