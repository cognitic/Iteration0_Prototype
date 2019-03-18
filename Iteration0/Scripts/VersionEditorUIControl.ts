/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      VersionEditorUIControl
//
class VersionEditorUIControl extends RequirementUIControl {
    version: VersionEditorViewModel;
    versionsWrapper: JQuery;
    versionSaveURL: string = "/Project/CreateEditProjectVersionWith";
    removeVersionURL: string = "/Project/RemoveProjectVersion";
    versionRequirementSaveURL: string = "/Project/CreateEditVersionRequirementWith";
    removeVersionRequirementURL: string = "/Project/RemoveVersionRequirement";

    constructor(formVM: VersionEditorViewModel) {
        super("VersionEditorUIControl", "#editor");
        this.ProjectID = formVM.ProjectID;  
        this.version = formVM;
        this.versionsWrapper = $("#editor-version-requirement-wrapper");
        this.Start();
    }
    public Start() {
        this.Build();
    }
    public Build() {
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            this.BuildRequirements();
        }
        $("#edit-definition-link").click((e => { this.ShowEditDefinitionForm(); return false }) );
        $("#add-version-requirement-link").click((e => { this.ShowVersionRequirementSelectForm(); return false }) );
    }
    public BuildDefinition() {
        $(".editor-header-bubble-definition").html((this.FieldIsBlank(this.version.Definition.Summary)) ? "No<br/>Definition<br/>yet" : this.version.Definition.Summary.replace(/\n/gim, "<br/>"));
        $(".editor-header-bubble-title").html(this.version.Definition.NumberName + ' - ' + this.version.Definition.NickName);
    }
    public ShowNewDefinitionForm(ProjectID: number, ProjectProducts: Array<ItemViewModel>) {
        var newVM = new VersionViewModel(); newVM.VersionID = -1; newVM.ProductID = -1; newVM.NumberName = "V#.#"; newVM.NickName = "Green Light"; newVM.Summary = "";
        newVM.VersionEnumType = VersionEnumType.Planned; newVM.ReleasedYear = 2019; newVM.ReleasedMonth = 12;
        this.ProjectID = ProjectID;
        this.version.Definition = newVM;
        this.version.ProjectProducts = ProjectProducts;
        if (this.version.ProjectProducts.length == 0) {
            this.app.ShowAlert("Please set project products first");
        } else {
            this.ShowDefinitionForm(this.version.Definition);
        }
    }
    public ShowEditDefinitionForm() {
        this.ShowDefinitionForm(this.version.Definition);
    }
    public BuildRequirements() {
        var Context = this;
        if (this.versionsWrapper.length > 0) {
            if (this.version.ProductRequirements.length > 0) {
                var html = '<div>';
                jQuery.each(this.version.ProductRequirements, function () {
                html += '<div id="r' + this.RequirementID + '"  class="requirement-box">';
                html += '<div class="r vb"><a class="remove-version-requirement-link action-link" linkid="' + this.RequirementID + '" href="/">Remove</a></div>';
                html += Context.BuildContextTagsFor(this);
                html += '<div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '"># ' + this.RequirementID + '</a></div>';
                html += '<span class="requirement-content"><span class="requirement-behavior">' + Context.BuildBehaviorSummaryFor(this) + '</span>';
                html += '</span></div>';
                });
                html += '';
                html += '</div>';
                this.versionsWrapper.html(html);
            } else {
                this.versionsWrapper.html('<div class="tac">No Versions yet</div>');
            }
            $(".remove-version-requirement-link").click((e => { this.ShowRemoveVersionRequirementForm(parseInt($(e.target).attr('linkID'))); return false }));
        }
    }
    public ShowRemoveVersionForm(versionID: Number) {
        this.removePendingID = versionID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Version", this.OnRequirementRemoveClick, null, this, null);
    }
    public OnVersionRequirementClick(context: VersionEditorUIControl) {
        context.AjaxCall(context.removeVersionURL, JSON.stringify({ versionID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowDefinitionForm(version: VersionViewModel) {
        var title = ((version.VersionID > 0) ? "Edit Version Definition" : "Define New Version"); 
        var formHtml = "<div class='form-element-group'><div><label >Product : </label></div><div>" + this.BuildDropDownHtmlWith("formProduct", this.version.ProjectProducts, "Select Product", version.ProductID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Number : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + version.NumberName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Nickname : </label></div><div><input type='text' id='formNickName' class='texttype' maxlength='50' style='width: 300px;' value='" + version.NickName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Goal : </label></div><div><textarea id='formDefGoal' type='textarea' name='textarea-goal' maxlength='1000' style='width: 300px; Height:100px;' placeholder='Benefits and reasons for creating this version'>" + this.version.Definition.Summary + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label >Code Name # : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='20' style='width: 200px;' value='" + this.version.Definition.CodeName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Status : </label></div><div>" + this.BuildDropDownHtmlWith("formStatus", VersionStatusOptions, "Select Status", version.VersionEnumType.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Month : </label></div><div>" + this.BuildDropDownHtmlWith("formMonth", MonthOptions, "Select Month", version.ReleasedMonth.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Year : </label></div><div>" + this.BuildDropDownHtmlWith("formYear", YearOptions, "Select Year", version.ReleasedYear.toString()) + "</div></div>";
            //formHtml += "<div class='filter-group'><label >Is Only Visible By Owner : </label><input type='checkbox' id='IsPrivateCB'></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
        return false;
    }
    public OnDefinitionSaveClick(context: VersionEditorUIControl) {
        var VM = new VersionViewModel();
        VM.ProductID = parseInt($.trim($("#formProduct").val()));
        VM.NumberName = $.trim($("#formDefName").val()); VM.NickName = $.trim($("#formNickName").val()); VM.Summary = $.trim($("#formDefGoal").val());
        VM.VersionEnumType = parseInt($.trim($("#formStatus").val()));
        VM.ReleasedMonth = parseInt($.trim($("#formMonth").val()));
        VM.ReleasedYear = parseInt($.trim($("#formYear").val()));

        var isOK = true;
        if ((context.FieldIsBlank(VM.NumberName))) { isOK = false; context.app.ShowAlert("Number is mandatory !"); }
        if ((context.FieldIsBlank(VM.ProductID))) { isOK = false; context.app.ShowAlert("Product is mandatory !"); }
        if ((context.FieldIsBlank(VM.VersionEnumType))) { isOK = false; context.app.ShowAlert("Status is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: context.version.Definition, ProjectID: context.ProjectID  }), context.OnEditorSaved, context);
        }
    }
    //NB: Filtrer les versions des requirements par product
    //[Check] All Version  Order by Priority, Concept, Use Case, Feature
    //UC-22
    //(Tag) Behavior by ... (maxsize)(Priority)[Checkbox OR  V.0.0 (Planned) or V0.0] 

    public ShowVersionRequirementSelectForm() {
        var Context = this;
        var title = "Select New Requirements";
        if (this.version.ProductRequirements.length > 0) {
            var html = '<div>';
            html += '<div class="r vb">' + this.BuildDropDownHtmlWith("formYear", YearOptions, "Select Year", "2019") + '';
            html += this.BuildDropDownHtmlWith("formYear", YearOptions, "Select Year", "2019") + '</div><div class="cb"></div>';
            html += '<div style="height: 400px; overflow-y: scroll;">';
            jQuery.each(this.version.ProductRequirements, function () {
                html += '<div>';
                if (1 == 1) {
                    html += '<div class="r vb"><input type="checkbox"  linkid="' + this.RequirementID + '" ></div>';
                } else {
                    html += '<div class="r vb">Version xxx</div>';
                }
                html += Context.BuildContextTagsFor(this);
                html += '<div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '"># ' + this.RequirementID + '</a></div>';
                html += '<span class="requirement-content"><span class="requirement-behavior">' + Context.BuildBehaviorSummaryFor(this) + '</span>';
                html += '</span></div>';
            });
            html += '</div>';
            html += '</div>';
        } else {
            html = '<div class="tac">No Requirements available</div>';
        }
        //formHtml += "<div class='filter-group'><label >Is Only Visible By Owner : </label><input type='checkbox' id='IsPrivateCB'></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + html + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
        return false;
    }
    public OnVersionRequirementSelectClick(context: VersionEditorUIControl) {
        var newRequirementIDs = [];
        //parseInt($.trim($("#formProduct").val()));

        var isOK = true;
        if (newRequirementIDs.length > 0) { isOK = false; context.app.ShowAlert("No Requirements Selected !"); }
        if (isOK) {
            context.AjaxCall(context.versionRequirementSaveURL, JSON.stringify({ requirementIDs: newRequirementIDs, VersionID: context.version.Definition.VersionID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    }
    public ShowRemoveVersionRequirementForm(requirementID: Number) {
        this.removePendingID = requirementID;
        this.app.ShowCustomMessage("Are you sure you want to remove this item ?", "Remove Requirement", this.OnRequirementRemoveClick, null, this, null);
    }
    public OnRequirementRemoveClick(context: VersionEditorUIControl) {
        context.AjaxCall(context.removeVersionRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    }
    public OnEditorSaved(response, context: VersionEditorUIControl) {
        if (response.Definition != undefined) {
            if (context.version.Definition.VersionID > 0) {
                context.version = response;
                context.Build();
                //xxx feedback ShowInsideMessage  "Definition has been saved !"
                context.app.HideUnfreezeControls();
            } else {
                var rootUrl = window.location.href.substring(0, window.location.href.indexOf("/Project/"));
                window.location.replace(rootUrl + context.editorURL + response.Definition.ProjectID);
            }
        }
        else {
            context.app.ShowAlert(response);
        }
    }
}
