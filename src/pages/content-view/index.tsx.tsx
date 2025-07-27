// app/content-view/page.tsx
import { Suspense } from 'react';
import Loader from '../../components/loader';
import ContentViewClient from '../../components/content-viewer/content-view-client';
import { IonContent, IonPage } from '@ionic/react';

export default function ContentViewPage() {
  return (
    <Suspense fallback={<div><Loader visible={true} /></div>}>
      <IonPage>
        <IonContent>
          <ContentViewClient />
        </IonContent>
      </IonPage>

    </Suspense>
  );
}