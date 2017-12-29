var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "declare @InitialPopOrDenom table \
              ( \
                PatId varchar(25), \
                DateOfVisit smalldatetime, \
                StopDate smalldatetime, \
                StartDate smalldatetime \
              ) \
              declare  @tempTableC table \
              ( \
                PatId varchar(25), \
                DateOfVisit smalldatetime, \
                StopDate smalldatetime, \
                StartDate smalldatetime \
              ) \
              insert into @InitialPopOrDenom \
              select (cqm.PatId), cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from xrxEhr_CQM cqm \
              where \
              ( \
                (cqm.PatId = '"+patId+"') \
                and (cqm.ReasonCode is null) \
                and \
                ( \
                  cqm.Code = '10178000' or cqm.Code = '110473004' or cqm.Code = '112963003' or cqm.Code = '112964009' or cqm.Code = '12163000' or cqm.Code = '231744001' or cqm.Code = '308694002' or cqm.Code = '308695001' or cqm.Code = '313999004' or cqm.Code = '31705006' or cqm.Code = '335636001' or cqm.Code = '336651000' or cqm.Code = '35717002' or cqm.Code = '361191005' or cqm.Code = '385468004' or cqm.Code = '39243005' or cqm.Code = '397544007' or cqm.Code = '404628003' or cqm.Code = '415089008' or cqm.Code = '417493007' or cqm.Code = '418430006' or cqm.Code = '419767009' or cqm.Code = '420260004' or cqm.Code = '420526005' or cqm.Code = '424945000' or cqm.Code = '446548003' or cqm.Code = '46309001' or cqm.Code = '46426006' or cqm.Code = '46562009' or cqm.Code = '50538003' or cqm.Code = '5130002' or cqm.Code = '51839008' or cqm.Code = '54885007' or cqm.Code = '65812008' or cqm.Code = '67760003' or cqm.Code = '69360005' or cqm.Code = '74490003' or cqm.Code = '75814005' or cqm.Code = '79611007' or cqm.Code = '82155009' or cqm.Code = '84149000' or cqm.Code = '85622008' or cqm.Code = '88282000' or cqm.Code = '89153001' or cqm.Code = '9137006' or cqm.Code = '66840' or cqm.Code = '66850' or cqm.Code = '66852' or cqm.Code = '66920' or cqm.Code = '66930' or cqm.Code = '66940' or cqm.Code = '66982' or cqm.Code = '66983' or cqm.Code = '66984' \
                ) \
                and (cqm.DateOfVisit >= '"+fromDate+"') and (cqm.DateOfVisit <= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              insert into @tempTableC \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm \
              where \
              ( \
                (cqm.PatId = '"+patId+"') \
                and \
                (cqm.ReasonCode is null) \
                and \
                ( \
                  cqm.Code = '13767004' or cqm.Code = '172426003' or cqm.Code = '172498005' or cqm.Code = '172548007' or cqm.Code = '18752000' or cqm.Code = '20647004' or cqm.Code = '21491001' or cqm.Code = '223217009' or cqm.Code = '224227005' or cqm.Code = '225184003' or cqm.Code = '287233001' or cqm.Code = '287236009' or cqm.Code = '287242008' or cqm.Code = '30113009' or cqm.Code = '31530007' or cqm.Code = '35552007' or cqm.Code = '360405005' or cqm.Code = '360411008' or cqm.Code = '363726008' or cqm.Code = '37332006' or cqm.Code = '37958004' or cqm.Code = '417297006' or cqm.Code = '430833007' or cqm.Code = '43908008' or cqm.Code = '444600006' or cqm.Code = '445023004' or cqm.Code = '445024005' or cqm.Code = '4503005' or cqm.Code = '45817009' or cqm.Code = '48933009' or cqm.Code = '50737005' or cqm.Code = '51281007' or cqm.Code = '53570002' or cqm.Code = '54085006' or cqm.Code = '54211003' or cqm.Code = '54362002' or cqm.Code = '5671007' or cqm.Code = '58689006' or cqm.Code = '61220009' or cqm.Code = '64340000' or cqm.Code = '66134002' or cqm.Code = '67546003' or cqm.Code = '72199008' or cqm.Code = '74948004' or cqm.Code = '75734004' or cqm.Code = '78191003' or cqm.Code = '78290008' or cqm.Code = '78362007' or cqm.Code = '84016007' or cqm.Code = '84542000' or cqm.Code = '85145001' or cqm.Code = '8813000' or cqm.Code = '89788006' or cqm.Code = '89942008' or cqm.Code = '90997007' or cqm.Code = '9255007' or cqm.Code = '65235' or cqm.Code = '65900' or cqm.Code = '65920' or cqm.Code = '65930' \
                  or cqm.Code = '438601000' or cqm.Code = '76240002' or cqm.Code = '65860' or cqm.Code = '65880' \
                  or cqm.Code = '2536007' or cqm.Code = '30246007' or cqm.Code = '4143006' or cqm.Code = '416773006' or cqm.Code = '49789002' or cqm.Code = '66030' \
                  or cqm.Code = '231751005' or cqm.Code = '231752003' or cqm.Code = '312705004' or cqm.Code = '312706003' or cqm.Code = '312707007' or cqm.Code = '312714009' or cqm.Code = '46562009' or cqm.Code = '65812008' or cqm.Code = '9137006' or cqm.Code = '66820' or cqm.Code = '66825' or cqm.Code = '66830' or cqm.Code = '66852' or cqm.Code = '66986' \
                  or cqm.Code = '231780001' or cqm.Code = '296867007' or cqm.Code = '3499006' or cqm.Code = '48671003' or cqm.Code = '67005' or cqm.Code = '67010' or cqm.Code = '67015' or cqm.Code = '67025' or cqm.Code = '67028' or cqm.Code = '67030' or cqm.Code = '67031' or cqm.Code = '67036' or cqm.Code = '67039' or cqm.Code = '67041' or cqm.Code = '67042' or cqm.Code = '67043' \
                  or cqm.Code = '10006000' or cqm.Code = '12651006' or cqm.Code = '14707009' or cqm.Code = '172451002' or cqm.Code = '172574001' or cqm.Code = '22768003' or cqm.Code = '3938007' or cqm.Code = '4344007' or cqm.Code = '47470009' or cqm.Code = '57103007' or cqm.Code = '68999001' or cqm.Code = '77950003' or cqm.Code = '78917001' or cqm.Code = '85231002' or cqm.Code = '8920006' or cqm.Code = '67101' or cqm.Code = '67105' or cqm.Code = '67107' or cqm.Code = '67108' or cqm.Code = '67110' or cqm.Code = '67112' or cqm.Code = '67141' or cqm.Code = '67145' \
                  or cqm.Code = '10807008' or cqm.Code = '84077007' or cqm.Code = '67250' or cqm.Code = '67255' \
                  or cqm.Code = '120119003' or cqm.Code = '12868007' or cqm.Code = '231741009' or cqm.Code = '66250' \
                ) \
                and \
                (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              select distinct(pop.PatId) \
              from @InitialPopOrDenom pop, @tempTableC tmpc where \
              ( \
                (tmpc.PatId = pop.PatId) \
                and \
                ( \
                  (isNull (tmpc.StartDate, tmpc.DateofVisit) >   isNull (pop.StartDate, pop.DateofVisit)) \
                  and \
                  (isNull (tmpc.StartDate, tmpc.DateofVisit) <= dateadd(day, 30 ,  isNull (pop.StartDate, pop.DateofVisit))) \
	              ) \
             )";


  cqmGuideController.cqmCheck(sql1, function(err, record){
      if(record && record.length > 0)
      {
        callback({criteriaName: "Numerator", isCriteriaQualify : true,  message : null});
      }
      else if(err) {
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : err});
      }
      else {
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Procedure, Performed : Removal Procedures<p align='justify' class='text-danger'>or Excision of Adhesions</p><p align='justify' class='text-danger'>or  Aspiration and Injection Procedures</p><p align='justify' class='text-danger'>or Lens Procedure </p><p align='justify' class='text-danger'>or Vitreous Procedures</p><p align='justify' class='text-danger'>or Retinal Repair Procedures</p><p align='justify' class='text-danger'>or Scleral Procedures</p><p align='justify' class='text-danger'>or Revision Procedures</p><p align='justify' class='text-danger'>Within 30 day(s) after Cataract Surgery</p>"});
      }
  });
}
