var myRoomData = new Array();
var roomData = new Array();

	roomData['family']=[
		['Billiard Table',2.4,0],
		['Bookcase',0.6,0],
		['Chair',0.15,0],
		['Sofa bed',1.2,0],
		['Table',1.2,0],
		['Television',0.4,0],
		['TV Cabinet',1,0],
		['3 Seater Couch',1.3,0],
		['2 Seater Couch',1,0],
		['Coffee Table',0.2,0],
		['Armchair',0.48,0],
		['Storage Tea Chest',0.15,0],
		['Book & Wine Carton',0.1,0]
	];
	roomData['dining']=[
		['Bookshelf',0.5,0],
		['Buffet/Sideboard',1,0],
		['Crystal Cabinet',0.85,0],
		['Dining Chair',0.15,0],
		['Dining Table',1,0],
		['Other Chair',0.3,0],
		['Auto Trolley',0.3,0],
		['Storage Tea Chest',0.15,0],
		['Book & Wine Carton',0.1,0]
	];
	roomData['bedroom']=[
		['Double Bed & Mattress',1.2,0],
		['Single Bed & Mattress',0.6,0],
		['Queen Bed & Mattress',1.8,0],
		['Folding Bed',0.28,0],
		['Bedside Table/Drawers',0.15,0],
		['Bookcase',0.6,0],
		['Chest',0.4,0],
		['Chair',0.15,0],
		['Chest Drawers Large',0.85,0],
		['Cot',0.7,0],
		['Dressing Table',0.8,0],
		['Bedhead',0.3,0],
		['Mattress Double',0.48,0],
		['Mattress Single',0.3,0],
		['Wardrobe',1.2,0],
		['Portable Robe',0.6,0],
		['Desk',0.8,0],
		['Dressing Table & Mirror',0.8,0],
		['Cheval Mirror',0.3,0],
		['Storage Tea Chest',0.15,0],
		['Book & Wine Carton',0.1,0]
	];	
	roomData['kitchen']=[
		['Cabinet Dresser',1,0],
		['Freezer',1,0],
		['Fridge',1,0],
		['Table',0.98,0],
		['Kitchen Chair',0.15,0],
		['Microwave',0.15,0],
		['Chopping Block',0.12,0],
		['High Chair',0.15,0],
		['Stool',0.15,0],
		['Cupboard',0.85,0],
		['Storage Tea Chest',0.15,0],
		['Book & Wine Carton',0.1,0]
	];
	roomData['hall']=[
		['Dropside Table',0.4,0],
		['Coat Stand',0.6,0],
		['Hall Table',0.25,0],
		['Hat Stand',0.28,0],
		['Storage Tea Chest',0.15,0],
		['Book & Wine Carton',0.1,0]
	];
	roomData['lounge']=[
		['Bar',1,0],
		['Bookcase',0.6,0],
		['Bookshelf',0.5,0],
		['Bureau',0.6,0],
		['3 Seater Couch',1.3,0],
		['2 Seater Couch',1,0],
		['Chair Arm',0.48,0],
		['Chair Other',0.3,0],
		['China Cabinet',0.7,0],
		['Coffee Table',0.2,0],
		['Desk',0.85,0],
		['Sofa bed',1.2,0],
		['Heater',0.1,0],
		['Lampshade',0.2,0],
		['Organ',2,0],
		['Piano',2,0],
		//['Stereo',0.4,0],
		['TV',0.4,0],
		['TV Cabinet',1,0],
		//['Video Recorder',0.1,0],
		['Wall Unit',1,0],
		['Storage Tea Chest',0.15,0],
		['Book & Wine Carton',0.1,0]
	];
	roomData['laundry']=[
		['Clothes Airer',0.05,0],
		['Clothes Dryer',0.56,0],
		['Small Laundry Cupboard',0.8,0],
		['Ironing Board',0.1,0],
		['Laundry Basket',0.1,0],
		['Laundry Trolley',0.1,0],
		['Washing Machine',0.6,0],
		['Vacuum Cleaner',0.2,0],
		['Storage Tea Chest',0.15,0],
		['Book & Wine Carton',0.1,0]
	];
	roomData['sundries']=[
		['Cupboard',0.85,0],
		['Filing Cabinet',0.6,0],
		['Golf Bag',0.2,0],
		['Sewing Machine',0.2,0],
		['Sewing Cabinet',0.6,0],
		['Trestle Table',1,0],
		['Bench',0.8,0],
		['Exercise Bike',0.4,0],
		['Mats & Rugs',0.15,0],
		['Pram',0.35,0],
		['Suitcase',0.2,0],
		['Folding Chairs',0.1,0],
		['Occasional Table',0.28,0],
		['Storage Tea Chest',0.15,0],
		['Book & Wine Carton',0.1,0]
	];
	roomData['outside']=[
		['B.B.Q',0.75,0],
		['Bicycle',0.4,0],
		['Chair',0.14,0],
		['Esky',0.1,0],
		['Fold Chairs',0.1,0],
		['Fold Lounge',0.2,0],
		['Outdoor Table',1,0],
		['Garden Setting',2.5,0],
		['Ladder',0.4,0],
		['Motor Mower',0.3,0],
		['Child\'s ride-on Toy',0.2,0],
		['Wheel Barrow',0.48,0],
		['Whipper Snipper',0.15,0],
		['Large Bin',0.6,0],
		['Table Tennis Table',1,0],
		['Trampoline (dismantled)',1,0],
		['Large Umbrella',0.3,0],
		['Swing (dismantled)',1,0],
		['Storage Tea Chest',0.15,0]
	];



	jQuery(function($) {


		$(".sc-rooms a").click(function(){
			
			removeActiveRoom();

			$(this).parent().addClass('selected');
			
			loadRoomItems($(this).attr("href"));
			return false;			
		});

		function getSize(room, item)
		{
			var size = 0;
			for (var i in roomData[room]){
				if(roomData[room][i][0] == item)
				{
					size = roomData[room][i][1];
					break;
				}
			}
			return size;
		}

		function calculateSpace()
		{
			var total = 0;
			var debug = "";
			var qty = 0;
			for (var i in myRoomData) {
				for (var j in myRoomData[i]) {
					qty = myRoomData[i][j];
					if(qty > 0)
					{
						total += (myRoomData[i][j]*getSize(i,j));
					}
				}
			}
			
			$(".sc-total .btn").attr("href","/quote/well-contact-you/?quote=Interested in " + total.toFixed(2) + "m2 of storage.");
			
			return total.toFixed(2);
		}


		function calculateRoomSpace(room)
		{
			var total = 0;
			var debug = "";
			var qty = 0;
			for (var i in myRoomData[room]) {
				qty = myRoomData[room][i];
				if(qty > 0)
				{
					total += (myRoomData[room][i]*getSize(room,i));
				}
			}
			return total.toFixed(2);
		}

		function getActiveRoom() {
			return $(".sc-rooms .selected a").attr("href").replace("#", "");
		}

		function loadRoomItems(room) {
			//console.log("LOAD ROOM ITEMS " + room);
			var id = room.replace("#", "");

			var src="";
			for (var i in roomData[id]) {
				qty = 0;
				key = roomData[id][i][0];
				//console.log("KEY:"+key);
				if(myRoomData[id]) {
					if(typeof myRoomData[id][key] !== 'undefined'){
						qty = myRoomData[id][key];
					}
				}
				src+="<li>"+roomData[id][i][0]+"<div>" +
				"<a href='#' title='' class='btn btn--green fn--remove-item' data-key='"+roomData[id][i][0]+"'> - </a>" +
				"<input type=\"text\" value=\""+qty+"\" readonly/>" +
				"<a href='#' title='' class='btn btn--green fn--add-item' data-key='"+roomData[id][i][0]+"'> + </a>" +
				
				"</div></li>";
			}
			$(room+" .sc-items-list").html(src);

			$(".sc-items-list .fn--add-item").bind("click", function(){
				addItem(id, $(this).data("key"), 1);
				loadRoomItems(room);
				loadSummaryItems(room);
				return false;
			});			
			$(".sc-items-list .fn--remove-item").bind("click", function(){				
				subtractItem(id, $(this).data("key"), 1);
				loadRoomItems(room);
				loadSummaryItems(room);
				return false;
			});			

			//loadSummaryItems(room);
		}

		function addItem(room, item, qty) {
			// console.log("-----------")
			// console.log(myRoomData);	

			qty = parseInt(qty);
			//console.log("add: " + room+", " + item +", " + qty);
			if(!myRoomData[room]) {
				myRoomData[room] = new Array();

			}

			if(!myRoomData[room][item]) {
				myRoomData[room][item] = qty;
			}
			else {
				var currentQty = parseInt(myRoomData[room][item]);
				myRoomData[room][item] = currentQty + 1;
			}
		}

		function subtractItem(room, item, qty) {

			qty = parseInt(qty);
			if(!myRoomData[room]) {
				myRoomData[room] = new Array();
			}

			if(!myRoomData[room][item]) {
				myRoomData[room][item] = 0;
			}
			else {
				var currentQty = parseInt(myRoomData[room][item]);
				if(currentQty >= 1) {
					myRoomData[room][item] = currentQty - 1;	
				}
			}
		}

		function removeItem(room, item) {
			//console.log("remove.." + room +", item " + item);
			if(!myRoomData[room]) {
				myRoomData[room] = new Array();
			}
			myRoomData[room][item] = 0;
		}

		function removeActiveRoom() {
			$(".sc-rooms li.selected").removeClass("selceted");

		}

		function loadSummaryItems(room) {

			var id = room.replace("#", "");
			var src="";

			var itemSize=0;

			for (var i in myRoomData[id]) {

				if(myRoomData[id][i] > 0) {
					src += "<li><div class='sc-items-selected-list-item'>"+i+"</div>" +
			   			   "<div class='sc-items-selected-list-adjust-add' data-key='"+i+"'> + </div>"+
			   			   "<div class='sc-items-selected-list-adjust-subtract' data-key='"+i+"'> - </div>"+
			   			   "<div class='sc-items-selected-list-qty'> <input type='number' name='' value='"+myRoomData[id][i]+"''></div>"+
			   			   "<div class='sc-items-selected-list-remove' data-key='"+i+"'> x </div></li>";
				}
			}
			$(room+" .sc-items-selected-list").html(src);
			
			

			//calculate room summary
			$(".txt-total-amount").text(calculateSpace());

			roomTotal = calculateRoomSpace(id);
			$(room+" .txt-room-total").html(roomTotal);

			if($(".sc-items-selected-list li").length > 0 ) {
				$(".sc-items-selected-list").fadeIn();
			}else {
				$(".sc-items-selected-list").fadeOut();
			}


			if(roomTotal > 0) {

				if($(".sc-rooms .selected .counter").length > 0) {
					$(".sc-rooms .selected .counter").html(roomTotal+"m<sup>3</sup>");
				}else {
					$(".sc-rooms .selected").append("<div class=\"counter\">"+roomTotal+"m<sup>3</sup></div>");
				}				
			}else {
				$(".sc-rooms .selected .counter").remove();
			}

			$(".sc-items-selected-list-adjust-add").bind("click", function(){
				addItem (id, $(this).data("key"), 1);
				loadSummaryItems(room);
				return false;

			});

			$(".sc-items-selected-list-adjust-subtract").bind("click", function(){
				subtractItem (id, $(this).data("key"), 1);
				loadSummaryItems(room);
				return false;				
				
			});

			$(".sc-items-selected-list-remove").bind("click", function(){
				removeItem (id, $(this).data("key"));
				loadSummaryItems(room);
				return false;				
				
			});

			
		}
		

		$(".sc-rooms li.selected a").trigger("click");		

});

/*
		   			<div class="sc-items-selected-list">
		   				<div class="row">
			   				<div class="sc-items-selected-list-item">Billiard Table (<span>2.4m<sup>3</sup></span>)</div>
			   				<div class="sc-items-selected-list-adjust"> + - </div>
			   				<div class="sc-items-selected-list-qty"> <input type="number" name="" value="1"></div>
			   				<div class="sc-items-selected-list-remove"> x </div>
			   			</div>
		   			</div>


	$(function() {

		if ( ! window.console ) console = { log: function() {} };


		// $("#itemRows .colAction").live("click", function(){
		// 	var activeItem = $(".colDescription", $(this).parent()).html();
		// 	var qty = $(".colQty input", $(this).parent()).attr("value");
		// 	if($.isNumeric(qty))  // true
		// 	{
		// 		addItem(getActiveRoom(), activeItem, qty);
		// 		loadSummaryItems();
		// 	}
		// });

		$("#itemRows .colActionAdd").live("click", function(){
			var activeItem = $(".colDescription", $(this).parent()).html();
			var qty = parseInt( $(".colQty input", $(this).parent()).attr("value") );
			addItem(getActiveRoom(), activeItem, qty);
			loadSummaryItems();
		});

		// delete product from summary
		$("#summaryRows .colAction").live("click", function(){
			var room = $(".rowHeader .colDescription", $(this).parent().parent()).html();
			var item = $(".colDescription", $(this).parent()).html();
			removeItem(room, item);
			loadSummaryItems();
		});

		// add to qty
		$("#summaryRows .colActionPlus").live("click", function(){
			var activeItem = $(".colDescription", $(this).parent()).html();
			var $qtyField = $(this).parent().find('.colQty input');  	// qty field
			var qty = parseInt( $qtyField.val() ) + 1;  // get current qty, plus 1
			$qtyField.val( qty ); // update the qty field
			addItem(getActiveRoom(), activeItem, qty);
			loadSummaryItems();
			console.log(qty);
		});

		// minus qty
		$("#summaryRows .colActionMinus").live("click", function(){
			var activeItem = $(".colDescription", $(this).parent()).html();
			var $qtyField = $(this).parent().find('.colQty input');  	// qty field
			var qty = parseInt( $qtyField.val() ) - 1;  // get current qty, minus 1
			if( qty < 1 ){ qty = 1 ; }	// dont let qty go below 1
			$qtyField.val( qty ); // update the qty field
			minusItem(getActiveRoom(), activeItem, qty);
			loadSummaryItems();
			console.log(qty);
		});

		function removeActiveRoom()
		{
			$("#roomRows .colDescription").each(function(){
				$(this).removeClass('active').addClass('inactive');
			});
			$("#roomRows .colAction").each(function(){
				$(this).html('');
			});
		}

		function getActiveRoom()
		{
			return $("#roomRows .active").html();
		}


		function loadSummaryItems()
		{
			var src="<div class=\"top\"></div>";
			var qty = 0;
			var isRoomActive = false;
			var rowHeader = "";
			var rowFooter = "";
			var row="";
			var size = "";
			var items = "";
			var rooms = [];

			for (var i in myRoomData)
			{
				isRoomActive = false;
				rowHeader="";
				row="";
				rowFooter="";

				rowHeader+="<div class=\"rowGroup\">";
				rowHeader+="	<div class=\"rowHeader\">";
				rowHeader+="		<div class=\"colDescription\">"+i+"</div>";
				rowHeader+="		<div class=\"colAction\"><img src=\"/wp-content/themes/fortknox/assets/images/icnCollapse.png\" /></div>";
				rowHeader+="		<div class=\"clearfix\"></div>";
				rowHeader+=" 	</div>";

				for (var j in myRoomData[i]) {
					qty = myRoomData[i][j];
					if(qty > 0)
					{
						row+="<div class=\"row\">";
						row+=" <div class=\"colDescAndSize\">";
						row+=" 	<div class=\"colDescription\">"+j+"</div>";
						row+="  <div class=\"colSize\">"+getSize(i, j)+"m3</div>";
						row+=" </div>";
						row+=" <div class=\"colAction\"><img src=\"/wp-content/themes/fortknox/assets/images/icnDelete.png\" /></div>";
						row+=" <div class=\"colActionPlus\"><img src=\"/wp-content/themes/fortknox/assets/images/iconQtyPlus.png\" /></div>";
						row+=" <div class=\"colActionMinus\"><img src=\"/wp-content/themes/fortknox/assets/images/iconQtyMinus.png\" /></div>";
						row+=" <div class=\"colQty\"><input type=\"text\" value="+myRoomData[i][j]+" /></div>";
						row+="<div class=\"clearfix\"></div>";
						row+="</div>";
						isRoomActive = true;
					}

					size = getSize(i, j);

					items = i + '[' + j.replace("&", "%26") + '|Qty:' + qty + '|Size:' + size + ']';
					rooms.push(items);
				}
				rowFooter+="	<div class=\"subTotal\">";
				rowFooter+="		<strong>Room Total</strong> (m3): <strong>"+calculateRoomSpace(i)+"</strong>";
				rowFooter+="	</div>";
				rowFooter+="</div>";

				if(isRoomActive) {
					src += rowHeader + row + rowFooter;
				}
			}

			$("#summaryRows").html(src);
			var spaceRequired = calculateSpace();
			$(".rowSummary .spaceRequired").html(spaceRequired);

			if(spaceRequired > 0)
			{
					$("#btnRequestAQuote span").html(spaceRequired);
					$("#btnRequestAQuote").show();
					$("#btnRequestAQuote a").attr("href","/quote/get-a-quote?space=" + spaceRequired + "&items=" + rooms);
			}
			else
			{
					$("#btnRequestAQuote").hide();
			}
		}

		$("#btnRequestAQuote").live("click", function(){
			$("#btnRequestAQuote").parent().click();
		});

		function calculateSpace()
		{
			var total = 0;
			var debug = "";
			var qty = 0;
			for (var i in myRoomData) {
				for (var j in myRoomData[i]) {
					qty = myRoomData[i][j];
					if(qty > 0)
					{
						total += (myRoomData[i][j]*getSize(i,j));
					}
				}
			}
			return total.toFixed(2);
		}


		function calculateRoomSpace(room)
		{
			var total = 0;
			var debug = "";
			var qty = 0;
			for (var i in myRoomData[room]) {
				qty = myRoomData[room][i];
				if(qty > 0)
				{
					total += (myRoomData[room][i]*getSize(room,i));
				}
			}
			return total.toFixed(2);
		}

		function addItem(room, item, qty)
		{
			qty = parseInt(qty);
			if(!myRoomData[room])
			{
				myRoomData[room] = new Array();
			}

			if(!myRoomData[room][item])
			{
				myRoomData[room][item] = qty;
			}
			else
			{
				var currentQty = parseInt(myRoomData[room][item]);
				myRoomData[room][item] = currentQty + 1;
			}
		}

		function minusItem(room, item, qty)
		{
			qty = parseInt(qty);
			if(!myRoomData[room])
			{
				myRoomData[room] = new Array();
			}

			if(!myRoomData[room][item])
			{
				myRoomData[room][item] = qty;
			}
			else
			{
				var currentQty = parseInt(myRoomData[room][item]);
				if( currentQty < 1 ){ currentQty = parseInt(2) }
				myRoomData[room][item] = currentQty - 1;
			}
		}

		function removeItem(room, item)
		{

			for (var i in myRoomData[room]) {
				if(i==item)
				{
					myRoomData[room][i]=0;
				}
			}
		}

		function getSize(room, item)
		{
			var size = 0;
			for (var i in roomData[room]){
				if(roomData[room][i][0] == item)
				{
					size = roomData[room][i][1];
					break;
				}
			}
			return size;
		}


		function isRoomActive(room)
		{
			var returnVal = false;
			if(myRoomData[room])
			{
				for (var i in myRoomData[room]) {
					if(myRoomData[room][i] > 0)
						returnVal = true;
					}
			}
			return returnVal;
		}

		function getMyRooms()
		{
			return myRoomData;
		}


		function increaseQty()
		{
			console.log('increaseQty')
		}


		function decreaseQty()
		{
			console.log('decreaseQty')
		}


		loadRoomItems("Family");

	});
*/	