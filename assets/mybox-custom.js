
function getPackageBoxCount(){
	var qty = 1
    const defaultPackage = Builder.itemData.getbox('currentBox').Items
    if(defaultPackage.length){
          if(defaultPackage[0].producttype === 'box'){
          qty = defaultPackage[0].qty
    }
    }
    return qty;
}

  
function setUpPackageBox(element,validateBox=false) {
  		
		// checking if there is already any product in the box and whether the products will get fit in selected box or not
       if(validateBox){
  		const currentItems = Builder.itemData.getbox('currentBox').Items
        if(currentItems.length){
        	const boxSize = parseInt(element.getAttribute('data-size'))      
          
          if(boxSize === 2){
          	const isNotValid = currentItems.filter(item => item.tags.includes('not_for_medium_box') || currentItems.filter(e => e.category === 'wine').length > 1).length
          	if(isNotValid){
                	alert('Please select the 12*15 box, cause there is already some product in cart which will not get fit in the 10*10 size of box.')
                    return false;
                }
          }
          
          if(boxSize === 1){
                const isNotValid = currentItems.filter(item => item.tags.includes('not_for_small_box') || item.category === 'wine').length
                if(isNotValid){
                	alert('Please select a bigger box, cause there is already some product in cart which will not get fit in the 6*6 size of box.')
                    return false;
                }
          }
        }
       }
  		var qty = getPackageBoxCount()
    	var xyz = {
            productId: element.getAttribute('p-id'),
            variantId: element.getAttribute('data-variant'),
            producttype: 'box',
            title: 'Build Your Own Box',
            price: element.getAttribute('data-price'),
            qty: qty,
            producthandle: 'build-your-own-box',
            image: element.getAttribute('data-image'),
            tags: element.getAttribute('data-tags'),
            boxSize: element.getAttribute('data-size')
            // image: 'https://cdn.shopify.com/s/files/1/0264/7366/0504/products/3boxes.jpg?v=1570685322'
          }
  		return xyz;
}


function canAddThisItem(element) {
// 	check if the product is able to fit in selected box or not.
    const selectedBox = Builder.itemData.getbox('currentBox').Items[0]
    if(selectedBox){
    const boxSize = parseInt(selectedBox.boxSize)
       
       
       	// check for medium box     
    if(boxSize === 2 && element.tags){
      const isNotValid = element.tags.includes('not_for_medium_box')
        if(isNotValid){
			alert('Please select the 12*15 box in order to add this item, You can select other box from Step1, Click on the Step1 from above and it will display boxes to select from.')
      		return true;
        } 
      
      if(element.category === 'wine' && Builder.itemData.getbox('currentBox').Items.filter(item => item.category === 'wine').length === 1){
      	var currentBox = Builder.itemData.getbox('currentBox')
        const largeBox = document.getElementById('packagebox3')   
    	currentBox.Items[0] = setUpPackageBox(largeBox);
    	Builder.itemData.addElem('currentBox',currentBox);
        return false;
      }
      }
    
    // check for small box
    if(boxSize === 1 && element.tags){
    	const isNotValid = element.tags.includes('not_for_small_box')
        if(isNotValid){
        	alert('Please select the 10*10 box in order to add this item, You can select other box from Step1, Click on the Step1 from above and it will display boxes to select from.')
      		return true;
        }
      
		// check for wine
      if(element.category === 'wine'){
      	var currentBox = Builder.itemData.getbox('currentBox')
        const largeBox = document.getElementById('packagebox2')   
    	currentBox.Items[0] = setUpPackageBox(largeBox);
    	Builder.itemData.addElem('currentBox',currentBox);
        return false;
      }
    }
       }
  
  
	return false;
}





function openProductDetail(product,index){
  if(index){
  	  const productDiv =  document.getElementById(`wineId${product}`);
  	  productDiv.click();
  }else{
  	NextStep(true)
  }
}

if (typeof(Storage) !== "undefined") {
  window.boxbuilder = {};
  window.boxbuilder.page = cpage;
  window.boxbuilder.itemData = {
    data: [],
    ini: 0,
    length: 0,
    total: 0,
    action: 'add',
    reset: function() {
      this.ini = 0, this.data = [];
    },
    ajaxpost: function(uri, params, callback) {
      $.ajax({
        type: 'POST',
        url: uri,
        dataType: 'json',
        async: false,
        data: params,
        success: function() {
          if (typeof callback === 'function') {
            callback();
          }
        },
        error: function() {}
      });
    },
    CartaddItem: function(qty, id, properties, callback) {
      var params = {quantity: qty,id: id};
      if (properties != false) {
        params.properties = properties;
      }
      window.boxbuilder.itemData.ajaxpost('/cart/add.js',params, callback);
    },
    CartupdateItem: function(qty, id, properties, callback) {
      var params = {updates: {id: qty}};
      if (properties != false) {
        params.properties = properties;
      }
      window.boxbuilder.itemData.ajaxpost('/cart/update.js', params, callback);
    },
    recursive: function() {
      console.log(window.boxbuilder.itemData.ini);
      var actionname = (window.boxbuilder.itemData.action == 'update') ? 'CartupdateItem' : 'CartaddItem';
      window.boxbuilder.itemData[actionname](window.boxbuilder.itemData.data[window.boxbuilder.itemData.ini].qty, window.boxbuilder.itemData.data[window.boxbuilder.itemData.ini].id, window.boxbuilder.itemData.data[window.boxbuilder.itemData.ini].properties, function() {
        window.location.href = '/cart';
      });
    },
    ajaxApp: function ajaxApp(uri, params, msg, shipping_date) {
      var tok = window.boxbuilder.itemData.uuidv4();
//       var boxData = window.boxbuilder.itemData.getbox('currentBox').Items[0];
      window.boxbuilder.itemData.addElem(tok, params);
      if (msg != null) {
        msg = msg;
      } else {
        window.boxbuilder.itemData.addElem(tok + "ms", window.boxbuilder.itemData.getbox('boxmsg'));
        msg = window.boxbuilder.itemData.getbox('boxmsg');
      }
      if (shipping_date != null) {
        shipping_date = shipping_date;
      } else {
        window.boxbuilder.itemData.addElem(tok + "sd", window.boxbuilder.itemData.getbox('shipping_date'));
        shipping_date = window.boxbuilder.itemData.getbox('shipping_date');
      }
      $('#page-load').css({
        "display": "block",
        "visibility": "visible",
        "z-index": "999999"
      });
      $.ajax({
        type: 'POST',
        url: uri,
        dataType: 'json',
        async: false,
        data: params,
        success: function(responsePrd) {
          $('#page-load').css({
            "display": "none",
            "visibility": "hidden",
            "z-index": "-1"
          });
          if (responsePrd.code == 200) {
            values = {
              id: responsePrd.data.variants[0].id,
              qty: 1,
              properties: {
                'Box_Contents': responsePrd.containts,
                'P_handle': responsePrd.p_handles,
                '_varinatsAdded': responsePrd.varinatsAdded,
                'box': tok,
                'boxData':{},
                'Card_msg': msg,
                'shipping_date': shipping_date
              }
            };
            window.boxbuilder.itemData.data.push(values);
            window.boxbuilder.itemData.total = 1;
            window.boxbuilder.itemData.action = 'add';
            window.boxbuilder.itemData.recursive();
          }
        },
        error: function() {}
      });
    },
    begin: function() {
      var listItem = this.allItems();
      if(!listItem?.Items?.length || listItem?.Items[0].producttype !== 'box'){
         document.getElementById('addToCartBtn').disabled = false;
     	 alert('Please Select a package box first')
         return
      }
      console.log('llll',listItem);
      
      // function addToCartBulk(listItem) {
      //   const formData = {
      //     'items': []
      //   };
      
      //   // Check if listItem.Items exists and is an array
      //   if (listItem && listItem.Items && Array.isArray(listItem.Items)) {
      //     // Push each item into the formData.items array
      //     listItem.Items.forEach(item => {
      //       formData.items.push({
      //         'id': item.variantId,
      //         'quantity': item.qty
      //       });
      //     });
      
      //     fetch(window.Shopify.routes.root + 'cart/add.js', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json'
      //       },
      //       body: JSON.stringify(formData)
      //     })
      //     .then(response => {
      //       if (response.ok) {
      //         return response.json();
      //       } else {
      //         throw new Error('Failed to add items to the cart. Status: ' + response.status);
      //       }
      //     })
      //     .then(data => {
      //       if (data && data.items && data.items.length > 0) {
      //         console.log('Items added to the cart:', data.items);
      //         // Process the response data as needed
      //         // Redirect to the cart page
      //         window.location.href = '/cart';
      //       } else {
      //         throw new Error('No items added to the cart.');
      //       }
      //     })
      //     .catch(error => {
      //       console.error('Error adding items to the cart:', error);
      //     });
      //   } else {
      //     console.error('Invalid format of listItem.Items');
      //   }
      // }


       // addToCartBulk(listItem);

       window.boxbuilder.itemData.ajaxApp('https://wiscowisco.com/wiscoboxes/add_box_product?shop=' + shop, listItem, null);
    },
    uuidv4: function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    addElem: function addElem(elementKey, elementData) {
      localStorage.setItem(elementKey, JSON.stringify(elementData));
      this.setBoxhtml();
      return;
    },
    getbox: function getbox(elementKey) {
      return JSON.parse(localStorage.getItem(elementKey));
    },
    addItem: function addItem(newitem) {
      if(canAddThisItem(newitem)){
      	return;
      }
	  // add coldpackage once if the perishable food is added       
      if(newitem?.tags?.includes('Perishable_food')){
      	const ice = document.getElementById('iceForPerish');
        var xyz = {
          productId: ice.getAttribute('p-id'),
          variantId: ice.getAttribute('data-variant'),
          producttype: 'product',
          producthandle: ice.getAttribute('handle'),
          title: ice.getAttribute('data-prod'),
          price: ice.getAttribute('data-price'),
          qty: 1,
          image: ice.getAttribute('data-img'),
          weight: ice.getAttribute('weight'),
          boxId: ice.getAttribute('weight'),
          tags: ice.getAttribute('data-tags'),
        }
      var currentBox = this.getbox('currentBox');
        if(currentBox.Items?.filter(item => item?.productId === xyz?.productId).length < 1){
           	if (currentBox.Items) {
        for (var i = 0; i < currentBox.Items.length; i++) {
          if (currentBox.Items[i].productId === xyz.productId) {
            currentBox.Items[i].qty++;
            this.addElem('currentBox', currentBox);
            return false;
          }
        }
        currentBox.Items.push(xyz);
        this.addElem('currentBox', currentBox);
      } 
          }
      }
	  // adding coldpackage end       
           
	  
      this.addSingleBox();
      var currentBox = this.getbox('currentBox');
      if (currentBox.Items) {
        for (var i = 0; i < currentBox.Items.length; i++) {
          if (currentBox.Items[i].productId === newitem.productId) {
            currentBox.Items[i].qty++;
            this.addElem('currentBox', currentBox);
            return false;
          }
        }
        currentBox.Items.push(newitem);
        this.addElem('currentBox', currentBox);
        return false;
      }
    },
           
    deleteBoxItemData: function deleteBoxItemData(boxid, productId) {
      var OldBox = window.boxbuilder.itemData.getbox(boxid);
      var newBoxs = {
        Items: []
      };
      if (OldBox.Items) {
        for (var i = 0; i < OldBox.Items.length; i++) {
          if (OldBox.Items[i].productId == productId) {} else {
            newBoxs.Items.push(OldBox.Items[i]);
          }
        }
        var msgg = window.boxbuilder.itemData.addElem(boxid + "ms");
        var shipping_date = window.boxbuilder.itemData.addElem(boxid + "sd");
        window.boxbuilder.itemData.ajaxApp('https://wiscowisco.com/wiscoboxes/add_box_product?shop=' + shop, newBoxs, msgg, shipping_date);
      }
    },
    deleteItem: function deleteItem(productId) {    
      var currentBox = this.getbox('currentBox');
      var deletingElement = currentBox.Items.filter(i => i.productId == productId)
      var boxCount = currentBox.Items[0].qty
      
      console.log(boxCount)
      console.log(deletingElement)
      
      if(deletingElement[0].producttype === 'box'){
      	return;
	  }
      
      if(deletingElement.length){
      	var dqty = deletingElement[0].qty
        
        
        if(currentBox.Items[0]){
       	
        
        var productCount = 0;
        currentBox.Items.map((item,idx) => {
          if(idx){
          	productCount = item.qty + productCount
          }
        });
         
        
        if(productCount - dqty < 11 && boxCount === 2){
        	currentBox.Items[0].qty -= 1;
        } else if(productCount - dqty < 21 && boxCount === 3){
          currentBox.Items[0].qty -= 1;
        }else if(productCount - dqty < 31 && boxCount === 4){
          currentBox.Items[0].qty -= 1;
        }else if(productCount - dqty < 41 && boxCount === 5){
          currentBox.Items[0].qty -= 1;
        }else if(productCount - dqty < 51 && boxCount === 6){
          currentBox.Items[0].qty -= 1;
        }else if(productCount - dqty < 61 && boxCount === 7){
          currentBox.Items[0].qty -= 1;
        }
		
      }
        
      }
      
      
          
      var newBoxs = {Items: []};
      if (currentBox.Items) {
        for (var i = 0; i < currentBox.Items.length; i++) {
          if (currentBox.Items[i].productId == productId) {} else {
            newBoxs.Items.push(currentBox.Items[i]);
          }
        }
        this.addElem('currentBox', newBoxs);
      }
    },
    allItems: function allItems() {
      return this.getbox('currentBox');
    },
    setBoxhtml: function setBoxhtml() {
      if (window.boxbuilder.page == "build-your-box") {
        var listItem = this.allItems();
        var htmm = ''; 
        var htmm1 = '';
        var pricc = 0;
                
        // Start Custom Linux Code Modified
        
        var itemName = [];
        for (var i = 0; i < listItem.Items.length; i++) {

          itemName.push({
            'price': listItem.Items[i].price, 
            'name': listItem.Items[i].producthandle, 
            'qtty': listItem.Items[i].qty, 
            'itemId': listItem.Items[i].productId
          });
          
          pricc = parseInt(pricc) + parseInt(listItem.Items[i].price) * listItem.Items[i].qty;
          htmm += '<li onClick="openProductDetail(' + listItem.Items[i].productId + ',' + i + ')">';
          htmm += '<a class="ng-scope" data-product_id="' + listItem.Items[i].productId + '">';
          htmm += '<img src="' + listItem.Items[i].image + '" class="img-responsive">';
          htmm += '<div class="name ng-binding">' + listItem.Items[i].producthandle + '</div>';
          htmm += '<div class="quantity-badge">' + listItem.Items[i].qty + '</div>';
          htmm += '</a>';
          if (listItem.Items[i].productId != '4324826251373') {
            htmm += '<a style="cursor:pointer;" onclick="deleteMyItem(' + listItem.Items[i].productId + ')" class="remove hidden-xs" data-product_id="' + listItem.Items[i].productId + '" tabindex="-1">';
            htmm += 'X</a>';
          }
          htmm += '</li>';
        }

        for (var i = 0; i < itemName.length; i++) {
          htmm1 += '<li id='+ itemName[i].itemId +' class="ng-scope">';
          htmm1 += '<div class="quantity ng-binding">'+ itemName[i].qtty +'</div>';
          htmm1 += '<div class="name ng-binding">'+ itemName[i].name +'</div>';
          htmm1 += '<div class="price ng-binding">'+ parseFloat(itemName[i].price / 100).toFixed(2) +'</div>';
          if (itemName[i].itemId != '4324826251373' && itemName[i].name != 'add-cold-packing-for-perishables') {
            htmm1 += '<a style="cursor:pointer;" onclick="deleteMyItem(' + itemName[i].itemId + ')" class="remove hidden-xs" data-id="' + itemName[i].itemId + '" tabindex="-1">';
            htmm1 += 'X</a>';
          }
          htmm1 += '</li>';
        }

        //window.MyLib.unslick();
        document.getElementById("box-images").innerHTML = '';
        document.getElementById("box-images").innerHTML = htmm;
        //window.MyLib.slick
        
        document.getElementById("box-list-items").innerHTML = '';
        document.getElementById("box-list-items").innerHTML = htmm1;
        
        // End Custom Linux Code Modified
        
        document.getElementById("basket-message").innerHTML = '<strong> YOUR BOX </strong><br>CONTAINS ' + listItem.Items.length + '  ITEMS';
        var itemCount = listItem.Items.length;
        document.getElementById("item_count_prod").value = itemCount;

        document.getElementById("stp_nxt_btn").innerHTML = '<strong >' + this.GetCurrentStepText() + '</strong><br>$' + parseFloat(pricc / 100).toFixed(2) + ' ';
        document.getElementById("item_subtotal").innerHTML = parseFloat(pricc / 100).toFixed(2) + ' ';
        return;
      }
    },
    GetCurrentStepText: function GetCurrentStepText() {
      return ((Builder.itemData.getbox('currentStep') == 0) ? 'NEXT STEP' : 'PREVIOUS STEP');
    },
    selectStep: function selectStep(n) {
      if (n > 0) {
        if (this.allItems().length < 1) {
          n = 0;
        }
      }
      var x = document.getElementsByClassName("tab");
      for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
      }
      x[n].style.display = "block";
      this.addElem('currentStep', n);
      this.fixStepIndicator(n);
    },
    fixStepIndicator: function fixStepIndicator(n) {
      var i, x = document.getElementsByClassName("step");
      for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
      }
      x[n].className += " active";
    },
    addBoxTocart: function addBoxTocart() {
      var listItem = this.allItems();
      values = {};
      for (var i = 0; i < listItem.Items.length; i++) {
        values[listItem.Items[i].variantId] = listItem.Items[i].qty;
      } 
    },

    // Add Box Here
    addSingleBox: function addSingleBox() {
      var currentBox = this.getbox('currentBox');
      if (currentBox.Items) {
        if (currentBox.Items.length === 3) {
          const middleBox =  document.getElementById('packagebox2');
//           not updating the box if BigBox is already been selected
          if(parseInt(currentBox.Items[0].price) < parseInt(middleBox.getAttribute('data-price'))){
          	currentBox.Items[0] = setUpPackageBox(middleBox);
          	this.addElem('currentBox', currentBox);
          }
          
        }
        if (currentBox.Items.length === 7) {
          const bigBox =  document.getElementById('packagebox3');
          currentBox.Items[0] = setUpPackageBox(bigBox);
          this.addElem('currentBox', currentBox);
        }
      }
    }
    // End Add Box Here
  };
  

  var Builder = window.boxbuilder;
  if (!Builder.itemData.getbox('currentBox')) {
    var newBox = {
      Items: []
    };
    Builder.itemData.addElem('currentBox', newBox);
  }
  if (window.boxbuilder.page == "build-your-box") {
    selectStep(0);
    Builder.itemData.setBoxhtml();
  }

  function selectStep(n) {
    Builder.itemData.selectStep(n);
  }
  

  function selectPackageBox(element){
    var currentBox = Builder.itemData.getbox('currentBox')
    const validatedBox = setUpPackageBox(element,validateBox=true);
    if(!validatedBox){
    	return;
    }
    currentBox.Items[0] = validatedBox;
    Builder.itemData.addElem('currentBox', currentBox);
    
    NextStep();
  }

  function NextStep(shouldGoBack = false) {
    if (parseInt(Builder.itemData.getbox('currentStep')) == 2 || shouldGoBack) {
      Builder.itemData.selectStep(parseInt(Builder.itemData.getbox('currentStep')) - 1);
    } else {
      Builder.itemData.selectStep(parseInt(Builder.itemData.getbox('currentStep')) + 1);
    }
  }
      
  function changeStep(step){
        const currentStep = parseInt(Builder.itemData.getbox('currentStep'))
        const newStep = parseInt(step)-1
        if(newStep < currentStep){
        	Builder.itemData.selectStep(newStep);
        }
   }
      

  function _AddToCart(){
    var mssg = document.getElementById("box-message").value;
    console.log('mssg',mssg)
    Builder.itemData.addElem('boxmsg', mssg);
    var shipping_date = document.getElementById("shipping_date").value;
    Builder.itemData.addElem('shipping_date', shipping_date);
    Builder.itemData.begin();
  }

  function removeExistingItmeFromcart(variantId){
    var Update  = 'updates['+variantId+']=0';
    $.ajax({
      type: 'POST',
      url:'/cart/update.js',
      data: Update,
      dataType: "json",
      success: function(resultData){
        delete_cookie('addedForVariant'+variantId);
        _AddToCart()
      }
    })
  }
  function completeCard() {
    
    if(gup('addedvariant')){
      removeExistingItmeFromcart(gup('addedvariant'));
    }else{
      //document.getElementById('addToCartBtn').disabled = ;
      element1 = document.getElementById('shipping_date').value;
        if(element1 == '')
        {
           alert('Please fill Desired Shipping Date');
        }else{
          console.log('ttt')
            _AddToCart();
        }
    }
  }

  function direct_add_to_cart(element) {
    var productCount = 0;
    setTimeout(function(){ 
      
      var xyz = {
          productId: element.getAttribute('p-id'),
          variantId: element.getAttribute('data-variant'),
          producttype: 'product',
          producthandle: element.getAttribute('handle'),
          category: element.getAttribute('data-cat'),
          title: element.getAttribute('data-prod'),
          price: element.getAttribute('data-price'),
          qty: 1,
          image: element.getAttribute('data-img'),
          weight: element.getAttribute('weight'),
          boxId: element.getAttribute('weight'),
          tags: element.getAttribute('data-tags'),
        }
      
      window.boxbuilder.itemData.getbox('currentBox').Items.map((item,idx) => {
        if(idx){
        	productCount = item.qty + productCount
        }
      });
      
      
      if ((productCount > 5) && (productCount) % 10 === 0) {	
        if(confirm(`OOPS... Too Many Items (Can't Add More Then ${productCount} Items). Should We Add another box to select more items?`)){
          window.boxbuilder.itemData.addItem(window.boxbuilder.itemData.getbox('currentBox').Items[0])
          Builder.itemData.addItem(xyz);
          $('#myModal').hide();   
         }else{
        	return false; 
         }          
      } else { 
        Builder.itemData.addItem(xyz);
        $('#myModal').hide();              
      }
    }, 100);

  }

  function deleteMyItem(Item) {
        const newData = Builder.itemData.getbox('currentBox').Items.filter(item => item.productId != Item)
        const perishableFoods = newData.filter(item => item.tags.includes('Perishable_food')).length
        const hasColdPackage = newData.filter(item => item.tags.includes('cold_packaging'))
        if(hasColdPackage.length && !perishableFoods){
      	  Builder.itemData.deleteItem(hasColdPackage[0].productId)   
        }
        
        Builder.itemData.deleteItem(Item);
    }

    function RemoveBoxItem(CartItem) {
        var dataline = $(CartItem).attr("data-line");
        var databox = $(CartItem).attr("data-box");
        var productId = $(CartItem).attr("data-variant");
        var prm = {
            line: dataline,
            quantity: 0
        };
        window.boxbuilder.itemData.ajaxpost('/cart/change.js', prm, function() {
            window.boxbuilder.itemData.deleteBoxItemData(databox, productId);
        });
    }
} else {
    console.log("Sorry, your browser does not support Web Storage...");
}
$('#ship_to_multiple').change(function() {
    if (this.checked) {
        Builder.itemData.addElem('multiship', "enable");
    } else {
        Builder.itemData.addElem('multiship', "disable");
    }
});

function removeItemsBoxdata() {
    Builder.itemData.addElem('currentBox', null);
}

function gup( name, url ) {
  if (!url) url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}

function set_cookie(name, value) {
  document.cookie = name +'='+ value +'; Path=/;';
}
function delete_cookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(name) {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  console.log(v);
  return v ? v[2] : null;
}

function RemoveAllContentsFromBox(){
  var PreviousItemsInBox = Builder.itemData.getbox('currentBox');
  if(PreviousItemsInBox.Items.length > 0){
    for(i=0;i<=PreviousItemsInBox.Items.length;i++){
      if(PreviousItemsInBox.Items[i]){
        deleteMyItem(PreviousItemsInBox.Items[i].productId);
      }
    }
  }
}
  
RemoveAllContentsFromBox();

if(getCookie(gup('addedvariant'))){
//   NextStep()
  var ArrayData = JSON.parse(getCookie(gup('addedvariant')));
  document.getElementById("box-message").value = ArrayData.Card_msg;
  document.getElementById("shipping_date").value = ArrayData.shipping_date;
      
  if(!getCookie('addedForVariant'+gup('addedvariant'))){
    for(i=0;i<=ArrayData.items.length;i++){
      if(ArrayData.items[i]){
        console.log(ArrayData.items[i]);
        Builder.itemData.addItem(ArrayData.items[i]);
      }
    }
    set_cookie('addedForVariant'+gup('addedvariant'),true);
  }
}