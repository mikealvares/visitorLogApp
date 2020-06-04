const Sqlite = require("nativescript-sqlite");
const fecha = require('fecha');
const ListItemsViewModel = require("./list-items-view-model");
const dialogs = require("tns-core-modules/ui/dialogs");

function onNavigatingTo(args) {
    //const component = args.object;
    //component.bindingContext = new ListItemsViewModel();
}
function onPageLoaded(args) {
    const component = args.object;
    component.bindingContext = new ListItemsViewModel();
}

function onItemTap(args) {
    const view = args.view;
    const page = view.page;
    const myFrame = page.frame;
    const tappedItem = view.bindingContext;
    const id = tappedItem.id;
    let otm = fecha.format(new Date(), 'HH:mm:ss');
    (new Sqlite("pmxVisLog.db")).then(db => {
        db.execSQL(
            "UPDATE visitors set otm=? WHERE id=?", 
            [otm,id]
        ).then((id) => {
            dialogs.alert("Visitor Has Checked Out.").then(function() {myFrame.navigate("list/list-items-page");});
        }, (e) => {
            console.log("DB ERROR", e.message);
        });
    }, error => {
        console.log("OPEN DB ERROR", error);
    });

}

exports.onPageLoaded = onPageLoaded;
exports.onItemTap = onItemTap;
exports.onNavigatingTo = onNavigatingTo;
