"use client";
import { useEffect, useRef, useState } from "react";
import type Player from "video.js/dist/types/player";
import VideoPlayer from "../../components/content-viewer/video-player";
import Loader from "../../components/loader";
import MainWrapper from "../../components/MainWrapper";
import { IonContent, IonHeader, IonPage } from "@ionic/react";
import Header from "../../components/header";

interface VideoItem {
  id: number;
  title: string;
  url: string;
}

const videos: VideoItem[] = [
  {
    id: 1,
    title: "Short 1",
    url: "https://media.istockphoto.com/id/2089020832/video/young-female-university-student-reading-a-book-at-campus.mp4?s=mp4-640x640-is&k=20&c=0uEpKNZCuvj4s7y9fx-TXrBYoakN8RgTcARJlHuipH8=",
  },
  {
    id: 2,
    title: "Short 2",
    url: "https://media.istockphoto.com/id/2216008266/video/spinning-magnets-in-motion.mp4?s=mp4-640x640-is&k=20&c=ZI7tbcxBknUIAobzR0mFT2XbqDVdFW-WVOzJElmI5MM=",
  },
  {
    id: 3,
    title: "Short 3",
    url: "https://media.istockphoto.com/id/2173244346/video/vertical-video-a-patient-undergoes-an-mri-or-ct-scan-as-doctors-review-images-in-a-modern.mp4?s=mp4-640x640-is&k=20&c=Tp1EsiDjsJRpBygP9nx3mP5_JLnetm1jy9DWAd73Kd8=",
  },
];

export default function EduReels() {
  const [loading, setLoading] = useState(true);
  const playerRefs = useRef<(Player | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrollingRef = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0.6)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          const entry = visibleEntries[0];
          const index = parseInt(
            (entry.target as HTMLElement).dataset.index || "0",
            10
          );

          setCurrentIndex(index);

          playerRefs.current.forEach((player, i) => {
            if (!player) return;
            if (i === index) {
              player.play()?.catch(() => { });
            } else {
              player.pause();
            }
          });

          // Add 'active' class to visible video
          document.querySelectorAll(".short-wrapper").forEach((el, i) => {
            if (i === index) {
              el.parentElement?.classList.add("active");
            } else {
              el.parentElement?.classList.remove("active");
            }
          });
        }
      },
      {
        threshold: Array.from({ length: 11 }, (_, i) => i / 10), // 0.0 to 1.0
      }
    );

    const elements = document.querySelectorAll(".short-wrapper");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);


  // On load: scroll to top video
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const wrappers = document.querySelectorAll(".short-wrapper");
    if (wrappers.length > 0) {
      wrappers[0].scrollIntoView({ behavior: "auto" });
    }
  }, []);

  // Handle scroll/keyboard navigation
  useEffect(() => {
    const wrappers = document.querySelectorAll(".short-wrapper");

    const scrollToIndex = (index: number) => {
      if (index >= 0 && index < wrappers.length) {
        wrappers[index].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") scrollToIndex(currentIndex + 1);
      if (e.key === "ArrowUp") scrollToIndex(currentIndex - 1);
    };

    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastWheelTime < 600 || isScrollingRef.current) return;

      isScrollingRef.current = true;
      scrollToIndex(currentIndex + (e.deltaY > 0 ? 1 : -1));
      lastWheelTime = now;

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 600);
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <IonPage>
        <Loader visible={loading} />
        <IonHeader>
          <Header />
        </IonHeader>
        <MainWrapper>
          <IonContent>
            <div className="shorts-container content-card d-flex justify-content-center">
              <div style={{ textAlign: "center", margin: "0 auto" }}>
                {videos.map((video, i) => (
                  <div key={video.id} className="relative video-div">
                    <div className="short-wrapper potrait" data-index={i} >
                      <VideoPlayer
                        ref={(el: Player | null) => {
                          playerRefs.current[i] = el;
                        }}
                        video={{
                          id: video.id.toString(),
                          title: video.title,
                          url: video.url,
                          thumbnail: "",
                          duration: "",
                          description: "",
                          descriptionFile: "",
                          contentType: "video",
                          about: "",
                          review: "",
                          relatedVideos: [],
                        }}
                        autoplay={true}
                      />
                    </div>
                    <div className="fixed-title pl-2">{video?.title || ""}</div>
                  </div>

                ))}
              </div>
            </div>
          </IonContent>


        </MainWrapper>
      </IonPage>
    </>
  );
}
