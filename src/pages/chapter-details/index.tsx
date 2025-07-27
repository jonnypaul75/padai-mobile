"use client";
import React, { useEffect, useState } from "react";

import { MdOutlineMenuBook, MdQuiz } from "react-icons/md";
import { FaDownload, FaPlay, FaYoutube } from "react-icons/fa";
import { BsFiletypeHtml } from "react-icons/bs";
import Loader from "../../components/loader";
import { apiProxyRequest } from "../../lib/api-client-proxy";
import type {
  ChapterContent,
  ChapterDataResponse,
} from "../../types/chapter-contents";
import { useHistory } from "react-router-dom";
import { IonContent, IonHeader, IonPage } from "@ionic/react";
import backIcon from "../../assets/images/icons/chevron-right.svg";
import Header from "../../components/header";
import ongoing2 from "../../assets/images/courses/ongoing-2.png";
export default function ChapterDetails() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ChapterContent | null>(null);
  const [chapterName, setChapterName] = useState<string>();
  const [chapterInfo, setChapterInfo] = useState<string>();
  // const [chapterImage, setChapterImage] = useState<string>();

  const activeDropdown = (event: React.MouseEvent<HTMLSpanElement>) => {
    const target = event.target as HTMLElement;
    const parent = target.closest(".lesson-tabbar-content");
    if (parent) {
      parent.classList.toggle("show");
    }
  };

  useEffect(() => {
    async function getChapterContents() {
      const payload = {};
      const result = await apiProxyRequest<ChapterDataResponse, typeof payload>(
        "POST",
        "Content/getChapters",
        payload
      );
      console.log(result);
      if (result && result?.chapters[1]?.content) {
        setContent(result?.chapters[1]?.content);
        setChapterName(result?.chapters[1].title);
        setChapterInfo(result?.chapters[1].info);
        // setChapterImage(result?.chapters[1].image);
      }
      setLoading(false);
    }

    getChapterContents();
  }, []);
  if (loading) {
    return <Loader visible={loading} />;
  }

  return (
    <IonPage>
      <IonHeader>
        <Header />
      </IonHeader>
      <IonContent>
        <section id="single-courses-complete mb-0">
          <div className="container">
            <div className="sticky">
              <div className="flex items-center py-2 border-b border-gray-200">
                <img
                  onClick={() => history.goBack()}
                  className="rotate-180 mb-[-2px] mr-2  cursor-pointer"
                  src={backIcon}
                  alt=""
                  width={24}
                  height={24}
                />
                <h4 className="text-xl text-gray-700 font-bold">
                  Chapter Details
                </h4>
              </div>
              <div className="single-courses-complete-top mt-32">
                <div className="ongoing-section-details-wrap">
                  <div className="ongoing-first">
                    <img
                      src={ongoing2}
                      alt={"course-img"}
                      width={70}
                      height={70}
                      // onError={() =>
                      //   setChapterImage(
                      //     "/src/assets/images/courses/ongoing-2.png"
                      //   )
                      // } // fallback image path
                    />
                  </div>
                  <div className="ongoing-second">
                    <div className="ongoing-second-wrap">
                      <div className="ongoing-details">
                        <h2 className="ongoing-txt1">{chapterName}</h2>
                        <p className="ongoing-txt2">{chapterInfo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="single-courses-complete-wrap">
              <div className="single-courses-complete-bottom">
                <div className="ongoing-section-wrap !border-0">
                  <div className="lesson-tabbar">
                    {content &&
                      Object.entries(content.resources).map(
                        ([type, items], index) => {
                          return (
                            <div
                              className="lesson-tabbar-content p-0! border-b-1 border-[#e5e5e5] max-h-[initial]!"
                              key={type}
                            >
                              <div
                                className="lesson-tabbar-title py-4 cursor-pointer"
                                onClick={($event) => activeDropdown($event)}
                              >
                                <span className="tab-lesson1">
                                  {index + 1} - {type}
                                </span>
                                <span className="tab-lesson2">
                                  <img
                                    className="rotate-[90deg]"
                                    src={backIcon}
                                    alt=""
                                    width={24}
                                    height={24}
                                  />
                                </span>
                              </div>
                              {items &&
                                items.length > 0 &&
                                items.map((item, index) => {
                                  return (
                                    <div
                                      className={`tabbar-bottom mb-4 ${index === 0 ? "mt-0!" : "mt-4"
                                        } !p-0`}
                                      key={index}
                                    >
                                      <a
                                        href={`/content-view?resourceId=${item.id}`}
                                        className="flex w-full gap-6 justify-between p-3"
                                      >
                                        <div className="play-btn-txt">
                                          {item.name}
                                        </div>
                                        {item.contentType ===
                                          "youtube-video" && (
                                            <div className="play-btn-icon">
                                              <FaYoutube
                                                style={{
                                                  color: "#f03",
                                                  fontSize: "20px",
                                                }}
                                              />
                                            </div>
                                          )}
                                        {item.contentType === "html" && (
                                          <div className="play-btn-icon">
                                            <BsFiletypeHtml
                                              style={{
                                                color: "#f97007",
                                                fontSize: "20px",
                                              }}
                                            />
                                          </div>
                                        )}
                                        {item.contentType === "web-link" && (
                                          <div className="play-btn-icon">
                                            <FaDownload
                                              style={{
                                                color: "#f97007",
                                                fontSize: "16px",
                                              }}
                                            />
                                          </div>
                                        )}
                                        {item.contentType === "video" && (
                                          <div className="play-btn-icon">
                                            <FaPlay
                                              style={{
                                                color: "#f97007",
                                                fontSize: "16px",
                                              }}
                                            />
                                          </div>
                                        )}
                                        {item.contentType === "interactive" &&
                                          (item.name === "AI Quiz" ||
                                            item.name ===
                                            "AI Quiz - Hindi") && (
                                            <div className="play-btn-icon">
                                              <MdQuiz
                                                style={{
                                                  color: "#f97007",
                                                  fontSize: "16px",
                                                }}
                                              />
                                            </div>
                                          )}
                                        {item.contentType === "interactive" &&
                                          (item.name === "Flash Cards" ||
                                            item.name ===
                                            "Flash Cards - Hindi") && (
                                            <div className="play-btn-icon">
                                              <MdOutlineMenuBook
                                                style={{
                                                  color: "#f97007",
                                                  fontSize: "16px",
                                                }}
                                              />
                                            </div>
                                          )}
                                      </a>
                                    </div>
                                  );
                                })}
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </IonContent>
    </IonPage>
  );
}
