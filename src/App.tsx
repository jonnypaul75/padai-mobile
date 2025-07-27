
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import './App.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./assets/styles.css";
import "./assets/media-query.css";
import "./assets/override.css";
import "./assets/chat-bot.css";

import { Route } from 'react-router-dom';

import Dashboard from './pages/dashboard';
import GetStarted from './pages/get-started';
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/react';
import { App as CapacitorApp } from '@capacitor/app';

import { IonReactRouter } from '@ionic/react-router';
import ChapterDetails from './pages/chapter-details';
import ContentViewPage from './pages/content-view/index.tsx';
import { useEffect } from 'react';
import type { PluginListenerHandle } from '@capacitor/core';

const App = () => {
  const ionRouter = useIonRouter();

  useEffect(() => {
    let backHandler: PluginListenerHandle | undefined;

    const setupBackButtonHandler = async () => {
      backHandler = await CapacitorApp.addListener('backButton', () => {
        if (ionRouter.canGoBack()) {
          ionRouter.goBack();
        } else {
          CapacitorApp.exitApp();
        }
      });
    };

    setupBackButtonHandler();

    return () => {
       backHandler?.remove?.();
    };
  }, [ionRouter]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            <GetStarted />
          </Route>
          <Route exact path="/content-view">
            <ContentViewPage />
          </Route>
          <Route path="/chapter-details">
            <ChapterDetails />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )

};

export default App;
