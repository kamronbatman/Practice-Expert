var Cmdargs = {};
var Connectionobj = {
    
    UserId: null,
    password: null,
    InitialCatalog: null,
    DataSource: null
};

exports.parseCommandLineArgs = function (str) {
    
    var args_array = str.match(/(\/((([A-Z])\w+):(\S+)))/g);
    
    if (args_array) {
        
        if (args_array.length > 0) {
            var i;
            for (i = 0; i < args_array.length; i++) {
                
                var key = args_array[i].substring(args_array[i].indexOf("/") + 1, args_array[i].indexOf(":"));
                var value = (args_array[i].substring((args_array[i].indexOf(":")) + 1, args_array[i].length));
                Cmdargs[key] = value.replace(/\|/g, " ");

                if (key == "ConnectionString") {

                    parseConnectionString(Cmdargs[key]);

                }
      
            }
       }

    }
   
};

exports.getcommandLineArgs = function () {
    return Cmdargs;
};

exports.getdbConnectionParas = function () {
    return Connectionobj;
};

function parseConnectionString(cnstr) {
    var cnstr_array = (cnstr).split(";");
    
    if (cnstr_array) {
        if (cnstr_array.length > 0) {
            var i;
            for (i = 0; i < cnstr_array.length; i++) {
                
                var cnstr_part = (cnstr_array[i]).split("=");
                if (cnstr_part.length > 1) {
                    
                    var key = cnstr_part[0];
                    var value = cnstr_part[1];
                    
                    switch (key.toLowerCase()) {
                        case "data source":
                            Connectionobj.DataSource = value;
                            break;
                        case "initial catalog":
                            Connectionobj.InitialCatalog = value;
                            break;
                        case "user id":
                            Connectionobj.UserId = value;
                            break;
                        case "password":
                            Connectionobj.password = value;
                            break;
                        default:
                            break;
                            
                    }
                        

                        
              
                }
            }
        }
    }
}


   