/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//
//      UIComponentEditorUIControl
//
var UIComponentEditorUIControl = /** @class */ (function (_super) {
    __extends(UIComponentEditorUIControl, _super);
    function UIComponentEditorUIControl(formVM) {
        var _this = _super.call(this, "UIComponentEditorUIControl", "#editor") || this;
        _this.saveURL = "/Project/CreateEditRessouceDefinition";
        _this.uploadScreenURL = "/Project/UploadScreen";
        _this.screenImageURLPath = "/Styles/Uploads/Visuals/";
        _this.removeVersionURL = "/Project/RemoveProjectVersions";
        _this.ProjectID = formVM.ProjectID;
        _this.RessourceID = formVM.Definition.RessourceID;
        _this.Requirements = formVM.Requirements;
        _this.Requirements = formVM.Requirements;
        _this.Alternatives = formVM.Alternatives;
        //this.VariationPoints = formVM.VariationPoints;
        _this.editorURL = "/Project/UIComponentEditor?ComponentID=";
        _this.uIComponent = formVM;
        _this.definitionWrapper = $(".editor-header-bubble-definition");
        //this.screenWrapper = $("#editor-screen-wrapper");
        //this.fieldWrapper = $("#editor-field-wrapper");
        _this.Start();
        return _this;
    }
    UIComponentEditorUIControl.prototype.Start = function () {
        var _this = this;
        this.Build();
        $("#edit-definition-link").click((function (e) { _this.ShowEditDefinitionForm(); return false; }));
        //$("#add-screen-link").click((e => { this.ShowNewScreenForm(); return false }));
        //$("#add-field-link").click((e => { this.ShowNewFieldForm(); return false }));
        //$("#add-requirement-link").click((e => { this.ShowNewRequirementForm(); return false }));
        //$("#add-alternative-link").click((e => { this.ShowNewRequirementForm(); return false }));
    };
    UIComponentEditorUIControl.prototype.ReBuild = function (viewModel) {
        this.uIComponent = viewModel;
        this.Build();
    };
    UIComponentEditorUIControl.prototype.Build = function () {
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            //this.BuildScreens();
            //this.BuildFields();
            this.BuildRequirements();
            this.BuildAlternatives();
        }
    };
    UIComponentEditorUIControl.prototype.BuildDefinition = function () {
        $(".editor-header-bubble-definition").html((this.FieldIsBlank(this.uIComponent.Definition.Definition)) ? "No<br/>Definition<br/>yet" : this.uIComponent.Definition.Definition.replace(/\n/gim, "<br/>"));
        $(".editor-header-bubble-title").html(this.uIComponent.Definition.Name.toString() + ' - ' + this.uIComponent.Definition.ProjectContextName);
    };
    //public ShowNewDefinitionForm() {
    //    if (this.uIComponent.ProjectFeatures.length == 0) {
    //        this.app.ShowAlert("Please set project features first");
    //    } else {
    //        var newVM = new RessourceDefinitionViewModel(); newVM.RessourceID = 0; newVM.Name = "My New UI"; newVM.Definition = ""; newVM.ContextName = "";
    //        this.uIComponent.Definition = newVM;
    //        this.ShowDefinitionForm(this.uIComponent.Definition);
    //    }
    //}
    UIComponentEditorUIControl.prototype.ShowEditDefinitionForm = function () {
        this.ShowDefinitionForm(this.uIComponent.Definition);
    };
    UIComponentEditorUIControl.prototype.ShowDefinitionForm = function (definition) {
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
    };
    UIComponentEditorUIControl.prototype.OnDefinitionSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel(); //VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.Component;
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefVision").val()); //VM.ContextName = $.trim($("#formDefCodeName").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ProjectContextName))) {
            isOK = false;
            context.app.ShowAlert("Context is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    UIComponentEditorUIControl.prototype.preventWrongAttachement = function (e) {
        var selector = $("#UploadedFile")[0];
        var selectedFile = selector.files[0];
        if (selectedFile) {
            if (!((selectedFile.type == "image/jpeg") || (selectedFile.type == "image/png"))) {
                this.app.ShowAlert("You can only upload image files.");
                selector.value = '';
            }
            $(selector).next('label').find('span').html(selector.value);
        }
    };
    UIComponentEditorUIControl.prototype.OnUploadedScreenImage = function (response, context) {
        if (response == "OK") {
            context.app.ShowAlert("Image has been saved !");
            //reload VM
            //context.selectedVisual[2] = "ref" + context.selectedVisual[1].toString();
            //$(".visual").attr("src", context.visualImageURL + context.selectedVisual[2].toString() + ".jpg");
        }
        else {
            context.app.ShowAlert(response);
        }
    };
    return UIComponentEditorUIControl;
}(RequirementUIControl));
//# sourceMappingURL=UIComponentEditor.js.map