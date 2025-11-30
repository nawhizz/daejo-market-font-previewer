import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getMemos } from "@/actions/get-memos";

export const dynamic = 'force-dynamic';

export default async function SavedMemos() {
    let savedMemos: any[] = [];
    let error = null;

    try {
        savedMemos = await getMemos();
    } catch (e) {
        console.error("Failed to load memos:", e);
        error = "메모를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.";
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-destructive text-lg font-semibold">{error}</p>
                    <Link href="/">
                        <Button variant="outline">홈으로 돌아가기</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F3F3F3] relative">
            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
                {savedMemos.length === 0 ? (
                    <div className="text-center py-32" data-testid="container-no-memos">
                        <p className="text-muted-foreground text-lg mb-6">
                            아직 저장된 메모가 없습니다.
                        </p>
                        <Link href="/">
                            <Button data-testid="button-create-memo">
                                첫 메모 만들기
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3" data-testid="container-saved-memos">
                        {savedMemos.map((memo) => {
                            const styles = memo.styles as any;
                            // Use saved font size but ensure it's readable in the grid
                            const safeFontSize = parseInt(styles.fontSize) || 24;
                            // Clamp font size for the card view to prevent overflow issues
                            const clampedFontSize = Math.min(Math.max(safeFontSize, 16), 32);

                            const safeFontWeight = styles.fontWeight === "bold" ? "bold" : "normal";
                            const safeFontStyle = styles.fontStyle === "italic" ? "italic" : "normal";
                            const safeLineHeight = typeof styles.lineHeight === "number"
                                ? Math.min(Math.max(styles.lineHeight, 0.8), 2.0)
                                : 1.5;
                            const safeLetterSpacing = /^-?[0-9]*\.?[0-9]+em$/.test(styles.letterSpacing)
                                ? styles.letterSpacing
                                : "0em";

                            return (
                                <Card
                                    key={memo.id}
                                    className="p-8 shadow-md border-none rounded-none min-h-[300px] flex flex-col transition-transform hover:-translate-y-1 duration-200"
                                    style={{ backgroundColor: "#FFFFFF" }}
                                    data-testid={`card-memo-${memo.id}`}
                                >
                                    <div
                                        className="font-display break-words flex-1 whitespace-pre-wrap"
                                        style={{
                                            color: "#212121",
                                            fontSize: `${clampedFontSize}px`,
                                            fontWeight: safeFontWeight,
                                            fontStyle: safeFontStyle,
                                            lineHeight: safeLineHeight,
                                            letterSpacing: safeLetterSpacing,
                                        }}
                                        data-testid={`text-memo-content-${memo.id}`}
                                    >
                                        {memo.content}
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Fixed Floating Button */}
            <Link
                href="/"
                className="fixed bottom-8 right-8 z-50 transition-transform hover:scale-105 active:scale-95"
            >
                <Image
                    src="/images/first-button.png"
                    alt="처음으로"
                    width={100}
                    height={100}
                    className="w-auto h-12 md:h-14 object-contain drop-shadow-md"
                />
            </Link>
        </div>
    );
}
