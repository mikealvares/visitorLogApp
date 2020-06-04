const Sqlite = require("nativescript-sqlite");
const HomeViewModel = require("./home-view-model");
/*
    DB:
    id : PK AI
    fnm: persons full name
    cnm: company name
    pno: phone number
    ino: id number
    vnm: visitors name
    rdt: date visited
    itm: in time
    otm: out time
    status: 1 is exported
    fnm,cnm,pno,ino,vnm,rdt,itm,otm,status
*/
function onNavigatingTo(args) {
    const component = args.object;
    component.bindingContext = new HomeViewModel();
    (new Sqlite("pmxVisLog.db")).then(db => {
        db.execSQL("CREATE TABLE IF NOT EXISTS visitors (id INTEGER PRIMARY KEY AUTOINCREMENT, fnm TEXT, cnm TEXT, pno TEXT, ino TEXT, vnm TEXT, rdt TEXT, itm TEXT, otm TEXT, status INTEGER)").then(id => {
            component.bindingContext = createViewModel(db);
        }, error => {
            console.log("CREATE TABLE ERROR", error);
        });
    }, error => {
        console.log("OPEN DB ERROR", error);
    });
}
exports.onNavigatingTo = onNavigatingTo