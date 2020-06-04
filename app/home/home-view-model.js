const Sqlite = require("nativescript-sqlite");
const fecha = require('fecha');
const dialogs = require("tns-core-modules/ui/dialogs");
const observableModule = require("tns-core-modules/data/observable");

function HomeViewModel() {
    let viewModel = observableModule.fromObject({
        onTap: function (args) {
            const page  = args.object.page;
            let err = 0;
            let fnm = page.getViewById("itf_fnm");
            let cnm = page.getViewById("itf_cnm");
            let pno = page.getViewById("itf_pno");
            let ino = page.getViewById("itf_ino");
            let vnm = page.getViewById("itf_vnm");
            let  lbl_fnm = page.getViewById("lbl_fnm");
            let  lbl_cnm = page.getViewById("lbl_cnm");
            let  lbl_pno = page.getViewById("lbl_pno");
            let  lbl_ino = page.getViewById("lbl_ino");
            let  lbl_vnm = page.getViewById("lbl_vnm");
            lbl_fnm.text = lbl_cnm.text = lbl_pno.text = lbl_ino.text = lbl_vnm.text = "";
            if(fnm.text == ''){
                err = 1;
                lbl_fnm.text = "Please enter your full name.";
            }
            if(cnm.text == ''){
                err = 1;
                lbl_cnm.text = "Please enter your company.";
            }
            if(pno.text == ''){
                err = 1;
                lbl_pno.text = "Please enter your phone/mobile number.";
            }
            if(ino.text == ''){
                err = 1;
                lbl_ino.text = "Please enter your ID card number.";
            }
            if(vnm.text == ''){
                err = 1;
                lbl_vnm.text = "Please enter the person you are meeting.";
            }
            if(err==1){
                dialogs.alert({
                    title: "ERROR",
                    message: "Please fill in the missing information",
                    okButtonText: "Close"
                }).then(function () {});
            }else{
                let rdt = fecha.format(new Date(), 'DD/MM/YYYY');
                let itm = fecha.format(new Date(), 'HH:mm:ss');
                let visitorID = 0;
                (new Sqlite("pmxVisLog.db")).then(db => {
                    db.execSQL(
                        "INSERT INTO visitors (fnm,cnm,pno,ino,vnm,rdt,itm,status) VALUES (?,?,?,?,?,?,?,?)", 
                        [fnm.text,cnm.text,pno.text,ino.text,vnm.text,rdt,itm,0]
                    ).then((id) => {
                        lbl_fnm.text = lbl_cnm.text = lbl_pno.text = lbl_ino.text = lbl_vnm.text = "";
                        fnm.text = cnm.text = pno.text = ino.text = vnm.text = null;
                        fnm.focus();
                        dialogs.alert("Visitor Saved").then(function() {});
                        visitorID = id; 
                        console.log(visitorID);
                    }, (e) => {
                        console.log("DB ERROR", e.message);
                    });
                }, error => {
                    console.log("OPEN DB ERROR", error);
                });
            }
        },
    });
    return viewModel;
}

module.exports = HomeViewModel;