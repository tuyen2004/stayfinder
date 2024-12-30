  
import MenuAdmin from './components/AdminApp/MenuAdmin';
import { Outlet } from 'react-router-dom';

function AppAdmin() {  
  return (  
    <div className="wrapper">
    <nav> <MenuAdmin />  </nav>
      <main>
         <Outlet/>
      </main>
    </div>
  );  
}  

export default AppAdmin;