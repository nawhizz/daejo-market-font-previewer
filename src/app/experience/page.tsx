'use client';

import { useState, useRef, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Type, Palette, Plus, Minus, Bold, Italic, RotateCcw, BookOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveMemo } from "@/actions/save-memo";
import Image from "next/image";

const PRESET_COLORS = [
    { name: "검정", value: "#212121" },
    { name: "진한 갈색", value: "#5D4037" },
    { name: "빨강", value: "#D32F2F" },
    { name: "주황", value: "#F57C00" },
    { name: "노랑", value: "#FBC02D" },
    { name: "초록", value: "#388E3C" },
    { name: "파랑", value: "#1976D2" },
];

const PRESET_BG_COLORS = [
    { name: "흰색", value: "#FFFFFF" },
    { name: "복숭아", value: "#FFE0B2" },
    { name: "살구", value: "#FFCCBC" },
    { name: "연한 노랑", value: "#FFFDE7" },
    { name: "연한 주황", value: "#FFF3E0" },
    { name: "하늘", value: "#E3F2FD" },
    { name: "민트", value: "#E0F2F1" },
];

export default function ExperiencePage() {
    const editorRef = useRef<HTMLDivElement>(null);
    const [content, setContent] = useState("");
    const [isControlsVisible, setIsControlsVisible] = useState(false);
    const [fontSize, setFontSize] = useState(56);
    const [fontColor, setFontColor] = useState("#212121");
    const [bgColor, setBgColor] = useState("#FFFFFF");
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [lineHeight, setLineHeight] = useState(1.5);
    const [letterSpacing, setLetterSpacing] = useState(0);
    const [authorName, setAuthorName] = useState("");

    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
                e.preventDefault();
                setIsControlsVisible(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                router.push("/");
            }, 20000); // 20 seconds
        };

        // Initial timer start
        resetTimer();

        // Event listeners for user activity
        const events = [
            "mousedown",
            "mousemove",
            "keypress",
            "scroll",
            "touchstart",
            "click",
        ];

        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        return () => {
            clearTimeout(timeoutId);
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [router]);

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

        const memoData = {
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
            authorName,
        };

        startTransition(async () => {
            const formData = new FormData();
            formData.append("content", memoData.content);
            formData.append("styles", JSON.stringify(memoData.styles));
            formData.append("bgColor", memoData.bgColor);
            formData.append("authorName", memoData.authorName);

            const result = await saveMemo(formData);
            if (result.success) {
                toast({
                    title: "저장되었습니다!",
                    description: "메모가 성공적으로 저장되었습니다.",
                    duration: 1600,
                });

                // 저장 성공 후 에디터 내용 및 상태 초기화
                if (editorRef.current) {
                    editorRef.current.innerText = "";
                }
                setContent("");
                setFontSize(56);
                setFontColor("#212121");
                setBgColor("#FFFFFF");
                setIsBold(false);
                setIsItalic(false);
                setLineHeight(1.5);
                setLetterSpacing(0);
                setAuthorName("");
            } else {
                toast({
                    title: "저장 실패",
                    description: result.error || "메모 저장 중 오류가 발생했습니다.",
                    variant: "destructive",
                    duration: 3000,
                });
            }
        });
    };

    const increaseFontSize = () => {
        if (fontSize < 72) setFontSize(fontSize + 4);
    };

    const decreaseFontSize = () => {
        if (fontSize > 16) setFontSize(fontSize - 4);
    };

    return (
        <div className="h-screen bg-white flex overflow-hidden">
            {/* Left Sidebar - Controls */}
            {isControlsVisible && (
                <aside className="w-80 flex-shrink-0 border-r border-border bg-card flex flex-col overflow-hidden z-20">
                    {/* Header */}
                    <div className="flex-shrink-0 p-6 border-b border-border">
                        <Link href="/">
                            <h1
                                className="text-2xl font-display font-bold text-primary cursor-pointer hover:opacity-80 transition-opacity"
                                data-testid="text-page-title"
                            >
                                대조시장체
                            </h1>
                        </Link>
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
                                            className={`w-12 h-12 rounded-lg transition-all ${bgColor === color.value
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
                                            className={`w-12 h-12 rounded-lg transition-all border-2 border-border ${fontColor === color.value
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
                        </div>
                    </div>

                </aside>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden min-h-0 relative bg-white">
                {/* Top Banner */}
                <div className="flex-shrink-0 w-full pt-4 pr-8 pb-0 pl-8">
                    <Image
                        src="/images/daejo-font-image.png"
                        alt="대조시장체"
                        width={1920}
                        height={100}
                        className="w-full h-auto object-contain"
                        priority
                    />
                </div>

                {/* Editor Container */}
                <div className="flex-1 pt-4 px-4 pb-0 md:pt-6 md:px-6 md:pb-0 flex flex-col min-h-0">
                    <div
                        className="flex-1 rounded-[30px] border border-[#E9E9E9] shadow-sm transition-colors duration-200 flex flex-col p-8 md:p-12 relative"
                        style={{ backgroundColor: bgColor }}
                    >
                        <div className="flex-1 relative min-h-0 w-full">
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
                                data-placeholder="은평대조어울림체를 타이핑해보세요. . ."
                                className="outline-none absolute inset-0 font-display text-left whitespace-pre-wrap overflow-y-auto custom-scrollbar pr-2"
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

                        {/* Author Name Input */}
                        {/* Author Name Input */}
                        <div className="absolute bottom-8 right-8 flex items-center gap-6 bg-white/50 px-8 py-4 rounded-full backdrop-blur-sm transition-opacity hover:bg-white/80">
                            <span className="text-gray-500 font-display text-[36px] leading-none pt-2">From.</span>
                            <input
                                type="text"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="작성자 이름"
                                className="bg-transparent border-none text-gray-500 font-display placeholder:text-muted-foreground/60 focus:outline-none w-[300px] text-[36px] leading-none pt-2"
                                maxLength={20}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex-shrink-0 p-4 md:p-6 flex justify-between items-center bg-white">
                    {/* Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="transition-transform hover:scale-105 active:scale-95"
                        aria-label="뒤로 가기"
                    >
                        <Image
                            src="/images/back-button.png"
                            alt="뒤로 가기"
                            width={48}
                            height={48}
                            className="w-12 h-12 object-contain"
                        />
                    </button>

                    {/* Right Buttons */}
                    <div className="flex gap-3">
                        <Link href="/saved-memos">
                            <div className="transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                                <Image
                                    src="/images/memo-button.png"
                                    alt="메모 보기"
                                    width={100}
                                    height={48}
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                        </Link>
                        <button
                            onClick={handleSave}
                            disabled={isPending}
                            className="transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Image
                                src="/images/save-button.png"
                                alt="저장하기"
                                width={100}
                                height={48}
                                className="h-12 w-auto object-contain"
                            />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
