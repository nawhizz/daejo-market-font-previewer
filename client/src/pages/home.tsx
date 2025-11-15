import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Type, Palette, Plus, Minus, Bold, Italic, Paintbrush, Save, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { InsertMemo, Memo } from "@shared/schema";

const PRESET_COLORS = [
  { name: "검정", value: "#2C1810" },
  { name: "진한 갈색", value: "#5D4037" },
  { name: "빨강", value: "#D32F2F" },
  { name: "주황", value: "#F57C00" },
  { name: "노랑", value: "#FBC02D" },
  { name: "초록", value: "#388E3C" },
  { name: "파랑", value: "#1976D2" },
];

const PRESET_BG_COLORS = [
  { name: "크림", value: "#FFF8E1" },
  { name: "복숭아", value: "#FFE0B2" },
  { name: "살구", value: "#FFCCBC" },
  { name: "연한 노랑", value: "#FFFDE7" },
  { name: "연한 주황", value: "#FFF3E0" },
  { name: "하늘", value: "#E3F2FD" },
  { name: "민트", value: "#E0F2F1" },
];

export default function Home() {
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState("#2C1810");
  const [bgColor, setBgColor] = useState("#FFF8E1");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  
  const { toast } = useToast();

  // Fetch saved memos
  const { data: savedMemos = [], isLoading: isLoadingMemos } = useQuery<Memo[]>({
    queryKey: ["/api/memos"],
  });

  const saveMemo = useMutation({
    mutationFn: async (memo: InsertMemo) => {
      return await apiRequest("POST", "/api/memos", memo);
    },
    onSuccess: () => {
      toast({
        title: "저장되었습니다!",
        description: "메모가 성공적으로 저장되었습니다.",
        duration: 3000,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/memos"] });
    },
    onError: () => {
      toast({
        title: "저장 실패",
        description: "메모 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "내용을 입력해주세요",
        description: "메모 내용이 비어있습니다.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const memo: InsertMemo = {
      content: content.trim(),
      styles: {
        color: fontColor,
        fontSize: `${fontSize}px`,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
      },
      bgColor,
    };

    saveMemo.mutate(memo);
  };

  const increaseFontSize = () => {
    if (fontSize < 72) setFontSize(fontSize + 4);
  };

  const decreaseFontSize = () => {
    if (fontSize > 16) setFontSize(fontSize - 4);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Header Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-400 rounded-full blur-3xl" />
        </div>

        {/* Dark wash overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 dark:from-black/20 dark:to-black/30" />

        <div className="relative py-16 md:py-24 px-6 md:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 
              className="text-5xl md:text-7xl font-display font-bold text-primary dark:text-primary drop-shadow-sm"
              data-testid="text-page-title"
            >
              대조시장체, 지금 써보기
            </h1>
            <p className="text-xl md:text-2xl text-primary/80 dark:text-primary/90 font-medium drop-shadow-sm">
              대조시장의 따뜻한 감성을 담은 폰트로 나만의 메시지를 만들어보세요
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4 text-sm md:text-base text-primary/70 dark:text-primary/80">
              <span 
                className="px-4 py-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-full border border-primary/20 dark:border-primary/30 flex items-center gap-2"
                data-testid="badge-feature-customize"
              >
                <Paintbrush className="w-4 h-4" />
                자유로운 꾸미기
              </span>
              <span 
                className="px-4 py-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-full border border-primary/20 dark:border-primary/30 flex items-center gap-2"
                data-testid="badge-feature-save"
              >
                <Save className="w-4 h-4" />
                간편한 저장
              </span>
              <span 
                className="px-4 py-2 bg-white/60 dark:bg-white/10 backdrop-blur-sm rounded-full border border-primary/20 dark:border-primary/30 flex items-center gap-2"
                data-testid="badge-feature-warmth"
              >
                <Heart className="w-4 h-4" />
                시장의 따뜻함
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-16 px-6 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Style Toolbar */}
          <Card className="p-6 md:p-8 shadow-lg">
            <div className="space-y-6">
              {/* Background Color Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-muted-foreground" />
                  <label className="text-sm font-semibold text-card-foreground">
                    배경 색상
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_BG_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBgColor(color.value)}
                      className={`w-10 h-10 rounded-full transition-all ${
                        bgColor === color.value
                          ? "ring-4 ring-primary ring-offset-2"
                          : "hover-elevate"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      data-testid={`button-bgcolor-${color.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Font Color Section */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-muted-foreground" />
                  <label className="text-sm font-semibold text-card-foreground">
                    글자 색상
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setFontColor(color.value)}
                      className={`w-10 h-10 rounded-full transition-all border-2 border-border ${
                        fontColor === color.value
                          ? "ring-4 ring-primary ring-offset-2"
                          : "hover-elevate"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                      data-testid={`button-fontcolor-${color.name}`}
                    />
                  ))}
                </div>
              </div>

              {/* Font Controls */}
              <div className="flex flex-wrap gap-4">
                {/* Font Size */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-card-foreground">
                    글자 크기
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decreaseFontSize}
                      disabled={fontSize <= 16}
                      data-testid="button-decrease-fontsize"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span 
                      className="w-16 text-center font-semibold text-lg"
                      data-testid="text-fontsize-value"
                    >
                      {fontSize}px
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={increaseFontSize}
                      disabled={fontSize >= 72}
                      data-testid="button-increase-fontsize"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Bold Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-card-foreground">
                    굵게
                  </label>
                  <div>
                    <Button
                      variant={isBold ? "default" : "outline"}
                      size="icon"
                      onClick={() => setIsBold(!isBold)}
                      data-testid="button-toggle-bold"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Italic Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-card-foreground">
                    기울임
                  </label>
                  <div>
                    <Button
                      variant={isItalic ? "default" : "outline"}
                      size="icon"
                      onClick={() => setIsItalic(!isItalic)}
                      data-testid="button-toggle-italic"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Memo Editor */}
          <Card 
            className="p-8 md:p-12 shadow-xl min-h-[400px] transition-colors duration-200"
            style={{ backgroundColor: bgColor }}
          >
            <div
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const textContent = e.currentTarget.textContent || "";
                setContent(textContent);
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertText', false, text);
              }}
              data-placeholder="여기에 메시지를 입력해보세요..."
              className="outline-none min-h-[300px] font-display leading-relaxed"
              style={{
                color: fontColor,
                fontSize: `${fontSize}px`,
                fontWeight: isBold ? "bold" : "normal",
                fontStyle: isItalic ? "italic" : "normal",
              }}
              data-testid="input-memo-content"
            />
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={saveMemo.isPending}
              className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
              data-testid="button-save-memo"
            >
              {saveMemo.isPending ? "저장 중..." : "저장하기"}
            </Button>
          </div>
        </div>

        {/* Saved Memos Section */}
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
            저장된 메모
          </h2>

          {isLoadingMemos ? (
            <div className="text-center text-muted-foreground" data-testid="text-loading-memos">
              불러오는 중...
            </div>
          ) : savedMemos.length === 0 ? (
            <div className="text-center text-muted-foreground" data-testid="text-no-memos">
              아직 저장된 메모가 없습니다.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2" data-testid="container-saved-memos">
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
                    className="p-6 shadow-lg"
                    style={{ backgroundColor: safeBgColor }}
                    data-testid={`card-memo-${memo.id}`}
                  >
                    <div
                      className="font-display leading-relaxed break-words"
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
                    <div className="mt-4 text-xs text-muted-foreground">
                      {new Date(memo.createdAt).toLocaleString("ko-KR")}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        <p>© 2025 대조시장 폰트 체험. 따뜻한 시장의 감성을 담았습니다.</p>
      </footer>
    </div>
  );
}
