/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      UIComponentEditorUIControl
//
class UIComponentEditorUIControl extends RequirementUIControl {
    uIComponent: UIComponentEditorViewModel;
    definitionWrapper: JQuery;
    screenWrapper: JQuery;
    fieldWrapper: JQuery;
    saveURL: string = "/Project/CreateEditRessouceDefinition";
    uploadScreenURL: string = "/Project/UploadScreen";
    screenImageURLPath: string = "/Styles/Uploads/Visuals/";
    removeVersionURL: string = "/Project/RemoveProjectVersions";

    constructor(formVM: UIComponentEditorViewModel) {
        super("UIComponentEditorUIControl", "#editor");
        this.ProjectID = formVM.ProjectID; this.RessourceID = formVM.Definition.RessourceID; this.Specifications = formVM.Specifications;
        this.Specifications = formVM.Specifications; this.Alternatives = formVM.Alternatives;
        //this.VariationPoints = formVM.VariationPoints;
        this.editorURL = "/Project/UIComponentEditor?ComponentID=";
        this.uIComponent = formVM;
        this.definitionWrapper = $(".editor-header-bubble-definition");
        //this.screenWrapper = $("#editor-screen-wrapper");
        //this.fieldWrapper = $("#editor-field-wrapper");
        this.Start();
    }
    public Start() {
        this.Build();
        $("#edit-definition-link").click((e => { this.ShowEditDefinitionForm(); return false }));
        //$("#add-screen-link").click((e => { this.ShowNewScreenForm(); return false }));
        //$("#add-field-link").click((e => { this.ShowNewFieldForm(); return false }));
        //$("#add-requirement-link").click((e => { this.ShowNewRequirementForm(); return false }));
        //$("#add-alternative-link").click((e => { this.ShowNewRequirementForm(); return false }));
    }
    public ReBuild(viewModel: any) {
        this.uIComponent = viewModel;
        this.Build();
    }
    public Build() {
        if (this.wrapper.length>0) {
            this.BuildDefinition();
            //this.BuildScreens();
            //this.BuildFields();
            this.BuildSpecifications();
            this.BuildAlternatives();
        }
    }
    public BuildDefinition() {
        $(".editor-header-bubble-definition").html((this.FieldIsBlank(this.uIComponent.Definition.Definition)) ? "No<br/>Definition<br/>yet" : this.uIComponent.Definition.Definition.replace(/\n/gim, "<br/>"));
        $(".editor-header-bubble-title").html(this.uIComponent.Definition.Name.toString() + ' - ' + this.uIComponent.Definition.ProjectContextName);
    }
    //public ShowNewDefinitionForm() {
    //    if (this.uIComponent.ProjectFeatures.length == 0) {
    //        this.app.ShowAlert("Please set project features first");
    //    } else {
    //        var newVM = new RessourceDefinitionViewModel(); newVM.RessourceID = 0; newVM.Name = "My New UI"; newVM.Definition = ""; newVM.ContextName = "";
    //        this.uIComponent.Definition = newVM;
    //        this.ShowDefinitionForm(this.uIComponent.Definition);
    //    }
    //}
    public ShowEditDefinitionForm() {
        this.ShowDefinitionForm(this.uIComponent.Definition);
    }
    public ShowDefinitionForm(definition: RessourceDefinitionViewModel) {
        var title = ((definition.RessourceID > 0) ? "Edit UI Definition" : "Define New UI Component");
        var formHtml = "<div class='form-element-group'><div><label >Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + definition.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >UI Overview : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 600px; Height:320px;' placeholder='UI Data, Features and Context Overview..'>" + definition.Definition + "</textarea></div></div>";
        if (definition.RessourceID > 0) {
            formHtml += '<form id="FormUpload" method= "POST" data- url="' + this.uploadScreenURL + '" enctype= "multipart/form-data" >';
            formHtml += '<div class="filter- group"><label class="filter">UI Screenshot :</label> <div class="ui input"><input type="file" name="UploadedFile" id="UploadedFile" class="custom" /><label for="UploadedFile"><span>Choose a file…</span><button class="ui icon button" id="UploadFile_btn"> <i class="upload icon"></i></button></label></div></div>';
            formHtml += '</form>';
        }
        //formHtml += "<div class='form-element-group'><div><label >Type : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='30' style='width: 200px;' placeholder='Component Type'  value='" + definition.ContextName + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
    }
    public OnDefinitionSaveClick(context: UIComponentEditorUIControl) {
        var VM = new RessourceDefinitionViewModel(); //VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.Component;
        VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val()); //VM.ContextName = $.trim($("#formDefCodeName").val());

        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
        if ((context.FieldIsBlank(VM.ProjectContextName))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    }

    public preventWrongAttachement(e) {
        var selector = <HTMLInputElement>$("#UploadedFile")[0];
        var selectedFile = selector.files[0];
        if (selectedFile) {
            if (!((selectedFile.type == "image/jpeg") || (selectedFile.type == "image/png"))) {
                this.app.ShowAlert("You can only upload image files.");
                selector.value = '';
            }
            $(selector).next('label').find('span').html(selector.value);
        }
    }
    public OnUploadedScreenImage(response: any, context: UIComponentEditorUIControl) {
        if (response == "OK") {
            context.app.ShowAlert("Image has been saved !");
            //reload VM
            //context.selectedVisual[2] = "ref" + context.selectedVisual[1].toString();
            //$(".visual").attr("src", context.visualImageURL + context.selectedVisual[2].toString() + ".jpg");
        }
        else {
            context.app.ShowAlert(response);
        }
    }

    //public BuildScreens() {
    //    if (this.definitionWrapper != null) {

    //    }
    //    $(".edit-screen-link").click((e => { this.ShowEditScreenForm(parseInt($(e.target).attr('linkID'))); return false }));
    //    $(".remove-screen-link").click((e => { this.ShowRemoveScreenForm(parseInt($(e.target).attr('linkID'))); return false }));
    //}

    //public ShowNewScreenForm() {
    //    this.app.ShowAlert("Coming Soon !");
    //    //var newVM = new SpecificationViewModel(); newVM.RequirementID = 0; newVM.RequirementEnumType = RequirementEnumType.Screen; newVM.Title = "My New Screen";
    //    //this.ShowScreenForm(newVM);
    //    $('#UploadedFile').change((e => this.preventWrongAttachement(e)));
    //    $('#UploadFile_btn').click((e => this.UploadFileTo(this.uploadScreenURL, this.selectedVisual[1], this.OnUploadedScreenImage)));
    //}
    //public ShowEditScreenForm(screenID: Number) {
    //    var VM: SpecificationViewModel;
    //    jQuery.each(this.uIComponent.Screens, function () { if (this.RequirementID == screenID) { VM = this; return false; } });
    //    this.ShowFieldForm(VM);
    //}
    //public ShowRemoveScreenForm(screenID: Number) {
    //    this.removePendingID = screenID;
    //    this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Screen", this.OnScreenRemoveClick, null, this, null);
    //}
    //public OnScreenRemoveClick(context: UIComponentEditorUIControl) {
    //    context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    //}
    //public BuildFields() {
    //    if (this.definitionWrapper != null) {

    //    }
    //    $(".edit-field-link").click((e => { this.ShowEditFieldForm(parseInt($(e.target).attr('linkID'))); return false }));
    //    $(".remove-field-link").click((e => { this.ShowRemoveFieldForm(parseInt($(e.target).attr('linkID'))); return false }));
    //}
    //public ShowNewFieldForm() {
    //    this.app.ShowAlert("Coming Soon !");
    //    //var newVM = new SpecificationViewModel(); newVM.RequirementID = 0; newVM.RequirementEnumType = RequirementEnumType.Field; newVM.Title = "Screen New Field";
    //    //this.ShowFieldForm(newVM);
    //}
    //public ShowEditFieldForm(fieldID: Number) {
    //    var VM: SpecificationViewModel;
    //    jQuery.each(this.uIComponent.Screens, function () { if (this.RequirementID == fieldID) { VM = this; return false; } });
    //    this.ShowFieldForm(VM);
    //}
    //public ShowRemoveFieldForm(fieldID: Number) {
    //    this.removePendingID = fieldID;
    //    this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Field", this.OnFieldRemoveClick, null, this, null);
    //}
    //public OnFieldRemoveClick(context: UIComponentEditorUIControl) {
    //    context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    //}
    //public ShowScreenForm(screen: SpecificationViewModel) {
    //    this.app.ShowAlert('Coming soon !');
    //}
    //public OnScreenSaveClick(context: UIComponentEditorUIControl) {
    //    var VM = new RessourceDefinitionViewModel(); VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.Component;
    //    VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val()); VM.ProjectContextName = $.trim($("#formDefCodeName").val());

    //    var isOK = true;
    //    if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
    //    if ((context.FieldIsBlank(VM.ProjectContextName))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
    //    if (isOK) {
    //        context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    //    }
    //}
    //public ShowFieldForm(field: SpecificationViewModel) {
    //    var title = ((field.RequirementID > 0) ? "Edit Requirement" : "Define New Requirement");
    //    var formHtml = "<div class='form-element-group'><div><label >Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + this.uIComponent.Definition.Name + "'></div></div>";
    //    this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
    //    //$('#ProductEnabledCB').prop('checked', IsActive);
    //}
    //public OnFieldSaveClick(context: UIComponentEditorUIControl) {
    //    var VM = new RessourceDefinitionViewModel(); VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.Component;
    //    VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val()); VM.ProjectContextName = $.trim($("#formDefCodeName").val());

    //    var isOK = true;
    //    if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
    //    if ((context.FieldIsBlank(VM.ProjectContextName))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
    //    if (isOK) {
    //        context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    //    }
    //}
}