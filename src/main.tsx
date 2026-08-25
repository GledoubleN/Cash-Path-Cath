import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TDSMobileProvider } from '@toss/tds-mobile';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TDSMobileProvider
      userAgent={{
        fontA11y: undefined,
        fontScale: undefined,
        isAndroid: false,
        isIOS: false,
        colorPreference: 'light',
      }}
    >
      <App />
    </TDSMobileProvider>
  </StrictMode>,
);
