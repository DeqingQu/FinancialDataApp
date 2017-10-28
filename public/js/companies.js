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

function listAllCompanies() {
	$.ajax({
		type: "get",
		url:"http://localhost:3000/api/companies/",
		async: true,
		dataType:"json",
		success: function(data) {
			alert(JSON.stringify(data));
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		}
	});
}

/*INIT*/
$('document').ready(function(){

	//	get all companies
	listAllCompanies();

	//	bind click event for delete_company class button
	$('.company_delete_btn').click(function(){
		// get company_id from id of DOM, id = 'delete_company_%d'
		var company_id = $(this).attr('id').substring("company_delete_btn_".length);
		var company_name = $(this).parent().parent().children('.company_name').text();
		var msg = "Are you sure delete " + company_name;
		if (confirm(msg) == true) {
			deleteCompany(company_id);
			return true;
		}
		else {
			return false;
		}
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
