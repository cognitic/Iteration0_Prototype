/// <reference path="jquery.d.ts" />
//
//      Parent Class for UI Controls
//
var EditorScope;
(function (EditorScope) {
    EditorScope[EditorScope["DEF"] = 1] = "DEF";
    EditorScope[EditorScope["CTX"] = 2] = "CTX";
    EditorScope[EditorScope["DEP"] = 3] = "DEP";
    EditorScope[EditorScope["DAT"] = 4] = "DAT";
    EditorScope[EditorScope["REQ"] = 5] = "REQ";
})(EditorScope || (EditorScope = {}));
;
var UIControl = /** @class */ (function () {
    function UIControl(ControlType, htmlWrapperID) {
        this.wrapperID = "#Unknown";
        this.tableHtmlTemplate = '<table class="ruleTable">';
        this.type = ControlType;
        this.wrapperID = htmlWrapperID;
        this.wrapper = $(this.wrapperID);
    }
    UIControl.prototype.Show = function () { };
    UIControl.prototype.Hide = function () { };
    UIControl.prototype.Start = function () {
    };
    UIControl.prototype.Save = function () {
    };
    UIControl.prototype.AjaxCall = function (postURL, JSONData, callBackFunction, callBackParameter, httpMethod, loadingMessage) {
        if (httpMethod === void 0) { httpMethod = 'POST'; }
        if (loadingMessage === void 0) { loadingMessage = 'Loading'; }
        $.ajax({
            context: this,
            url: postURL,
            type: httpMethod,
            data: JSONData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $('#loading-text').html(loadingMessage);
                $('.event-progress').toggleClass('open');
            },
            success: function (response) {
                $('.event-progress').toggleClass('open');
                if (response) {
                    if (callBackParameter == null) {
                        callBackFunction(response, this);
                    }
                    else {
                        callBackFunction(response, this, callBackParameter);
                    }
                }
                else {
                    this.app.ShowAlert("An unexpected error occurred while communicating with the server !");
                }
            },
            error: function (xhRequest, ErrorText, thrownError) {
                console.log(ErrorText);
                if (xhRequest.getAllResponseHeaders()) {
                    this.app.ShowAlert("Sorry, your session has timed out. Please log in again.");
                }
            }
        });
    };
    UIControl.prototype.BuildHtmlTable = function (firstRow, firstCol, lastRow, lastCol, data, filterCol, filterValue, colFlasher, extradata, extraHeader) {
        if (filterCol === void 0) { filterCol = -1; }
        var html = "";
        var tableHeader = "";
        var tableRows = "";
        var extraColNum = -1;
        if (lastRow > 0) {
            tableHeader = "<tr>";
            for (var j = firstCol; j < lastCol; j++) {
                var content = "";
                if (typeof data[0][j] !== 'undefined') {
                    content = data[0][j];
                }
                tableHeader += "<th>" + content + "</th>";
                if (extradata != null) {
                    if (content == extraHeader) {
                        extraColNum = j;
                        jQuery.each(extradata[0], function () {
                            tableHeader += "<th>GRP Week " + this + "</th>";
                        });
                    }
                }
            }
            tableHeader += "</tr>";
            if (lastRow > 1) {
                for (var i = firstRow; i < lastRow; i++) {
                    if ((filterCol == -1) || (data[i][filterCol] == filterValue)) {
                        tableRows += "<tr>";
                        for (var j = firstCol; j < lastCol; j++) {
                            var content = "";
                            if (typeof data[i] !== 'undefined') {
                                if (typeof data[i][j] !== 'undefined') {
                                    content = data[i][j];
                                }
                            }
                            tableRows += "<td";
                            if (colFlasher != null) {
                                if (colFlasher[j] == true) {
                                    tableRows += " class='flash'";
                                }
                                else if (j == firstCol) {
                                    tableRows += " class='ruleTablecellgreybackground'";
                                }
                            }
                            else if (j == firstCol) {
                                tableRows += " class='ruleTablecellgreybackground'";
                            }
                            tableRows += ">";
                            tableRows += content + "</td>";
                            if (extradata != null) {
                                if (extraColNum == j) {
                                    jQuery.each(extradata[i], function () {
                                        if (this == '') {
                                            tableRows += "<td class='voidcell'></td>";
                                        }
                                        else {
                                            tableRows += "<td>" + this + "</td>";
                                        }
                                    });
                                }
                            }
                        }
                        tableRows += "</tr>";
                    }
                }
            }
        }
        //var DetailsTableHtml = "<table class='kpitable' style='width: " + (SubWaveData[0].length - 1) * 100 + "px;'>";
        html = this.tableHtmlTemplate + tableHeader + tableRows + "</table>";
        return html;
    };
    UIControl.prototype.BuildHtmlDataTable = function (data) {
        var html = "";
        if (data.length > 0) {
            if (data[0].length > 0) {
                html = this.BuildHtmlTable(1, 0, data.length, data[0].length, data);
            }
        }
        return html;
    };
    UIControl.prototype.BuildLinksFromContent = function (contentHolder, linkLabel, templateStart, linkClass, IsURL) {
        jQuery.each(contentHolder, function () {
            var content = $(this).html();
            if (IsURL) {
                $(this).html("<a data-value='" + content + "'  href='" + templateStart + content + "' class='" + linkClass + "' >" + linkLabel + "</a>");
            }
            else {
                $(this).html("<a data-value='" + content + "'  onclick='" + templateStart + "(" + content + ")' class='" + linkClass + "' >" + linkLabel + "</a>");
            }
        });
    };
    UIControl.prototype.preventEnterSubmit = function (e) {
        if (e.which == 13) {
            var $targ = $(e.target);
            if (!$targ.is("textarea") && !$targ.is(":button,:submit")) {
                var focusNext = false;
                $(this).find(":input:visible:not([disabled],[readonly]), a").each(function () {
                    if (this === e.target) {
                        focusNext = true;
                    }
                    else if (focusNext) {
                        $(this).focus();
                        return false;
                    }
                });
                return false;
            }
        }
    };
    UIControl.prototype.DesactivateButton = function (buttons) {
        buttons.each(function (index) {
            $(this).off('click');
            //button.click(function (e) { e.preventDefault(); });
            $(this).addClass('btn_fake');
        });
    };
    UIControl.prototype.ReActivateButton = function (button, OnCLickDelegate) {
        var _this = this;
        button.unbind('click');
        button.click((function (e) { return OnCLickDelegate(_this); }));
        button.removeClass('btn_fake');
    };
    UIControl.prototype.UpdateDropDownsWith = function (kpiDropdowns, dropdownData, kpiValue) {
        var context = this;
        kpiDropdowns.each(function (index) {
            context.UpdateDropDownWith($(this), dropdownData, kpiValue);
        });
    };
    UIControl.prototype.UpdateDropDownWith = function (kpiDropdown, dropdownData, kpiValue) {
        var DropDownHtml = kpiDropdown.find('option:first').wrapAll('<div>').parent().html(); //keep default value
        if (DropDownHtml == undefined)
            DropDownHtml = "";
        jQuery.each(dropdownData, function () {
            var optionalParam = "";
            if (this.constructor === Array) {
                if (this.length > 2) {
                    if (this[2] !== null) {
                        if (this[2].constructor !== Array) {
                            optionalParam = "data-visual='" + this[2] + "'";
                        }
                    }
                }
                DropDownHtml += "<option " + optionalParam + " value='" + this[1] + "'>" + this[0] + "</option>";
            }
            else {
                DropDownHtml += "<option value='" + this + "'>" + this + "</option>";
            }
        });
        kpiDropdown.html(DropDownHtml);
        if (kpiValue != null) {
            this.UpdateFieldWith(kpiDropdown, kpiValue);
        }
        if (dropdownData.length == 0) {
            this.DisableFields(kpiDropdown);
        }
        else {
            this.EnableFields(kpiDropdown);
        }
    };
    UIControl.prototype.FilterArrayWith = function (ValueKeyData, FilterKey, FilterIndex) {
        if (FilterIndex == null)
            FilterIndex = 1;
        var result = [];
        var found = false;
        jQuery.each(ValueKeyData, function () {
            if (this[FilterIndex] == FilterKey) {
                result.push([this[0], this[1]]);
            }
        });
        return result;
    };
    UIControl.prototype.SearchIndexOf = function (ValueKeyData, SearchKey, SearchIndex) {
        if (SearchIndex == null)
            SearchIndex = 1;
        var index = 0;
        var found = false;
        jQuery.each(ValueKeyData, function () {
            if (this[SearchIndex] == SearchKey) {
                found = true;
                return false; //break 
            }
            index += 1;
        });
        if (found) {
            return index;
        }
        else {
            return -1;
        }
    };
    UIControl.prototype.ConvertDateToArray = function (d) {
        if (d == null) {
            return null;
        }
        else {
            return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
        }
    };
    UIControl.prototype.DisableFields = function (fields) {
        fields.each(function (index) {
            $(this).prop("disabled", true);
            //$(this).addClass('field_fake');
        });
    };
    UIControl.prototype.EnableFields = function (fields) {
        fields.each(function (index) {
            $(this).prop("disabled", false);
            //$(this).addClass('field_fake');
        });
    };
    UIControl.prototype.UpdateFielsdWith = function (fields, dataSource) {
        for (var i = 0; i < fields.length; i++) {
            this.UpdateFieldWith($('#' + fields[i]), dataSource[fields[i]]);
        }
    };
    UIControl.prototype.UpdateFieldWith = function (kpiField, kpiValue) {
        var isNull = ((kpiValue == null) || (kpiValue == undefined));
        //if (kpiField.hasClass("calendarType")) {
        //    if (isNull) {
        //        kpiField.val("");
        //    } else {
        //        kpiField.val(kpiValue);
        //    }
        //} else
        var wrapper = kpiField.parent();
        if (kpiField.hasClass("dropDownType") || wrapper.hasClass("dropDownType")) {
            if ((isNull) || (kpiValue == -1)) {
                kpiField.find('option:not([disabled]):selected').attr("selected", null);
                kpiField.find('option:first').attr("selected", "selected");
            }
            else {
                kpiField.find('option:not([disabled]):selected').attr("selected", null);
                kpiField.find('option[value="' + kpiValue + '"]').attr("selected", "selected");
            }
            if (wrapper.hasClass("dropDownType")) {
                wrapper.find(".text").html(kpiField.find('option:selected').text());
            }
            //} else if (kpiField.hasClass("textAeraType")) {
            //    if (isNull) {
            //        kpiField.val("");
            //    } else {
            //        kpiField.val(kpiValue);
            //    }
            //} else if (kpiField.hasClass("numType")) {
            //    if (isNull) {
            //        kpiField.val("");
            //    } else {
            //        kpiField.val(kpiValue);
            //    }
            //} else if (kpiField.hasClass("percType")) {
            //    if (isNull) {
            //        kpiField.val("");
            //    } else {
            //        kpiField.val(kpiValue);
            //    }
        }
        else {
            if (isNull) {
                kpiField.val("");
            }
            else {
                kpiField.val(kpiValue);
            }
        }
    };
    UIControl.prototype.SumFields = function (fields) {
        var result = 0;
        fields.each(function (index) {
            var val = parseFloat($(this).val());
            if (!isNaN(val)) {
                if (val == 0)
                    $(this).val("");
                result += val;
            }
        });
        return result;
    };
    UIControl.prototype.UploadFileTo = function (controllerURL, modelId, callBackFunction, callBackParameter) {
        var form = $('#FormUpload')[0];
        var dataString = new FormData(form);
        dataString.append('id', modelId);
        $.ajax({
            context: this,
            url: controllerURL,
            type: 'POST',
            //xhr: function () {  // Custom XMLHttpRequest
            //    var myXhr = $.ajaxSettings.xhr();
            //    //if (myXhr.upload) { // Check if upload property exists
            //    //    //myXhr.upload.onprogress = progressHandlingFunction
            //    //    myXhr.upload.addEventListener('progress', progressHandlingFunction, false); // For handling the progress of the upload
            //    //}
            //    return myXhr;
            //},
            success: function (response) {
                if (response) {
                    if (callBackParameter == null) {
                        callBackFunction(response, this);
                    }
                    else {
                        callBackFunction(response, this, callBackParameter);
                    }
                }
                else {
                    this.app.ShowAlert("An unexpected error occurred while communicating with the server !");
                }
            },
            error: function (response) {
                this.app.ShowAlert("An unexpected error occurred while communicating with the server !");
            },
            complete: function (response) {
            },
            data: dataString,
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });
        return false;
    };
    UIControl.prototype.GenerateNumericList = function (min, max, IsKeyValue) {
        var result = [];
        for (var i = min; i <= max; i++) {
            if (IsKeyValue) {
                result.push([i, i]);
            }
            else {
                result.push(i);
            }
        }
        return result;
    };
    return UIControl;
}());
//# sourceMappingURL=uicontrol.js.map