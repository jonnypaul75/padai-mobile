
import { useEffect } from "react";
import padaiIcon from "../assets/images/icons/padai.svg";
import timesIcon from "../assets/images/icons/times.svg";
import settingsIcon from "../assets/images/icons/settings.svg";
import chevronRightIcon from "../assets/images/icons/chevron-right.svg";
import { useSidebarStore } from "../store/sidebarStore";
import { useThemeStore } from "../store/themeStore";

export default function Sidebar() {
  const { isVisible, toggleSidebar } = useSidebarStore();
  const { toggleTheme } = useThemeStore();

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash !== '#modal' && isVisible) {
        toggleSidebar(); // Close modal if hash is removed
      }
    };

    if (isVisible) {
      if (window.location.hash !== '#modal') {
        window.history.pushState(null, '', '#modal');
      }
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isVisible, toggleSidebar]);

  const handleClose = () => {
    if (isVisible) {
      // Going from open → close
      if (window.location.hash === '#modal') {
        window.history.back(); // Remove #modal from URL
      } else {
        toggleSidebar(); // Just close if no hash
      }
    } else {
      toggleSidebar(); // Open and handled in useEffect
    }
  };

  return (
    <>
      <div className={`bg-overlay ${isVisible ? '' : '!hidden'}`} onClick={handleClose}></div>

      <div className={`sidebar ${isVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
        <div className="settings-header border-b border-gray-50">
          <div className="setting-icon mr-0!">
            <img src={padaiIcon} alt="" width={50} height={24} />
          </div>
          <div onClick={handleClose} className="setting-icon-name absolute right-[10px] top-[20px]">
            <img src={timesIcon} alt="" width={14} height={14} />
          </div>
        </div>

        <div className="setting-page-full p-1">
          <div className="setting-page-wrapper">
            <a href="payment-screen.html">
              <div className="setting-deatils">
                <div className="setting-icon">
                  <img src={settingsIcon} alt="" width={24} height={24} />
                </div>
                <div className="icon-name">
                  <p>Preferences</p>
                </div>
                <div className="icon-back-btn">
                  <img src={chevronRightIcon} alt="" width={24} height={24} />
                </div>
              </div>
              <div className="setting-border mt-8"></div>
            </a>

            <a href="notification-option.html" className="mt-8">
              <div className="setting-deatils">
                <div className="setting-icon">
                  <img src={settingsIcon} alt="" width={24} height={24} />
                </div>
                <div className="icon-name">
                  <p>Notification Options</p>
                </div>
                <div className="icon-back-btn">
                  <img src={chevronRightIcon} alt="" width={24} height={24} />
                </div>
              </div>
              <div className="setting-border mt-8"></div>
            </a>

            <a href="language.html" className="mt-8">
              <div className="setting-deatils">
                <div className="setting-icon">
                  <img src={settingsIcon} alt="" width={24} height={24} />
                </div>
                <div className="icon-name">
                  <p>Language</p>
                </div>
                <div className="icon-back-btn">
                  <img src={chevronRightIcon} alt="" width={24} height={24} />
                </div>
              </div>
              <div className="setting-border mt-8"></div>
            </a>

            <div className="setting-deatils justify-between theme-change mt-8">
              <div className="flex items-center">
                <div className="setting-icon">
                  <div className="dz-icon theme-btn bg-pink light">
                    <img src={settingsIcon} alt="" width={24} height={24} />
                  </div>
                </div>
                <div className="icon-name">
                  <p>Dark Mode</p>
                </div>
              </div>
              <div className="notification-option-switch">
                <label className="switch">
                  <input type="checkbox" onChange={toggleTheme} />
                  <span className="slider theme-change"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="setting-border mt-8"></div>
        </div>
      </div>
    </>
  );
}