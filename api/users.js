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

// Retrieve a user's IdP Access Token from the Auth0 Management API
const getIdentityProviderToken = async (managementToken, userID) => {
    try {
        const response = await axios.get(`${AUDIENCE}/users/${userID}`, {
            headers: {
                Authorization: `Bearer ${managementToken}`
            }
        });
        const token = response.data;
        console.log("IdP Access Token:", token);
        return token;
    } catch (error) {
        console.error("Error getting IdP Access Token:", error);
        throw(error);
    }
};

// GET route to retrieve user IdP token (protected)
router.get("/:id/idp-token", authenticateJWT, async (req, res) => {
    try {
        const auth0ID = req.params.id;
        const managementToken = await getManagementToken();
        const idpToken = await getIdentityProviderToken(managementToken, auth0ID);
        res.status(200).send(idpToken);
    } catch (error) {
        console.error("Error retrieving IdP Token:", error);
        res.sendStatus(500);
    }
});

module.exports = router;