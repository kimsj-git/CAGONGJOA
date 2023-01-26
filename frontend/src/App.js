import { Route, Switch, Redirect } from "react-router-dom";
import KakaoLoginGetCode from "./components/member/login/KakakLoginGetCode";

import LoginPage from "./pages/member/LoginPage";
import SignupPage from "./pages/member/SignupPage";


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
      <Route path="/signup">
        <SignupPage/>
      </Route>

    </Switch>
  );
}

export default App;
