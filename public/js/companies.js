//action:getClassList
function deleteCompany(company_id){
	$.ajax({
		type: "delete",
		url:"http://localhost:3000/api/companies/" + company_id,
		async: true,
		dataType:"json",
		success: function(data) {
			window.location.reload();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		}
	});
};

/*INIT*/
$('document').ready(function(){
	//bind click event for add class button
	$('#delete_company_86').click(function(){
		deleteCompany(86);
	});
	// //Show classes
	// getClassList();
	//
	// //Add class (bind click event for post class button)
	// $('#dialog .addClassForm .submitBtn').click(function(){
	// 	if($('#dialog .addClassForm form').checkForm()==true){
	// 		//alert(JSON.stringify($('#dialog .addClassForm form').serializeForm()));			//For test
	// 		createNewClass();
	// 		$('#dialog .addClassForm .close').trigger('click');
	// 		getClassList();
	// 	}
	// });
});
