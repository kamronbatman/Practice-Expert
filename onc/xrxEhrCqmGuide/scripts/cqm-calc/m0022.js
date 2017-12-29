var helper = require("../common/helper.js");

module.exports = function (nqf, meassureName, patId, fromDate, toDate, dctId, fclId, parentDivId) {

  let cqm0022Denom = require("../cqm-scripts/0022/denom.js");
  cqm0022Denom(patId, fromDate, toDate, dctId, fclId, function(dataDenom){

    let meassureInfoDivId = "info0022Div";
    helper.createMeassureInfoDiv(parentDivId, meassureInfoDivId, nqf, meassureName, dataDenom);

    if(dataDenom && dataDenom.isCriteriaQualify)
    {
      var cqm0022Num1 = require("../cqm-scripts/0022/num1.js");
      cqm0022Num1(patId, fromDate, toDate, dctId, fclId, function(dataNum1){

        if(dataNum1 && dataNum1.isCriteriaQualify){
          helper.appendMessage(meassureInfoDivId, dataNum1, true);
        }
        else if(dataNum1 && !dataNum1.isCriteriaQualify){
            var cqm0022Num2 = require("../cqm-scripts/0022/num2.js");
            cqm0022Num2(patId, fromDate, toDate, dctId, fclId, function(dataNum2){

              if(dataNum2 && dataNum2.isCriteriaQualify){
                helper.appendMessage(meassureInfoDivId, dataNum2, true);
              }
              else if(dataNum2 && !dataNum2.isCriteriaQualify){
                //Other General Instructions attach to a messaure div directly if necessary.
                $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );
                helper.appendMessage(meassureInfoDivId, dataNum1);

                //Other General Instructions attach to a messaure div directly if necessary.
                $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );
                helper.appendMessage(meassureInfoDivId, dataNum2);
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
