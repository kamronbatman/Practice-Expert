var helper = require("../common/helper.js");

module.exports = function (nqf, meassureName, patId, fromDate, toDate, dctId, fclId, parentDivId) {
    let cqm0033Denom = require("../cqm-scripts/0033/denom.js");
    cqm0033Denom(patId, fromDate, toDate, dctId, fclId, function(dataDenom){

      let meassureInfoDivId = "info0033Div";
      helper.createMeassureInfoDiv(parentDivId, meassureInfoDivId, nqf, meassureName, dataDenom);

        if(dataDenom && dataDenom.isCriteriaQualify){
          var cqm0033DenomExl = require("../cqm-scripts/0033/denom-exl.js");
          cqm0033DenomExl(patId, fromDate, toDate, dctId, fclId, function(dataDenomExl){

            if(dataDenomExl && dataDenomExl.isCriteriaQualify)
            {
                helper.appendMessage(meassureInfoDivId, dataDenomExl, true);
            }
            else  if(dataDenomExl && !dataDenomExl.isCriteriaQualify)
            {
              var cqm0033Num = require("../cqm-scripts/0033/num.js");
              cqm0033Num(patId, fromDate, toDate, dctId, fclId, function(dataNum){

                  if(dataNum && dataNum.isCriteriaQualify)
                  {
                    helper.appendMessage(meassureInfoDivId, dataNum, true);
                  }
                  else if(dataNum && !dataNum.isCriteriaQualify)
                  {

                    //Other General Instructions attach to a messaure div directly if necessary.
                    $("#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>Not qualifying for this meassure it could qualify by either : </b></p>" );

                    helper.appendMessage(meassureInfoDivId, dataDenomExl);

                    //Other General Instructions attach to a messaure div directly if necessary.
                    $("#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );

                    helper.appendMessage(meassureInfoDivId, dataNum);
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
