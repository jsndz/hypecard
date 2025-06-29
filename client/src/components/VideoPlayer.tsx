import { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLSPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      if (videoRef.current) {
        hls.attachMedia(videoRef.current);
      }
    } else if (
      videoRef.current &&
      videoRef.current.canPlayType("application/vnd.apple.mpegurl")
    ) {
      if (videoRef.current) {
        videoRef.current.src = src;
      }
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-auto rounded-lg"
      playsInline
    />
  );
};

export default HLSPlayer;
