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
    requirementsWrapper: JQuery;
    alternativesWrapper: JQuery;
    tableHtmlTemplate: string = '<table class="ruleTable">'
    requirementSaveURL: string = "/Project/CreateEditRessourceRequirement";
    removeRequirementURL: string = "/Project/RemoveRessourceRequirement";
    //OnEditorSavedDelegate: any;
    RessourceID: Number; ProjectID: Number;
    Requirements: Array<RequirementViewModel>;
    Alternatives: Array<RequirementViewModel>;
    RequirementUseCase: UseCaseEditorViewModel;
    editorURL: string;
    removePendingID: Number;
    ContextLabels = ["", "Domain Context", "Business Process", "Feature"];
    ContextPluralLabels = ["", "Domain Contexts", "Business Processes", "Features"];
    ContextItemLabels = ["", "Domain Concept", "Use Case", "UI Component"];

    constructor(ControlType: string, htmlWrapperID: string) {
        this.type = ControlType;
        this.wrapperID = htmlWrapperID;
        this.wrapper = $(this.wrapperID);
        this.requirementsWrapper = $("#editor-requirements-wrapper");
        this.alternativesWrapper = $("#editor-alternatives-wrapper");
    }
    Show() { }
    Hide() { }
    Start() {
    }
    ReBuild(viewModel: any) {
    }
    Save() {
    }
    public BuildContextTagsFor(requirement : RequirementViewModel): String {
        var html = '<div class="context-tag">' + requirement.ScopeSummary.replace(new RegExp('/', 'g'), '</div><div class="context-tag">') + '</div>';
        return html;
    }

    public BuildBehaviorSummaryFor(requirement: RequirementViewModel): String {
        var html = requirement.Behavior;
        if (!this.FieldIsBlank(requirement.Concept)) html += ' on <a class="u" href="/Project/DomainConceptEditor?ConceptID=' + requirement.ConceptID + '">@' + requirement.Concept + '</a>';
        if (!this.FieldIsBlank(requirement.UI)) html += ' using <a class="u" href="/Project/UIComponentEditor?ComponentID=' + requirement.UIID + '">@' + requirement.UI + '</a>';
        if (!this.FieldIsBlank(requirement.Infrastructure)) html += ' with <a class="u" href="/Project/ProjectEditor?ProjectID=' + this.ProjectID + '#infrastructures">@' + requirement.Infrastructure + '</a>';
        return html;
    }

    public BuildRequirements() {
        var Context = this;
        if (this.requirementsWrapper != null) {
            if (this.Requirements.length > 0) {
                var html = '<div>';
                jQuery.each(this.Requirements, function () {
                    if (!Context.FieldIsBlank(this.SelectedVersionSummary)) html += '<span class="fmin2 r i">' + this.SelectedVersionSummary + "&nbsp;</span>";
                    html += '<div id="r' + this.RequirementID + '"  class="requirement-box">';
                    if (this.UseCaseID == Context.RessourceID) html += '<div class="r vb cb"><a class="edit-requirement-link u action-link" linkid="' + this.RequirementID + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-requirement-link u action-link" linkid="' + this.RequirementID + '" href="/">Remove</a>&nbsp;</div>';
                    html += Context.BuildContextTagsFor(this);
                    html += '<div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '"># ' + this.RequirementID + '</a></div>';
                    html += '<span class="requirement-content"><span class="requirement-behavior">' + Context.BuildBehaviorSummaryFor(this) + '</span>';
                    if (!Context.FieldIsBlank(this.Description)) html += ' : ' + this.Description;
                    html += '</span></div>';
                });
                html += '';
                html += '</div>';
                this.requirementsWrapper.html(html);
            } else {
                this.requirementsWrapper.html('<div class="tac">No Required Behaviors yet</div>');
            }
        }
        $(".edit-requirement-link").click((e => { this.ShowEditRequirementForm(parseInt($(e.target).attr('linkID'))); return false }));
        $(".remove-requirement-link").click((e => { this.ShowRemoveRequirementForm(parseInt($(e.target).attr('linkID'))); return false }));
    }
    public BuildAlternatives() {
        var Context = this;
        if (this.alternativesWrapper != null) {
            if (this.Alternatives.length > 0) {
                var html = '<div>';
                jQuery.each(this.Alternatives, function () {
                    if (!Context.FieldIsBlank(this.SelectedVersionSummary)) html += '<span class="fmin2 r i">' + this.SelectedVersionSummary + "&nbsp;</span>";
                    html += '<div id="r' + this.RequirementID + '"  class="requirement-box">';
                    if (this.UseCaseID == Context.RessourceID) html += '<div class="r vb cb"><a class="edit-alternative-link u action-link" linkid="' + this.RequirementID + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-alternative-link u action-link" linkid="' + this.RequirementID + '" href="/">Remove</a>&nbsp;</div>';
                    html += Context.BuildContextTagsFor(this);
                    html += '<div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '"># ' + this.RequirementID + '</a></div>';
                    html += '<span class="requirement-content"><span class="requirement-behavior">' + Context.BuildBehaviorSummaryFor(this) + '</span>';
                    if (!Context.FieldIsBlank(this.Description)) html += ' : ' + this.Description;
                    html += '</span></div>';
                });
                html += '';
                html += '</div>';
                this.alternativesWrapper.html(html);
            } else {
                this.alternativesWrapper.html('<div class="tac">No Alternative Behaviors yet</div>');
            }
        }
        $(".edit-alternative-link").click((e => { this.ShowEditAlternativeForm(parseInt($(e.target).attr('linkID'))); return false }));
        $(".remove-alternative-link").click((e => { this.ShowRemoveAlternativeForm(parseInt($(e.target).attr('linkID'))); return false }));
    }
    public ShowRemoveRequirementForm(requirementID: Number) {
        this.removePendingID = requirementID;
        this.app.ShowCustomMessage("Are you sure you want to delete this requirement ?", "Remove Requirement", this.OnRequirementRemoveClick, null, this, null);
    }
    public OnRequirementRemoveClick(context: RequirementUIControl) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    }
    public UpdateRequirementContext(requirement: RequirementViewModel) {
        requirement.ScopeIDs = [];
        jQuery.each($('.context-CB : checked'), function () {
            requirement.ScopeIDs.push(parseInt($(this).attr('CBId')));
        });
        this.BuildHtmlButtonSelector();
    }
    public BuildHtmlButtonSelector(): String {
        var context = this;
        var html = "";
        jQuery.each(this.RequirementUseCase.VariationPoints, function () {
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
    public ShowNewRequirementForm() {
        var VM = new RequirementViewModel(); VM.Behavior = ''; VM.Description = ''; VM.Priority = 1; VM.ConceptID = 0; VM.UIID = 0; VM.InfrastructureID = 0;
        this.ShowRequirementForm(VM);
    }
    public ShowEditRequirementForm(requirementID: Number) {
        var VM: RequirementViewModel;
        jQuery.each(this.Requirements, function () { if (this.RequirementID == requirementID) { VM = this; return false; } });
        this.ShowRequirementForm(VM);
    }
    public ShowRequirementForm(requirement: RequirementViewModel) {
        var title = ((requirement.RequirementID > 0) ? "Edit Required Behavior" : "New Required Behavior");
        var formHtml = "<div class='form-element-group'><div><label >Behavior : </label></div><div><input type='text' id='formBehaviorVerb' class='texttype' maxlength='50' style='width: 500px;' placeholder='Behavior as Verb Phrase..' value='" + requirement.Behavior  + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Description : </label></div><div><textarea id='formBehaviorDescription' type='textarea' name='textarea-description' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Expected Behavior characteristics and options that are externally observable..'>" + requirement.Description + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label >On : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorResponsability", this.RequirementUseCase.ProjectConcepts, "Select Concept", requirement.ConceptID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Using : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorUI", this.RequirementUseCase.ProjectUIs, "Select UI", requirement.UIID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >With : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorInfrastructure", this.RequirementUseCase.ProjectInfrastructures, "Select Infrastructure", requirement.InfrastructureID.toString()) + "</div></div>";
        //formHtml += "<div class='form-element-group'><div><label >Related Work Item : </label></div><div><input type='text' id='formWorkItemURL' class='texttype' maxlength='50' style='width: 300px;' placeholder='URL' value='" + requirement.ExternalURL + "'></div></div>";
        
        formHtml += "<div class='form-element-group'><div><label >Priority : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorPriority", PriorityLevels, "Select Priority", requirement.Priority.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Scope : </label></div></div>";
        formHtml += "<div>&nbsp;</div>" + this.BuildHtmlButtonSelector();
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnRequirementSaveClick, null, this, null);
        //$('.context-CB').prop("checked", (e => this.UpdateRequirementContext(requirement))); 
    }
    public ShowRemoveAlternativeForm(AlternativeID: Number) {
        this.removePendingID = AlternativeID;
        this.app.ShowCustomMessage("Are you sure you want to delete this Alternative ?", "Remove Alternative", this.OnAlternativeRemoveClick, null, this, null);
    }
    public OnAlternativeRemoveClick(context: RequirementUIControl) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ AlternativeID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowNewAlternativeForm() {
        var VM = new RequirementViewModel(); VM.DefaultBehaviorID = 0; VM.Behavior = ''; VM.Description = ''; VM.Priority = 1;
        this.ShowAlternativeForm(VM);
    }
    public ShowEditAlternativeForm(RequirementID: Number) {
        var VM: RequirementViewModel;
        jQuery.each(this.Alternatives, function () { if (this.RequirementID == RequirementID) { VM = this; return false; } });
        this.ShowAlternativeForm(VM);
    }

    public ShowAlternativeForm(requirement: RequirementViewModel) {
        var title = ((requirement.RequirementID > 0) ? "Edit Behavior Alternative" : "New Behavior Alternative");
        var formHtml = "<div class='form-element-group'><div><label >Default Behavior : </label></div><div>" + this.BuildDropDownHtmlWith("formDefaultBehavior", this.RequirementUseCase.RequirementOptions, "Select Behavior", requirement.DefaultBehaviorID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Alternative Behavior : </label></div><div><input type='text' id='formBehaviorVerb' class='texttype' maxlength='50' style='width: 500px;' placeholder='Behavior as Verb Phrase..' value='" + requirement.Behavior + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Description : </label></div><div><textarea id='formBehaviorDescription' type='textarea' name='textarea-description' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Expected Behavior characteristics and options that are externally observable..'>" + requirement.Description + "</textarea></div></div>";
        //Alternative Type : radio button RequirementEnumType.LogicAlternative
        //formHtml += "<div class='form-element-group'><div><label >Related Work Item : </label></div><div><input type='text' id='formWorkItemURL' class='texttype' maxlength='50' style='width: 300px;' placeholder='URL' value='" + requirement.ExternalURL + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Priority : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorPriority", PriorityLevels, "Select Priority", requirement.Priority.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Scope : </label></div></div>";
        formHtml += "<div>&nbsp;</div>" + this.BuildHtmlButtonSelector();
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnRequirementSaveClick, null, this, null);
        $("#formDefaultBehavior").width(480);
        //$('.context-CB').prop("checked", (e => this.UpdateRequirementContext(requirement))); 
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
    public OnRequirementSaveClick(response, context: RequirementUIControl) {
        var isAlternative = $("#formDefaultBehavior").length > 0;
        var VM = new RequirementViewModel();
        if (isAlternative) {
            VM.DefaultBehaviorID = parseInt($("#formDefaultBehavior").val());
        } else {
            VM.ConceptID = parseInt($("#formBehaviorResponsability").val()); VM.UIID = parseInt($("#formBehaviorUI").val()); VM.InfrastructureID = parseInt($("#formBehaviorInfrastructure").val());
        }
        VM.Behavior = $.trim($("#formBehaviorVerb").val()); VM.Description = $.trim($("#formBehaviorDescription").val()); VM.Priority = parseInt($("#formHiddenID").val()); 
         //scope

        var isOK = true;
        if ((context.FieldIsBlank(VM.Behavior))) { isOK = false; context.app.ShowAlert("Behavior is mandatory !"); }
        if ((context.FieldIsBlank(VM.Priority))) { isOK = false; context.app.ShowAlert("Priority is mandatory !"); }
        if (isAlternative) {
            if ((context.FieldIsBlank(VM.DefaultBehaviorID))) { isOK = false; context.app.ShowAlert("Default Behavior is mandatory !"); }
            //if ((context.FieldIsBlank(VM.Scope))) { isOK = false; context.app.ShowAlert("Scope is mandatory !"); }
        } else {
            if ((context.FieldIsBlank(VM.ConceptID))) { isOK = false; context.app.ShowAlert("Concept is mandatory !"); }
        }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
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