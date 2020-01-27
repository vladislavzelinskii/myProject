

function ready() {

	var Stores2 = httpGet('http://localhost:3000/api/Stores');
	var template = document.querySelector('#row');
	for (let i = 0; i < Stores2.length; i++) {
		let mas = Stores2[i];
		let clone = template.content.cloneNode(true);
		let cells = clone.querySelectorAll('div.stroka');
		cells[0].textContent = mas.Name;
		cells[1].textContent = mas.Address;
		cells[2].textContent = mas.FloorArea;
		cells[3].textContent = "sq. m";
		template.parentNode.appendChild(clone);
		document.getElementsByTagName("li")[i].setAttribute("id", "store"+i);



		let idOfElement = document.getElementsByTagName("li")[i].getAttribute("id");
		let elementById = document.getElementById(idOfElement);
		let id = mas.id;
		elementById.addEventListener("click", function(){loadStore(id)});
	}


	var modal = document.getElementById('modalStore');
	var btn = document.getElementById("storeCreate");
	var span = document.getElementsByClassName("create-store-cancel")[0];


	btn.onclick = function() {
		modal.style.display = "block";
	}
	span.onclick = function() {
		modal.style.display = "none";
	}


	var form1 = document.getElementById('modalStore');
	var field1 = form1.querySelectorAll("input");
	var error1 = form1.querySelectorAll(".error");

	form1.addEventListener("submit", function(){validation(field1, " ", " ")});


}


function validation(field, a, b) {
	var flag = 0;

	field.forEach(function(userItem) {
		if (userItem.validity.valueMissing) {

			userItem.className = "border actborder"
			nextNode = userItem.nextSibling.nextSibling.nextSibling;

			nextNode.innerHTML = "Enter mandatory field!";
			nextNode.className = "error active";

		flag = 1;
		} else {
			userItem.classList.remove("actborder");
			nextNode = userItem.nextSibling.nextSibling.nextSibling;
			nextNode.innerHTML = " ";
			nextNode.classList.remove("active")
		}

	});

	if (flag) {
		var modal = document.getElementById('modalError');
		var span = document.getElementsByClassName("modal-error-button")[0];

		modal.style.display = "block";

		span.onclick = function() {
			modal.style.display = "none";
		}

		event.preventDefault();

	} else {
		if (a == " " && b == " ") {
			myFormStore();
		} else if (a != " " && b == " ") {
			myFormProduct(a)
		} else if (a != " " && b != " ") {
			myFormProductEdit(a, b)
		}
	}

}


function myFormStore() {
	let myForm = document.getElementById('modalStore');
	var formData = new FormData(myForm);

	formObj = {};
	for (var pair of formData.entries()) {
		formObj[pair[0]] = pair[1]
	}
	
	var xmlHttp = new XMLHttpRequest();

	xmlHttp.open( "POST", "http://localhost:3000/api/Stores", false );
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	xmlHttp.send(JSON.stringify(formObj));

}

function myFormProduct(a) {
	let myForm = document.getElementById('modalProduct');
	var formData = new FormData(myForm);

	formObj = {};
	for (var pair of formData.entries()) {
		formObj[pair[0]] = pair[1]
	}

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.open( "POST", `http://localhost:3000/api/Stores/${a}/rel_Products`, false );
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	xmlHttp.send(JSON.stringify(formObj));

}

function myFormProductEdit(a, b) {

	let myForm = document.getElementById('modalProductEdit');
	var formData = new FormData(myForm);

	formObj = {};
	for (var pair of formData.entries()) {
		formObj[pair[0]] = pair[1]
	}

	formObj.StoreId = b;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.open( "POST", `http://localhost:3000/api/Products/${a}/replace`, false );
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	xmlHttp.send(JSON.stringify(formObj));

}



function httpGet(http) {

	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", http, false );
	xmlHttp.send( null );
	return JSON.parse(xmlHttp.responseText);
}



function loadStore(id) {

	var modal1 = document.getElementsByClassName("store-not-selected")[0];
	modal1.style.display = "none";
	var modal2 = document.getElementsByClassName("section-right")[0];
	modal2.style.display = "block";



	while(document.getElementById("id1")) {
		document.getElementById("id1").remove();
	}
	var Stores2 = httpGet(`http://localhost:3000/api/Stores/${id}`);
	var template = document.querySelector('#storeInfo');
	var mas = Stores2;
	var clone = template.content.cloneNode(true);
	var cells = clone.querySelectorAll('span');
	cells[0].textContent = mas.Email;
	cells[1].textContent = mas.PhoneNumber;
	cells[2].textContent = mas.Address;
	cells[3].textContent = mas.Established;
	cells[4].textContent = mas.FloorArea;
	template.parentNode.appendChild(clone);

	var a = id;

	var Stores2 = httpGet(`http://localhost:3000/api/Stores/${a}/rel_Products`);
	
	let storeIdDelete = mas.id;
	let storeIdCreate = mas.id;

	var ok = 0;
	var storage = 0;
	var outOfStock = 0;
	var length1 = Stores2.length;


	for (var j = 0; j < length1; j++) {
		if (Stores2[j].Status == "OK") {
			ok += 1;
		}
	}
	for (var j = 0; j < length1; j++) {
		if (Stores2[j].Status == "STORAGE") {
			storage += 1;
		}
	}
	for (var j = 0; j < length1; j++) {
		if (Stores2[j].Status == "OUT_OF_STOCK") {
			outOfStock += 1;
		}
	}


	var all = ok + storage + outOfStock;



	while(document.getElementById("id2")) {
		document.getElementById("id2").remove();
	}
	var template = document.querySelector('#productAvailability');
	var mas = Stores2;
	var clone = template.content.cloneNode(true);
	var cells = clone.querySelectorAll('span');
	cells[0].textContent = all;
	cells[1].textContent = ok;
	cells[2].textContent = storage;
	cells[3].textContent = outOfStock;
	template.parentNode.appendChild(clone);
	
	loadDataByFilter(Stores2, a);

	filterButtonAll.addEventListener("click", function(){loadData(a, '')});
	filterButtonOk.addEventListener("click", function(){loadData(a, 'OK')});
	filterButtonStorage.addEventListener("click", function(){loadData(a, 'STORAGE')});
	filterButtonOut.addEventListener("click", function(){loadData(a, 'OUT_OF_STOCK')});

	function loadData(a, filter) {
		if (filter) {
			var Stores2 = httpGet('http://localhost:3000/api/Stores/' + a +'/rel_Products?filter=%7B%22where%22%3A%7B%22Status%22%3A%22' + filter + '%22%7D%7D');
		} else {
			var Stores2 = httpGet(`http://localhost:3000/api/Stores/${a}/rel_Products`);
		}
		loadDataByFilter(Stores2, a);
	}

	function loadDataByFilter(Stores2, a) {
		var table = document.getElementById("myTable");
		while(table.rows.length > 1) {
			document.getElementById("myTable").deleteRow(1);
		}
		var template = document.querySelector('#tableRow');
		for (var j = 0; j < length1; j++) {
			var mas = Stores2[j];
			var clone = template.content.cloneNode(true);
			var cells = clone.querySelectorAll('td');
			cells[0].textContent = mas.Name;
			cells[1].textContent = mas.Price + " " + "USD";
			cells[2].textContent = mas.Specs;
			cells[3].textContent = mas.SupplierInfo;
			cells[4].textContent = mas.MadeIn;
			cells[5].textContent = mas.ProductionCompanyName;
			cells[6].textContent = mas.Rating;
			template.parentNode.appendChild(clone);

			let productIdDelete = mas.id;
			let productIdEdit = mas.id;

			document.getElementsByClassName("deleteProduct")[j].setAttribute("id", "deleteProductButton"+j);
			document.getElementsByClassName("editProduct")[j].setAttribute("id", "editProductButton"+j);


			let idOfElement = document.getElementsByClassName("deleteProduct")[j].getAttribute("id");
			let idOfElement2 = document.getElementsByClassName("editProduct")[j].getAttribute("id");
			let elementById = document.getElementById(idOfElement);
			let elementById2 = document.getElementById(idOfElement2);
			elementById.addEventListener("click", function(){deleteProduct(productIdDelete)});
			elementById2.addEventListener("click", function(){editProduct(productIdEdit)});

		}
	}


	var modal = document.getElementById('modalProduct');
	var btn = document.getElementById("productCreate");
	var span = document.getElementsByClassName("create-product-cancel")[0];

	

	btn.onclick = function() {
		modal.style.display = "block";
	}
	span.onclick = function() {
		modal.style.display = "none";
	}


	var form2 = document.getElementById('modalProduct');
	var field2 = form2.querySelectorAll("input");
	var error2 = form2.querySelectorAll(".error");

	form2.addEventListener("submit", function(){validation(field2, storeIdCreate, " ")});



	var deleteBtn = document.getElementById("storeDelete");
	deleteBtn.onclick = function() {
		if (confirm("Delete " + storeIdDelete)) {
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open( "DELETE", `http://localhost:3000/api/Stores/${storeIdDelete}`, false );
			xmlHttp.send({});
			document.location.reload(true);
		}
	}



	const getSort = ({ target }) => {
		const order = (target.dataset.order = -(target.dataset.order || -1));
		const index = [...target.parentNode.cells].indexOf(target);
		const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
		const comparator = (index, order) => (a, b) => order * collator.compare(
			a.children[index].innerHTML,
			b.children[index].innerHTML
		);

		for(const tBody of target.closest('table').tBodies)
			tBody.append(...[...tBody.rows].sort(comparator(index, order)));

		for(const cell of target.parentNode.cells)
			cell.classList.toggle('sorted', cell === target);
	};

	document.querySelectorAll('.table_sort thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));


}



function deleteProduct(productIdDelete) {
	if (confirm("Delete " + productIdDelete)) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "DELETE", `http://localhost:3000/api/Products/${productIdDelete}`, false ); // false for synchronous request
		xmlHttp.send({});
		document.location.reload(true);
	}
}

function editProduct(productIdEdit) {

	var modal = document.getElementById('modalProductEdit');
	var span = document.getElementById('edit-product-cancel');


	span.onclick = function() {
		modal.style.display = "none";
	}



	modal.style.display = "block";
	var productObj = httpGet(`http://localhost:3000/api/Products/${productIdEdit}`);

	document.getElementById('EName').value = productObj.Name;
	document.getElementById('EPrice').value = productObj.Price;
	document.getElementById('ESpecs').value = productObj.Specs;
	document.getElementById('ERating').value = productObj.Rating;
	document.getElementById('ESupInfo').value = productObj.SupplierInfo;
	document.getElementById('EMadeIn').value = productObj.MadeIn;
	document.getElementById('ECompany').value = productObj.ProductionCompanyName;
	document.getElementById('EStatus').value = productObj.Status;

	var idOfStore = productObj.StoreId;

	var form3  = document.getElementById('modalProductEdit');
	var field3 = form3.querySelectorAll("input");
	var error3 = form3.querySelectorAll(".error");

	form3.addEventListener("submit", function(){validation(field3, productIdEdit, idOfStore)});


}





document.addEventListener("DOMContentLoaded", ready);



