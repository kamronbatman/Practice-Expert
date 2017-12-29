var helper = require("../common/helper.js");

module.exports = function (nqf, meassureName, patId, fromDate, toDate, dctId, fclId, parentDivId) {

  let cqm0419Denom = require("../cqm-scripts/0419/denom.js");
  cqm0419Denom(patId, fromDate, toDate, dctId, fclId, function(dataDenom){

      let meassureInfoDivId = "info0419Div";
      helper.createMeassureInfoDiv(parentDivId, meassureInfoDivId, nqf, meassureName, dataDenom);

      if(dataDenom && dataDenom.isCriteriaQualify){
        let cqm0419Num = require("../cqm-scripts/0419/num.js");
        cqm0419Num(patId, fromDate, toDate, dctId, fclId, function(dataNum){

                  if(dataNum && dataNum.isCriteriaQualify){
                    helper.appendMessage(meassureInfoDivId, dataNum, true);
                  }
                  else if(dataNum && !dataNum.isCriteriaQualify) {


                    let cqm0419DenomExp = require("../cqm-scripts/0419/denom-exp.js");
                    cqm0419DenomExp(patId, fromDate, toDate, dctId, fclId, function(dataDenomExp){

                              if(dataNum && dataNum.isCriteriaQualify){
                                helper.appendMessage(meassureInfoDivId, dataNum, true);
                              }
                              else if(dataNum && !dataNum.isCriteriaQualify) {

                                //Other General Instructions attach to a messaure div directly if necessary.
                                $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>Not qualifying for this meassure it could qualify by either : </b></p>" );
                                helper.appendMessage(meassureInfoDivId, dataNum);

                                //Other General Instructions attach to a messaure div directly if necessary.
                                $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );
                                helper.appendMessage(meassureInfoDivId, dataDenomExp);
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
