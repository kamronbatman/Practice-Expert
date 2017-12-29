var helper = require("../common/helper.js");

module.exports = function (nqf, meassureName, patId, fromDate, toDate, dctId, fclId, parentDivId){

    let denom = require("../cqm-scripts/0421/denom.js");
    denom(patId, fromDate, toDate, dctId, fclId, function(dataDenom){

        let meassureInfoDivId = "info0421Div";
        helper.createMeassureInfoDiv(parentDivId, meassureInfoDivId, nqf, meassureName, dataDenom);

        if(dataDenom && dataDenom.isCriteriaQualify)
        {
            var denomExl = require("../cqm-scripts/0421/denom-exl.js");
            denomExl(patId, fromDate, toDate, dctId, fclId, function(dataDenomExl){
              if(dataDenomExl && dataDenomExl.isCriteriaQualify)
              {
                  helper.appendMessage(meassureInfoDivId, dataDenomExl, true);
              }
              else  if(dataDenomExl && !dataDenomExl.isCriteriaQualify)
              {
                var num1 = require("../cqm-scripts/0421/num1.js");
                num1(patId, fromDate, toDate, dctId, fclId, function(dataNum){

                    if(dataNum && dataNum.isCriteriaQualify)
                    {
                      helper.appendMessage(meassureInfoDivId, dataNum, true);
                    }
                    else if(dataNum && !dataNum.isCriteriaQualify)
                    {

                      var num2 = require("../cqm-scripts/0421/num2.js");
                      num2(patId, fromDate, toDate, dctId, fclId, function(dataNum2){

                          if(dataNum2 && dataNum2.isCriteriaQualify)
                          {
                            helper.appendMessage(meassureInfoDivId, dataNum2, true);
                          }
                          else if(dataNum2 && !dataNum2.isCriteriaQualify)
                          {

                            //Other General Instructions attach to a messaure div directly if necessary.
                            $("#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>Not qualifying for this meassure it could qualify by either : </b></p>" );

                            helper.appendMessage(meassureInfoDivId, dataDenomExl);

                            //Other General Instructions attach to a messaure div directly if necessary.
                            $("#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );

                            helper.appendMessage(meassureInfoDivId, dataNum);

                            //Other General Instructions attach to a messaure div directly if necessary.
                            $("#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );

                            helper.appendMessage(meassureInfoDivId, dataNum2);
                          }
                      });




                    }
                });

              }
            });
        }
        else if (dataDenom && !dataDenom.isCriteriaQualify) {

          helper.appendMessage(meassureInfoDivId, dataDenom);
        }

    });
};
