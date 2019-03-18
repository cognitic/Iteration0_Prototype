/// <reference path="jquery.d.ts" />
//
//      Parent Class for UI Controls
//
var RequirementUIControl = /** @class */ (function () {
    function RequirementUIControl(ControlType, htmlWrapperID) {
        this.wrapperID = "#Unknown";
        this.tableHtmlTemplate = '<table class="ruleTable">';
        this.requirementSaveURL = "/Project/CreateEditRessourceRequirement";
        this.removeRequirementURL = "/Project/RemoveRessourceRequirement";
        this.ContextLabels = ["", "Domain Context", "Business Process", "Feature"];
        this.ContextPluralLabels = ["", "Domain Contexts", "Business Processes", "Features"];
        this.ContextItemLabels = ["", "Domain Concept", "Use Case", "UI Component"];
        this.type = ControlType;
        this.wrapperID = htmlWrapperID;
        this.wrapper = $(this.wrapperID);
        this.requirementWrapper = $("#editor-requirement-wrapper");
    }
    RequirementUIControl.prototype.Show = function () { };
    RequirementUIControl.prototype.Hide = function () { };
    RequirementUIControl.prototype.Start = function () {
    };
    RequirementUIControl.prototype.ReBuild = function (viewModel) {
    };
    RequirementUIControl.prototype.Save = function () {
    };
    RequirementUIControl.prototype.OnRequirementSaveClick = function (response, context) {
        var VM = new RequirementViewModel();
        //VM.RessourceID = context.RessourceID; VM.RequirementID = parseInt($("#formHiddenID").val()); VM.RequirementEnumType = RequirementEnumType.UseCase;
        //VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val()); VM.Category = $.trim($("#formDefCodeName").val());
        var isOK = true;
        //if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
        //if ((context.FieldIsBlank(VM.Category))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSavedDelegate, context);
        }
    };
    RequirementUIControl.prototype.BuildRequirements = function () {
        var _this = this;
        if (this.requirementWrapper != null) {
        }
        $(".edit-requirement-link").click((function (e) { _this.ShowEditRequirementForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-requirement-link").click((function (e) { _this.ShowRemoveRequirementForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    RequirementUIControl.prototype.ShowNewRequirementForm = function () {
        var VM = new RequirementViewModel();
        VM.Priority = 1;
        this.ShowRequirementForm(VM);
    };
    RequirementUIControl.prototype.ShowEditRequirementForm = function (requirementID) {
        var VM;
        jQuery.each(this.Requirements, function () { if (this.RequirementID == requirementID) {
            VM = this;
            return false;
        } });
        this.ShowRequirementForm(VM);
    };
    RequirementUIControl.prototype.ShowRemoveRequirementForm = function (requirementID) {
        this.removePendingID = requirementID;
        this.app.ShowCustomMessage("Are you sure you want to delete this requirement ?", "Remove Requirement", this.OnRequirementRemoveClick, null, this, null);
    };
    RequirementUIControl.prototype.OnRequirementRemoveClick = function (context) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    RequirementUIControl.prototype.OnEditorSaved = function (response, context) {
        if (response.Definition != undefined) {
            if (context.RessourceID > 0) {
                context.ReBuild(response);
                //TODO feedback with ShowInsideMessage  "xxx has been saved !"
                context.app.HideUnfreezeControls();
            }
            else {
                var rootUrl = window.location.href.substring(0, window.location.href.indexOf("/Project/"));
                window.location.replace(rootUrl + context.editorURL + response.Definition.RessourceID);
            }
        }
        else {
            context.app.ShowAlert(response);
        }
    };
    RequirementUIControl.prototype.UpdateRequirementContext = function (requirement) {
        requirement.Variants = new Array();
        jQuery.each($('.context-CB : checked'), function () {
            requirement.Variants.push({ KeyValue: $(this).attr('CBId') });
        });
        this.BuildHtmlButtonSelector();
    };
    RequirementUIControl.prototype.BuildHtmlButtonSelector = function () {
        var context = this;
        var html = "";
        jQuery.each(this.VariationPoints, function () {
            html += "<div><input type='text' TypeId='" + this.Name + "' class='texttype context-field' maxlength='50' style='width: 300px;' value=''>";
            html = '<div class="app-profile-options-dropdown dropdown"><button class="square smallbtn">Select ' + this.Name + '</button><div class="dropdown-content">';
            jQuery.each(this.Contexts, function () {
                html += "<a href='/' class='context-CB' TypeId='" + this.ContextTypeID + "' CBId='" + this.ContextID + "'>" + this.Name + "</a>";
            });
            html += '</div></div>';
        });
        html += '</div></div>';
        return html;
    };
    RequirementUIControl.prototype.ShowRequirementForm = function (requirement) {
        var _this = this;
        var title = ((requirement.RequirementID > 0) ? "Edit Requirement" : "Define New Requirement");
        var formHtml = this.BuildHtmlButtonSelector();
        formHtml += "<div><input type='text' id='formDefNamex' class='texttype;' maxlength='50' style='width: 300px;' value='ALL'><button class='square'>Select Group..</button></div></div>";
        formHtml += "<div>&nbsp;</div><div class='form-element-group'><div><label class='filter'>Description : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Specific System Behavior..'>" + requirement.Description + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Priority : </label></div><div>" + this.BuildDropDownHtmlWith("formPriority", PriorityLevels, "Select Priority", requirement.Priority.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Related Work Item : </label></div><div><input type='text' id='formWorkItemURL' class='texttype' maxlength='50' style='width: 300px;' placeholder='URL' value='" + requirement.WorkItemURL + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnRequirementSaveClick, null, this, null);
        $('.context-CB').prop("checked", (function (e) { return _this.UpdateRequirementContext(requirement); }));
    };
    RequirementUIControl.prototype.BuildDropDownHtmlWith = function (dropDownId, items, defaultValue, selectedValue) {
        var DropDownHtml = "<select id='" + dropDownId + "' style='width:300px;'><option value='' disabled='' " + ((selectedValue == "-1") ? "selected=''" : "") + ">" + defaultValue + "</option>";
        jQuery.each(items, function () {
            DropDownHtml += "<option value='" + this.KeyValue + "' " + ((selectedValue == this.KeyValue) ? "selected=''" : "") + ">" + this.Label + "</option>";
        });
        DropDownHtml += '</select>';
        return DropDownHtml;
        //if ((isNull) || (kpiValue == -1)) {
        //    kpiField.find('option:not([disabled]):selected').attr("selected", null);
        //    kpiField.find('option:first').attr("selected", "selected");
        //} else {
        //    kpiField.find('option:not([disabled]):selected').attr("selected", null);
        //    kpiField.find('option[value="' + kpiValue + '"]').attr("selected", "selected");
        //}
    };
    RequirementUIControl.prototype.AjaxCall = function (postURL, JSONData, callBackFunction, callBackParameter, httpMethod, loadingMessage) {
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
    RequirementUIControl.prototype.preventEnterSubmit = function (e) {
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
    RequirementUIControl.prototype.DesactivateButton = function (buttons) {
        buttons.each(function (index) {
            $(this).off('click');
            //button.click(function (e) { e.preventDefault(); });
            $(this).addClass('btn_fake');
        });
    };
    RequirementUIControl.prototype.ReActivateButton = function (button, OnCLickDelegate) {
        var _this = this;
        button.unbind('click');
        button.click((function (e) { OnCLickDelegate(_this); return false; }));
        button.removeClass('btn_fake');
    };
    RequirementUIControl.prototype.SearchIndexOf = function (ValueKeyData, SearchKey, SearchIndex) {
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
    RequirementUIControl.prototype.ConvertDateToArray = function (d) {
        if (d == null) {
            return null;
        }
        else {
            return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
        }
    };
    RequirementUIControl.prototype.FieldIsBlank = function (str) {
        return (!str || /^\s*$/.test(str));
    };
    RequirementUIControl.prototype.DisableFields = function (fields) {
        fields.each(function (index) {
            $(this).prop("disabled", true);
            //$(this).addClass('field_fake');
        });
    };
    RequirementUIControl.prototype.EnableFields = function (fields) {
        fields.each(function (index) {
            $(this).prop("disabled", false);
            //$(this).addClass('field_fake');
        });
    };
    RequirementUIControl.prototype.UploadFileTo = function (controllerURL, modelId, callBackFunction, callBackParameter) {
        var form = $('#FormUpload')[0];
        var dataString = new FormData(form);
        dataString.append('id', modelId);
        $.ajax({
            context: this,
            url: controllerURL,
            type: 'POST',
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
    RequirementUIControl.prototype.GenerateNumericList = function (min, max, IsKeyValue) {
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
    return RequirementUIControl;
}());
//# sourceMappingURL=RequirementUIControl.js.map