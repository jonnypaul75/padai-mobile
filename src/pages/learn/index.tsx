import { useState, useEffect } from "react";

import Loader from "../../components/loader"
import SelectBoard from "../../components/select-dropdown/board-select";
import SelectClass from "../../components/select-dropdown/select-class";
import MainWrapper from "../../components/MainWrapper";
import type {
  Chapter,
  ChapterDataResponse,
} from "../../types/chapter-contents";
import { apiProxyRequest } from "../../lib/api-client-proxy";
import book1 from "../../assets/images/book-1.png";
import ongoing2 from "../../assets/images/courses/ongoing-2.png";
import { IonContent, IonHeader, IonPage, IonToolbar } from "@ionic/react";
import Header from "../../components/header";
import { Link } from "react-router-dom";
import SelectLanguage from "../../components/select-dropdown/language-select";
import type {
  SubjectApiResponse,
  SubjectResponseData,
} from "../../types/class-section";
import backIcon from "../../assets/images/icons/chevron-right.svg";

function LearnPage() {
  const [loading, setLoading] = useState(true);
  const [isdummyVisible, setIsdummyVisible] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [isContentAvailable, setIsContentAvailable] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    "English"
  );
  const [subjectId] = useState<string>("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [SubjectOptions, setSubjectOptions] = useState<SubjectResponseData[]>();

  const getChapterContents = async () => {
    setIsContentAvailable(true);
    const payload = {};
    const result = await apiProxyRequest<ChapterDataResponse, typeof payload>(
      "POST",
      "Content/getChapters",
      payload
    );
    if (result) {
      setChapters(result.chapters);
    }
  };

  const getClassesList = async () => {
    const payload = { school_id: "23", class_id: selectedClass };
    const result = await apiProxyRequest<SubjectApiResponse, typeof payload>(
      "POST",
      "Content/getSubjects",
      payload
    );
    if (result) {
      setSubjectOptions(result.data);
    }
    setIsContentAvailable(true);
  };

  useEffect(() => {
    if (selectedBoard && selectedClass && subjectId) {
      setIsContentAvailable(true);
      setIsdummyVisible(false);
      setShowFilter(true);
    }
  }, [selectedBoard, selectedClass, subjectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const backToSubjects = () => {
    setChapters([]);
  };

  if (loading) return <Loader />;

  return (
    <>
      <IonPage>
        <Loader visible={loading} />
        <MainWrapper>
          <IonContent fullscreen>
            <IonHeader>
              <IonToolbar>
                <Header />
              </IonToolbar>
            </IonHeader>
            {showFilter && !(chapters.length > 0) && (
              <div className="selection mt-2">
                <div className="container">
                  <div
                    className={`grid gap-2 grid-cols-12 ${!showFilter ? "hidden" : ""
                      }`}
                  >
                    <div className="col-span-6">
                      <SelectBoard
                        onSelectBoard={setSelectedBoard}
                        selectedBoard={selectedBoard}
                      />
                    </div>
                    <div className="col-span-6">
                      <SelectClass
                        onSelectClass={setSelectedClass}
                        selectedClass={selectedClass}
                      />
                    </div>
                    {selectedClass && (
                      <div className="col-span-12">
                        <SelectLanguage
                          onSelectLanguage={setSelectedLanguage}
                          selectedLanguage={selectedLanguage}
                        />
                      </div>
                    )}
                    {selectedClass && (
                      <div className="col-span-12">
                        <button
                          className="btn w-full py-1 rounded bg-[#f97007] text-white cursor-pointer"
                          onClick={getClassesList}
                        >
                          View
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isdummyVisible && (
              <section className="mt-2">
                <div className="container">
                  <div className="content-card text-center">
                    <img
                      src={book1}
                      alt="Select Your Learning Path"
                      width={100}
                      height={100}
                      className="mx-auto"
                    />
                    <h2 className="font-semibold text-[24px]">
                      Select Your Learning Path
                    </h2>
                    <p>
                      Choose your board, class, subject, and book to start
                      learning with our AI tutor.
                    </p>
                    <div className="bg-[#D0F0F9] border border-[#b3e5fc] rounded-lg p-[10px] inline-block mt-[10px] mb-[100px]">
                      <i className="fas fa-info-circle text-[#01579b] mr-2" />
                      For demonstration, try selecting <br />
                      <strong>
                        CBSE {">"} Class X {">"} Science {">"} Language
                      </strong>
                      <button
                        className="btn w-full py-1 mt-4 cursor-pointer font-semibold rounded bg-[#f97007] text-white"
                        onClick={() => {
                          setShowFilter(true);
                          setIsdummyVisible(false);
                        }}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {!isdummyVisible &&
              isContentAvailable &&
              selectedClass &&
              chapters.length == 0 && (
                <section id="single-courses-complete" className="!mb-0">
                  <div className="container">
                    <div className="single-courses-complete-wrap">
                      <div className="single-courses-complete-bottom">
                        <div className="ongoing-section-wrap !border-0">
                          <div className="lesson-tabbar">
                            {SubjectOptions?.map((subject, index) => (
                              <div key={index} onClick={getChapterContents}>
                                <div className="py-3 px-3 hover:bg-[#e6f7f7] rounded-md mt-2 transition-colors duration-150 ease-in-out">
                                  <div className="lesson-tabbar-title">
                                    <div className="flex items-center gap-x-3">
                                      <div className="tab-lesson2">
                                        <img
                                          src={ongoing2}
                                          alt={subject.subject_name}
                                          width={48}
                                          height={48}
                                          className="rounded"
                                        />
                                      </div>
                                      <div>
                                        <span className="block tab-lesson1">
                                          {subject.subject_name}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

            {!isdummyVisible &&
              isContentAvailable &&
              selectedClass &&
              chapters.length > 0 && (
                <section id="single-courses-complete" className="!mb-0">
                  <div className="container">
                    <div className="single-courses-complete-wrap">
                      <div className="single-courses-complete-bottom">
                        <div className="ongoing-section-wrap !border-0">
                          <div className="lesson-tabbar">
                            <div className="flex items-center py-2 border-b border-gray-200">
                              <img
                                onClick={backToSubjects}
                                className="rotate-180 mb-[-2px] mr-3 cursor-pointer"
                                src={backIcon}
                                alt=""
                                width={24}
                                height={24}
                              />
                              <h4 className="text-xl text-gray-700 font-bold">
                                Chapter Content
                              </h4>
                            </div>
                            {chapters.map((chapter, index) => (
                              <Link to={`/chapter-details/`} key={index}>
                                <div className="py-3 px-3 hover:bg-[#e6f7f7] rounded-md mt-2 transition-colors duration-150 ease-in-out">
                                  <div className="lesson-tabbar-title">
                                    <div className="flex items-center gap-x-3">
                                      <div className="tab-lesson2">
                                        <img
                                          src={ongoing2}
                                          alt={chapter.title}
                                          width={48}
                                          height={48}
                                          className="rounded"
                                        />
                                      </div>
                                      <div>
                                        <span className="block tab-lesson1">
                                          {chapter.title}
                                        </span>
                                        <span className="text-gray-500">
                                          {chapter.info}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
          </IonContent>
        </MainWrapper>
      </IonPage>
    </>
  );
}

export default LearnPage;
