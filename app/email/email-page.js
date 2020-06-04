const EmailViewModel = require("./email-view-model");
const permissions = require('nativescript-permissions');

function onNavigatingTo(args) {}
function onPageLoaded(args) {
   permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "To save the data before export").then( () => {}).catch( () => {});
   permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "To save the data before export").then( () => {}).catch( () => {});
   const component = args.object;
   component.bindingContext = new EmailViewModel();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onPageLoaded = onPageLoaded;