import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Memo } from "@shared/schema";

export default function SavedMemos() {
  const { data: savedMemos = [], isLoading } = useQuery<Memo[]>({
    queryKey: ["/api/memos"],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 h-4" />
              폰트 체험하기
            </Button>
          </Link>
          <h1 className="text-2xl font-display font-bold text-foreground" data-testid="text-page-title">
            저장된 메모
          </h1>
          <div className="w-[120px]" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-8 py-12">
        {isLoading ? (
          <div className="text-center text-muted-foreground text-lg" data-testid="text-loading-memos">
            불러오는 중...
          </div>
        ) : savedMemos.length === 0 ? (
          <div className="text-center py-16" data-testid="container-no-memos">
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="container-saved-memos">
            {savedMemos.map((memo) => {
              const safeFontSize = parseInt(memo.styles.fontSize) || 32;
              const clampedFontSize = Math.min(Math.max(safeFontSize, 16), 72);
              const safeFontWeight = memo.styles.fontWeight === "bold" ? "bold" : "normal";
              const safeFontStyle = memo.styles.fontStyle === "italic" ? "italic" : "normal";
              const safeColor = /^#[0-9A-Fa-f]{6}$/.test(memo.styles.color) 
                ? memo.styles.color 
                : "#2C1810";
              const safeBgColor = /^#[0-9A-Fa-f]{6}$/.test(memo.bgColor)
                ? memo.bgColor
                : "#FFF8E1";

              return (
                <Card
                  key={memo.id}
                  className="p-6 shadow-lg min-h-[200px] flex flex-col"
                  style={{ backgroundColor: safeBgColor }}
                  data-testid={`card-memo-${memo.id}`}
                >
                  <div
                    className="font-display leading-relaxed break-words flex-1"
                    style={{
                      color: safeColor,
                      fontSize: `${clampedFontSize}px`,
                      fontWeight: safeFontWeight,
                      fontStyle: safeFontStyle,
                    }}
                    data-testid={`text-memo-content-${memo.id}`}
                  >
                    {memo.content}
                  </div>
                  <div className="mt-4 pt-4 border-t border-muted text-xs text-muted-foreground">
                    {new Date(memo.createdAt).toLocaleString("ko-KR")}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border mt-12">
        <p>© 2025 대조시장 폰트 체험. 따뜻한 시장의 감성을 담았습니다.</p>
      </footer>
    </div>
  );
}
