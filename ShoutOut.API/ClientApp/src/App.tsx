import './locales/i18n';
import 'simplebar-react/dist/simplebar.min.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'react-quill/dist/quill.snow.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { store, persistor } from './redux/store';
import Router from './routes';
import ThemeProvider from './theme';
import ThemeLocalization from './locales';
import SnackbarProvider from './components/snackbar';
import ScrollToTop from './components/scroll-to-top';
import { MotionLazyContainer } from './components/animate';
import { ThemeSettings, SettingsProvider } from './components/settings';
import { AuthProvider } from './auth/JwtContext';
import SignalRHubProvider from './middlewares/SignalRHubProvider';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SettingsProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <MotionLazyContainer>
                    <ThemeProvider>
                      <ThemeSettings>
                        <ThemeLocalization>
                          <SnackbarProvider>
                            <SignalRHubProvider>
                              <Router />
                            </SignalRHubProvider>
                          </SnackbarProvider>
                        </ThemeLocalization>
                      </ThemeSettings>
                    </ThemeProvider>
                  </MotionLazyContainer>
                </BrowserRouter>
              </SettingsProvider>
            </LocalizationProvider>
          </PersistGate>
        </ReduxProvider>
      </HelmetProvider>
    </AuthProvider>
  );
}
