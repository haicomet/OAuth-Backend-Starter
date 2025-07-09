const axios = require("axios");
const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../auth");

const DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
const CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_AUTH0_CLIENT_SECRET;
const AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;

// Retrieve an access token from the Auth0 Management API
const getManagementToken = async () => {
    try {
        const data = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            audience: AUDIENCE,
        });
        const response = await axios.post(`https://${DOMAIN}/oauth/token`, data, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded', 
            }
        });
        const token = response.data.access_token;
        return token;
    } catch (error) {
        console.error("Error getting Auth0 access token:", error);
        throw(error);
    }
};

// Retrieve a user's IdP Access Tokens from the Auth0 Management API
const getIdentityProviderTokens = async (managementToken, userID) => {
    try {
        const response = await axios.get(`https://${DOMAIN}/api/v2/users/${userID}`, {
            headers: {
                Authorization: `Bearer ${managementToken}`
            }
        });
        const token = response.data;
        return token;
    } catch (error) {
        console.error("Error getting IdP Access Token:", error);
        throw(error);
    }
};

// GET route to retrieve user GitHub IdP token (protected)
router.get("/:id/github-idp-token", authenticateJWT, async (req, res) => {
    try {
        const auth0ID = req.params.id;
        const managementToken = await getManagementToken();
        const userInfo = await getIdentityProviderTokens(managementToken, auth0ID);
        let idpToken = null;
        console.log(userInfo.identities);
        for (const identity of userInfo.identities) {
            if (identity.provider === "github") {
                idpToken = identity.access_token;
                break;
            }
        }
        console.log(idpToken);
        if (idpToken)
            res.status(200).send(idpToken);
        else
            res.status(404).send("User's GitHub IdP Token not found");
    } catch (error) {
        console.error("Error retrieving IdP Token:", error);
        res.sendStatus(500);
    }
});

module.exports = router;