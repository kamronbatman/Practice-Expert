var helper = require("../common/helper.js");

module.exports = function (nqf, meassureName, patId, fromDate, toDate, dctId, fclId, parentDivId) {

  let denom = require("../cqm-scripts/0088/denom.js");
  denom(patId, fromDate, toDate, dctId, fclId, function(dataDenom){

      let meassureInfoDivId = "info0088Div";
      helper.createMeassureInfoDiv(parentDivId, meassureInfoDivId, nqf, meassureName, dataDenom);

      if(dataDenom && dataDenom.isCriteriaQualify){

        let num = require("../cqm-scripts/0088/num.js");
        num(patId, fromDate, toDate, dctId, fclId, function(dataNum){

            if(dataNum && dataNum.isCriteriaQualify){
              helper.appendMessage(meassureInfoDivId, dataNum, true);
            }
            else if(dataNum && !dataNum.isCriteriaQualify) {

              let exp = require("../cqm-scripts/0088/denom-exp.js");
              exp(patId, fromDate, toDate, dctId, fclId, function(dataExp){
                if(dataExp && dataExp.isCriteriaQualify){
                  helper.appendMessage(meassureInfoDivId, dataExp, true);
                }
                else if(dataExp && !dataExp.isCriteriaQualify) {
                  //Other General Instructions attach to a messaure div directly if necessary.
                  $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>Not qualifying for this meassure it could qualify by either : </b></p>" );
                  helper.appendMessage(meassureInfoDivId, dataNum);

                  //Other General Instructions attach to a messaure div directly if necessary.
                  $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );
                  helper.appendMessage(meassureInfoDivId, dataExp);
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
