import { useState, useEffect } from "react";
import Loader from "../../components/loader";
import { useIonRouter } from "@ionic/react";

const GetStarted = () => {
  const [loading, setLoading] = useState(true);
  const router = useIonRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    const redirect = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirect);
    };
  }, []);

  return (
    <>
      <Loader visible={loading} />
      <div className="onboarding-slider">
        <div className="container">
          <div className="Onboarding-Screen-1-full flex justify-center items-center">
            <div className="h-[100%] flex items-center justify-center">
              <div>
                <div className="onboarding-img">
                  <img
                    src="/padai.svg"
                    alt="onboarding-img-1"
                    width={150}
                    height={300}
                    className="m-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <Slider {...settings} ref={sliderRef}>
          <div className="slide slide1">
            <div className="container">
              <div className="Onboarding-Screen-1-full">
                <div className="h-[100%] flex flex-col justify-between">
                  <div>
                    <div className="skip_btn skip_btn-onboading pt-30">
                      <a className="cursor-pointer" onClick={goToNextSlide}>Skip</a>
                    </div>
                    <div className="onboarding-img mt-32">
                      <img src={onboarding1} alt="onboarding-img-1" width={300} height={300} className="m-auto" />
                    </div>
                    <div className="boarding-title mt-32">
                      <h1>We provide the best <br /> learning courses &amp; great<br /> mentors!</h1>
                    </div>
                  </div>
                  <div className="onboarding-next-btn">
                    <a className="cursor-pointer" onClick={goToNextSlide}>Next</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="slide slide2">
            <div className="container">
              <div className="Onboarding-Screen-1-full">
                <div className="h-[100%] flex flex-col justify-between">
                  <div>
                    <div className="skip_btn skip_btn-onboading pt-30">
                      <a className="cursor-pointer" onClick={goToNextSlide}>Skip</a>
                    </div>
                    <div className="onboarding-img mt-32">
                      <img src={onboarding2} alt="onboarding-img-2" width={300} height={300} className="m-auto" />
                    </div>
                    <div className="boarding-title mt-32">
                      <h1>Learn anytime and anywhere easily and conveniently</h1>
                    </div>
                  </div>
                  <div className="onboarding-next-btn">
                    <a className="cursor-pointer" onClick={goToNextSlide}>Next</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="slide slide3">
            <div className="container">
              <div className="Onboarding-Screen-1-full">
                <div className="h-[100%] flex flex-col justify-between">
                  <div>
                    <div className="skip_btn skip_btn-onboading pt-30">
                    </div>
                    <div className="onboarding-img mt-32">
                      <img src={onboarding3} alt="onboarding-img-3" width={300} height={300} className="m-auto" />
                    </div>
                    <div className="boarding-title mt-32">
                      <h1>Let’s improve your skills together with   <span style={{ color: 'rgb(237 129 51)' }}>Pad</span><span style={{ color: 'rgb(33 140 118)' }}>AI</span> App right now!</h1>
                    </div>
                  </div>
                  <div className="onboarding-next-btn">
                    <a href="/dashboard">Get Started</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slider> */}
      </div>
    </>
  );
};

export default GetStarted;
