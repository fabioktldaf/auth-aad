import React, { useState, useEffect } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated } from "@azure/msal-react";
import { useMsal } from "@azure/msal-react";
import { apiRequestGetAllUsers, loginRequest } from "./config/authConfig";
import { EndSessionPopupRequest } from "@azure/msal-browser";
import { graphConfig } from "./config/authConfig";

export async function callMsGraph(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  try {
    const response = await fetch(graphConfig.graphMeEndpoint, {
      method: "GET",
      headers,
    });

    return await response.json();
  } catch (err: any) {
    console.log(err);
  }
}

function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const [userData, setUserData] = useState<any>();
  const [allUsers, setAllUsers] = useState<any>([]);

  useEffect(() => {
    if (isAuthenticated) {
      instance
        .acquireTokenSilent({ ...loginRequest, account: accounts[0] })
        .then((resp) => {
          const { account, scopes, expiresOn, accessToken } = resp;
          const { name, username } = account!;

          console.log("resp ", resp);
          console.log("account ", accounts[0]);
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
      const resp = await fetch(apiRequestGetAllUsers.url, {
        method: "GET",
        headers,
      });

      const json = await resp.json();
      if (json.result === "ok") setAllUsers(json.data);

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
                <button onClick={() => handleCallHelloFunction()}>Call GetAllUsers Function</button>
              </p>
              <br />
              {allUsers && allUsers.length > 0 && (
                <div>
                  {allUsers.map((user: any, index: number) => (
                    <div key={index} style={{ marginBottom: "1em", border: "1px solid #aaa", padding: "1em 2em" }}>
                      <div>id: {user.id}</div>
                      <br />
                      <div>@odata.type: {user["@odata.type"]}</div>
                      <br />
                      <div>displayName: {user.displayName}</div>
                      <br />
                      <div>givenName: {user.givenName}</div>
                      <br />
                      <div>surname: {user.surname}</div>
                      <br />
                      <div>userPrincipalName: {user.userPrincipalName}</div>
                    </div>
                  ))}
                </div>
              )}
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
