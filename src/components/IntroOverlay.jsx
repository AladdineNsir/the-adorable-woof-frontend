import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function IntroOverlay({ exiting, onFinish }) {
  const videoRef = useRef(null);
  const onFinishRef = useRef(onFinish);
  const [muted, setMuted] = useState(false);
  onFinishRef.current = onFinish;

  useLayoutEffect(() => {
    const bodyStyle = document.body.style;
    const documentStyle = document.documentElement.style;
    const originalBodyStyles = {
      position: bodyStyle.position,
      top: bodyStyle.top,
      left: bodyStyle.left,
      right: bodyStyle.right,
      width: bodyStyle.width,
      overflow: bodyStyle.overflow,
      paddingRight: bodyStyle.paddingRight,
    };
    const originalDocumentStyles = {
      overflow: documentStyle.overflow,
      scrollBehavior: documentStyle.scrollBehavior,
    };
    window.history.scrollRestoration = "manual";
    documentStyle.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const bodyPaddingRight = Number.parseFloat(
      window.getComputedStyle(document.body).paddingRight
    ) || 0;

    bodyStyle.position = "fixed";
    bodyStyle.top = "0";
    bodyStyle.left = "0";
    bodyStyle.right = "0";
    bodyStyle.width = "100%";
    bodyStyle.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`;
    bodyStyle.overflow = "hidden";
    documentStyle.overflow = "hidden";

    return () => {
      Object.assign(bodyStyle, originalBodyStyles);
      Object.assign(documentStyle, originalDocumentStyles);
      documentStyle.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      documentStyle.scrollBehavior = originalDocumentStyles.scrollBehavior;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const video = videoRef.current;

    const startPlayback = async () => {
      if (!video) return;

      try {
        await video.play();
      } catch (error) {
        if (cancelled) return;

        if (error?.name !== "NotAllowedError") {
          onFinishRef.current();
          return;
        }

        video.muted = true;
        setMuted(true);

        try {
          await video.play();
        } catch {
          if (!cancelled) onFinishRef.current();
        }
      }
    };

    startPlayback();

    return () => {
      cancelled = true;
      video?.pause();
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex h-[100dvh] w-screen items-center justify-center bg-[#1F1713]/25 px-4 py-16 backdrop-blur-[3px] sm:px-8"
      initial={false}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: "100vw",
        height: "100dvh",
        pointerEvents: exiting ? "none" : "auto",
      }}
      aria-hidden={exiting}
    >
      <motion.div
        className="relative aspect-video w-[min(75vw,48rem,105dvh)] overflow-hidden rounded-2xl border border-[#E7D8C8] bg-[#FBF5EA] shadow-[0_14px_35px_rgba(77,54,35,0.12)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <video
          ref={videoRef}
          className="h-full w-full bg-[#FBF5EA] object-contain [mix-blend-mode:multiply]"
          src="/videos/intro.mp4"
          poster="/assets/logoOs-640.webp"
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          onEnded={onFinish}
          onError={onFinish}
          aria-label="Animation d’introduction"
        />

        <button
          type="button"
          onClick={onFinish}
          className="absolute bottom-[clamp(2.25rem,8.5%,3.5rem)] right-[clamp(0.75rem,2.5%,1.5rem)] rounded-full border border-[#E7DED2] bg-white/90 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-[#7B675D] shadow-sm backdrop-blur transition-colors hover:border-[#C96A26] hover:text-[#C96A26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C96A26]"
        >
          Skip
        </button>
      </motion.div>
    </motion.div>
  );
}
