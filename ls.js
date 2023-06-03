const axios = require('axios');
const {clientId, clientSecret, tenant, leanspaceUrl, ingestionUrl } = require('./config.json');

const NODES_ENDPOINT_URL = leanspaceUrl + '/asset-repository/nodes';
const COMMAND_DEF_ENDPOINT_URL = leanspaceUrl + '/commands-repository/command-definitions';
const COMMAND_QUEUE_ENDPOINT_URL = leanspaceUrl + '/commands-repository/command-queues';
const COMMANDS_URL = leanspaceUrl + '/commands-repository/commands/v2';
const TRANSMISSION_URL = leanspaceUrl + '/commands-repository/transmissions';

let cachedAccessToken;

async function getAccessToken(clientId, clientSecret, tenant){
  if(cachedAccessToken && isTokenStillValid(cachedAccessToken)){
    console.log("returning token from cache")
    return cachedAccessToken;
  }
  console.log("there is no token in cache or it has expired, getting a new one.")
  const response = await fetch(`https://${tenant}-develop.auth.eu-central-1.amazoncognito.com/oauth2/token?scope=https://api.leanspace.io/READ&grant_type=client_credentials`,
    {
      method:'POST',
      headers:{
        "Authorization":'Basic ' + Buffer.from(clientId + ":" + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

  if(response.status !=200) throw Error(`Problem with authentication! Http code from service: ${response.status}`)
  let accessTokenWrapper = await response.json();
  cachedAccessToken = accessTokenWrapper.access_token;
  return cachedAccessToken
}

function isTokenStillValid(accessToken){
  const tokenSections = (accessToken || '').split('.');
  if (tokenSections.length < 2) {
     return false;
  }
  const payloadJSON = JSON.parse(Buffer.from(tokenSections[1], 'base64').toString('utf8'));
  const currentSeconds = Math.floor( (new Date()).valueOf() / 1000);
  if (currentSeconds > payloadJSON.exp || currentSeconds < payloadJSON.auth_time) {
      return false;
  }

  return true;
}

function errorHandler(err) {
    console.error("Error encountered: ", err);
}

async function getWrapper(url, token, query, id){
  let result = null;

  await axios.get(url + (query ? `?query=${query}` : `/${id}`), {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
      }
  }).then((response)=>{
      result = response;
  }).catch(errorHandler);

  return result;
}

async function postWrapper(url, token, params){
  let result = null;

  await axios.post(url, params, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
      }
  }).then((response)=>{
      result = response;
  }).catch(errorHandler);

  return result;
}

export const getAsset = async (nodeId, token = cachedAccessToken) =>
  await getWrapper(NODES_ENDPOINT_URL, token, null, nodeId);

export const getCommandDefinition = async (cmdId, token = cachedAccessToken) =>
  await getWrapper(COMMAND_DEF_ENDPOINT_URL, token, null, cmdId);

export const findAsset = async (query, token = cachedAccessToken) => {
    let result = null;

    await axios.get(NODES_ENDPOINT_URL + `?query=${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
        }
    }).then(async (response) => {
        if(response.data.numberOfElements > 0) {
            await getAsset(response.data.content[0].id, token).then( (response) => {
                result = response.data;
            });
        }
    }).catch(errorHandler);

    return result;
}

export const findCommandDefinition = async (query, token = cachedAccessToken) =>
  await getWrapper(COMMAND_DEF_ENDPOINT_URL, token, query, null);

export const findCommandQueue = async (query, token = cachedAccessToken) =>
  await getWrapper(COMMAND_QUEUE_ENDPOINT_URL, token, query, null);

export const findCommand = async (query, token = cachedAccessToken) =>
  await getWrapper(COMMANDS_URL, token, query, null);

export const createCommand = async (params, token = cachedAccessToken) =>
  await postWrapper(COMMANDS_URL, token, params);

export const createTransmission = async (params, token = cachedAccessToken) =>
  await postWrapper(TRANSMISSION_URL, token, params);

await getAccessToken(clientId, clientSecret, tenant);
