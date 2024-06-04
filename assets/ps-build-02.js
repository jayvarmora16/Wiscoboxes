//this is default value
var main_build_id = $("#ps-build-variantids").val();
var cdate = new Date();
var groupnumber = cdate.getTime();
var allps = {};
allps.queue = [];

localStorage.removeItem('custombox');
localStorage.removeItem('groupnumber');

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

// this is used for update properties
function update_properties(newid,action)
{
  var checkmaiid = 'no';
  var checkcustomboxps = localStorage.getItem('custombox');
   if(checkcustomboxps!==null)
   { 
      var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));
      
      for(var i = 0; i < restoredCustombox.custombox.length; i++)
      {
        var chkid = restoredCustombox.custombox[i].id;
        
        if(chkid==main_build_id)
        {
          checkmaiid = 'yes';
          
          var varids = restoredCustombox.custombox[i]._ps_vr_ids;
          if(action=='remove')
          {
          	varids = removeValue(varids, newid, ',');
          }
          else if(action=='add')
          {
          	varids = varids+','+newid;
          }
          restoredCustombox.custombox[i]._ps_vr_ids = varids;
          break;
        }
      }// loop closed
     
     if(checkmaiid=='yes')
     {
      localStorage.setItem('custombox', JSON.stringify(restoredCustombox));
     }
   }
  
  return false;
}//function closed

//this is used for display cart items
function add_more_items_addtocart()
{
  //start
  var checkgroupnumber = localStorage.getItem('groupnumber');
   
  var our_total_price = 0;
  var allrows = '';
  var checktotal = 0;

  var checkcustomboxps = localStorage.getItem('custombox');
  
  if(checkcustomboxps!==null)
  {
    var restoredCustombox = new Array();
    var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));

    var cartitems = restoredCustombox.custombox;
    for(var i=0;i<cartitems.length;i++)
    {
      var lineindex = i+1;
      var item = cartitems[i];
      var item_id = item.id;
      var item_title = item.title;
      var item_src = item.image;
      var qty_item = item.quantity;
      var current_price = item.unitprice;
      // current_price = current_price/100;

      var checkprop_hide = item._ps_hide_item;
      var checkprop_builder = item._ps_custom_builder;
      var checkprop_groupnumber = item._ps_group_number;
      
      if(checkprop_builder=='yes' && checkprop_groupnumber == checkgroupnumber)
      {
        allrows +='<div class="table_captions table_details" id="cart-row-'+lineindex+'">';
        
        //this is prod image
        allrows +='<div class="prodd">';
        allrows +='<a href="javascript:void(0);" title="'+item_title+'" class="cart_page_image">';
        allrows +='<img src="'+item_src+'" alt="'+item_title+'" />';
        allrows +='</a>';
        allrows +='</div>';
        
        //this is prod title
        allrows +='<div class="prodd_name">';
        allrows +='<p><a href="javascript:void(0);">';
        allrows +=item_title;
        allrows +='</a></p>';
        
        //this is properties section
        if(checkprop_hide=='no')
        {
          var ship_date = item["Desired shipping date"];
          var gift_note = item["Gift Note"];
          var spl_inst = item["Special Instructions"];
          
          var tax_exempt_number_pr = item["Tax_Exempt_Number"];
          var company_name_pr = item["Company_Name"];
          
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
          
          	if(tax_exempt_number_pr!=''&& typeof tax_exempt_number_pr!='undefined')
            {
              allrows +='Tax_Exempt_Number: '+tax_exempt_number_pr+'<br />';
            }
          	if(company_name_pr!='' && typeof company_name_pr!='undefined')
            {
              allrows +='Company_Name: '+company_name_pr+'<br />';
            }
          allrows +='</p>';
        }
        //properties section closed
        
        allrows +='</div>';
        
        //this is used for quantity
        allrows +='<div class="qtty">';
        allrows +='<a href="javascript:void(0);" data-price="'+current_price+'" data-id="'+item_id+'" data-line-item="'+lineindex+'" onclick="update_cart(this,\'minus\');">-</a>';
        allrows +='<input type="text" min="0" id="quantity-'+item_id+'" data-price="'+current_price+'" size="3" maxlength="3" class="quantity" name="updates[]" value="'+qty_item+'" readonly/>';
        allrows +='<a href="javascript:void(0);" data-id="'+item_id+'" data-price="'+current_price+'" data-line-item="'+lineindex+'" onclick="update_cart(this,\'plus\');">+</a>';
        allrows +='</div>';
        
        //this is price and remove
        our_total_price = our_total_price+(current_price*qty_item);
        
        allrows +='<div class="prrice">';
        allrows +='<p><span class="money">$'+current_price+'</span></p>';
        
        if(checkprop_builder=='yes' && checkprop_hide == 'no')
        {
          var ps_vr_ids = item._ps_vr_ids;
          
          allrows +='<a class="ps_remove_item" data-var-group="'+ps_vr_ids+'" href="javascript:void(0);">Remove</a>';
        }
        else
        {
          allrows +='<a data-id="'+item_id+'" data-price="'+current_price+'" data-line-item="'+lineindex+'" onclick="remove_item(this);" href="javascript:void(0);">Remove</a>';
        }
        
        allrows +='</div>';
        
        allrows +='</div>';              
        
      }//if closed
      
    }// loop closed
  }//if closed
      
  $('#main-cart-container-section').html(allrows);

  $('#our_total_ps').attr("real-total",our_total_price);
  $('#our_total_ps').html("$"+our_total_price);

  //closed
}

//this is used for add all items in cart
function all_items_addtocart(type)
{
  $('#step3-error-message-hidden').fancybox().trigger('click');
  var checkcustomboxps = localStorage.getItem('custombox');
  
   if(checkcustomboxps!==null)
   {
     var psquantity=0;
     
      var checkgroupnumber = localStorage.getItem('groupnumber');
      var getalldata = JSON.parse(localStorage.getItem('custombox'));
	  
      var main_all_length = getalldata.custombox.length;
     
      for(var i = 0; i < getalldata.custombox.length; i++)
      {
        var item = getalldata.custombox[i];
        var mid = parseInt(item.id);
        if(mid!='')
        {
          var mquantity = parseInt(item.quantity);
          var checkprop_hide = item._ps_hide_item;
          
		  if(checkprop_hide=='no')
          {
            var ps_vr_ids = item._ps_vr_ids;
            var ship_date = item["Desired shipping date"];
          	var gift_note = item["Gift Note"];
          	var spl_inst = item["Special Instructions"];
            
            var tax_exempt_number_pr = item["Tax_Exempt_Number"];
			var company_name_pr = item["Company_Name"];
            
            if(company_name_pr!='' && typeof company_name_pr!='undefined')
            {
              allps.queue.push({
                quantity: mquantity,
                id: mid,
                properties: {
                  '_ps_custom_builder': 'yes',
                  '_ps_hide_item': 'no',
                  '_ps_vr_ids': ps_vr_ids,
                  'Desired shipping date': ship_date,
                  'Gift Note': gift_note,
                  'Special Instructions': spl_inst,
                  'Tax_Exempt_Number':tax_exempt_number_pr,
                  'Company_Name':company_name_pr,
                  '_ps_group_number': checkgroupnumber
                }
              });
            }
            else if(tax_exempt_number_pr!=''&& typeof tax_exempt_number_pr!='undefined')
            {
              allps.queue.push({
                quantity: mquantity,
                id: mid,
                properties: {
                  '_ps_custom_builder': 'yes',
                  '_ps_hide_item': 'no',
                  '_ps_vr_ids': ps_vr_ids,
                  'Desired shipping date': ship_date,
                  'Gift Note': gift_note,
                  'Special Instructions': spl_inst,
                  'Tax_Exempt_Number':'YES',
                  '_ps_group_number': checkgroupnumber
                }
              });
            }
            else
            {
              allps.queue.push({
                quantity: mquantity,
                id: mid,
                properties: {
                  '_ps_custom_builder': 'yes',
                  '_ps_hide_item': 'no',
                  '_ps_vr_ids': ps_vr_ids,
                  'Desired shipping date': ship_date,
                  'Gift Note': gift_note,
                  'Special Instructions': spl_inst,
                  '_ps_group_number': checkgroupnumber
                }
              });
            }
            
          }
          else
          {
            
            allps.queue.push({
              quantity: mquantity,
              id: mid,
              properties: {
                '_ps_custom_builder': 'yes',
                '_ps_hide_item': 'yes',
                '_ps_group_number': checkgroupnumber
              }
            });
            
          }

        }
      }// loop closed
     
     allps.moveAlong = function() {
	  // If we still have requests in the queue, let's process the next one.
	  if (allps.queue.length) {
	    var request = allps.queue.shift();
        var allpropty = request.properties;
        
        var allproptydata = '';
            
        var result = Object.keys(allpropty).map(function(key) {
          allproptydata+='&properties['+key+']='+allpropty[key];
        });
        
	    var data = 'id='+ request.id + '&quantity='+ request.quantity + allproptydata;
        
        // console.log(data);
        
	    $.ajax({
	      type: 'POST',
          url: '/cart/add.js',
	      dataType: 'json',
	      data: data,
	      success: function(res){
	        allps.moveAlong();
		    psquantity += 1;
	      },
          error: function(){
	        // if it's not last one Move Along else update the cart number with the current quantity
            if (allps.queue.length){
              allps.moveAlong()
            } 
	      }
         });
     }
	 // If the queue is empty, we add 1 to cart
	 else {
	  psquantity += 1;
	  if(main_all_length==psquantity)
      {
         if(type=='checkout')
         {
           $.fancybox.close();
           //window.location.href="/checkout";
           window.location.href="/cart";
         }
         else if(type=='shop')
         {
           $.fancybox.close();
           window.location.href="/collections/shop";
         }
      }// if closed
	 }
    };//closed
     
     allps.moveAlong();
   }
  return false;
}//function closed

// this is used for remove item from cart
function remove_item(el)
{
  var itemid = $(el).attr("data-id");
  var itemline = $(el).attr("data-line-item");
  
  var our_total_price = 0;
  
  $("#cart-row-"+itemline).remove();
  
  var checkcustomboxps = localStorage.getItem('custombox');
   if(checkcustomboxps!==null)
   { 
      var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));

      for(var i = 0; i < restoredCustombox.custombox.length; i++)
      {
        var chkid = restoredCustombox.custombox[i].id;
        
        if(chkid==itemid)
        {
          restoredCustombox.custombox.splice(i, 1);
          break;
        }
      }// loop closed
     
     localStorage.setItem('custombox', JSON.stringify(restoredCustombox));
     
     var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));

      for(var i = 0; i < restoredCustombox.custombox.length; i++)
      {
        var chkprice = parseFloat(restoredCustombox.custombox[i].unitprice);
        var chkqty = parseInt(restoredCustombox.custombox[i].quantity);
        
        our_total_price = our_total_price+parseFloat(chkprice*chkqty);
      }// loop closed
   }
   update_properties(itemid,'remove'); 
  $('#our_total_ps').html("$"+our_total_price);
  
  return false;
}//function closed

// this is used for update item
function update_cart(el,type)
{
  var itemid = $(el).attr("data-id");
  
  var itemqty = $("#quantity-"+itemid).val();
  
  var lineitem = $(el).attr("data-line-item");
  
  var our_total_price = 0;
  
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
    
    var checkcustomboxps = localStorage.getItem('custombox');
   if(checkcustomboxps!==null)
   { 
      var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));

      for(var i = 0; i < restoredCustombox.custombox.length; i++)
      {
        var chkid = restoredCustombox.custombox[i].id;
        
        if(chkid==itemid)
        {
          restoredCustombox.custombox[i].quantity = itemqty;
          break;
        }
      }// loop closed
     
     localStorage.setItem('custombox', JSON.stringify(restoredCustombox));
     
     var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));

      for(var i = 0; i < restoredCustombox.custombox.length; i++)
      {
        var chkprice = parseFloat(restoredCustombox.custombox[i].unitprice);
        var chkqty = parseInt(restoredCustombox.custombox[i].quantity);
        
        our_total_price = our_total_price+parseFloat(chkprice*chkqty);
      }// loop closed
   }
    
  $('#our_total_ps').html("$"+our_total_price);
    
    console.log('update item successfully');
    
  }//if closed
  
  return false;
}// function closed

// this is used for direct add to cart
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
    var cvr_price = $(maindropdown).children("option:selected").attr("data-price");
  }
  else
  {
  	var cvrid = $(maindropdown).val();
    var cvr_price = $(maindropdown).attr("data-price");
  }
  
  var quantity = $('#'+formid).find("input[name=quantity]").val();
  quantity = parseInt(quantity);

  var single_price = parseFloat(cvr_price);

  var loaderid = 'loader-'+formid;
  
  var fimg = $(el).parent().find('.featureimg').attr("src");

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
  
  var checkcustomboxps = localStorage.getItem('custombox');
  
  if(checkcustomboxps===null)
  {
    var customboxps =
    { 
      custombox: 
      [
        {id:cvrid,
         quantity:quantity,
         image:fimg,
         title:cprod,
         unitprice:single_price,
         _ps_custom_builder:'yes',
         _ps_hide_item:'yes',
         _ps_group_number:groupnumber,
         addtocart:'pending',
         complete:'pending'
        }
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
        id:cvrid,
        quantity:quantity,
        image:fimg,
        title:cprod,
        unitprice:single_price,
        _ps_custom_builder:'yes',
        _ps_hide_item:'yes',
        _ps_group_number:groupnumber,
        addtocart:'pending',
        complete:'pending'
      });
    
    localStorage.setItem('custombox', JSON.stringify(restoredCustombox));
  }//else closed

  update_properties(cvrid,'add');
  console.log('item added successfully');
  
  $('#'+loaderid).css({"display":"none","z-index":-1});
  $(el).parent().addClass('active');
  
  return false;
}// function closed

//this is used for quick view add to cart
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
    var cvr_price = $(maindropdown).children("option:selected").attr("data-price");
  }
  else
  {
  	var cvrid = $(maindropdown).val();  
    var cvr_price = $(maindropdown).attr("data-price");  
  }

  var quantity = $('#'+formid).find("input[name=quantity]").val();
  quantity = parseInt(quantity);
  var loaderid = 'quick-'+formid; 
  var single_price = parseFloat(cvr_price);

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
  
  var fimg = $("a[data-form-id='"+formid+"']").parent().find('.featureimg').attr("src");

  var checkcustomboxps = localStorage.getItem('custombox');
  
  if(checkcustomboxps===null)
  {
    var customboxps =
    { 
      custombox: 
      [
        {id:cvrid,
         quantity:quantity,
         image:fimg,
         title:cprod,
         unitprice:single_price,
         _ps_custom_builder:'yes',
         _ps_hide_item:'yes',
         _ps_group_number:groupnumber,
         addtocart:'pending',
         complete:'pending'
        }
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
        id:cvrid,
        quantity:quantity,
        image:fimg,
        title:cprod,
        unitprice:single_price,
        _ps_custom_builder:'yes',
        _ps_hide_item:'yes',
        _ps_group_number:groupnumber,
        addtocart:'pending',
        complete:'pending'
      });
    
    localStorage.setItem('custombox', JSON.stringify(restoredCustombox));
  }//else closed

  console.log('quick item added successfully');
  update_properties(cvrid,'add');
  
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
  
  var tax_number_rbox1='';
  var tax_number_rbox2='';
  if (document.getElementById('tax_number_rbox1').checked) 
  {
    tax_number_rbox1='yes';
    var newradio1 = $("<input id=\"pstax_number_rbox1\" type=\"hidden\" value=\"YES\" name=\"properties[Tax_Exempt_Number]\" />");
    $("#append-dynamic-properties").append(newradio1);
  }
  
  if (document.getElementById('tax_number_rbox2').checked) 
  {
    tax_number_rbox2='yes';
    var tax_number_box = $("#tax_number_box").val();
    var newradio2 = $("<input id=\"pstax_number_rbox2\" type=\"hidden\" value=\"" + tax_number_box + "\" name=\"properties[Tax_Exempt_Number]\" />");
    $("#append-dynamic-properties").append(newradio2);
    
    var company_number_box = $("#company_number_box").val();
    var newradio3 = $("<input id=\"pstax_number_rbox3\" type=\"hidden\" value=\"" + company_number_box + "\" name=\"properties[Company_Name]\" />");
    $("#append-dynamic-properties").append(newradio3);
  }
  
  $('#step2-build-box-loader').css({"display":"block","z-index":9999});
  $('#step3-error-message-hidden').fancybox().trigger('click');

  var fimg = $('.default_feature_image').find('img').attr('src');
  var cprod = $('#main-prod-title').text();
  var single_price = parseFloat($('#main-prod-title').attr("data-price"));
  var ps_vr_ids = $('#ps-build-variantids').val();

  var checkcustomboxps = localStorage.getItem('custombox');
  
  if(checkcustomboxps===null)
  { 
    if(tax_number_rbox1=='yes')
    {
   		var customboxps =
        { 
          custombox: 
          [
            {id:main_build_id,
             quantity:1,
             image:fimg,
             title:cprod,
             unitprice:single_price,
             _ps_custom_builder:'yes',
             _ps_hide_item:'no',
             _ps_vr_ids:ps_vr_ids,
             'Desired shipping date':cprod1,
             'Gift Note':cprod2,
             'Special Instructions':cprod3,
             'Tax_Exempt_Number':'YES',
             _ps_group_number:groupnumber,
             addtocart:'pending',
             complete:'pending'
            }
          ]
        };   
    }
    else if(tax_number_rbox2=='yes')
    {
      var Company_Name = $("#company_number_box").val();
      var Tax_Exempt_Number = $("#tax_number_box").val();
      
      var customboxps =
        { 
          custombox: 
          [
            {id:main_build_id,
             quantity:1,
             image:fimg,
             title:cprod,
             unitprice:single_price,
             _ps_custom_builder:'yes',
             _ps_hide_item:'no',
             _ps_vr_ids:ps_vr_ids,
             'Desired shipping date':cprod1,
             'Gift Note':cprod2,
             'Special Instructions':cprod3,
             'Tax_Exempt_Number':Tax_Exempt_Number,
             'Company_Name':Company_Name,
             _ps_group_number:groupnumber,
             addtocart:'pending',
             complete:'pending'
            }
          ]
        };
    }
    else
    {
      var customboxps =
        { 
          custombox: 
          [
            {id:main_build_id,
             quantity:1,
             image:fimg,
             title:cprod,
             unitprice:single_price,
             _ps_custom_builder:'yes',
             _ps_hide_item:'no',
             _ps_vr_ids:ps_vr_ids,
             'Desired shipping date':cprod1,
             'Gift Note':cprod2,
             'Special Instructions':cprod3,
             _ps_group_number:groupnumber,
             addtocart:'pending',
             complete:'pending'
            }
          ]
        };
    }
    
    localStorage.setItem('custombox', JSON.stringify(customboxps));
    localStorage.setItem('groupnumber', groupnumber);
  }
  else
  {
    var restoredCustombox = new Array();
    var restoredCustombox = JSON.parse(localStorage.getItem('custombox'));
    
    if(tax_number_rbox1=='yes')
    {  
       restoredCustombox.custombox.push({
         id:main_build_id,
         quantity:1,
         image:fimg,
         title:cprod,
         unitprice:single_price,
         _ps_custom_builder:'yes',
         _ps_hide_item:'no',
         _ps_vr_ids:ps_vr_ids,
         'Desired shipping date':cprod1,
         'Gift Note':cprod2,
         'Special Instructions':cprod3,
         'Tax_Exempt_Number':'YES',
         _ps_group_number:groupnumber,
         addtocart:'pending',
         complete:'pending'
      });
    }
    else if(tax_number_rbox2=='yes')
    {
      var Company_Name = $("#company_number_box").val();
      var Tax_Exempt_Number = $("#tax_number_box").val();
      
      restoredCustombox.custombox.push({
         id:main_build_id,
         quantity:1,
         image:fimg,
         title:cprod,
         unitprice:single_price,
         _ps_custom_builder:'yes',
         _ps_hide_item:'no',
         _ps_vr_ids:ps_vr_ids,
         'Desired shipping date':cprod1,
         'Gift Note':cprod2,
         'Special Instructions':cprod3,
         'Tax_Exempt_Number':Tax_Exempt_Number,
         'Company_Name':Company_Name,
         _ps_group_number:groupnumber,
         addtocart:'pending',
         complete:'pending'
      });
    }
    else
    {
      restoredCustombox.custombox.push({
         id:main_build_id,
         quantity:1,
         image:fimg,
         title:cprod,
         unitprice:single_price,
         _ps_custom_builder:'yes',
         _ps_hide_item:'no',
         _ps_vr_ids:ps_vr_ids,
         'Desired shipping date':cprod1,
         'Gift Note':cprod2,
         'Special Instructions':cprod3,
         _ps_group_number:groupnumber,
         addtocart:'pending',
         complete:'pending'
      });
    }
    
    localStorage.setItem('custombox', JSON.stringify(restoredCustombox));
  }//else closed

  console.log('build box added successfully');
  
  add_more_items_addtocart();
  
  $('#step2-build-box-loader').css({"display":"none","z-index":-1});
  
   $('#step2-nextBtn').css({"display":"inline"});
  $.fancybox.close();
  
  $('#step2-build-box-btn').attr("disabled", "disabled");
  
  nextPrev(1);
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

function qtyplusInc(e)
{
  // Get the field name
  var fieldName = $(e).attr('field');
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
}

function qtyminusInc(e)
{
  // Get the field name
  var fieldName = $(e).attr('field');
  // Get its current value
  var currentVal = parseInt($('input[id=direct-quantity-'+fieldName+']').val());
  // If it isn't undefined or its greater than 0
  if (!isNaN(currentVal) && currentVal > 1) {
    // Decrement one
    $('input[id=direct-quantity-'+fieldName+']').val(currentVal - 1);
    $('input[id=quantity-'+fieldName+']').val(currentVal - 1);
  } else {
    // Otherwise put a 0 there
    $('input[id=direct-quantity-'+fieldName+']').val(1);
    $('input[id=quantity-'+fieldName+']').val(1);
  }
}

function radio_no_check() {
        if (document.getElementById('tax_number_rbox2').checked) {
          $('#input_tax_div').slideDown('slow');
        } else {
          $('#input_tax_div').slideUp('slow');
        }
    }

function radio_yes_check() {
        if (document.getElementById('tax_number_rbox1').checked) {
          $('#input_tax_div').slideUp('slow');
        } else {
           $('#input_tax_div').slideUp('slow');
        }
    }
function checkbox_no_check() {
        if (document.getElementById('tax_number_checkbox2').checked) {
           $('.tax_number1').slideDown('slow');
           $('.tax_number2').slideDown('slow');
        } else {
           $('.tax_number1').slideUp('slow');
           $('.tax_number2').slideUp('slow');
        }
    }

// this is used for page loader
/*document.onreadystatechange = function () {
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
}*/

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

    /*row.each(function(i, el) {
      if ($(el).attr('data-type') == filterValue) {
        row.hide()
        $(el).show();
        // $(el).css('padding-top','0px');
      }
    });

    // In Addition to Wlin's Answer (For "All" value)
    if ("all" == filterValue) {
      row.show();
    }*/
    
    if (filterValue!=""){    
      $.ajax({
        type: 'GET',
        url: 'https://wiscoboxes.com/collections/all?view=ps-collection',
        beforeSend: function(){
          $('#page-load').css({"display":"block","visibility":"visible","z-index":"999999"}); 
        },
        success: function(data) {
          
          $('#page-load').css({"display":"none","visibility":"hidden","z-index":"-1"}); 
          row.css("display","none");
          
          if (filterValue=="allcategory")
          {
          	//var filteredData = $(data).find("."+filterValue);
            var pk;
            for (pk = 0; pk < main_list_handle.length; pk++) 
            { 
              var newftval = main_list_handle[pk];
              
              $("#main-category-data-"+newftval).html('');
              
              var pk1;
              
              /*var filteredData = $(data).find(".main-category-"+newftval);

              $.each(filteredData, function(index, product) {
                  $("#main-category-data-"+newftval).append(product);
              });*/
              
              for (pk1 = 0; pk1 < all_section_data.length; pk1++) 
              {
                var newcate = all_section_data[pk1]['cat'];
                if(newcate==newftval)
                {
                  var newfthandle = all_section_data[pk1]['handle'];
                  var filteredData = $(data).find(".ps-"+newfthandle);

                  $("#main-category-data-"+newftval).append(filteredData);
                }
              }// loop closed
              

              $("#"+newftval).css("display","block");
              
            }//loop closed
          }
          else
          {
            $("#main-category-data-"+filterValue).html('');
            var pk1;
            for (pk1 = 0; pk1 < all_section_data.length; pk1++) 
            {
              var newcate = all_section_data[pk1]['cat'];
              if(newcate==filterValue)
              {
                var newftval = all_section_data[pk1]['handle'];
                var filteredData = $(data).find(".ps-"+newftval);

                $("#main-category-data-"+filterValue).append(filteredData);
              }
            }// loop closed
            
            $("#"+filterValue).css("display","block");   
            
		  	/*var filteredData = $(data).find(".main-category-"+filterValue);
          
          	$("#main-category-data-"+filterValue).html('');

          	$.each(filteredData, function(index, product) {
            	$("#main-category-data-"+filterValue).append(product);
          	});
          
          	$("#"+filterValue).css("display","block");*/
            
          }//else closed

        },
        dataType: "html"
      });
    }//if closed

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
        if (!isNaN(currentVal) && currentVal > 1) {
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
  window.location.reload();
  return false;
});