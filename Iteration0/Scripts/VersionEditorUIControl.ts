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
        this.versionsWrapper = $("#editor-versions-wrapper");
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
        $("#add-requirement-link").click((e => { this.ShowNewVersionRequirementForm(); return false }) );
    }
    public BuildDefinition() {
        $("#editor-definition-zone").html((this.FieldIsBlank(this.version.Definition.Summary)) ? "No<br/>Definition<br/>yet" : this.version.Definition.Summary.replace(/\n/gim, "<br/>"));
        $("#editor-definition-category").html(this.version.Definition.ProductName);
        $("#editor-definition-code").html(this.version.Definition.NumberName);
    }
    public ShowNewDefinitionForm(ProjectID: number, ProjectProducts: Array<ItemViewModel>) {
        var newVM = new VersionViewModel(); newVM.VersionID = -1; newVM.ProductID = -1; newVM.NumberName = "Vx.x.x"; newVM.NickName = ""; newVM.Summary = "";
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
        if (this.versionsWrapper.length > 0) {
            //if (this.version.ProductRequirements.length > 0) {
            //    var html = '<div><table>';
            //    html += '<tr><th>Product</th><th>Version</th><th>Content</th><th></th></tr>';
            //    jQuery.each(this.version.Versions, function () {
            //        html += "<tr><td>" + this.Product + "</td><td>V2.0.0 (Not released)</td><td>No Requirement</td><td> Edit / Remove</td></tr>";
            //        html += '<li>' + this.NumberName + '</li>';
            //    });
            //    html += '</table></div>';
            //    this.versionsWrapper.html(html);
            //} else {
            //    this.versionsWrapper.html('<div class="tac">No Versions yet</div>');
            //}
        }
    }
    public ShowNewVersionRequirementForm() {
        this.app.ShowAlert("Coming soon !");
    }
    public ShowRemoveRequirementForm(versionID: Number) {
        this.removePendingID = versionID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Version", this.OnRequirementRemoveClick, null, this, null);
    }
    public OnVersionRequirementClick(context: VersionEditorUIControl) {
        context.AjaxCall(context.removeVersionURL, JSON.stringify({ versionID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowDefinitionForm(version: VersionViewModel) {
        var title = ((version.VersionID > 0) ? "Edit Version Definition" : "Define New Version"); 
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Product : </label></div><div>" + this.BuildDropDownHtmlWith("formProduct", this.version.ProjectProducts, "Select Product", version.ProductID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Number : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + version.NumberName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Nickname : </label></div><div><input type='text' id='formNickName' class='texttype' maxlength='50' style='width: 300px;' value='" + version.NickName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Goal : </label></div><div><textarea id='formDefGoal' type='textarea' name='textarea-goal' maxlength='1000' style='width: 300px; Height:100px;' placeholder='Benefits and reasons for creating this version'>" + this.version.Definition.Summary + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label class='filter'>Code Name # : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='20' style='width: 200px;' value='" + this.version.Definition.CodeName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Status : </label></div><div>" + this.BuildDropDownHtmlWith("formStatus", VersionStatusOptions, "Select Status", version.VersionEnumType.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Month : </label></div><div>" + this.BuildDropDownHtmlWith("formMonth", MonthOptions, "Select Month", version.ReleasedMonth.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Year : </label></div><div>" + this.BuildDropDownHtmlWith("formYear", YearOptions, "Select Year", version.ReleasedYear.toString()) + "</div></div>";
            //formHtml += "<div class='filter-group'><label class='filter'>Is Only Visible By Owner : </label><input type='checkbox' id='IsPrivateCB'></div>";
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
    public ShowVersionRequirementForm() {
        this.app.ShowAlert("Coming Soon !");
    }
    public ShowVersionRequirementXXForm() {
        var title = "Define Version Requirements";
        var formHtml = "";

        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnVersionSaveClick, null, this, null);
        //load version.versions[0].Name each
        $('.table-select-requirement').click((e => { this.AddVersionRequirement(); return false }));
        $('.table-remove-requirement').click((e => { this.RemoveVersionRequirement(parseInt($(e.target).attr('linkID'))); return false }));
        return false;
    }
    public AddVersionRequirement() {

    }
    public RemoveVersionRequirement(requirementID: Number) {

    }
    public OnVersionSaveClick(context: VersionEditorUIControl) {
        var VM = new VersionViewModel();
        //VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.UseCase;
        //VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val()); VM.Category = $.trim($("#formDefCodeName").val());

        var isOK = true;
        //if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
        //if ((context.FieldIsBlank(VM.Category))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.versionSaveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
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
