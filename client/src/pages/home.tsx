import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Type, Palette, Plus, Minus, Bold, Italic, Paintbrush, Save, Heart, BookOpen, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import type { InsertMemo } from "@shared/schema";

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
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState("#2C1810");
  const [bgColor, setBgColor] = useState("#FFF8E1");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  
  const { toast } = useToast();

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
    const actualContent = editorRef.current?.innerText || "";
    setContent(actualContent);
    
    if (!actualContent.trim()) {
      toast({
        title: "내용을 입력해주세요",
        description: "메모 내용이 비어있습니다.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const memo: InsertMemo = {
      content: actualContent.trim(),
      styles: {
        color: fontColor,
        fontSize: `${fontSize}px`,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
        lineHeight,
        letterSpacing: `${letterSpacing}em`,
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

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.textContent = "";
    }
    setContent("");
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Left Sidebar - Controls */}
      <aside className="w-80 flex-shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-border">
          <h1 
            className="text-2xl font-display font-bold text-primary"
            data-testid="text-page-title"
          >
            대조시장체
          </h1>
          <p className="text-sm text-muted-foreground mt-1">폰트 체험하기</p>
        </div>

        {/* Controls */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
          <div className="space-y-6">
            {/* Background Color Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <label className="text-sm font-semibold">배경 색상</label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_BG_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBgColor(color.value)}
                    className={`w-12 h-12 rounded-lg transition-all ${
                      bgColor === color.value
                        ? "ring-2 ring-primary ring-offset-1"
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
                <label className="text-sm font-semibold">글자 색상</label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFontColor(color.value)}
                    className={`w-12 h-12 rounded-lg transition-all border-2 border-border ${
                      fontColor === color.value
                        ? "ring-2 ring-primary ring-offset-1"
                        : "hover-elevate"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    data-testid={`button-fontcolor-${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">글자 크기</label>
              <div className="flex items-center gap-2 justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 16}
                  className="w-11 h-11"
                  data-testid="button-decrease-fontsize"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span 
                  className="text-base font-semibold"
                  data-testid="text-fontsize-value"
                >
                  {fontSize}px
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 72}
                  className="w-11 h-11"
                  data-testid="button-increase-fontsize"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Bold & Italic */}
            <div className="space-y-3">
              <label className="text-sm font-semibold">스타일</label>
              <div className="flex gap-2">
                <Button
                  variant={isBold ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsBold(!isBold)}
                  className="flex-1 h-11"
                  data-testid="button-toggle-bold"
                >
                  <Bold className="w-4 h-4" />
                </Button>
                <Button
                  variant={isItalic ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsItalic(!isItalic)}
                  className="flex-1 h-11"
                  data-testid="button-toggle-italic"
                >
                  <Italic className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Line Height */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">줄간격</label>
                <span className="text-sm text-muted-foreground" data-testid="text-lineheight-value">
                  {lineHeight.toFixed(1)}
                </span>
              </div>
              <Slider
                value={[lineHeight]}
                onValueChange={(values) => setLineHeight(values[0])}
                min={0.8}
                max={2.0}
                step={0.1}
                className="w-full"
                data-testid="slider-lineheight"
              />
            </div>

            {/* Letter Spacing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">글자간격</label>
                <span className="text-sm text-muted-foreground" data-testid="text-letterspacing-value">
                  {letterSpacing.toFixed(2)}em
                </span>
              </div>
              <Slider
                value={[letterSpacing]}
                onValueChange={(values) => setLetterSpacing(values[0])}
                min={-0.05}
                max={0.5}
                step={0.01}
                className="w-full"
                data-testid="slider-letterspacing"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 p-6 border-t border-border space-y-3">
          <Button
            onClick={handleClear}
            variant="outline"
            className="w-full h-12 gap-2"
            data-testid="button-clear-memo"
          >
            <RotateCcw className="w-4 h-4" />
            전체 지우기
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMemo.isPending}
            className="w-full h-12"
            data-testid="button-save-memo"
          >
            {saveMemo.isPending ? "저장 중..." : "저장하기"}
          </Button>
          <Link href="/saved-memos" className="block">
            <Button
              variant="outline"
              className="w-full h-12 gap-2"
              data-testid="button-view-saved-memos"
            >
              <BookOpen className="w-4 h-4" />
              메모 보기
            </Button>
          </Link>
        </div>
      </aside>

      {/* Right Side - Editor */}
      <main className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div 
          className="flex-1 m-6 rounded-lg p-8 md:p-12 shadow-xl transition-colors duration-200 overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              const textContent = e.currentTarget.innerText || "";
              setContent(textContent);
            }}
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, text);
            }}
            data-placeholder="여기에 메시지를 입력해보세요..."
            className="outline-none w-full font-display text-center whitespace-pre-wrap"
            style={{
              color: fontColor,
              fontSize: `${fontSize}px`,
              fontWeight: isBold ? "bold" : "normal",
              fontStyle: isItalic ? "italic" : "normal",
              lineHeight,
              letterSpacing: `${letterSpacing}em`,
            }}
            data-testid="input-memo-content"
          />
        </div>
      </main>
    </div>
  );
}
