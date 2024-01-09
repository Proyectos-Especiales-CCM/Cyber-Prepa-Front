import { Outlet } from 'react-router-dom';
import { Header, Footer } from '../components';

const PublicRouter = () => {
  return (
    <>
      <Header/>
        <Outlet />
      <Footer />
    </>
  );
};

export default PublicRouter;
