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
			for (i in data) {
				var company = data[i];
				var company_name_td = "<td class='company_name'>" + company['company_name'] + "</td>";
				var company_symbol_td = "<td><a href='https://finance.google.com/finance?q="
					+ company['ticker_symbol'] + "'>" + company['ticker_symbol'] + "</a></td>";
				var company_related_td = "<td>" + company['related_companies'] + "</td>";
				var update_td = "<td><a href='update?company_id=" + company['company_id'] + "'</a>Update</td>";
				var delete_td = "<td><a class='company_delete_btn' id=company_delete_btn_"
					+ company['company_id'] + " href='#'>Delete</a></td>";
				$('#company_tbody').append("<tr>" + company_name_td + company_symbol_td
					+ company_related_td + update_td + delete_td + "</tr>")
			}

			bindDeleteFunction();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(XMLHttpRequest.status);
			alert(XMLHttpRequest.readyState);
			alert(textStatus);
		}
	});
}

function bindDeleteFunction() {
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
}

/*INIT*/
$('document').ready(function(){

	//	get all companies
	listAllCompanies();

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
