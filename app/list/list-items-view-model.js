const Sqlite = require("nativescript-sqlite");
const observableModule = require("tns-core-modules/data/observable");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

function ListItemsViewModel() {
    const items = new ObservableArray([]);
    (new Sqlite("pmxVisLog.db")).then(db => {
        db.all("SELECT * FROM visitors WHERE status=0").then(rows => {
            for(var row in rows) {
                otm = 'N/A'
                if(rows[row][8]!=null)
                    otm = rows[row][8];
                items.push({
                    id: rows[row][0], 
                    fnm: rows[row][1], 
                    cnm: rows[row][2], 
                    pno: rows[row][3], 
                    ino: rows[row][4], 
                    vnm: rows[row][5], 
                    rdt: rows[row][6], 
                    itm: rows[row][7],
                    otm: otm,
                });
            }
        }, error => {
            console.log("SELECT ERROR", error);
        });
    }, error => {
        console.log("OPEN DB ERROR", error);
    });
    const viewModel = observableModule.fromObject({
        items: items,
    });

    return viewModel;
}

module.exports = ListItemsViewModel;