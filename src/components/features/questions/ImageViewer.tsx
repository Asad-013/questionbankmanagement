"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    X,
    Download,
    ChevronLeft,
    ChevronRight,
    RotateCw,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Share2,
} from "lucide-react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageViewerProps {
    images: string[];
    initialIndex?: number;
    title?: string;
    subtitle?: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ImageViewer({
    images,
    initialIndex = 0,
    title,
    subtitle,
    isOpen,
    onClose,
}: ImageViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        setCurrentIndex(initialIndex);
        setRotation(0);
    }, [initialIndex, isOpen]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen) return;
            switch (e.key) {
                case "Escape":
                    onClose();
                    break;
                case "ArrowLeft":
                    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                    break;
                case "ArrowRight":
                    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                    break;
                case "r":
                case "R":
                    setRotation((prev) => prev + 90);
                    break;
            }
        },
        [isOpen, images.length, onClose]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleDownload = async () => {
        const url = images[currentIndex];
        if (!url) return;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `question-paper-${currentIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch {
            window.open(url, "_blank");
        }
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success("Link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link");
        }
    };

    const handleResetZoom = () => {
        setRotation(0);
    };

    if (!isOpen) return null;

    const hasMultiple = images.length > 1;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
        >
            {/* Top toolbar */}
            <div className="absolute top-0 left-0 right-0 z-[101] flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                    {title && (
                        <span className="text-white font-semibold text-sm truncate max-w-[200px]">
                            {title}
                        </span>
                    )}
                    {subtitle && (
                        <span className="text-white/60 text-xs">{subtitle}</span>
                    )}
                    {hasMultiple && (
                        <span className="text-white/60 text-xs bg-white/10 rounded-full px-3 py-1">
                            {currentIndex + 1} / {images.length}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => setRotation((r) => r - 90)}
                        title="Rotate left"
                    >
                        <RotateCw className="h-4 w-4 -scale-x-100" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => setRotation((r) => r + 90)}
                        title="Rotate right"
                    >
                        <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
                        onClick={handleResetZoom}
                        title="Reset rotation"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>

                    <div className="w-px h-5 bg-white/20 mx-1" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
                        onClick={handleShare}
                        title="Share"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
                        onClick={handleDownload}
                        title="Download"
                    >
                        <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white/70 hover:text-white hover:bg-red-500/80"
                        onClick={onClose}
                        title="Close (Esc)"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Navigation arrows */}
            {hasMultiple && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-[101] rounded-full h-12 w-12 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() =>
                            setCurrentIndex((prev) =>
                                prev > 0 ? prev - 1 : images.length - 1
                            )
                        }
                    >
                        <ChevronLeft className="h-7 w-7" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-[101] rounded-full h-12 w-12 text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() =>
                            setCurrentIndex((prev) =>
                                prev < images.length - 1 ? prev + 1 : 0
                            )
                        }
                    >
                        <ChevronRight className="h-7 w-7" />
                    </Button>
                </>
            )}

            {/* Main image area with zoom */}
            <div
                className="relative w-full h-full flex items-center justify-center p-16"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <div
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="transition-transform duration-300 ease-out max-w-full max-h-full"
                >
                    <Zoom>
                        <img
                            src={images[currentIndex]}
                            alt={`Question paper ${currentIndex + 1}`}
                            className="max-w-[85vw] max-h-[85vh] object-contain rounded-lg shadow-2xl cursor-zoom-in"
                            draggable={false}
                        />
                    </Zoom>
                </div>
            </div>

            {/* Bottom thumbnail strip */}
            {hasMultiple && (
                <div className="absolute bottom-0 left-0 right-0 z-[101] flex items-center justify-center gap-2 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2 overflow-x-auto max-w-[80vw] pb-1 scrollbar-hide">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={cn(
                                    "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                                    currentIndex === idx
                                        ? "border-primary shadow-lg shadow-primary/30 scale-110"
                                        : "border-white/20 opacity-50 hover:opacity-80"
                                )}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Keyboard hints */}
            <div className="absolute bottom-4 right-4 z-[101] flex items-center gap-3 text-white/30 text-xs">
                {hasMultiple && (
                    <>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">←</kbd>
                            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">→</kbd>
                            Navigate
                        </span>
                    </>
                )}
                <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">R</kbd>
                    Rotate
                </span>
                <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px]">Esc</kbd>
                    Close
                </span>
            </div>
        </div>
    );
}
