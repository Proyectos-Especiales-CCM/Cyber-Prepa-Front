import { Header } from "components/Header"
import { Outlet } from "react-router-dom"

const PublicRouter = () => {
  return (
    <div>
     <Header />
          <Outlet />
     <Footer />
    </div>
  )
}

export default PublicRouter
