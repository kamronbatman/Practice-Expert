var helper = require("../common/helper.js");

module.exports = function (nqf, meassureName, patId, fromDate, toDate, dctId, fclId, parentDivId){

  var cqm0024Denom = require("../cqm-scripts/0024/denom.js");
  cqm0024Denom(patId, fromDate, toDate, dctId, fclId, function(dataDenom){

    let meassureInfoDivId = "info0024Div";
    helper.createMeassureInfoDiv(parentDivId, meassureInfoDivId, nqf, meassureName, dataDenom);

    if(dataDenom && dataDenom.isCriteriaQualify)
    {
      var cqm0024DenomExl = require("../cqm-scripts/0024/denom-exl.js");
      cqm0024DenomExl(patId, fromDate, toDate, dctId, fclId, function(dataDenomExl){

        if(dataDenomExl && dataDenomExl.isCriteriaQualify)
        {
          helper.appendMessage(meassureInfoDivId, dataDenomExl, true);
        }
        else  if(dataDenomExl && !dataDenomExl.isCriteriaQualify)
        {
            var cqm0024Num1 = require("../cqm-scripts/0024/num1.js");
            cqm0024Num1(patId, fromDate, toDate, dctId, fclId, function(dataNum1){

              if(dataNum1 && dataNum1.isCriteriaQualify)
              {
                helper.appendMessage(meassureInfoDivId, dataNum1, true);
              }
              else if(dataNum1 && !dataNum1.isCriteriaQualify)
              {
                  var cqm0024Num2 = require("../cqm-scripts/0024/num2.js");
                  cqm0024Num2(patId, fromDate, toDate, dctId, fclId, function(dataNum2){

                    if(dataNum2 && dataNum2.isCriteriaQualify)
                    {
                      helper.appendMessage(meassureInfoDivId, dataNum2, true);
                    }
                    else if(dataNum2 && !dataNum2.isCriteriaQualify)
                    {
                      var cqm0024Num3 = require("../cqm-scripts/0024/num3.js");
                      cqm0024Num3(patId, fromDate, toDate, dctId, fclId, function(dataNum3){

                          if(dataNum3 && dataNum3.isCriteriaQualify)
                          {
                            helper.appendMessage(meassureInfoDivId, dataNum3, true);
                          }
                          else if(dataNum3 && !dataNum3.isCriteriaQualify)
                          {
                            //Other General Instructions attach to a messaure div directly if necessary.
                            $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>Not qualifying for this meassure it could qualify by either : </b></p>" );

                            helper.appendMessage(meassureInfoDivId, dataDenomExl);

                            //Other General Instructions attach to a messaure div directly if necessary.
                            $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );

                            helper.appendMessage(meassureInfoDivId, dataNum1);

                            //Other General Instructions attach to a messaure div directly if necessary.
                            $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );

                            helper.appendMessage(meassureInfoDivId, dataNum2);

                            //Other General Instructions attach to a messaure div directly if necessary.
                            $( "#"+meassureInfoDivId).append( "<p align='justify' class='text-muted'><b>or : </b></p>" );

                            helper.appendMessage(meassureInfoDivId, dataNum3);

                          }
                      });

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
