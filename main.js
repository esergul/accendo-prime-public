const dashboardUrl = "https://develop.leanspace.io/services/dashboards/dashboards/25777829-37e7-46f6-bb4c-99ee2390e4e7";

document.addEventListener("DOMContentLoaded", init);

function init(){
    $("#dashBoard").attr(`src`, dashboardUrl);
}