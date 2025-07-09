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

module.exports = router;