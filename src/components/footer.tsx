import React from 'react';
import {
  IonTabBar,
  IonTabButton,
  IonIcon
} from '@ionic/react';
import { useLocation } from 'react-router-dom';
import homeIcon from '../assets/images/icons/home-icon.svg';
import audioIcon from '../assets/images/icons/audio-boom.svg';
import videoMediaIcon from '../assets/images/icons/video-media.svg';
import { chatbubbleEllipses } from 'ionicons/icons';
import { useChatPanelStore } from '../store/chatStore';

interface BottomNavigationProps {
  toggleChat: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ toggleChat }) => {
  const location = useLocation();
  const currentPath = location.pathname.replace(/^\/+/, ''); // remove leading slash

  const { isOpen } = useChatPanelStore();

  const handleChatIconClick = () => {
    toggleChat();
  };

  return (
    <div id="bottom-navigation">
      <div className="container">
        <div className="home-navigation-menu">
          <div className="bottom-panel nagivation-menu-wrap">
            <IonTabBar slot="bottom" className={`bootom-tabbar ${isOpen ? 'overflow-hidden' : ''}`} id='bootom-tabbar'>
              <IonTabButton
                tab="dashboard"
                href="/dashboard/tab1"
                className={currentPath === 'dashboard/tab1' ? 'tab-active' : ''}
              >
                <span>
                  <img src={homeIcon} alt="Home" />
                </span>
                <div className={'orange-boder ' + (currentPath === 'dashboard/tab1' ? 'active' : '')}></div>
              </IonTabButton>
              <IonTabButton
                tab="media"
                href="/dashboard/tab2"
                className={currentPath === 'dashboard/tab2' ? 'tab-active' : ''}
              >
                <span>
                  <img src={audioIcon} alt="Audio" />
                </span>
                <div className={'orange-boder ' + (currentPath === 'dashboard/tab2' ? 'active' : '')}></div>
              </IonTabButton>
              <IonTabButton
                tab="edu-reels"
                href="/dashboard/tab3"
                className={currentPath === 'dashboard/tab3' ? 'tab-active' : ''}
              >
                <span>
                  <img src={videoMediaIcon} alt="Video" />
                </span>
                <div className={'orange-boder ' + (currentPath === 'dashboard/tab3' ? 'active' : '')}></div>
              </IonTabButton>
              <IonTabButton>
                <IonIcon
                  onClick={handleChatIconClick}
                  icon={chatbubbleEllipses}
                  style={{ fontSize: '24px', width: '24px', height: '24px' }}
                />
              </IonTabButton>
            </IonTabBar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
