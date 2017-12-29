"use strict";

var Connectionobj = {
    
    UserId: null,
    Password: null,
    InitialCatalog: null,
    DataSource: null
};

function parseConnectionString(cnstr) {
    cnstr = cnstr.substring(1);
    cnstr = cnstr.substring(0, cnstr.length-1);
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
                            Connectionobj.Password = value;
                            break;
                        default:
                            break;
                            
                    }
                }
            }
        }
    }
    return Connectionobj;
};

module.exports.parseConnectionString = parseConnectionString;
