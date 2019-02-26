/// <reference path="jquery.d.ts" />

//
//      Parent Class for UI Controls
//

class RequirementUIControl {
    app: Iteration0;
    type: string;
    title: string;
    wrapperID: string = "#Unknown";
    startURL: string;
    saveURL: string;
    wrapper: JQuery;
    contentWrapper: JQuery;
    requirementWrapper: JQuery;
    tableHtmlTemplate: string = '<table class="ruleTable">'
    requirementSaveURL: string = "/Project/CreateEditRessourceRequirement";
    removeRequirementURL: string = "/Project/RemoveRessourceRequirement";
    OnEditorSavedDelegate: any;
    RessourceID: Number; ProjectID: Number;
    Requirements: Array<RequirementViewModel>;
    VariationPoints: Array<ProjectContextTypeViewModel>;
    editorURL: string;
    removePendingID: Number;
    ContextLabels = ["", "Domain Context", "Business Process", "Feature"];
    ContextPluralLabels = ["", "Domain Contexts", "Business Processes", "Features"];
    ContextItemLabels = ["", "Domain Concept", "Use Case", "UI Component"];

    constructor(ControlType: string, htmlWrapperID: string) {
        this.type = ControlType;
        this.wrapperID = htmlWrapperID;
        this.wrapper = $(this.wrapperID);
        this.requirementWrapper = $("#editor-requirement-wrapper");
    }
    Show() { }
    Hide() { }
    Start() {
    }
    ReBuild(viewModel: any) {
    }
    Save() {
    }
    public OnRequirementSaveClick(response, context: RequirementUIControl) {
        var VM = new RequirementViewModel();
        //VM.RessourceID = context.RessourceID; VM.RequirementID = parseInt($("#formHiddenID").val()); VM.RequirementEnumType = RequirementEnumType.UseCase;
        //VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val()); VM.Category = $.trim($("#formDefCodeName").val());

        var isOK = true;
        //if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
        //if ((context.FieldIsBlank(VM.Category))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSavedDelegate, context);
        }
    }

    public BuildRequirements() {
        if (this.requirementWrapper != null) {

        }
        $(".edit-requirement-link").click((e => { this.ShowEditRequirementForm(parseInt($(e.target).attr('linkID'))); return false }));
        $(".remove-requirement-link").click((e => { this.ShowRemoveRequirementForm(parseInt($(e.target).attr('linkID'))); return false }));
    }
    public ShowNewRequirementForm() {
        var VM = new RequirementViewModel(); VM.Priority = 1;
        this.ShowRequirementForm(VM);
    }
    public ShowEditRequirementForm(requirementID: Number) {
        var VM: RequirementViewModel;
        jQuery.each(this.Requirements, function () { if (this.RequirementID == requirementID) { VM = this; return false; } });
        this.ShowRequirementForm(VM);
    }
    public ShowRemoveRequirementForm(requirementID: Number) {
        this.removePendingID = requirementID;
        this.app.ShowCustomMessage("Are you sure you want to delete this requirement ?", "Remove Requirement", this.OnRequirementRemoveClick, null, this, null);
    }
    public OnRequirementRemoveClick(context: RequirementUIControl) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    }
    public OnEditorSaved(response, context: RequirementUIControl) {
        if (response.Definition != undefined) {
            if (context.RessourceID > 0) {
                context.ReBuild(response);
                //TODO feedback with ShowInsideMessage  "xxx has been saved !"
                context.app.HideUnfreezeControls();
            } else {
                var rootUrl = window.location.href.substring(0, window.location.href.indexOf("/Project/"));
                window.location.replace(rootUrl + context.editorURL + response.Definition.RessourceID);
            }
        }
        else {
            context.app.ShowAlert(response);
        }
    }
    public UpdateRequirementContext(requirement: RequirementViewModel) {
        requirement.Variants = new Array<ItemViewModel>();
        jQuery.each($('.context-CB : checked'), function () {
            requirement.Variants.push({ KeyValue: $(this).attr('CBId') } as ItemViewModel);
        });
        this.BuildHtmlButtonSelector();
    }
    public BuildHtmlButtonSelector(): String {
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
    }
    public ShowRequirementForm(requirement: RequirementViewModel) {
        var title = ((requirement.RequirementID > 0) ? "Edit Requirement" : "Define New Requirement");
        var formHtml = this.BuildHtmlButtonSelector();
        formHtml += "<div><input type='text' id='formDefNamex' class='texttype;' maxlength='50' style='width: 300px;' value='ALL'><button class='square'>Select Group..</button></div></div>";
        formHtml += "<div>&nbsp;</div><div class='form-element-group'><div><label class='filter'>Description : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Specific System Behavior..'>" + requirement.Description + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Priority : </label></div><div>" + this.BuildDropDownHtmlWith("formPriority", PriorityLevels, "Select Priority", requirement.Priority.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Related Work Item : </label></div><div><input type='text' id='formWorkItemURL' class='texttype' maxlength='50' style='width: 300px;' placeholder='URL' value='" + requirement.WorkItemURL + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnRequirementSaveClick, null, this, null);
        $('.context-CB').prop("checked", (e => this.UpdateRequirementContext(requirement))); 
    }

    public BuildDropDownHtmlWith(dropDownId: String, items: Array<ItemViewModel>, defaultValue: String, selectedValue: String) {
        var DropDownHtml = "<select id='" + dropDownId + "' style='width:300px;'><option value='' disabled='' " + ((selectedValue == "-1") ? "selected=''" : "") +">" + defaultValue +"</option>";
        jQuery.each(items, function () {
            DropDownHtml += "<option value='" + this.KeyValue + "' " + ((selectedValue == this.KeyValue) ? "selected=''": "") +">" + this.Label + "</option>";
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
    }
    AjaxCall(postURL: string, JSONData: string, callBackFunction, callBackParameter?: any, httpMethod: string = 'POST', loadingMessage: string = 'Loading') {
        $.ajax({
            context: this,
            url: postURL,
            type: httpMethod,
            data: JSONData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $('#loading-text').html(loadingMessage)
                $('.event-progress').toggleClass('open');

            },
            success: function (response) {
                $('.event-progress').toggleClass('open');
                if (response) {
                    if (callBackParameter == null) {
                        callBackFunction(response, this);
                    } else {
                        callBackFunction(response, this, callBackParameter);
                    }
                }
                else {
                    this.app.ShowAlert("An unexpected error occurred while communicating with the server !");
                }
            },
            error: function (xhRequest, ErrorText, thrownError) {
                console.log(ErrorText)
                if (xhRequest.getAllResponseHeaders()) { this.app.ShowAlert("Sorry, your session has timed out. Please log in again."); }
            }
        });
    }
    preventEnterSubmit(e) {
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
    }
    DesactivateButton(buttons: JQuery) {
        buttons.each(function (index) {
            $(this).off('click')
            //button.click(function (e) { e.preventDefault(); });
            $(this).addClass('btn_fake');
        });
    }
    ReActivateButton(button: JQuery, OnCLickDelegate) {
        button.unbind('click');
        button.click((e => { OnCLickDelegate(this); return false }));
        button.removeClass('btn_fake');
    }
    SearchIndexOf(ValueKeyData: any, SearchKey: Number, SearchIndex?: number) {
        if (SearchIndex == null)
            SearchIndex = 1;
        var index = 0;
        var found: boolean= false;
        jQuery.each(ValueKeyData, function () {
            if (this[SearchIndex] == SearchKey) {
                found = true;
                return false;//break 
            }
            index += 1;
        });
        if (found) {
            return index;
        } else {
            return -1;
        }
    }
    ConvertDateToArray(d: Date): number[] {
        if (d == null) {
            return null;
        } else {
            return [d.getFullYear(), d.getMonth()+1, d.getDate()];
        }
    }
    public  FieldIsBlank(str) : boolean {
        return (!str || /^\s*$/.test(str));
    }
    DisableFields(fields: JQuery) {
        fields.each(function (index) {
            $(this).prop("disabled", true);
            //$(this).addClass('field_fake');
        });
    }
    EnableFields(fields: JQuery) {
        fields.each(function (index) {
            $(this).prop("disabled", false);
            //$(this).addClass('field_fake');
        });
    }
    UploadFileTo(controllerURL, modelId, callBackFunction, callBackParameter?: any) {
        var form = <HTMLFormElement>$('#FormUpload')[0];
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
                    } else {
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
    }
    GenerateNumericList(min: number, max: number, IsKeyValue: Boolean): any[] {
        var result = [];
        for (var i = min; i <= max; i++) {
            if (IsKeyValue) {
                result.push([i,i]);
            } else {
                result.push(i);
            }
        }
        return result;
    }
}