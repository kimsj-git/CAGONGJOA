import React from "react";
import { Route, Redirect } from "react-router-dom";

function AuthRoute({ component: Component, ...rest }) {
    const IsLogin = () => {
        const auth = sessionStorage.getItem("accessToken")
        if (!auth || auth === undefined){
            return false
        } else{
            return true
        }
    }
  return (
    <Route
      {...rest}
      render={(props) =>
          IsLogin() ? <Component {...props}/> : <Redirect to="/login" />
      }
    />
  );
}

export default AuthRoute;