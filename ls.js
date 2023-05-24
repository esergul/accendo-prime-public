const axios = require('axios');
const accessToken = "eyJraWQiOiJRSktrUElqNXFSbzBvWmVSQm51WWVrTEtQSXRLOUdRQXVpcXBjWWpSaEJrPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5OTI3NTVkYy1hNGI0LTQwZWUtYTdjMy03MTVjZDY3NzY1NjMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2V1LWNlbnRyYWwtMV9TSjVSQzdHRFgiLCJjbGllbnRfaWQiOiJucnRqYXBzZDVlZHVqMWNoZmdhNTEwYSIsIm9yaWdpbl9qdGkiOiJlYjQ5NTM0Ny03ZDE5LTQyYzItYTczMi00M2Y1ZDY0NmI4NTUiLCJldmVudF9pZCI6ImYxZmJkNzcxLTJjZmUtNDU2Yi1hM2I5LTk4M2JiMTc1NDI0YSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2ODQ5MjUyNzUsImV4cCI6MTY4NDkyODg3NCwiaWF0IjoxNjg0OTI1Mjc1LCJqdGkiOiI1MDFkM2QzYS1kNWI5LTQ1MTQtYTFmNy05MjZkMmNlMjExNmMiLCJ1c2VybmFtZSI6Ijk5Mjc1NWRjLWE0YjQtNDBlZS1hN2MzLTcxNWNkNjc3NjU2MyJ9.i0P67XzT8EOOQH53KgTuAMUn4EiMUEEduEgtkYcrWQSLKcTYleOp1haa8_DapZHTOWxW2LoKXXEW1_9GFyhvUy0jbEYADFQMx9EJr8oPO0DATqevmU-s49acClbRXQKy1RExfIkBLiGCm3SCC_pKpVnrNRpO9jygrKaSR4LGwlDwqBwAQ3IiieYtNdf_WTxDWigI2p9EcJVpF_CBEcx6VzG-k302CGtsFoMBP9lq-8OmvYZ8s44_W-JpLXWTp1LPjgYo9IOKxoTsTs-vcJNzH6-ExQDqKyNwQsLV6CEt5b6M3VWzoxNujTjXWI3By7-VrkebiZJFyOIoSSU6ZzhO7A";
const API_COMMON_DIR = 'https://api.develop.leanspace.io/';
const NODES_ENDPOINT_URL = API_COMMON_DIR + 'asset-repository/nodes';

const roverName = "controver"; //todo: set accordingly

const getAssetById = async (nodeId, token) => {
    let result = null;
  
    await axios.get(NODES_ENDPOINT_URL + "/" + nodeId, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json' 
        }
    }).then((response)=>{
        result = response;
    }).catch((err)=>{});
   
    return result;
}


const getAsset = async (query, token) => {
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
    }).catch((err)=>{});
   
    return result;
}

