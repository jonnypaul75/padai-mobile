import React, { useState, useEffect } from "react";
import { IonTabs, IonRouterOutlet, IonPage } from "@ionic/react";
import { Route, Redirect, useLocation } from "react-router-dom";
import LearnPage from "../learn";
import BottomNavigation from "../../components/footer";
import Media from "../media";
import EduReels from "../edu-reels/page";
import { useChatPanelStore } from "../../store/chatStore";

const Tab1: React.FC = () => (
  <IonPage>
    <LearnPage />
  </IonPage>
);

const Tab2: React.FC = () => (
  <Media />
);

const Tab3: React.FC = () => (
  <EduReels />
);

const Dashboard: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard/tab1");
  const { toggle, isOpen } = useChatPanelStore();

  useEffect(() => {
    const currentTab = location.pathname.replace(/^\/+/, ""); // e.g., 'dashboard/tab2'
    setActiveTab(currentTab);
    console.log(activeTab)

    if (isOpen) {
      toggle(); // Close chat
    }
  }, [location.pathname]);

  return (
    <IonTabs>
      <IonRouterOutlet animated={false}>
        <Route exact path="/dashboard/tab1" component={Tab1} />
        <Route exact path="/dashboard/tab2" component={Tab2} />
        <Route exact path="/dashboard/tab3" component={Tab3} />
        <Route exact path="/dashboard">
          <Redirect to="/dashboard/tab1" />
        </Route>
      </IonRouterOutlet>

      <BottomNavigation toggleChat={toggle} />
    </IonTabs>
  );
};

export default Dashboard;
