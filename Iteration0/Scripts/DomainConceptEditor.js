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
//      InsertionEditorUIControl
//
var DomainConceptEditorUIControl = /** @class */ (function (_super) {
    __extends(DomainConceptEditorUIControl, _super);
    function DomainConceptEditorUIControl(formVM) {
        var _this = _super.call(this, "DomainConceptEditorUIControl", "#editor") || this;
        _this.saveURL = "/Project/CreateEditRessouceDefinition";
        _this.associationSaveURL = "/Project/CreateEditRessouceAssociation";
        _this.removeAssociationURL = "/Project/RemoveRessourceAssociation";
        _this.ProjectID = formVM.ProjectID;
        _this.RessourceID = formVM.Definition.RessourceID;
        _this.editorURL = "/Project/DomainConceptEditor?ConceptID=";
        _this.domainConcept = formVM;
        _this.definitionWrapper = $("#editor-definition-zone");
        _this.AttributesWrapper = $("#editor-attributes-wrapper");
        _this.ResponsabilityWrapper = $("#editor-responsabilities-wrapper");
        _this.Start();
        return _this;
    }
    DomainConceptEditorUIControl.prototype.Start = function () {
        var _this = this;
        this.Build();
        $("#edit-definition-link").click((function (e) { _this.ShowEditDefinitionForm(); return false; }));
        $("#add-attribute-link").click((function (e) { _this.ShowNewAttributeForm(); return false; }));
        $("#add-responsability-link").click((function (e) { _this.ShowNewResponsabilityForm(); return false; }));
        $("#add-requirement-link").click((function (e) { _this.ShowNewRequirementForm(); return false; }));
    };
    DomainConceptEditorUIControl.prototype.ReBuild = function (viewModel) {
        this.domainConcept = viewModel;
        this.Build();
    };
    DomainConceptEditorUIControl.prototype.Build = function () {
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            this.BuildAttributes();
            this.BuildResponsabilitys();
            this.BuildRequirements();
        }
    };
    DomainConceptEditorUIControl.prototype.BuildDefinition = function () {
        $("#editor-definition-zone").html((this.FieldIsBlank(this.domainConcept.Definition.Definition)) ? "No<br/>Definition<br/>yet" : this.domainConcept.Definition.Definition.replace(/\n/gim, "<br/>"));
        $("#editor-definition-category").html("<a href='/Project/RessourceCategory?Name=" + this.domainConcept.Definition.ContextName + "'>" + this.domainConcept.Definition.ContextName + '</a>');
        $("#editor-definition-code").html("<a href='/Project/RessourceEditor?RessourceID=" + this.domainConcept.Definition.RessourceID + "'>@" + this.domainConcept.Definition.RessourceID.toString() + '</a>');
    };
    //public ShowNewDefinitionForm() {
    //    if (this.domainConcept.ProjectDomainContexts.length == 0) {
    //        this.app.ShowAlert("Please set project domain contexts first");
    //    } else {
    //    var newVM = new RessourceDefinitionViewModel(); newVM.RessourceID = 0; newVM.Name = "My New Concept"; newVM.Definition = ""; newVM.ContextName = "";
    //    this.domainConcept.Definition = newVM;
    //    this.ShowDefinitionForm(this.domainConcept.Definition);
    //    }
    //}
    DomainConceptEditorUIControl.prototype.ShowEditDefinitionForm = function () {
        this.ShowDefinitionForm(this.domainConcept.Definition);
    };
    DomainConceptEditorUIControl.prototype.BuildAttributes = function () {
        var _this = this;
        if (this.definitionWrapper != null) {
        }
        $(".edit-Responsability-link").click((function (e) { _this.ShowEditResponsabilityForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-Responsability-link").click((function (e) { _this.ShowRemoveResponsabilityForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    DomainConceptEditorUIControl.prototype.BuildResponsabilitys = function () {
        var _this = this;
        if (this.definitionWrapper != null) {
        }
        $(".edit-Responsability-link").click((function (e) { _this.ShowEditResponsabilityForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-Responsability-link").click((function (e) { _this.ShowRemoveResponsabilityForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    DomainConceptEditorUIControl.prototype.ShowNewAttributeForm = function () {
        this.app.ShowAlert("Coming Soon !");
        //var newVM = new RessourceAssociationViewModel(); newVM.RessourceID = 0; //newVM.Name = "My New Concept"; newVM.Definition = ""; newVM.Category = "";
        //this.ShowDefinitionForm(this.domainConcept.Definition);
    };
    DomainConceptEditorUIControl.prototype.ShowNewResponsabilityForm = function () {
        this.app.ShowAlert("Coming Soon !");
        //var newVM = new RessourceAssociationViewModel(); newVM.RessourceID = 0; //newVM.Name = "My New Concept"; newVM.Definition = ""; newVM.Category = "";
        //this.ShowDefinitionForm(this.domainConcept.Definition);
    };
    DomainConceptEditorUIControl.prototype.ShowEditResponsabilityForm = function (associationID) {
        var VM;
        jQuery.each(this.domainConcept.Attributes, function () { if (this.RequirementID == associationID) {
            VM = this;
            return false;
        } });
        if (VM == null) {
            jQuery.each(this.domainConcept.HasManyAssociations, function () { if (this.RequirementID == associationID) {
                VM = this;
                return false;
            } });
        }
        if (VM == null) {
            jQuery.each(this.domainConcept.HasOneAssociations, function () { if (this.RequirementID == associationID) {
                VM = this;
                return false;
            } });
        }
        if (VM == null) {
            jQuery.each(this.domainConcept.Operations, function () { if (this.RequirementID == associationID) {
                VM = this;
                return false;
            } });
        }
        this.ShowResponsabilityForm(VM);
    };
    DomainConceptEditorUIControl.prototype.ShowRemoveResponsabilityForm = function (associationID) {
        this.removePendingID = associationID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Responsability", this.OnResponsabilityRemoveClick, null, this, null);
    };
    DomainConceptEditorUIControl.prototype.OnResponsabilityRemoveClick = function (context) {
        context.AjaxCall(context.removeAssociationURL, JSON.stringify({ associationID: context.removePendingID, ressourceID: context.domainConcept.Definition.RessourceID }), context.OnEditorSaved, context);
    };
    DomainConceptEditorUIControl.prototype.ShowDefinitionForm = function (definition) {
        var title = ((definition.RessourceID > 0) ? "Edit Concept Definition" : "Define New Concept");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + definition.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Definition : </label></div><div><textarea id='formDefBrief' type='textarea' name='textarea-brief' maxlength='2000' style='width: 600px; Height:320px;' placeholder='Concept definition relevant for solving the domain problem in the real world..'>" + this.domainConcept.Definition.Definition + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label class='filter'>Context : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='30' style='width: 200px;' placeholder='Bounded Context' value='" + definition.ContextName + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
    };
    DomainConceptEditorUIControl.prototype.OnDefinitionSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel(); //VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.Domain;
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefBrief").val()); //.ContextName = $.trim($("#formDefCodeName").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        //if ((context.FieldIsBlank(VM.ContextName))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    DomainConceptEditorUIControl.prototype.ShowResponsabilityForm = function (Responsability) {
        var _this = this;
        var title = ((this.domainConcept.Definition.RessourceID > 0) ? "Edit Concept Definition" : "Define New Concept");
        var formHtml = "";
        formHtml += '<select id="#associationTypeDP"><optgroup label="Attribute" ><option value="1" >State</option>< option value= "2" >Has One</option>< option value= "3" >Has Many</option>< /optgroup><optgroup label="Specification" ><option value="4" >Aggregation< /option>< option value= "5" >Operation< /option>< /optgroup></select>';
        formHtml += "<div class='form-element-group' > <div><label class='filter' > Operation / Attribute Name : </label></div> <div><input type='text' id= 'formDefName' class='texttype' maxlength= '50' style= 'width: 300px;' value= '" + this.domainConcept.Definition.Name + "' > </div></div> ";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
        $('#associationTypeDP').change((function (e) { return _this.OnAssociationChange(parseInt($(e.target).val())); }));
        //TODO <button>Select Collaborator..</button>
    };
    DomainConceptEditorUIControl.prototype.OnAssociationChange = function (AssociationEnumTypeId) {
    };
    return DomainConceptEditorUIControl;
}(RequirementUIControl));
//# sourceMappingURL=DomainConceptEditor.js.map