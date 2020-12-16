const axios = require('axios')
const config = require("../config/app.config");

let headers = {
    'Content-Type': 'application/json',
    'x-access-token': ''
};

exports.dbGet = async (path, id, token) => {
    headers["x-access-token"] = token;
    headers.token = id;
    try {
        const resp = await axios({ method: 'GET', url: config.dbServiceUrl + path, headers: headers });
        console.log(resp.data);
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err;
    }
};



exports.dbPost = async function (path, id, data, token) {

    headers.token = id;
    headers["x-access-token"] = token;
    try {
        const resp = await axios({ method: 'POST', url: config.dbServiceUrl + path, headers: headers, data: data });
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err;
    }
}

exports.dbDelete = async function (path, id, data, token) {
    headers.token = id;
    headers["x-access-token"] = token;
    try {
        const resp = await axios({ method: 'DELETE', url: config.dbServiceUrl + path, headers: headers, data: data });
        return resp.data;
    } catch (err) {
        // Handle Error Here
        console.error(err);
        return err;
    }
}