import Header from '../components/Header/Header';
import ExecutorProfile from '../components/ExecutorProfile/ExecutorProfile';
import PageTransition from '../components/PageTransition/PageTransition';

const ExecutorProfilePage = () => {
  return (
    <PageTransition>
      <div className="home-page">
        <Header />
        <ExecutorProfile />
      </div>
    </PageTransition>
  );
};

export default ExecutorProfilePage;
