var helper = require("../common/helper.js");

module.exports = function (nqf, meassureName, patId, fromDate, toDate, dctId, fclId, parentDivId) {

  let cqm0608Denom = require("../cqm-scripts/0608/denom.js");
  cqm0608Denom(patId, fromDate, toDate, dctId, fclId, function(dataDenom){

      let meassureInfoDivId = "info0608Div";
      helper.createMeassureInfoDiv(parentDivId, meassureInfoDivId, nqf, meassureName, dataDenom);

      if(dataDenom && dataDenom.isCriteriaQualify){

        let cqm0608Num = require("../cqm-scripts/0608/num.js");
        cqm0608Num(patId, fromDate, toDate, dctId, fclId, function(dataNum){

            if(dataNum && dataNum.isCriteriaQualify){
              helper.appendMessage(meassureInfoDivId, dataNum, true);
            }
            else if(dataNum && !dataNum.isCriteriaQualify) {

              let cqm0608Exp = require("../cqm-scripts/0608/denom-exp.js");
              cqm0608Exp(patId, fromDate, toDate, dctId, fclId, function(dataExp){
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
