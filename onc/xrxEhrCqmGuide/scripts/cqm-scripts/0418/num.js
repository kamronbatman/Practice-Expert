var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "declare  @tempTableA table \
            ( \
            	RecNo uniqueidentifier, \
            	EhrRecno uniqueidentifier, \
            	MasterRecno uniqueidentifier, \
            	PatId varchar(25), \
            	DateOfVisit smalldatetime, \
            	StopDate smalldatetime, \
            	StartDate smalldatetime, \
            	Code varchar(25) \
            ) \
            declare  @tempTableB table \
            ( \
              RecNo uniqueidentifier, \
            	EhrRecno uniqueidentifier, \
            	MasterRecno uniqueidentifier, \
            	PatId varchar(25), \
            	DateOfVisit smalldatetime, \
            	StopDate smalldatetime, \
            	StartDate smalldatetime, \
            	Code varchar(25) \
            ) \
            select distinct(pat.PatId) \
            from xrxPat pat \
            where \
            ( \
            	( \
             		pat.patId in \
            		( \
            			select tmpa.PatId \
            			from @tempTableA tmpa, xrxPat pat \
            			where \
            			( \
            				(tmpa.PatId = pat.PatId) \
            				and	 ((select dbo.xrxGetPatAge(pat.Birthdate,null, tmpa.DateOfVisit)) < 18) \
            			) \
            		) \
            		and \
            		( \
            			pat.patId in \
            			( \
            				select tmpa.PatId \
            				from @tempTableA tmpa \
            				inner join \
            				( \
            					select * from xrxEhr_CQM cqm \
            					where \
            					( \
            						(PatId = '"+patId+"') \
            						and \
            						(cqm.MasterRecno is not null) \
            						and \
            						(cqm.Code =	'428171000124102') \
            					) \
                    )tmpCqm \
            				on tmpa.EhrRecno = tmpCqm.MasterRecno \
            			) \
            			or \
            			( \
            				pat.patId in \
            				( \
            					select tmpa.PatId \
            					from @tempTableA tmpa \
            					inner join \
            					( \
            						select * from xrxEhr_CQM cqm \
            						where \
            						( \
            							(PatId = '"+patId+"') \
            							and \
            							(cqm.MasterRecno is not null) \
            							and \
            							(cqm.Code =	'428181000124104') \
            						) \
                      )tmpCqm \
                      on tmpa.EhrRecno = tmpCqm.MasterRecno \
            				) \
            				and \
                    pat.patId in \
            				( \
            					select tmpa.PatId \
            					from @tempTableA tmpa \
            					inner join \
            					( \
            						select * from xrxEhr_CQM cqm \
            						where \
            						( \
            							(PatId = '"+patId+"') \
            							and \
            							( \
            								( \
            									cqm.Code = '10197000' or cqm.Code = '10997001' or cqm.Code = '165171009' or cqm.Code = '165190001' or cqm.Code = '370803007' or cqm.Code = '38756009' or cqm.Code = '45392008' or cqm.Code = '79094001' or cqm.Code = '90407005' \
            								) \
            								or \
            								( \
            									cqm.Code = '183524004' or cqm.Code = '183583007' or cqm.Code = '183851006' or cqm.Code = '183866009' or cqm.Code = '305922005' or cqm.Code = '306136006' or cqm.Code = '306137002' or cqm.Code = '306226009' or cqm.Code = '306227000' or cqm.Code = '306252003' or cqm.Code = '306291008' or cqm.Code = '306294000' or cqm.Code = '308459004' or cqm.Code = '308477009' or cqm.Code = '309627007' or cqm.Code = '390866009' or cqm.Code = '401174001' or cqm.Code = '429387009' or cqm.Code = '61801003' \
            								) \
            								or \
            								( \
            									( \
            										cqm.Code = '1190110' or cqm.Code = '248642' or cqm.Code = '310384' or cqm.Code = '310385' or cqm.Code = '310386' or cqm.Code = '313989' or cqm.Code = '313990' or cqm.Code = '313995' or cqm.Code = '803293' \
            									) \
            								) \
            								or \
            								( \
            									cqm.Code = '372067001' or cqm.Code = '385721005' or cqm.Code = '385724002' or cqm.Code = '385725001' or cqm.Code = '385726000' or cqm.Code = '385727009' or cqm.Code = '385887004' or cqm.Code = '385889001' or cqm.Code = '385890005' or cqm.Code = '401277000' or cqm.Code = '410223002' or cqm.Code = '410224008' or cqm.Code = '410225009' or cqm.Code = '410226005' or cqm.Code = '410227001' or cqm.Code = '410228006' or cqm.Code = '410229003' or cqm.Code = '410230008' or cqm.Code = '410231007' or cqm.Code = '410232000' or cqm.Code = '410233005' or cqm.Code = '410234004' or cqm.Code = '425604002' or cqm.Code = '439141002' or cqm.Code = '5694008' or cqm.Code = '88848003' or cqm.Code = '91310009' \
            								) \
            								or \
            								( \
            									cqm.Code = '225337009' \
            								) \
            							) \
            						) \
                      )tmpCqm \
            					on tmpa.EhrRecno = tmpCqm.MasterRecno \
            					where \
            					( \
            						DATEDIFF(day, tmpa.DateOfVisit, isNull (tmpCqm.StartDate, tmpCqm.DateofVisit)) <= 1 \
            					) \
            				) \
            			) \
            		) \
            	) \
            	or \
            	( \
            		pat.patId in \
            		( \
            			select tmpb.PatId \
            			from @tempTableB tmpb, xrxPat pat \
            			where \
            			( \
            				(tmpb.PatId = pat.PatId) \
            				and	 ((select dbo.xrxGetPatAge(pat.Birthdate,null, tmpb.DateOfVisit)) >= 18) \
            			) \
            		) \
            		and \
            		( \
            			pat.patId in \
            			( \
            				select tmpb.PatId \
            				from @tempTableB tmpb \
            				inner join \
            				( \
            					select * from xrxEhr_CQM cqm \
            					where \
            					( \
            						(PatId = '"+patId+"') \
            						and \
            						(cqm.MasterRecno is not null) \
            						and \
            						(cqm.Code =	'428171000124102') \
            					) \
                    )tmpCqm \
            				on tmpb.EhrRecno = tmpCqm.MasterRecno \
            			) \
            			or \
            			( \
            				pat.patId in \
            				( \
            					select tmpb.PatId \
            					from @tempTableB tmpb \
            					inner join \
            					( \
            						select * from xrxEhr_CQM cqm \
            						where \
            						( \
            							(PatId = '"+patId+"') \
            							and \
            							(cqm.MasterRecno is not null) \
            							and \
            							(cqm.Code =	'428181000124104') \
            						) \
                      )tmpCqm \
            					on tmpb.EhrRecno = tmpCqm.MasterRecno \
            				) \
            				and \
            				pat.patId in \
            				( \
            					select tmpb.PatId \
            					from @tempTableB tmpb \
            					inner join \
            					( \
            						select * from xrxEhr_CQM cqm \
            						where \
            						( \
            							(PatId = '"+patId+"') \
            							and \
            							( \
            								( \
            									cqm.Code = '10197000' or cqm.Code = '10997001' or cqm.Code = '165171009' or cqm.Code = '165190001' or cqm.Code = '370803007' or cqm.Code = '38756009' or cqm.Code = '45392008' or cqm.Code = '79094001' or cqm.Code = '90407005' \
            								) \
            								or \
            								( \
            									cqm.Code = '14129001' or cqm.Code = '183524004' or cqm.Code = '183528001' or cqm.Code = '183583007' or cqm.Code = '183866009' or cqm.Code = '305922005' or cqm.Code = '306136006' or cqm.Code = '306137002' or cqm.Code = '306138007' or cqm.Code = '306204008' or cqm.Code = '306226009' or cqm.Code = '306227000' or cqm.Code = '306252003' or cqm.Code = '306294000' or cqm.Code = '308459004' or cqm.Code = '308477009' or cqm.Code = '390866009' or cqm.Code = '401174001' or cqm.Code = '408293001' or cqm.Code = '429387009' or cqm.Code = '61801003' \
            								) \
            								or \
            								( \
            									( \
            										cqm.Code = '1000048' or cqm.Code = '1000054' or cqm.Code = '1000058' or cqm.Code = '1000064' or cqm.Code = '1000070' or cqm.Code = '1000076' or cqm.Code = '1000097' or cqm.Code = '1041790' or cqm.Code = '107078' or cqm.Code = '1086772' or cqm.Code = '1086778' or cqm.Code = '1086784' or cqm.Code = '1086789' or cqm.Code = '1092185' or cqm.Code = '1098649' or cqm.Code = '1098666' or cqm.Code = '1098670' or cqm.Code = '1098674' or cqm.Code = '1098678' or cqm.Code = '1098710' or cqm.Code = '1099288' or cqm.Code = '1099292' or cqm.Code = '1099296' or cqm.Code = '1099300' or cqm.Code = '1099304' or cqm.Code = '1099316' or cqm.Code = '1111695' or cqm.Code = '1119617' or cqm.Code = '1190110' or cqm.Code = '1232585' or cqm.Code = '1245038' or cqm.Code = '1291263' or cqm.Code = '1298857' or cqm.Code = '1298861' or cqm.Code = '1298870' or cqm.Code = '1301023' or cqm.Code = '1301024' or cqm.Code = '197363' or cqm.Code = '197364' or cqm.Code = '197365' or cqm.Code = '197366' or cqm.Code = '198045' or cqm.Code = '198046' or cqm.Code = '198047' or cqm.Code = '198640' or cqm.Code = '198641' or cqm.Code = '199283' or cqm.Code = '199318' or cqm.Code = '199333' or cqm.Code = '199820' or cqm.Code = '200145' or cqm.Code = '200368' or cqm.Code = '200371' or cqm.Code = '237786' or cqm.Code = '242345' or cqm.Code = '242637' or cqm.Code = '242715' or cqm.Code = '245373' or cqm.Code = '245562' or cqm.Code = '248642' or cqm.Code = '251200' or cqm.Code = '252463' or cqm.Code = '252712' or cqm.Code = '252714' or cqm.Code = '252718' or cqm.Code = '253086' or cqm.Code = '259140' or cqm.Code = '259993' or cqm.Code = '260001' or cqm.Code = '260002' or cqm.Code = '282962' or cqm.Code = '283406' or cqm.Code = '283407' or cqm.Code = '283485' or cqm.Code = '283672' or cqm.Code = '284046' or cqm.Code = '309313' or cqm.Code = '309314' or cqm.Code = '309671' or cqm.Code = '309672' or cqm.Code = '310384' or cqm.Code = '310385' or cqm.Code = '310386' or cqm.Code = '310410' or cqm.Code = '311725' or cqm.Code = '311726' or cqm.Code = '312036' or cqm.Code = '312241' or cqm.Code = '312242' or cqm.Code = '312243' or cqm.Code = '312244' or cqm.Code = '312347' or cqm.Code = '312938' or cqm.Code = '312940' or cqm.Code = '312941' or cqm.Code = '313447' or cqm.Code = '313496' or cqm.Code = '313497' or cqm.Code = '313498' or cqm.Code = '313499' or cqm.Code = '313580' or cqm.Code = '313581' or cqm.Code = '313582' or cqm.Code = '313583' or cqm.Code = '313584' or cqm.Code = '313585' or cqm.Code = '313586' or cqm.Code = '313989' or cqm.Code = '313990' or cqm.Code = '313995' or cqm.Code = '314111' or cqm.Code = '314199' or cqm.Code = '314277' or cqm.Code = '317136' or cqm.Code = '349332' or cqm.Code = '349591' or cqm.Code = '349592' or cqm.Code = '349593' or cqm.Code = '349594' or cqm.Code = '349595' or cqm.Code = '351249' or cqm.Code = '351250' or cqm.Code = '351285' or cqm.Code = '410062' or cqm.Code = '410503' or cqm.Code = '476809' or cqm.Code = '485514' or cqm.Code = '562790' or cqm.Code = '562791' or cqm.Code = '562815' or cqm.Code = '577208' or cqm.Code = '596926' or cqm.Code = '596930' or cqm.Code = '596934' or cqm.Code = '608139' or cqm.Code = '608143' or cqm.Code = '730440' or cqm.Code = '730441' or cqm.Code = '730442' or cqm.Code = '790264' or cqm.Code = '790288' or cqm.Code = '794947' or cqm.Code = '803293' or cqm.Code = '808744' or cqm.Code = '808748' or cqm.Code = '808751' or cqm.Code = '808753' or cqm.Code = '835564' or cqm.Code = '835568' or cqm.Code = '835572' or cqm.Code = '835577' or cqm.Code = '835582' or cqm.Code = '835589' or cqm.Code = '835591' or cqm.Code = '835593' or cqm.Code = '856364' or cqm.Code = '856369' or cqm.Code = '856373' or cqm.Code = '856377' or cqm.Code = '856706' or cqm.Code = '856720' or cqm.Code = '856762' or cqm.Code = '856769' or cqm.Code = '856773' or cqm.Code = '856783' or cqm.Code = '856792' or cqm.Code = '856797' or cqm.Code = '856825' or cqm.Code = '856834' or cqm.Code = '856840' or cqm.Code = '856845' or cqm.Code = '856853' or cqm.Code = '857291' or cqm.Code = '857296' or cqm.Code = '857297' or cqm.Code = '857301' or cqm.Code = '857305' or cqm.Code = '857315' or cqm.Code = '859186' or cqm.Code = '859190' or cqm.Code = '859193' or cqm.Code = '861064' or cqm.Code = '865206' or cqm.Code = '865210' or cqm.Code = '865214' or cqm.Code = '884808' or cqm.Code = '884813' or cqm.Code = '884821' or cqm.Code = '884824' or cqm.Code = '895018' or cqm.Code = '895020' or cqm.Code = '895023' or cqm.Code = '898697' or cqm.Code = '898704' or cqm.Code = '899262' or cqm.Code = '903873' or cqm.Code = '903879' or cqm.Code = '903884' or cqm.Code = '903887' or cqm.Code = '903891' or cqm.Code = '905168' or cqm.Code = '905172' or cqm.Code = '966787' or cqm.Code = '966793' or cqm.Code = '991200' or cqm.Code = '993503' or cqm.Code = '993518' or cqm.Code = '993536' or cqm.Code = '993541' or cqm.Code = '993550' or cqm.Code = '993557' or cqm.Code = '993567' or cqm.Code = '993681' or cqm.Code = '993687' or cqm.Code = '993691' or cqm.Code = '994911' \
            									) \
            								) \
            								or \
            								( \
            									cqm.Code = '372067001' or cqm.Code = '385721005' or cqm.Code = '385724002' or cqm.Code = '385725001' or cqm.Code = '385726000' or cqm.Code = '385727009' or cqm.Code = '385887004' or cqm.Code = '385889001' or cqm.Code = '385890005' or cqm.Code = '401277000' or cqm.Code = '410223002' or cqm.Code = '410224008' or cqm.Code = '410225009' or cqm.Code = '410226005' or cqm.Code = '410227001' or cqm.Code = '410228006' or cqm.Code = '410229003' or cqm.Code = '410230008' or cqm.Code = '410231007' or cqm.Code = '410232000' or cqm.Code = '410233005' or cqm.Code = '410234004' or cqm.Code = '425604002' or cqm.Code = '439141002' or cqm.Code = '5694008' or cqm.Code = '88848003' or cqm.Code = '91310009' \
            								) \
            								or \
            								( \
            									cqm.Code = '225337009' \
            								) \
            							) \
            						) \
            					)tmpCqm \
            					on tmpb.EhrRecno = tmpCqm.MasterRecno \
            					where \
            					( \
            						DATEDIFF(day, tmpb.DateOfVisit, isNull (tmpCqm.StartDate, tmpCqm.DateofVisit)) <= 1 \
            					) \
            				) \
            			) \
            		) \
            	) \
            	or \
            	( \
            		pat.patId in \
            		( \
            			select cqm.PatId \
            			from xrxEhr_CQM cqm \
            			where \
            			( \
            				(PatId = '"+patId+"') \
            				and \
            				( \
            					(cqm.Code = 'G8510') \
            					or \
            					(cqm.Code = 'G8431') \
            				) \
            			) \
            		) \
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
            callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'>MOST RECENT:Occurrence A of Risk Category Assessment: Adolescent/Adult Depression Screening (result: 'Depression Screening Result') during Measurement Period</p> \
                                                                                        <p align='justify' class='text-danger'></p> \
                                                                                        <p align='justify' class='text-danger'>AND</p> \
                                                                                        <p align='justify' class='text-danger'>Occurrence A of Risk Category Assessment: Adolescent Depression Screening (result: 'Negative Depression Screening') during Measurement Period</p> \
                                                                                        <p align='justify' class='text-danger'>OR</p> \
                                                                                        <p align='justify' class='text-danger'>Occurrence A of Risk Category Assessment: Adolescent Depression Screening (result: 'Positive Depression Screening') during Measurement Period </p> \
                                                                                        <p align='justify' class='text-danger'>AND a follow-up plan is documented on the date of the positive screen </p> \
                                                                                      "});
          }
      });

};
