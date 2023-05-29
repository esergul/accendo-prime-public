const axios = require('axios');
const { clientId, clientSecret, tenant, leanspaceUrl, ingestionUrl } = require('./config.json');
const { LeanspaceRestClient, Nodes } = require("@leanspace/js-client");

const accessToken = '';
const NODES_ENDPOINT_URL = leanspaceUrl + '/asset-repository/nodes';
const COMMAND_DEF_ENDPOINT_URL = leanspaceUrl + '/commands-repository/command-definitions';
const COMMAND_QUEUE_ENDPOINT_URL = leanspaceUrl + '/commands-repository/command-queues';
const COMMANDS_URL = leanspaceUrl + '/commands-repository/commands';

const client = new LeanspaceRestClient({
    baseURL: leanspaceUrl,
    tenant: tenant,
    username: clientId,
    password: clientSecret,
});

const usageMetrics = new Nodes({ client });

const accumulatedMetrics = await usageMetrics.get("9ed63c6f-244a-4cf2-8da6-d232637c7c9b")
console.log(accumulatedMetrics)

function errorHandler(err) {
    console.error("Error encountered: ", err);
}

const getAssetById = async (nodeId, token = accessToken) => {
    let result = null;
  
    await axios.get(NODES_ENDPOINT_URL + "/" + nodeId, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
        }
    }).then((response)=>{
        result = response;
    }).catch(errorHandler);
   
    return result;
}

const getAsset = async (query, token = accessToken) => {
    let result = null;
  
    await axios.get(NODES_ENDPOINT_URL + `?query=${query}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
        }
    }).then(async (response) => {
        if(response.data.numberOfElements > 0) {
            await getAssetById(response.data.content[0].id, token).then( (response) => {
                result = response.data;
            });
        }
    }).catch(errorHandler);
   
    return result;
}

const getCommandDefinition = async (query, token = accessToken) => {
    let result = null;
  
    await axios.get(COMMAND_DEF_ENDPOINT_URL + `?query=${query}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
        }
    }).then((response)=>{
        result = response;
    }).catch(errorHandler);
   
    return result;
}

const getCommandQueue = async (query, token = accessToken) => {
    let result = null;
  
    await axios.get(COMMAND_QUEUE_ENDPOINT_URL + `?query=${query}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
        }
    }).then((response)=>{
        result = response;
    }).catch(errorHandler);
   
    return result;
}

const createCommand = async (params, token = accessToken) => {
    let result = null;
  
    await axios.post(COMMANDS_URL, params, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
        }
    }).then((response)=>{
        result = response;
    }).catch(errorHandler);
   
    return result;
}

export{getAsset, getCommandDefinition, getCommandQueue, createCommand}