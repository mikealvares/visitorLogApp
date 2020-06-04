const email = require("nativescript-email");
const Sqlite = require("nativescript-sqlite");
const observableModule = require("tns-core-modules/data/observable");
const fileSystemModule = require("tns-core-modules/file-system");
const dialogs = require("tns-core-modules/ui/dialogs");

function EmailViewModel() {

    const viewModel = observableModule.fromObject({
        onTap: function (args) {
            const page = args.object.page;
            const vm = page.bindingContext;
            const documents = fileSystemModule.knownFolders.documents();
            const folder = documents.getFolder("testFolder");
            const file = folder.getFile("visitorLog.csv");
            let cnt = 0;
            let visData = 'Date, Name, Company, Phone, ID, Person visiting, In Time, Out Time \n';
            let err = 0;
            let unm = page.getViewById("itf_unm");
            let lbl_unm = page.getViewById("lbl_unm");
            lbl_unm.text = "";
            if(unm.text != 'Mosta1234!'){
                err = 1;
                lbl_unm.text = "Please enter valid password.";
            }
            if(err==1){
                dialogs.alert({
                    title: "ERROR",
                    message: "Please fill in the missing information",
                    okButtonText: "Close"
                }).then(function () {});
            }else{
                (new Sqlite("pmxVisLog.db")).then(db => {
                    db.all("SELECT * FROM visitors WHERE status=0").then(rows => {
                        for(var row in rows) {
                            cnt = 1;
                            visData += rows[row][6] + ',' + rows[row][1] + ',' + rows[row][2] + ',' + rows[row][3] + ',' + rows[row][4] + ',' + rows[row][5] + ',' + rows[row][7] + ',' + rows[row][8] + '\n';
                        }
                        file.writeText(visData).then((result) => {
                            file.readText().then((res) => {
                                console.log(file.path)
                                email.compose({
                                    subject: "Visitor Export Log",
                                    body: "Visitor export log.",
                                    to: ['test@test.com'],
                                    cc: ['test1@test.com'],
                                    attachments: [
                                        {
                                            fileName: 'visitorLog.csv',
                                            path: file.path,
                                            mimeType: 'text/csv'
                                        },
                                    ]
                                }).then(
                                    function() {
                                        (new Sqlite("pmxVisLog.db")).then(db => {
                                            db.all("SELECT * FROM visitors WHERE status=0").then(rows => {
                                                for(var row in rows) {
                                                    let id = rows[row][0];
                                                    db.execSQL(
                                                        "UPDATE visitors set status=1 WHERE id=?", 
                                                        [id]
                                                    ).then((id) => {
                                                    }, (e) => {
                                                        console.log("DB ERROR", e.message);
                                                    });
                                                }
                                            }, error => {
                                                console.log("SELECT ERROR", error);
                                            });
                                        }, error => {
                                            console.log("OPEN DB ERROR", error);
                                        });
                                    }, function(err) {
                                        console.log("Error: " + err);
                                });
                            });
                        }).catch((err) => {
                            console.log(err);
                        });
                    }, error => {
                        console.log("SELECT ERROR", error);
                    });
                }, error => {
                    console.log("OPEN DB ERROR", error);
                });
            }
        },
    });
    return viewModel;
}

module.exports = EmailViewModel;
