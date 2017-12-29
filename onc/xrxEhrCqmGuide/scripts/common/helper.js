
module.exports.createMeassureInfoDiv = function(parentDivId, divId, nqf, messuareName, data){

  if(data && (data.isCriteriaQualify) || (!data.isCriteriaQualify && data.message)){
    $("#"+parentDivId).append("<div id="+divId+" class='alert alert-dismissible alert-info'><button type='button' class='close' data-dismiss='alert'>&times;</button> \
      <strong>"+messuareName+"</strong> \
      <button type='button' class='btn btn-link' onclick='viwDoc(\""+nqf+"\")'><i class='fa fa-file-code-o' aria-hidden='true'></i></button> \
      <hr /> \
    </div>");
  }
}

module.exports.appendMessage = function(divId, data, isMeasureQualify){

  if(isMeasureQualify){
    $( "#"+divId).append( "<p align='justify' class='text-success'><b> Messuare, Qualify.</b></p>" );
  }
  else{
    if(data.message){
        $( "#"+divId).append( "<p align='justify' class='text-danger'><b><u>"+data.criteriaName+"</u>,  "+data.message+"</b></p>" );
    }
  }
}
