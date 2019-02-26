/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      InsertionEditorUIControl
//
class DomainConceptEditorUIControl extends RequirementUIControl {
    domainConcept: DomainConceptEditorViewModel;
    definitionWrapper: JQuery;
    ResponsabilityWrapper: JQuery;
    AttributesWrapper: JQuery;
    saveURL: string = "/Project/CreateEditRessouceDefinition";
    associationSaveURL: string = "/Project/CreateEditRessouceAssociation";
    removeAssociationURL: string = "/Project/RemoveRessourceAssociation";

    constructor(formVM: DomainConceptEditorViewModel) {
        super("DomainConceptEditorUIControl", "#editor");
        this.ProjectID = formVM.ProjectID; this.RessourceID = formVM.Definition.RessourceID; 
        this.editorURL = "/Project/DomainConceptEditor?ConceptID=";
        this.domainConcept = formVM;
        this.definitionWrapper = $("#editor-definition-zone");
        this.AttributesWrapper = $("#editor-attributes-wrapper");
        this.ResponsabilityWrapper = $("#editor-responsabilities-wrapper");
        this.Start();
    }
    public Start() {
        this.Build();
        $("#edit-definition-link").click((e => { this.ShowEditDefinitionForm(); return false }));        
        $("#add-attribute-link").click((e => { this.ShowNewAttributeForm(); return false }));
        $("#add-responsability-link").click((e => { this.ShowNewResponsabilityForm(); return false }));
        $("#add-requirement-link").click((e => { this.ShowNewRequirementForm(); return false }));
    }
    public ReBuild(viewModel: any) {
        this.domainConcept = viewModel;
        this.Build();
    }
    public Build() {
        if (this.wrapper.length>0) {
            this.BuildDefinition();
            this.BuildAttributes();
            this.BuildResponsabilitys();
            this.BuildRequirements();
        }
    }
    public BuildDefinition() {
        $("#editor-definition-zone").html((this.FieldIsBlank(this.domainConcept.Definition.Definition)) ? "No<br/>Definition<br/>yet" : this.domainConcept.Definition.Definition.replace(/\n/gim, "<br/>"));
        $("#editor-definition-category").html("<a href='/Project/RessourceCategory?Name=" + this.domainConcept.Definition.ContextName + "'>" + this.domainConcept.Definition.ContextName + '</a>');
        $("#editor-definition-code").html("<a href='/Project/RessourceEditor?RessourceID=" + this.domainConcept.Definition.RessourceID + "'>@" + this.domainConcept.Definition.RessourceID.toString() + '</a>');
    }
    //public ShowNewDefinitionForm() {
    //    if (this.domainConcept.ProjectDomainContexts.length == 0) {
    //        this.app.ShowAlert("Please set project domain contexts first");
    //    } else {
    //    var newVM = new RessourceDefinitionViewModel(); newVM.RessourceID = 0; newVM.Name = "My New Concept"; newVM.Definition = ""; newVM.ContextName = "";
    //    this.domainConcept.Definition = newVM;
    //    this.ShowDefinitionForm(this.domainConcept.Definition);
    //    }
    //}
    public ShowEditDefinitionForm() {
        this.ShowDefinitionForm(this.domainConcept.Definition);
    }
    public BuildAttributes() {
        if (this.definitionWrapper != null) {

        }
        $(".edit-Responsability-link").click((e => { this.ShowEditResponsabilityForm(parseInt($(e.target).attr('linkID'))); return false }));
        $(".remove-Responsability-link").click((e => { this.ShowRemoveResponsabilityForm(parseInt($(e.target).attr('linkID'))); return false }));
    }
    public BuildResponsabilitys() {
        if (this.definitionWrapper != null) {

        }
        $(".edit-Responsability-link").click((e => { this.ShowEditResponsabilityForm(parseInt($(e.target).attr('linkID'))); return false }));
        $(".remove-Responsability-link").click((e => { this.ShowRemoveResponsabilityForm(parseInt($(e.target).attr('linkID'))); return false }));
    }
    public ShowNewAttributeForm() {
        this.app.ShowAlert("Coming Soon !");
        //var newVM = new RessourceAssociationViewModel(); newVM.RessourceID = 0; //newVM.Name = "My New Concept"; newVM.Definition = ""; newVM.Category = "";
        //this.ShowDefinitionForm(this.domainConcept.Definition);
    }
    public ShowNewResponsabilityForm() {
        this.app.ShowAlert("Coming Soon !");
        //var newVM = new RessourceAssociationViewModel(); newVM.RessourceID = 0; //newVM.Name = "My New Concept"; newVM.Definition = ""; newVM.Category = "";
        //this.ShowDefinitionForm(this.domainConcept.Definition);
    }
    public ShowEditResponsabilityForm(associationID: Number) {
        var VM: RessourceAssociationViewModel;
        jQuery.each(this.domainConcept.Attributes, function () { if (this.RequirementID == associationID) { VM = this; return false; } });
        if (VM == null) { jQuery.each(this.domainConcept.HasManyAssociations, function () { if (this.RequirementID == associationID) { VM = this; return false; } }); }
        if (VM == null) { jQuery.each(this.domainConcept.HasOneAssociations, function () { if (this.RequirementID == associationID) { VM = this; return false; } }); }
        if (VM == null) { jQuery.each(this.domainConcept.Operations, function () { if (this.RequirementID == associationID) { VM = this; return false; } }); }
        this.ShowResponsabilityForm(VM);
    }
    public ShowRemoveResponsabilityForm(associationID: Number) {
        this.removePendingID = associationID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Responsability", this.OnResponsabilityRemoveClick, null, this, null);
    }
    public OnResponsabilityRemoveClick(context: DomainConceptEditorUIControl) {
        context.AjaxCall(context.removeAssociationURL, JSON.stringify({ associationID: context.removePendingID, ressourceID: context.domainConcept.Definition.RessourceID }), context.OnEditorSaved, context);
    }
    public ShowDefinitionForm(definition: RessourceDefinitionViewModel) {
        var title = ((definition.RessourceID > 0) ? "Edit Concept Definition" : "Define New Concept");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + definition.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Definition : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='2000' style='width: 600px; Height:320px;' placeholder='Concept definition relevant for solving the domain problem in the real world..'>" + this.domainConcept.Definition.Definition + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label class='filter'>Context : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='30' style='width: 200px;' placeholder='Bounded Context' value='" + definition.ContextName + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
    }
    public OnDefinitionSaveClick(context: DomainConceptEditorUIControl) {
        var VM = new RessourceDefinitionViewModel(); //VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.Domain;
        VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val()); //.ContextName = $.trim($("#formDefCodeName").val());

        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
        //if ((context.FieldIsBlank(VM.ContextName))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    }

    public ShowResponsabilityForm(Responsability: RessourceAssociationViewModel) {
        var title = ((this.domainConcept.Definition.RessourceID > 0) ? "Edit Concept Definition" : "Define New Concept");
        var formHtml = "";
        formHtml += '<select id="#associationTypeDP"><optgroup label="Attribute" ><option value="1" >State</option>< option value= "2" >Has One</option>< option value= "3" >Has Many</option>< /optgroup><optgroup label="Specification" ><option value="4" >Aggregation< /option>< option value= "5" >Operation< /option>< /optgroup></select>';
        formHtml += "<div class='form-element-group' > <div><label class='filter' > Operation / Attribute Name : </label></div> <div><input type='text' id= 'formDefName' class='texttype' maxlength= '50' style= 'width: 300px;' value= '" + this.domainConcept.Definition.Name + "' > </div></div> ";

        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
        $('#associationTypeDP').change((e => this.OnAssociationChange(parseInt($(e.target).val()))));
        //TODO <button>Select Collaborator..</button>
    }
    public OnAssociationChange(AssociationEnumTypeId: Number) {

    }
    //public OnAssociationSaveClick(context: DomainConceptEditorUIControl) {
    //    var VM = new RessourceDefinitionViewModel(); VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.Domain;
    //    VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val()); VM.ContextName = $.trim($("#formDefCodeName").val());

    //    var isOK = true;
    //    if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
    //    if ((context.FieldIsBlank(VM.ContextName))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
    //    if (isOK) {
    //        context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    //    }
    //}
}