import { Route, Switch, Redirect } from "react-router-dom";
import KakaoLoginGetCode from "./components/login/KakakLoginGetCode";

import LoginPage from "./pages/LoginPage";


function App() {

  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/login"/>
      </Route>
      
      {/* Login 관련 ROUTE */}
      <Route path="/login" exact>
        <LoginPage/>
      </Route>
      <Route path="/oauth/kakao/callback">
        <KakaoLoginGetCode/>
      </Route>

    </Switch>
  );
}

export default App;
