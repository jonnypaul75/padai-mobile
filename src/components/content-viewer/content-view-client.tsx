import { useEffect, useState } from "react";
import Flashcard from "./flash-cards";
import QuizPlayer from "./quiz-player";
import { apiProxyRequest } from "../../lib/api-client-proxy";
import type {
  ResourceItem,
  ChapterDataResponse,
} from "../../types/chapter-contents";
import Loader from "../loader";
import MainWrapper from "../MainWrapper";
import HtmlViewer from "./html-viewer";
import VideoPlayer from "./video-player";
import YouTubePlayer from "./youtube-player";
import backIcon from "../../assets/images/icons/chevron-right.svg";
import { useHistory, useLocation } from "react-router-dom";

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
import '@react-pdf-viewer/core/lib/styles/index.css';

import PdfViewer from "./Pdf-viewer";
import { IonHeader } from "@ionic/react";
import Header from "../../components/header";


// type VideoItem = {
//   id: string;
//   title: string;
//   url: string;
//   thumbnail: string;
//   duration: string;
//   descriptionFile: string;
//   description?: string; // Optional field for description
//   review: string;
//   about: string;
//   contentType: "video" | "audio";
// };
export default function ContentViewClient() {

  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState<ResourceItem | null>(null);
  const router = useHistory();
  const location = useLocation(); // similar to router.pathname or router.asPath
  const queryParams = new URLSearchParams(location.search);
  const resourceId = queryParams.get("resourceId"); // ?myParam=value
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);

  const hindiQuiz = [
    {
      id: 1,
      question:
        "जब एक चुंबक के पास कम्पास सुई लाई जाती है तो वह विक्षिप्त क्यों हो जाती है?",
      description:
        "समझें कि चुंबकीय क्षेत्र कम्पास सुई को कैसे प्रभावित करता है।",
      options: [
        "पृथ्वी के गुरुत्वाकर्षण बल के कारण",
        "स्थैतिक विद्युत आकर्षण के कारण",
        "चुंबक के चुंबकीय क्षेत्र के कारण",
        "वायुदाब में बदलाव के कारण",
      ],
      correctIndex: 2,
    },
    {
      id: 2,
      question:
        "एक सीधा चालक 4 ए का करंट ले जा रहा है और 2 सेमी दूर एक चुंबकीय क्षेत्र उत्पन्न करता है। यदि धारा को 8 ए कर दिया जाए, तो उसी बिंदु पर चुंबकीय क्षेत्र में क्या परिवर्तन होगा?",
      description:
        "सीधे चालक में धारा और चुंबकीय क्षेत्र के बीच संबंध लागू करें।",
      options: [
        "यह आधा हो जाएगा",
        "यह समान रहेगा",
        "यह दोगुना हो जाएगा",
        "यह शून्य हो जाएगा",
      ],
      correctIndex: 2,
    },
    {
      id: 3,
      question:
        "सीधे करंट-ले जाने वाले चालक के चारों ओर चुंबकीय क्षेत्र रेखाओं का पैटर्न कैसा होता है?",
      description:
        "चुंबकीय क्षेत्र रेखाएं करंट ले जाने वाले सीधे तार के चारों ओर एक विशेष पैटर्न बनाती हैं।",
      options: [
        "चालक के समांतर सीधी रेखाएं",
        "चालक से बाहर की ओर विकिरणीय रेखाएं",
        "चालक के केंद्र पर केंद्रित समवृत्त रेखाएं",
        "यादृच्छिक रेखाएं",
      ],
      correctIndex: 2,
    },
    {
      id: 4,
      question:
        "किस नियम का उपयोग करंट-ले जाने वाले चालक के चारों ओर चुंबकीय क्षेत्र की दिशा ज्ञात करने के लिए किया जाता है?",
      description:
        "हाथ के नियम का उपयोग कर करंट और चुंबकीय क्षेत्र की दिशा को जोड़ें।",
      options: [
        "फ्लेमिंग का बाएँ हाथ का नियम",
        "दाएँ हाथ का अंगूठा नियम",
        "कुलॉम्ब का नियम",
        "एम्पियर का परिपथीय नियम",
      ],
      correctIndex: 1,
    },
    {
      id: 5,
      question:
        "यदि तार में धारा की दिशा पूर्व से पश्चिम है, तो दाएँ हाथ के अंगूठा नियम का उपयोग करके तार के नीचे चुंबकीय क्षेत्र की दिशा ज्ञात करें।",
      description: "एक क्षैतिज चालक के लिए दाएँ हाथ का अंगूठा नियम लागू करें।",
      options: [
        "ऊपर की ओर",
        "उत्तर दिशा",
        "पृष्ठ की ओर (कागज़ के अंदर)",
        "तार के लंबवत तल में घड़ी की दिशा में",
      ],
      correctIndex: 3,
    },
    {
      id: 6,
      question:
        "निम्न में से कौन सा कथन करंट ले जाने वाले लंबे सीधे सोलोनॉयड के अंदर चुंबकीय क्षेत्र को सही तरीके से वर्णित करता है?",
      description: "सोलोनॉयड के अंदर चुंबकीय क्षेत्र की प्रकृति को समझें।",
      options: [
        "यह शून्य होता है",
        "जैसे-जैसे हम उसके छोर की ओर बढ़ते हैं, यह घटता है",
        "जैसे-जैसे हम उसके छोर की ओर बढ़ते हैं, यह बढ़ता है",
        "यह सभी बिंदुओं पर समान होता है",
      ],
      correctIndex: 3,
    },
    {
      id: 7,
      question:
        "किस यंत्र का उपयोग चुंबकीय क्षेत्र की उपस्थिति का पता लगाने के लिए किया जाता है?",
      description:
        "उस उपकरण की पहचान करें जो चुंबकीय क्षेत्र के प्रति प्रतिक्रिया करता है।",
      options: ["वोल्टमीटर", "एमीटर", "कम्पास", "बैरोमीटर"],
      correctIndex: 2,
    },
    {
      id: 8,
      question:
        "किस नियम का उपयोग चुंबकीय क्षेत्र में करंट-ले जाने वाले चालक पर बल की दिशा ज्ञात करने के लिए किया जाता है?",
      description:
        "यह नियम दिशाओं को दिखाने के लिए तीन लम्बवत अंगुलियों का उपयोग करता है।",
      options: [
        "दाएँ हाथ का अंगूठा नियम",
        "फ्लेमिंग का बाएँ हाथ का नियम",
        "फ्लेमिंग का दाएँ हाथ का नियम",
        "लेन्ज़ का नियम",
      ],
      correctIndex: 1,
    },
    {
      id: 9,
      question:
        "यदि एक प्रोटॉन चुंबकीय क्षेत्र में स्वतंत्र रूप से गतिशील हो, तो निम्न में से कौन-सी राशि बदल सकती है?",
      description: "चुंबकीय क्षेत्र गतिशील आवेशित कणों को प्रभावित करता है।",
      options: ["द्रव्यमान", "गति", "वेग", "आवेश"],
      correctIndex: 2,
    },
    {
      id: 10,
      question: "चुंबकीय क्षेत्र की तीव्रता की इकाई क्या है?",
      description:
        "यह उस वैज्ञानिक के नाम पर है जिसने विद्युतचुंबकत्व में योगदान दिया।",
      options: ["टेस्ला", "एम्पियर", "ओएर्स्टेड", "वोल्ट"],
      correctIndex: 2,
    },
  ];
  const quizQuestions = [
    {
      id: 1,
      question:
        "Why does a compass needle get deflected when brought near a bar magnet?",
      description: "Understand how magnetic fields influence a compass needle.",
      options: [
        "Due to gravitational force of Earth",
        "Due to electrostatic attraction",
        "Due to magnetic field of the bar magnet",
        "Due to air pressure variations",
      ],
      correctIndex: 2,
    },
    {
      id: 2,
      question:
        "A straight conductor carrying a current of 4 A produces a magnetic field at a point 2 cm away. If the current is increased to 8 A, what happens to the magnetic field at the same point?",
      description:
        "Apply the relation between magnetic field and current in a straight conductor.",
      options: [
        "It becomes half",
        "It remains the same",
        "It doubles",
        "It becomes zero",
      ],
      correctIndex: 2,
    },
    {
      id: 3,
      question:
        "What is the pattern of magnetic field lines around a straight current-carrying conductor?",
      description:
        "Magnetic field lines form a specific pattern around a straight wire carrying current.",
      options: [
        "Straight lines parallel to the conductor",
        "Radial lines outward from conductor",
        "Concentric circles centered on the conductor",
        "Random lines",
      ],
      correctIndex: 2,
    },
    {
      id: 4,
      question:
        "Which rule is used to determine the direction of magnetic field around a current-carrying conductor?",
      description:
        "Relates current direction to magnetic field direction using hand rule.",
      options: [
        "Fleming's left hand rule",
        "Right-hand thumb rule",
        "Coulomb's law",
        "Ampere\u2019s circuital law",
      ],
      correctIndex: 1,
    },
    {
      id: 5,
      question:
        "If the direction of current is east to west in a wire, find the direction of magnetic field below the wire using the right-hand thumb rule.",
      description: "Apply right-hand thumb rule for a horizontal conductor.",
      options: [
        "Upward",
        "North",
        "Into the page",
        "Clockwise in a plane perpendicular to the wire",
      ],
      correctIndex: 3,
    },
    {
      id: 6,
      question:
        "Which of the following correctly describes the magnetic field inside a long straight solenoid-carrying current?",
      description:
        "Understand the nature of the magnetic field inside a solenoid.",
      options: [
        "It is zero",
        "It decreases as we move towards its end",
        "It increases as we move towards its end",
        "It is the same at all points",
      ],
      correctIndex: 3,
    },
    {
      id: 7,
      question:
        "Which instrument is used to detect the presence of magnetic field?",
      description: "Identify the device that responds to a magnetic field.",
      options: ["Voltmeter", "Ammeter", "Compass", "Barometer"],
      correctIndex: 2,
    },
    {
      id: 8,
      question:
        "Which rule is used to determine the direction of force on a current-carrying conductor in a magnetic field?",
      description:
        "This rule uses three perpendicular fingers to indicate directions.",
      options: [
        "Right-hand thumb rule",
        "Fleming's left-hand rule",
        "Fleming's right-hand rule",
        "Lenz's law",
      ],
      correctIndex: 1,
    },
    {
      id: 9,
      question:
        "A proton moves freely in a magnetic field. Which of the following quantities may change?",
      description: "Magnetic field affects moving charged particles.",
      options: ["Mass", "Speed", "Velocity", "Charge"],
      correctIndex: 2,
    },
    {
      id: 10,
      question: "What is the unit of magnetic field strength?",
      description:
        "It's named after a scientist who contributed to electromagnetism.",
      options: ["Tesla", "Ampere", "Oersted", "Volt"],
      correctIndex: 2,
    },
  ];

  const flashcards = [
    {
      question: "<b>What did Hans Christian Oersted discover?</b><br/>",
      answer:
        "<p>He discovered that a current-carrying wire deflects a compass needle, showing a magnetic field is produced around it.</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/compass.jpg",
    },
    {
      question: "What are <u>magnetic field lines</u>?",
      answer:
        "They are imaginary lines used to represent the direction and strength of a magnetic field.",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/magents-field-lines.jpg",
    },
    {
      question: "<b>Right-Hand Thumb Rule</b>: What does it state?",
      answer:
        "<p>If you hold a conductor in your right hand with the thumb pointing in the direction of current, then the curled fingers show the direction of the magnetic field.</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/right-hand-thumb-rule.jpg",
    },
    {
      question:
        "What is the <u>direction of magnetic field lines</u> inside and outside a bar magnet?",
      answer: "Outside: From North to South<br/>Inside: From South to North",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/magnetic-field.jpg",
    },
    {
      question: "<b>What is a solenoid?</b><br/>",
      answer:
        "<p>A coil of many circular turns of insulated wire wrapped in the shape of a cylinder, producing a uniform magnetic field inside.</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/Solenoid.png",
    },
    {
      question: "What is an <u>electromagnet</u>?",
      answer:
        "A strong magnet made by placing a soft iron core inside a current-carrying solenoid.",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/solenoid-real.jpg",
    },
    {
      question: "<b>What does Fleming’s Left-Hand Rule help us find?</b><br/>",
      answer:
        "<p>It gives the direction of force on a current-carrying conductor in a magnetic field.</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/Flemings-left-hand-rule.png",
    },
    {
      question: "How does current affect <u>magnetic field strength</u>?",
      answer:
        "The stronger the current, the stronger the magnetic field around the conductor.",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/magnetic-field-with-battery.jpg",
    },
    {
      question:
        "<b>Why are magnetic field lines <u>closer together</u> near the poles?</b><br/>",
      answer:
        "<p>Because the magnetic field is stronger near the poles, and closer lines represent stronger fields.</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/Bar+Magnet+Fields.png",
    },
    {
      question: "How is <u>Magnetism used in medicine</u>?",
      answer:
        "Techniques like MRI use magnetic fields to create images of internal body parts for diagnosis.",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/ct-mri-scanner.jpg",
    },
  ];

  const flashCardsHindi = [
    {
      question: "<b>हांस क्रिश्चियन ओएर्स्टेड ने क्या खोजा?</b><br/>",
      answer:
        "<p>उन्होंने खोजा कि एक करंट प्रवाहित तार चुंबकीय सुई को विचलित करता है, जिससे यह सिद्ध होता है कि उसके चारों ओर एक चुंबकीय क्षेत्र उत्पन्न होता है।</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/compass.jpg",
    },
    {
      question: "<u>चुंबकीय क्षेत्र रेखाएं</u> क्या होती हैं?",
      answer:
        "ये काल्पनिक रेखाएं होती हैं, जो चुंबकीय क्षेत्र की दिशा और तीव्रता को दर्शाने के लिए प्रयोग की जाती हैं।",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/magents-field-lines.jpg",
    },
    {
      question: "<b>दाएँ हाथ का अंगूठा नियम</b>: यह क्या बताता है?",
      answer:
        "<p>यदि आप एक चालक को अपने दाएँ हाथ में ऐसे पकड़ें कि अंगूठा धारा की दिशा में हो, तो मुड़ी हुई उंगलियाँ चुंबकीय क्षेत्र की दिशा को दर्शाती हैं।</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/right-hand-thumb-rule.jpg",
    },
    {
      question:
        "<u>छड़ चुंबक</u> के अंदर और बाहर चुंबकीय क्षेत्र रेखाओं की दिशा क्या होती है?",
      answer: "बाहर: उत्तर से दक्षिण की ओर<br/>अंदर: दक्षिण से उत्तर की ओर",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/magnetic-field.jpg",
    },
    {
      question: "<b>सोलोनॉयड क्या होता है?</b><br/>",
      answer:
        "<p>एक बेलन के आकार में लिपटे हुए इंसुलेटेड तार के कई गोल चक्करों की कुंडली, जो अंदर एक समान चुंबकीय क्षेत्र उत्पन्न करती है।</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/Solenoid.png",
    },
    {
      question: "<u>विद्युत चुंबक</u> क्या है?",
      answer:
        "एक शक्तिशाली चुंबक जो करंट प्रवाहित सोलोनॉयड के अंदर एक कोमल लौह कोर रखने से बनता है।",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/solenoid-real.jpg",
    },
    {
      question: "<b>फ्लेमिंग का बाएँ हाथ का नियम हमें क्या बताता है?</b><br/>",
      answer:
        "<p>यह चुंबकीय क्षेत्र में करंट प्रवाहित चालक पर लगने वाले बल की दिशा को बताता है।</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/Flemings-left-hand-rule.png",
    },
    {
      question:
        "<u>धारा चुंबकीय क्षेत्र की तीव्रता को कैसे प्रभावित करती है?</u>",
      answer:
        "जितनी अधिक धारा, उतना ही अधिक चुंबकीय क्षेत्र चालक के चारों ओर उत्पन्न होता है।",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/magnetic-field-with-battery.jpg",
    },
    {
      question:
        "<b>चुंबकीय क्षेत्र रेखाएं <u>ध्रुवों के पास</u> एक-दूसरे के नज़दीक क्यों होती हैं?</b><br/>",
      answer:
        "<p>क्योंकि चुंबकीय क्षेत्र ध्रुवों के पास अधिक तीव्र होता है, और पास-पास की रेखाएं तीव्र क्षेत्र को दर्शाती हैं।</p>",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/Bar+Magnet+Fields.png",
    },
    {
      question: "<u>चिकित्सा में चुंबकत्व का उपयोग</u> कैसे होता है?",
      answer:
        "एमआरआई जैसी तकनीकें चुंबकीय क्षेत्र का उपयोग करके शरीर के आंतरिक अंगों की छवि बनाती हैं ताकि रोग का निदान किया जा सके।",
      image:
        "https://d1rb72t9cnnyis.cloudfront.net/CBSE/X/Science/CH12/Images/ct-mri-scanner.jpg",
    },
  ];

  useEffect(() => {
    async function getChapterContents() {
      try {
        const payload = {};
        const result = await apiProxyRequest<
          ChapterDataResponse,
          typeof payload
        >("POST", "Content/getChapters", payload);

        const allResources = Object.values(
          result.chapters[1]?.content?.resources || {}
        ).flat();

        const matchedResource =
          allResources.find((item: ResourceItem) => item.id === resourceId) || null;

        setResource(matchedResource);

        // ✅ Load PDF as Uint8Array if contentType is "web-link" and URL ends with .pdf
        if (
          matchedResource?.contentType === "web-link" &&
          matchedResource?.url?.endsWith(".pdf")
        ) {
          const res = await fetch(matchedResource.url);
          console.log(res);
          const arrayBuffer = await res.arrayBuffer();
          const uint8Data = new Uint8Array(arrayBuffer);

          setPdfData(uint8Data); // <- store Uint8Array in state
        }
      } catch (err) {
        console.error("Error fetching chapter or PDF:", err);
      } finally {
        setLoading(false);
      }
    }

    getChapterContents();
  }, [resourceId]);



  if (loading) return <Loader visible />;

  if (!resource) {
    return (
      <MainWrapper>
        <p>Invalid Resource ID, please use valid link or contact admin.</p>
      </MainWrapper>
    );
  }

  const HeaderNav = (
    <div className="flex items-center py-2 border-b border-gray-200 relative bg-white">
      <img
        onClick={() => router.goBack()}
        className="rotate-180 mb-[-2px] cursor-pointer"
        src={backIcon}
        alt="Back"
        width={24}
        height={24}
      />
      <h4 className="text-xl text-gray-700 font-bold">{resource.name}</h4>
    </div>
  );

  return (
    <>
      <IonHeader>
         <Header />
      </IonHeader>
      <MainWrapper>
        <div className="container">
          <div className="card">
            <div className="!pb-1 !border-b-0">{HeaderNav}</div>
            {resource.contentType === "video" ? (
              <>
                {/* Video Player */}
                <div className="content-card video-content">
                  <div
                    className="!border-0 !pb-5"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "12px",
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ width: "100%", maxWidth: "600px" }}>
                      <div className="video-section no-poster">
                        <VideoPlayer
                          video={{
                            id: resource.id.toString(),
                            title: resource.name,
                            url: resource.url || "",
                            thumbnail: "",
                            duration: "",
                            description: resource.content || "",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      maxHeight: "Calc(100vh - 400px)",
                      overflow: "scroll",
                      border: "1px solid #ccc",
                    }}
                  >
                    {/* Scrollable Tab Content */}
                    <div
                      style={{
                        padding: "0",
                        background: "#fcfcfc",
                        textAlign: "start",
                      }}
                    >
                      <div
                        style={{
                          border: "1px solid #ccc",
                          borderRadius: 6,
                          minHeight: "100%",
                        }}
                      >
                        <div className="">
                          <HtmlViewer url={resource.htmlView || ""} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : resource.contentType === "youtube-video" ? (
              <>
                {/* Video Player */}
                <div className="content-card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "12px",
                      flexShrink: 0,
                    }}
                    className="sticky !top-[50px] !z-50 !border-b-0 !pb-5"
                  >
                    <div style={{ width: "100%", maxWidth: "600px" }}>
                      <div className="video-section">
                        {/* {selectedVideo?.contentType === "audio" && (
                                            <img
                                                src={selectedVideo.thumbnail}
                                                alt="Audio Poster"
                                                className="audio-poster max-w-full h-auto"
                                            />
                                        )} */}
                        <YouTubePlayer
                          video={{
                            id: resource.id,
                            title: resource.name,
                            url: resource.url || "",
                            thumbnail: "",
                            duration: "",
                            description: resource.content || "",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      maxHeight: "Calc(100vh - 350px)",
                      overflow: "scroll",
                      border: "1px solid #ccc",
                    }}
                  >
                    {/* Scrollable Tab Content */}
                    <div
                      style={{
                        padding: "0 12px 12px",
                        background: "#fcfcfc",
                        textAlign: "start",
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
                        <HtmlViewer url={resource.htmlView || ""} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : resource.contentType === "html" ? (
              <div
                style={{ maxHeight: "Calc(100vh - 45px)", overflowY: "scroll" }}
              >
                <HtmlViewer url={resource.url || ""} />
              </div>
            ) : resource.contentType === "interactive" &&
              resource.name === "Flash Cards" ? (
              <>
                <div className="flashcard-container">
                  <div className="columns-2 gap-5 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>div:not(:first-child)]:mt-8">
                    {flashcards?.map((card, i) => (
                      <div className="mb-4" key={i}>
                        <Flashcard key={i} {...card} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : resource.contentType === "interactive" &&
              resource.name === "Flash Cards - Hindi" ? (
              <>
                <div className="flashcard-container">
                  <div className="columns-2 gap-5 sm:columns-2 sm:gap-8 md:columns-3 lg:columns-4 [&>img:not(:first-child)]:mt-8">
                    {flashCardsHindi?.map((card, i) => (
                      <div className="mb-4" key={i}>
                        <Flashcard key={i} {...card} />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : resource.contentType === "interactive" &&
              resource.name === "AI Quiz" ? (
              <>
                <QuizPlayer questions={quizQuestions} />
              </>
            ) : resource.contentType === "interactive" &&
              resource.name === "AI Quiz - Hindi" ? (
              <>
                <QuizPlayer questions={hindiQuiz} />
              </>
            ) : resource.contentType === "web-link" ? (
              <>
                <div className="flashcard-container text-start !mt-0">
                  {/* 📄 PDF Viewer */}
                  <div className="bg-white pdf-lib" style={{overflow: 'scroll' }}>
                    {pdfData ? (


                      <PdfViewer fileUrl={pdfData} />

                    ) : (
                      <p>Loading PDF...</p>
                    )}
                  </div>
                    <div style={{maxHeight:'Calc(55vh - 20px)', overflow: 'scroll',textAlign:'left'}}>
                      <HtmlViewer url={resource.script || ""} />
                    </div>
                  {/* <hr className="border text-start mb-4" /> */}
                  {/* <button
                  className="w-fit px-6 py-3 rounded bg-[#f97007] text-white cursor-pointer inline-block ms-3 mb-5"
                  onClick={() => downloadFile(resource.url!, resource.name)}
                >
                  Download
                </button> */}
                </div>
              </>
            ) : (
              <p>Unsupported content type</p>
            )}
          </div>
        </div>
      </MainWrapper>
    </>

  );
}
