import { InterviewProvider, useInterview } from './context/InterviewContext';
import LandingPage from './components/LandingPage';
import SetupPage from './components/SetupPage';
import AptitudeRound from './components/AptitudeRound';
import TechnicalRound from './components/TechnicalRound';
import HRRound from './components/HRRound';
import FinalReport from './components/FinalReport';

function AppRouter() {
  const { state } = useInterview();

  switch (state.currentScreen) {
    case 'landing':
      return <LandingPage />;
    case 'setup':
      return <SetupPage />;
    case 'aptitude':
      return <AptitudeRound />;
    case 'technical':
      return <TechnicalRound />;
    case 'hr':
      return <HRRound />;
    case 'report':
      return <FinalReport />;
    default:
      return <LandingPage />;
  }
}

export default function App() {
  return (
    <InterviewProvider>
      <AppRouter />
    </InterviewProvider>
  );
}
