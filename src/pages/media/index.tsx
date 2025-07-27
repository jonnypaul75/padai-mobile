"use client";
import { useState, useRef, useEffect } from "react";
import "video.js/dist/video-js.css";
import HtmlViewer from "../../components/content-viewer/html-viewer";
import VideoPlayer from "../../components/content-viewer/video-player";
import Loader from "../../components/loader";
import MainWrapper from "../../components/MainWrapper";
import backIcon from "../../assets/images/icons/chevron-right.svg";
import Header from "../../components/header";
import { IonContent, IonHeader, IonPage } from "@ionic/react";

type VideoItem = {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  descriptionFile: string;
  description?: string; // Optional field for description
  review: string;
  about: string;
  contentType: "video" | "audio";
};

const videos: VideoItem[] = [
  {
    id: 1,
    title: "The Three Little Pigs",
    url: "https://d3d5quqi9gvuwy.cloudfront.net/Children+Classics/The+Three+Little+Pigs/Marathi/Three+Little+Pigs+-+Marathi_Playlist.m3u8",
    thumbnail:
      "https://d3d5quqi9gvuwy.cloudfront.net/Children+Classics/The+Three+Little+Pigs/English/The+Three+Little+Pigs+Landscape.webp",
    duration: "07:12",
    descriptionFile:
      "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Chapter-Summary.html",
    review: "Review for video 1.",
    about: "Uploaded by Trainer 1.",
    contentType: "audio",
  },
  {
    id: 2,
    title: "Magnetic Effects Of Electric Current English",
    url: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.mp4/.m3u8",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    duration: "11:05",
    descriptionFile:
      "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Chapter-Summary.html",
    review: "Review for video 2.",
    about: "Uploaded by Trainer 2.",
    contentType: "video",
  },
];

export default function Media() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  // const [descriptionHtml, setDescriptionHtml] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<
    "description" | "review" | "about"
  >("description");

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollPositionRef = useRef<number>(0);

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  const [toggle, setToggles] = useState<{
    menu: boolean;
    chat: boolean;
    filter: boolean;
    width: boolean;
  }>({
    menu: false,
    chat: false,
    filter: false,
    width: false,
  });

  const handleVideoClick = (video: VideoItem) => {
    scrollPositionRef.current = scrollContainerRef.current?.scrollTop || 0;
    setSelectedVideo(video);
    setActiveTab("description");
    setToggles({ ...toggle, width: true });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  const goBack = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <IonPage>
        <Loader visible={loading} />
        <IonHeader>
          <Header />
        </IonHeader>
        <MainWrapper>
          <IonContent>

            <div className="main-container p-5">

              <div>
                {!selectedVideo && (
                  <>
                    <div>
                      <div className="flex items-center py-2 border-b border-gray-200 mb-3">
                        {/* <img
                      onClick={() => history.goBack()}
                      className="rotate-180 mb-[-2px] cursor-pointer"
                      src={backIcon}
                      alt=""
                      width={24}
                      height={24}
                    /> */}
                        <h4 className="text-xl text-gray-700 font-bold">
                          Video List
                        </h4>
                      </div>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                          width: "100%",
                          padding: 8,
                          marginTop: 8,
                          fontSize: "1rem",
                          border: "1px solid #ccc",
                          borderRadius: 6,
                          marginBottom: 12,
                        }}
                      />
                    </div>
                    {/*  List View  */}
                    <div
                      ref={scrollContainerRef}
                      style={{
                        flexGrow: 1,
                        overflowY: "auto",
                      }}
                    >
                      {filteredVideos.map((video) => (
                        <div
                          className="chapter-list"
                          key={video.id}
                          onClick={() => handleVideoClick(video)}
                        >
                          <div className="flex">
                            <img
                              className="me-2"
                              src={video.thumbnail}
                              alt={video.title}
                              width={100}
                              height={60}
                              style={{
                                minWidth: 100,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                            <div>
                              <span className="block title">{video.title}</span>
                              <span className="info">⏱ {video.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {selectedVideo && (
                  <div className="content-area">
                    <div className="d-flex gap-3">
                      <div className="content-card text-center flex-grow-1 d-flex  justify-content-center">
                        <div className="w-full">
                          {/* Header */}
                          <div className="flex items-center py-2 border-b border-gray-200">
                            <img
                              onClick={goBack}
                              className="rotate-180 cursor-pointer"
                              src={backIcon}
                              alt=""
                              width={24}
                              height={24}
                            />
                            <h4 className="text-base text-gray-700 font-bold">
                              {selectedVideo.title}
                            </h4>
                          </div>

                          {/* Video Player */}
                          <div className="content-card d-flex media-player">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "12px 0",
                                flexShrink: 0,
                                width: "100%",
                              }}
                            >
                              <div style={{ width: "100%", maxWidth: "800px" }}>
                                <div className="video-section">
                                  <VideoPlayer
                                    video={{
                                      id: selectedVideo.id.toString(),
                                      title: "",
                                      url: selectedVideo.url || "",
                                      thumbnail: selectedVideo.thumbnail || "",
                                      duration: selectedVideo.duration || "",
                                      description:
                                        selectedVideo.descriptionFile || "",
                                      descriptionFile:
                                        selectedVideo.descriptionFile || "",
                                      review: selectedVideo.review || "",
                                      about: selectedVideo.about || "",
                                      contentType: selectedVideo.contentType,
                                      relatedVideos: [],
                                    }}
                                  />
                                </div>
                                {/* <p
                              style={{
                                color: "black",
                                fontSize: "1.2rem",
                                marginTop: 4,
                              }}
                            >
                              {selectedVideo.title}
                            </p> */}
                                <p
                                  style={{
                                    textAlign: "start",
                                    color: "#555",
                                    fontSize: "0.9rem",
                                    marginTop: 4,
                                  }}
                                >
                                  ⏱ Duration: {selectedVideo.duration}
                                </p>
                              </div>
                            </div>

                            <div style={{ flex: 1, overflowY: "clip" }}>
                              {/* Tabs */}
                              {/* <div
                            style={{
                              padding: "12px 0",
                              flexShrink: 0,
                              margin: "auto",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 8,
                              }}
                            >
                              {["description", "review", "about"].map((tab) => (
                                <button
                                  key={tab}
                                  onClick={() =>
                                    setActiveTab(
                                      tab as "description" | "review" | "about"
                                    )
                                  }
                                  style={{
                                    flex: 1,
                                    padding: "12px 0px",
                                    border: "1px solid #ccc",
                                    borderRadius: 4,
                                    background:
                                      activeTab === tab ? "#007bff" : "#f9f9f9",
                                    color: activeTab === tab ? "#fff" : "#000",
                                    cursor: "pointer",
                                  }}
                                >
                                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div> */}

                              {/* Scrollable Tab Content */}
                              <div
                                style={{
                                  flexGrow: 1,
                                  overflowY: "auto",
                                  padding: "12px  0px",
                                  background: "#fcfcfc",
                                  textAlign: "start",
                                  height: "Calc(100vh - 440px)"
                                }}
                              >
                                <div
                                  style={{
                                    border: "1px solid #ccc",
                                    borderRadius: 6,
                                    padding: 12,
                                    minHeight: "100%",
                                  }}
                                >
                                  {activeTab === "description" && (
                                    <div
                                      className="scroller"
                                      style={{ overflowY: "scroll" }}
                                    >
                                      <HtmlViewer
                                        url={selectedVideo.descriptionFile || ""}
                                      />
                                    </div>
                                  )}
                                  {activeTab === "review" && (
                                    <p>{selectedVideo.review}</p>
                                  )}
                                  {activeTab === "about" && (
                                    <p>{selectedVideo.about}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </IonContent>


        </MainWrapper>
      </IonPage>

    </>
  );
}
