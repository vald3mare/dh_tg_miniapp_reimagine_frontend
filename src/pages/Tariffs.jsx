import Header from '../components/Header/Header';
import TariffSection from '../components/TariffSection/TariffSection';
import PageTransition from '../components/PageTransition/PageTransition';
import './Tariffs.css';

const Tariffs = () => (
  <PageTransition>
    <div className="tariffs-page">
      <Header />
      <TariffSection compact={false} />
    </div>
  </PageTransition>
);

export default Tariffs;
