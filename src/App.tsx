import React, { useState, useEffect } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { apiRequestHello, loginRequest } from "./config/authConfig";
import { EndSessionPopupRequest } from "@azure/msal-browser";

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    if (isAuthenticated) {
      instance
        .acquireTokenSilent({ ...loginRequest, account: accounts[0] })
        .then((resp) => {
          const { account, scopes, expiresOn, accessToken } = resp;
          const { name, username } = account!;

          instance.setActiveAccount(accounts[0]);

          setUserData({
            accessToken,
            expiresOn,
            name,
            username,
            scopes: [...scopes],
          });
        })
        .catch(console.log);
    } else setUserData(undefined);
  }, [isAuthenticated, accounts, instance]);

  const handleCallHelloFunction = async () => {
    const headers = new Headers();
    const bearer = `Bearer ${userData.accessToken}`;

    headers.append("Authorization", bearer);

    try {
      const resp = await fetch(apiRequestHello.url, {
        method: "GET",
        headers,
      });

      const json = await resp.json();

      console.log("Hello Api response : ", json);
    } catch (err) {
      console.log(err);
    }
  };

  const renderAuth = () => {
    return (
      <AuthenticatedTemplate>
        <div style={{ margin: "2em" }}>
          <button
            onClick={() =>
              instance.logoutPopup({
                postLogoutRedirect: "/",
                mainWindowRedirectUri: "/",
              } as EndSessionPopupRequest)
            }
          >
            Logout
          </button>
          {userData && (
            <div style={{ marginTop: "2em" }}>
              <div>Name: {userData.name}</div>
              <br />
              <div>Username: {userData.username}</div>
              <br />
              <div>Access Token: {userData.accessToken}</div>
              <br />
              <div>Expires On: {userData.expiresOn.toString()}</div>
              <br />
              <div>Scopes: {userData.scopes.join(", ")}</div>
              <br />
              <p>
                <button onClick={() => handleCallHelloFunction()}>Call Hello Function</button>
              </p>
            </div>
          )}
        </div>
      </AuthenticatedTemplate>
    );
  };

  const renderNotAuth = () => {
    return (
      <UnauthenticatedTemplate>
        <button onClick={() => instance.loginPopup(loginRequest)}>Login</button>
      </UnauthenticatedTemplate>
    );
  };

  return (
    <div>
      <p>0.0.1</p>
      {isAuthenticated ? renderAuth() : renderNotAuth()}
    </div>
  );
}

export default App;
