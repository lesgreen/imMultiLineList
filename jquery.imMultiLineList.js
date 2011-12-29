/*
 * 	 imMultiLineList - A JQuery Plugin
 * 	 @author Les Green
 * 	 Copyright (C) 2011 Intriguing Minds, Inc.
 * 
 *   Version 0.5; - 26 Dec 2011
 *  
 * 
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.

 *   Demo and Documentation can be found at:   
 *   http://www.grasshopperpebbles.com
 *   
 */


;(function($){
    $.fn.imMultiLineList = function(pluginOptions) {
        // support mutltiple elements
        if (this.length > 1){
            this.each(function() { $(this).imMultiLineList(pluginOptions) });
            return this;
        }
 
        // SETUP private variabls;
        var imMultiLineList = this;
        var selectedItems = new Array();
        var lastSelectedIndex = -1;
 
           // setup options
		var defaults = {
			option_map: '', //{"optionValue": "id", "optionText": "address"} 
			item_class: '',
			item_hover_class: '',
			item_select_class: '',
			value_text_separator: '~'
		};
       	var opts = $.extend({}, defaults, pluginOptions);

        // SETUP private functions;
		var initialize = function() {
		   // support MetaData plugin
		   if ($.meta){
		       options = $.extend({}, opts, this.data());
		   }
		   return imMultiLineList;
		};
		
		var doAdd = function(result) {
			var listItem;
			
			$.each(result, function(i, itm) {
				listItem = $('<div></div>').attr('id', 'imMultiLineList'+i).html(itm[opts.option_map.optionText]).appendTo(imMultiLineList);
				$(listItem).data("options", {optionValue: itm[opts.option_map.optionValue], index: i, isSelected: false});
				if (opts.item_class) {
					$(listItem).addClass(opts.item_class);
				}
				
				$(listItem).hover(
				  function () {
				    $(this).addClass(opts.item_hover_class);
				  }, 
				  function () {
				    $(this).removeClass(opts.item_hover_class);
				  }
				);

				$(listItem).click(function(e) {
					if ((e.ctrlKey) || (e.metaKey)) {
						toggleSelectedItem($(this));
					} else if (e.shiftKey) {
						if (selectedItems.length > 0) {
							if (lastSelectedIndex != -1) {
								selectRange($(this).data("options").index);
							}
						} 	
					} else {
						if (selectedItems.length == 0) {
							toggleSelectedItem($(this));
						} else {
							var sel = deSelectAll();
							if (sel) {
								toggleSelectedItem($(this));
							}	
						}
					}
				});	
			});
		};
		
		var toggleSelectedItem = function(itm) {
			if (itm.data("options").isSelected == true) {
				removeFromArray(itm.data("options").optionValue);
				itm.data("options", {optionValue: itm.data("options").optionValue, index: itm.data("options").index, isSelected: false});
			} else {
				var myArray = new Array();
				myArray['value'] = itm.data("options").optionValue;
				myArray['text'] = itm.html();
				selectedItems[selectedItems.length] = myArray;
				itm.data("options", {optionValue: itm.data("options").optionValue, index: itm.data("options").index, isSelected: true});
				lastSelectedIndex = itm.data("options").index;
				//console.log(lastSelectedIndex);
			}
			//$(this).data("options", {optionValue: $(this).data("options").optionValue, isSelected: sel);
			if (opts.item_select_class) {
				if (itm.hasClass(opts.item_select_class)) {
					itm.removeClass(opts.item_select_class);
				} else {
					itm.addClass(opts.item_select_class);
				}
			}
		};
		
		var selectRange = function(idx) {
			var itms = imMultiLineList.find(' > div');
			var startVal = stopVal = 0;
			if (lastSelectedIndex < idx) {
				startVal = lastSelectedIndex;
				stopVal = idx; 	
			} else if (idx > lastSelectedIndex) {
				startVal = lastSelectedIndex;
				stopVal = idx;
			}
			
			var myArray, itm;
			for (var i = startVal; i<=stopVal; i++) {
				itm = $(itms)[i];
				myArray = [];
				myArray['value'] = $(itm).data("options").optionValue;
				myArray['text'] = $(itm).html();
				selectedItems[selectedItems.length] = myArray;
				$(itm).data("options", {optionValue: $(itm).data("options").optionValue, index: $(itm).data("options").index, isSelected: true});
				lastSelectedIndex = $(itm).data("options").index;
				if (opts.item_select_class) {
					if (! $(itm).hasClass(opts.item_select_class)) {
						$(itm).addClass(opts.item_select_class);
					}
				}
			}
		};
		
		var removeFromArray = function(optVal) {
			var ln = selectedItems.length;
			for (var i = 0; i<ln; i++) {
				if (selectedItems[i]['value'] == optVal) {
					selectedItems.splice(i,1);
					break;
				}
			}
		};
		
		var deSelectAll = function() {
			selectedItems = [];
			var itms = imMultiLineList.find(' > div');
       		$.each(itms, function(i,itm) {
       			$(itm).data("options", {optionValue: $(itm).data("options").optionValue, index: $(itm).data("options").index, isSelected: false});
       			if ($(itm).hasClass(opts.item_select_class)) {
					$(itm).removeClass(opts.item_select_class);
				}
       		});
       		return true;
		};
				
		var doAjax = function(t, u, d, fnBefore, fnSuccess) {
			$.ajax({
				type: t,
				url: u,
				data: d,
				error: showError,
				dataType: 'json',
				beforeSend: fnBefore, //function(){$("#loading").show("fast");}, //show loading just when link is clicked
				//complete: function(){ $("#loading").hide("fast");}, //stop showing loading when the process is complete
				success: fnSuccess//{ //so, if data is retrieved, store it in html
		 	}); //close $.ajax(
		};

		var showError = function(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus);
			console.log(textStatus);
		};
         
       	// PUBLIC functions
       	this.addItems = function(url) {
       		if (opts.option_map.optionValue) {
           		doAjax('GET', url, '', '', doAdd);
           }
       	};
       	
       	this.addItem = function(str) {
       		var itm;
       		try {
				itm = jQuery.parseJSON( str );
			}
			catch(e) {
				var ln = imMultiLineList.find(' > div').length;
				var ar = str.split(opts.value_text_separator);
				if (ar[1] != '') {
					itm = jQuery.parseJSON('[{"'+ opts.option_map.optionValue +'": "'+ ar[1] + '", "' + opts.option_map.optionText + '": "' + ar[0] +'"}]');
				} else {
					itm = jQuery.parseJSON('[{"'+ opts.option_map.optionValue +'": "'+ ln + '", "' + opts.option_map.optionText + '": "' + str +'"}]');
				}
			} 
       		doAdd(itm);
       	};
  
		this.getSelectedItems = function() {
           return selectedItems;
       	};
       	
       	this.removeSelectedItems = function() {
       		var itms = imMultiLineList.find(' > div');
       		$.each(itms, function(i,itm) {
       			if ($(itm).data("options").isSelected == true) {
       				removeFromArray($(itm).data("options").optionValue);
       				$("div#imMultiLineList"+i).remove();
       			}
       		});
       	};
       	
       	this.getOptions = function() {
           return options;
       	};

       return initialize();
    }
})(jQuery);