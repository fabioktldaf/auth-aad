export const msalConfig = {
  auth: {
    clientId: "8006c866-1a41-432a-8d1f-690b7924b126",
    authority: "https://login.microsoftonline.com/35bd1325-af2b-43f0-a106-3efdcfed0b07",
    redirectUri: "https://witty-sand-0686f5710.2.azurestaticapps.net/",
    //redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [
    "email",
    "profile",
    //"User.Export.All",
    //"User.ManageIdentities.All",
    "User.Read",
    //"User.Read.All",
    "User.ReadBasic.All",
  ],
};

export const apiRequestGetAllUsers = {
  url: "https://hello-auth-world.azurewebsites.net/api/GetAllUsers??code=ovIfMxPE7VjiJSGhcx3Hu_yGa8VgrlkCyTkgiPCiBxuiAzFuZeNIRg==",
  //url: "https://hello-auth-world.azurewebsites.net/api/Hello",
  scopes: ["api://8006c866-1a41-432a-8d1f-690b7924b126/user_impersonation"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};

/*
user1@cappiellofabiogmail.onmicrosoft.com   Goma2429
user2@cappiellofabiogmail.onmicrosoft.com   Goma2429
liquidatore@cappiellofabiogmail.onmicrosoft.com Goma2429
admin@cappiellofabiogmail.onmicrosoft.com   Goma2429
*/
