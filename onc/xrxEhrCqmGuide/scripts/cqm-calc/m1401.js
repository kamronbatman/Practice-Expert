var helper = require("../common/helper.js");

module.exports = function (nqf, meassureName, patId, fromDate, toDate, dctId, fclId, parentDivId) {

  let cqm1401Denom = require("../cqm-scripts/1401/denom.js");
  cqm1401Denom(patId, fromDate, toDate, dctId, fclId, function(dataDenom){

      let meassureInfoDivId = "info1401Div";
      helper.createMeassureInfoDiv(parentDivId, meassureInfoDivId, nqf, meassureName, dataDenom);

      if(dataDenom && dataDenom.isCriteriaQualify){

              let cqm1401Num = require("../cqm-scripts/1401/num.js");
              cqm1401Num(patId, fromDate, toDate, dctId, fclId, function(dataNum){

                  if(dataNum && dataNum.isCriteriaQualify){
                    helper.appendMessage(meassureInfoDivId, dataNum, true);
                  }
                  else if(dataNum && !dataNum.isCriteriaQualify) {

                    //Other General Instructions attach to a messaure div directly if necessary.
                    $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>Not qualifying for this meassure it could qualify by either : </b></p>" );
                    helper.appendMessage(meassureInfoDivId, dataDenomExl);

                    //Other General Instructions attach to a messaure div directly if necessary.
                    $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );
                    helper.appendMessage(meassureInfoDivId, dataNum);
                  }
              });
      }
      else if (dataDenom && !dataDenom.isCriteriaQualify) {
        helper.appendMessage(meassureInfoDivId, dataDenom);
      }

  });
};
