//this is default value
var main_build_id = $("#ps-build-variantids").val();
var cdate = new Date();
var groupnumber = cdate.getTime();

// localStorage.setItem('groupnumber', groupnumber);

function complete_build()
{
  localStorage.removeItem('custombox');
}//function closed

//this is push value
function pushIt(newid,qty) {
  
  var checkcustomboxps = localStorage.getItem('custombox');
  
  if(checkcustomboxps===null)
  {
    var customboxps =
    { 
      custombox: 
      [
        {id:newid,quantity:qty,addtocart:'pending',complete:'pending'}
      ]
    };
    localStorage.setItem('custombox', JSON.stringify(customboxps));
    localStorage.setItem('groupnumber', groupnumber);
  }
  else
  {
  	var restoredCustombox = new Array();
  	var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));
    
      restoredCustombox.custombox.push({
        id:  newid,
        quantity: qty,
        addtocart:'pending',
        complete:'pending'
      });
    
    localStorage.setItem('custombox', JSON.stringify(restoredCustombox));
  }//else closed
  
}//function closed

//this is used for check localstorage
function find_buildid_localstorage(buildid) {
  var checkcustomboxps = localStorage.getItem('custombox');
 if(checkcustomboxps!==null)
 { 
    var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));

    for(var i = 0; i < restoredCustombox.custombox.length; i++)
    {
      var chkid = restoredCustombox.custombox[i].id;
      var chkaddtocart = restoredCustombox.custombox[i].addtocart;
      var chkcomplete = restoredCustombox.custombox[i].complete;

      if(chkid==buildid)
      {
        return chkaddtocart;
        break;
      }
    }
    return "notfound";
 }
}//function closed

function all_other_addtocart()
{
  var checkcustomboxps = localStorage.getItem('custombox');
  
   if(checkcustomboxps!==null)
   {
    var checkgroupnumber = localStorage.getItem('groupnumber');
    var getalldata = JSON.parse(localStorage.getItem('custombox'));

    for(var i = 0; i < getalldata.custombox.length; i++)
    {
      var mid = parseInt(getalldata.custombox[i].id);
      if(main_build_id!=mid)
      {
        var mquantity = parseInt(getalldata.custombox[i].quantity);

        jQuery.post('/cart/add.js', {
          quantity: mquantity,
          id: mid,
          properties: {
            '_ps_custom_builder': 'yes',
            '_ps_hide_item': 'yes',
            '_ps_group_number': checkgroupnumber
          }
        });

      }
    }// loop closed
    return "done"; 
   }
}//function closed

function update_localstorage() {
  
  var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));
  
  for(var i = 0; i < restoredCustombox.custombox.length; i++)
  {
    restoredCustombox.custombox[i].addtocart = 'done';
  }
  
  localStorage.setItem('custombox', JSON.stringify(restoredCustombox));
  
}//function closed

//this is used for remove one value
function removeValue(list, value, separator) {
  separator = separator || ",";
  var values = list.split(separator);
  for(var i = 0 ; i < values.length ; i++) {
    if(values[i] == value) {
      values.splice(i, 1);
      return values.join(separator);
    }
  }
  return list;
}

// this is used for after update any other product
function oupdate_main_product()
{
  var datastr = 'updates['+main_build_id+']=0';
  $.ajax({
    type: "POST",
    url: '/cart/update.js',
    async: false,
    data:datastr,
    success: function(){
      console.log('remove item!');
    },
    complete: function () {
      var formid = $("#main_custom_builder_btn").attr("data-form-id");
      
      $.ajax({
        type: "POST",
        url: '/cart/add.js',
        async: false,
        data:$('#'+formid).serialize(),
        complete: function () {
          console.log('box added successfully');
          refreshcart('');
        }
      });
      
    }//complete closed
  });
  
}// function closed


// this is used for update main product
function rupdate_main_product(removeid)
{
  var datastr = 'updates['+main_build_id+']=0';
  $.ajax({
    type: "POST",
    url: '/cart/update.js',
    async: false,
    data:datastr,
    success: function(){
      console.log('remove item!');
    },
    complete: function () {
      var formid = $("#main_custom_builder_btn").attr("data-form-id");
      
      var variants_ids = $("#ps-build-variantids").val();
      var new_variants_ids = removeValue(variants_ids,removeid,',');
      $("#ps-build-variantids").val(new_variants_ids);
      
      $.ajax({
        type: "POST",
        url: '/cart/add.js',
        async: false,
        data:$('#'+formid).serialize(),
        complete: function () {
          console.log('box added successfully');
          refreshcart('');
        }
      });
      
    }//complete closed
  });
  
}// function closed

// this is used for refresh cart
function refreshcart(_callback)
{
  var checkgroupnumber = localStorage.getItem('groupnumber');
  
  $.ajax({
  url: '/cart.js',
  dataType: 'json',
  async: false,
  success: function(cart) {
   
      var our_total_price = 0;
      var allrows = '';
      
      var checktotal = cart.item_count;
   		if(checktotal>0)
        {
          var cartitems = cart.items;    
          for(var i=0;i<cartitems.length;i++)
          {
            var lineindex = i+1;
            var item = cartitems[i];
            var item_prop = item.properties;
            var checkprop_hide = item_prop._ps_hide_item;
            var checkprop_builder = item_prop._ps_custom_builder;
            var checkprop_groupnumber = item_prop._ps_group_number;
            
            if(checkprop_builder=='yes' && checkprop_groupnumber == checkgroupnumber)
            {
              var item_url = item.url;
              var item_title = item.title;
              var item_src = item.image;
              
              allrows +='<div class="table_captions table_details" id="cart-row-'+lineindex+'">';
              
              //this is prod image
              allrows +='<div class="prodd">';
              allrows +='<a href="'+item_url+'" title="'+item_title+'" class="cart_page_image">';
              allrows +='<img src="'+item_src+'" alt="'+item_title+'" />';
              allrows +='</a>';
              allrows +='</div>';
              
              //this is prod title
              allrows +='<div class="prodd_name">';
              allrows +='<p><a href="'+item_url+'">';
              allrows +=item_title;
              allrows +='</a></p>';
              
              //this is properties section
              if(checkprop_hide=='no')
              {
                var ship_date = item_prop["Desired shipping date"];
                var gift_note = item_prop["Gift Note"];
                var spl_inst = item_prop["Special Instructions"];
                
                allrows +='<p>';
                  if(ship_date!='')
                  {
                    allrows +='Desired shipping date: '+ship_date+'<br />';
                  }
                  if(gift_note!='')
                  {
                    allrows +='Gift Note: '+gift_note+'<br />';
                  }
                  if(spl_inst!='')
                  {
                    allrows +='Special Instructions: '+spl_inst+'<br />';
                  }
                allrows +='</p>';
              }
              //properties section closed
              
              allrows +='</div>';
              
              //this is used for quantity
              
              var qty_item = item.quantity;
              allrows +='<div class="qtty">';
              allrows +='<a href="javascript:void(0);" data-id="'+item.id+'" data-line-item="'+lineindex+'" onclick="update_cart(this,\'minus\');">-</a>';
              allrows +='<input type="text" min="0" id="quantity-'+item.id+'" size="3" maxlength="3" class="quantity" name="updates[]" value="'+qty_item+'" readonly/>';
              allrows +='<a href="javascript:void(0);" data-id="'+item.id+'" data-line-item="'+lineindex+'" onclick="update_cart(this,\'plus\');">+</a>';
              allrows +='</div>';
              
              //this is price and remove
              var current_price = item.price;
              our_total_price = our_total_price+(current_price*qty_item);
              current_price = current_price/100;
              
              allrows +='<div class="prrice">';
              allrows +='<p><span class="money">$'+current_price+'</span></p>';
              
              if(checkprop_builder=='yes' && checkprop_hide == 'no')
              {
                var ps_vr_ids = item_prop._ps_vr_ids;
                
                allrows +='<a class="ps_remove_item" data-var-group="'+ps_vr_ids+'" href="javascript:void(0);">Remove</a>';
              }
              else
              {
              	allrows +='<a onclick="remove_item('+item.id+');" href="javascript:void(0);">Remove</a>';
              }
              
              allrows +='</div>';
              
              allrows +='</div>';              
              
            }//if closed
            
          }// loop closed
        }//if closed
      
      $('#main-cart-container-section').html(allrows);
    
      $('.cart_count').text(checktotal);
    
      $('#our_total_ps').html("$"+our_total_price/100);
    
      if(typeof _callback === "function")
       _callback(1);  
      return false;
	}
  });
  return false;
}//function closed

// this is used for remove item from cart
function remove_item(itemid)
{
  var datastr = 'updates['+itemid+']=0';
  
  $.ajax({
    type: "POST",
    url: '/cart/update.js',
    async: false,
    data:datastr,
    beforeSend: function(){
      $('#step3-build-box-loader').css({"display":"block"});
      $('#step3-error-message-hidden').fancybox().trigger('click');
    },
    success: function(){
      console.log('remove item from the cart!');
    },
    complete: function () {
      $('#step3-build-box-loader').css({"display":"none"});
      //this is used for get cart data
      rupdate_main_product(itemid);
      console.log('remove item successfully');
      $.fancybox.close();
    }
  });
  
  return false;
}//function closed

// this is used for update item
function update_cart(el,type)
{
  var itemid = $(el).attr("data-id");
  
  var itemqty = $("#quantity-"+itemid).val();
  
  var lineitem = $(el).attr("data-line-item");
  
  itemqty = parseInt(itemqty);
  
  if(type=='plus')
  {
    itemqty = itemqty+1;
  }
  else if(type=='minus' && itemqty>0)
  {
    itemqty = itemqty-1;
  }
      
  if(itemqty>0)
  {
    $("#quantity-"+itemid).val(itemqty);
    
    $.ajax({
    type: "POST",
    url: '/cart/change.js',
    async: false,
    data:{ line: lineitem, quantity: itemqty },
    dataType: 'json',
    beforeSend: function(){
      $('#step3-build-box-loader').css({"display":"block"});
      $('#step3-error-message-hidden').fancybox().trigger('click');
    },
    success: function(){
      console.log('item update successfully');
    },
    complete: function () {
      $('#step3-build-box-loader').css({"display":"none"});
      //this is used for get cart data
      refreshcart('');
      console.log('update item successfully');
      $.fancybox.close();
    }
  });
    
  }//if closed
  
  return false;
}// function closed

  
function direct_add_to_cart(el)
{
  var formid = $(el).attr("data-form-id");
  var ccat = $(el).attr("data-cat");
  var cprod = $(el).attr("data-prod");
  
  var var_size = $('#'+formid).find("#ps-var-size").attr("data-size");
  var maindropdown = $('#'+formid).find("[name=id]");
  
  if(var_size>1)
  {
    var cvrid = $(maindropdown).children("option:selected").val();
  }
  else
  {
  	var cvrid = $(maindropdown).val();
  }
  var quantity = $('#'+formid).find("input[name=quantity]").val();
  var loaderid = 'loader-'+formid;
  
  $('#'+loaderid).css({"display":"block","z-index":9999});
  
  var variants_ids = $("#ps-build-variantids").val();
  if(variants_ids=='')
  {
    $("#ps-build-variantids").val(cvrid);
  }
  else
  {
    var new_variants_ids = variants_ids+","+cvrid;
    $("#ps-build-variantids").val(new_variants_ids);
  }
  
  pushIt(cvrid,quantity);
  
  console.log('item added successfully');
  
  $('#'+loaderid).css({"display":"none","z-index":-1});
  $(el).parent().addClass('active');
  
  return false;
}// function closed

  
function quick_add_to_cart(el)
{
  var formid = $(el).attr("data-form-id");
  var ccat = $(el).attr("data-cat");
  var cprod = $(el).attr("data-prod");
  
  var var_size = $('#'+formid).find("#ps-var-size").attr("data-size");
  var maindropdown = $('#'+formid).find("[name=id]");
  
  if(var_size>1)
  {
    var cvrid = $(maindropdown).children("option:selected").val();
  }
  else
  {
  	var cvrid = $(maindropdown).val();    
  }
  var quantity = $('#'+formid).find("input[name=quantity]").val();
  var loaderid = 'quick-'+formid; 
  
  $('#'+loaderid).css({"display":"block","z-index":9999});
  
  var variants_ids = $("#ps-build-variantids").val();
  if(variants_ids=='')
  {
    $("#ps-build-variantids").val(cvrid);
  }
  else
  {
    var new_variants_ids = variants_ids+","+cvrid;
    $("#ps-build-variantids").val(new_variants_ids);
  }
  
  pushIt(cvrid,quantity);
  
  console.log('item added successfully');
  
  $('#'+loaderid).css({"display":"none","z-index":-1});
  $("a[data-form-id='"+formid+"']").parent().addClass('active');
  $(".fancybox-close").trigger('click');
  
  return false;
}// function closed

//this is used for build custom cart
function build_box()
{
  $("#ps_group_number").val(groupnumber);
  
  var formid = $("#main_custom_builder_btn").attr("data-form-id");
  
  var cprod1 = $("#getshippingdate").val();
  
  if(cprod1!='')
  {
  	var newinput1 = $("<input id=\"psgetshippingdate\" type=\"hidden\" value=\"" + cprod1 + "\" name=\"properties[Desired shipping date]\" />");
  
  	$("#append-dynamic-properties").append(newinput1);
  }
  else
  {
    $('#ship_date_error').show();
    return false;
  }
  
  var cprod2 = $("#getgiftnote").val();
  
  if(cprod2!='')
  {
  	var newinput2 = $("<input id=\"psgetgiftnote\" type=\"hidden\" value=\"" + cprod2 + "\" name=\"properties[Gift Note]\" />");
  
  	$("#append-dynamic-properties").append(newinput2);
  }
  
  var cprod3 = $("#getspecialins").val();
  
  if(cprod3!='')
  {
  	var newinput3 = $("<input id=\"psgetspecialins\" type=\"hidden\" value=\"" + cprod3 + "\" name=\"properties[Special Instructions]\" />");
  
  	$("#append-dynamic-properties").append(newinput3);
  }
  
  pushIt(main_build_id,1);
  
  $.ajax({
    type: "POST",
    url: '/cart/add.js',
    async: false,
    data:$('#'+formid).serialize(),
    beforeSend: function(){
      $('#step2-build-box-loader').css({"display":"block","z-index":9999});
      $('#step3-error-message-hidden').fancybox().trigger('click');
    },
    complete: function () {
      var chkres = all_other_addtocart();
      if(chkres=='done'){
      	console.log('box added successfully');
      	update_localstorage();
      	
        setTimeout(function(){ 
          $('#step2-build-box-loader').css({"display":"none","z-index":-1});
      	  $.fancybox.close();
          refreshcart(nextPrev); 
        }, 2000);
      }
    }
  });
  
  return false;
}//funcion closed

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 1) {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").style.display = "none";
  } else {
    
    /*var pscheckb = find_buildid_localstorage(main_build_id);
    if(pscheckb=="notfound")
    {
      	document.getElementById("nextBtn").style.display = "none";
    }
    else if (n == 1)
    {
     	document.getElementById("nextBtn").style.display = "inline"; 
    }*/
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}//function closed

function step1_nextPrev(n) {
  
  //this is check localstorage
  var check_custombox  = localStorage.getItem('custombox');
  if(check_custombox === null || check_custombox =='')
  {
    alert("please build your own box");
    return false;
  }
  else
  {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");

    // Hide the current tab:
    x[currentTab].style.display = "none";

    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;

    // if you have reached the end of the form...
    if (currentTab >= x.length) {
      return false;
    }

    // Otherwise, display the correct tab:
    showTab(currentTab);
  }
}//function closed
  
function nextPrev(n) {
  
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  //if (n == 1 && !validateForm()) return false;
  
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    // document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}//function closed

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}//function closed

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}//function closed

function myFunction() {
  //$(".row").css('padding-top','0px');
  if (window.pageYOffset > sticky) {
    headerps.classList.add("sticky");
  } else {
    headerps.classList.remove("sticky");
  }
}//function closed


// this is used for page loader
document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
       $('#ps-contents').css("visibility","hidden");
  } else if (state == 'complete') {
      setTimeout(function(){
        document.getElementById('interactive');
        $('#page-load').css({"display":"none","visibility":"hidden","z-index":"-1"}); 
        $('#ps-contents').css("visibility","visible");
      },500);
  }
}

// Current tab is set to be the first tab (0)
var currentTab = 0; 
// Display the crurrent tab
showTab(currentTab); 

var headerps = document.getElementById("myHeader");
var sticky = 375; 

window.onscroll = function() {
  myFunction()
};

$(function(){
  //this is hide first
  $('.step3-error-message').hide();
  
  $("input[name='quantity']").on('input', function (e) {
    $(this).val($(this).val().replace(/[^0-9]/g, ''));
  });
  
  $("#category_filter,#category_filter2").change(function() {
    var filterValue = $(this).val();

    $("#category_filter,#category_filter2").val(filterValue);
    var row = $('.row');

    row.each(function(i, el) {
      if ($(el).attr('data-type') == filterValue) {
        row.hide()
        $(el).show();
        // $(el).css('padding-top','0px');
      }
    });

    // In Addition to Wlin's Answer (For "All" value)
    if ("all" == filterValue) {
      row.show();
    }

  });
  
});

jQuery(document).ready(function(){
    // This button will increment the value
    $('.qtyplus').click(function(e){
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[id=direct-quantity-'+fieldName+']').val());
        // If is not undefined
        if (!isNaN(currentVal)) {
            // Increment
            $('input[id=direct-quantity-'+fieldName+']').val(currentVal + 1);
            $('input[id=quantity-'+fieldName+']').val(currentVal + 1);
        } else {
            // Otherwise put a 0 there
            $('input[id=direct-quantity-'+fieldName+']').val(1);
            $('input[id=quantity-'+fieldName+']').val(1);
        }
    });
    // This button will decrement the value till 0
    $(".qtyminus").click(function(e) {
        // Stop acting like a button
        e.preventDefault();
        // Get the field name
        fieldName = $(this).attr('field');
        // Get its current value
        var currentVal = parseInt($('input[id=direct-quantity-'+fieldName+']').val());
        // If it isn't undefined or its greater than 0
        if (!isNaN(currentVal) && currentVal > 0) {
            // Decrement one
            $('input[id=direct-quantity-'+fieldName+']').val(currentVal - 1);
            $('input[id=quantity-'+fieldName+']').val(currentVal - 1);
        } else {
            // Otherwise put a 0 there
            $('input[id=direct-quantity-'+fieldName+']').val(1);
            $('input[id=quantity-'+fieldName+']').val(1);
        }
    });
});
  
$(document).on('click', '.ps_remove_item', function () {
  
  var other_ids = $(this).attr('data-var-group');
  
  var datastr = '';
  
  var myarray = other_ids.split(',');
  
  if(myarray.length)
  {
    for(var i = 0; i < myarray.length; i++)
    {
      var idd =myarray[i];
      if(datastr=='')
      {
      	if(idd!=''){
        	datastr += 'updates['+idd+']=0';
      	}  
      }
      else
      {
        if(idd!=''){
          datastr += '&updates['+idd+']=0';
        }
      }
    }
  }// if closed
  
  complete_build();
  
  //this is used for remove items
  $.ajax({
    type: "POST",
    url: '/cart/update.js',
    async: false,
    data:datastr,
    success: function(){
      console.log('remove item!');
    },
    complete: function () {
      window.location.reload();
    }
  });
  
  return false;
});