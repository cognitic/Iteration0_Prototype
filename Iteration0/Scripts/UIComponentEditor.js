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
        _this.removeVersionURL = "/Project/RemoveProjectVersions";
        _this.ProjectID = formVM.ProjectID;
        _this.RessourceID = formVM.Definition.RessourceID;
        _this.Requirements = formVM.Requirements;
        _this.VariationPoints = formVM.VariationPoints;
        _this.editorURL = "/Project/UIComponentEditor?ComponentID=";
        _this.uIComponent = formVM;
        _this.definitionWrapper = $("#editor-definition-zone");
        _this.screenWrapper = $("#editor-screen-wrapper");
        _this.fieldWrapper = $("#editor-field-wrapper");
        _this.Start();
        return _this;
    }
    UIComponentEditorUIControl.prototype.Start = function () {
        var _this = this;
        this.Build();
        $("#edit-definition-link").click((function (e) { _this.ShowEditDefinitionForm(); return false; }));
        $("#add-screen-link").click((function (e) { _this.ShowNewScreenForm(); return false; }));
        $("#add-field-link").click((function (e) { _this.ShowNewFieldForm(); return false; }));
        $("#add-requirement-link").click((function (e) { _this.ShowNewRequirementForm(); return false; }));
    };
    UIComponentEditorUIControl.prototype.ReBuild = function (viewModel) {
        this.uIComponent = viewModel;
        this.Build();
    };
    UIComponentEditorUIControl.prototype.Build = function () {
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            this.BuildScreens();
            this.BuildFields();
            this.BuildRequirements();
        }
    };
    UIComponentEditorUIControl.prototype.BuildDefinition = function () {
        $("#editor-definition-zone").html((this.FieldIsBlank(this.uIComponent.Definition.Definition)) ? "No<br/>Definition<br/>yet" : this.uIComponent.Definition.Definition.replace(/\n/gim, "<br/>"));
        $("#editor-definition-category").html("<a href='/Project/RessourceCategory?Name=" + this.uIComponent.Definition.ContextName + "'>" + this.uIComponent.Definition.ContextName + '</a>');
        $("#editor-definition-code").html("<a href='/Project/RessourceEditor?RessourceID=" + this.uIComponent.Definition.RessourceID + "'>@" + this.uIComponent.Definition.RessourceID.toString() + '</a>');
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
    UIComponentEditorUIControl.prototype.BuildScreens = function () {
        var _this = this;
        if (this.definitionWrapper != null) {
        }
        $(".edit-screen-link").click((function (e) { _this.ShowEditScreenForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-screen-link").click((function (e) { _this.ShowRemoveScreenForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    UIComponentEditorUIControl.prototype.ShowNewScreenForm = function () {
        this.app.ShowAlert("Coming Soon !");
        //var newVM = new RequirementViewModel(); newVM.RequirementID = 0; newVM.RequirementEnumType = RequirementEnumType.Screen; newVM.Title = "My New Screen";
        //this.ShowScreenForm(newVM);
    };
    UIComponentEditorUIControl.prototype.ShowEditScreenForm = function (screenID) {
        var VM;
        jQuery.each(this.uIComponent.Screens, function () { if (this.RequirementID == screenID) {
            VM = this;
            return false;
        } });
        this.ShowFieldForm(VM);
    };
    UIComponentEditorUIControl.prototype.ShowRemoveScreenForm = function (screenID) {
        this.removePendingID = screenID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Screen", this.OnScreenRemoveClick, null, this, null);
    };
    UIComponentEditorUIControl.prototype.OnScreenRemoveClick = function (context) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    UIComponentEditorUIControl.prototype.BuildFields = function () {
        var _this = this;
        if (this.definitionWrapper != null) {
        }
        $(".edit-field-link").click((function (e) { _this.ShowEditFieldForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-field-link").click((function (e) { _this.ShowRemoveFieldForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    UIComponentEditorUIControl.prototype.ShowNewFieldForm = function () {
        this.app.ShowAlert("Coming Soon !");
        //var newVM = new RequirementViewModel(); newVM.RequirementID = 0; newVM.RequirementEnumType = RequirementEnumType.Field; newVM.Title = "Screen New Field";
        //this.ShowFieldForm(newVM);
    };
    UIComponentEditorUIControl.prototype.ShowEditFieldForm = function (fieldID) {
        var VM;
        jQuery.each(this.uIComponent.Screens, function () { if (this.RequirementID == fieldID) {
            VM = this;
            return false;
        } });
        this.ShowFieldForm(VM);
    };
    UIComponentEditorUIControl.prototype.ShowRemoveFieldForm = function (fieldID) {
        this.removePendingID = fieldID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Field", this.OnFieldRemoveClick, null, this, null);
    };
    UIComponentEditorUIControl.prototype.OnFieldRemoveClick = function (context) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    UIComponentEditorUIControl.prototype.ShowDefinitionForm = function (definition) {
        var title = ((definition.RessourceID > 0) ? "Edit UI Definition" : "Define New UI Component");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + definition.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>UI Overview : </label></div><div><textarea id='formDefBrief' type='textarea' name='textarea-brief' maxlength='1000' style='width: 600px; Height:320px;' placeholder='UI Data, Features and Context Overview..'>" + definition.Definition + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label class='filter'>Type : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='30' style='width: 200px;' placeholder='Component Type'  value='" + definition.ContextName + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
    };
    UIComponentEditorUIControl.prototype.OnDefinitionSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel(); //VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.Component;
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefBrief").val()); //VM.ContextName = $.trim($("#formDefCodeName").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ContextName))) {
            isOK = false;
            context.app.ShowAlert("Context is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    UIComponentEditorUIControl.prototype.ShowScreenForm = function (screen) {
        this.app.ShowAlert('Coming soon !');
    };
    UIComponentEditorUIControl.prototype.OnScreenSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel();
        VM.RessourceID = parseInt($("#formHiddenID").val());
        VM.RessourceEnumType = RessourceEnumType.Component;
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefBrief").val());
        VM.ContextName = $.trim($("#formDefCodeName").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ContextName))) {
            isOK = false;
            context.app.ShowAlert("Context is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    UIComponentEditorUIControl.prototype.ShowFieldForm = function (field) {
        var title = ((field.RequirementID > 0) ? "Edit Requirement" : "Define New Requirement");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + this.uIComponent.Definition.Name + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
    };
    UIComponentEditorUIControl.prototype.OnFieldSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel();
        VM.RessourceID = parseInt($("#formHiddenID").val());
        VM.RessourceEnumType = RessourceEnumType.Component;
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefBrief").val());
        VM.ContextName = $.trim($("#formDefCodeName").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ContextName))) {
            isOK = false;
            context.app.ShowAlert("Context is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    return UIComponentEditorUIControl;
}(RequirementUIControl));
//# sourceMappingURL=UIComponentEditor.js.map