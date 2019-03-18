/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      InsertionEditorUIControl
//
class DomainConceptEditorUIControl extends RequirementUIControl {
    domainConcept: DomainConceptEditorViewModel;
    definitionWrapper: JQuery;
    ResponsabilityWrapper: JQuery;
    AggregationsWrapper: JQuery;
    saveURL: string = "/Project/CreateEditRessouceDefinition";
    associationSaveURL: string = "/Project/CreateEditRessouceAssociation";
    removeAggregationURL: string = "/Project/RemoveRessourceAssociation";

    constructor(formVM: DomainConceptEditorViewModel) {
        super("DomainConceptEditorUIControl", "#editor");
        this.ProjectID = formVM.ProjectID; this.RessourceID = formVM.Definition.RessourceID;
        this.Requirements = formVM.Requirements; this.Alternatives = formVM.Alternatives;
        this.editorURL = "/Project/DomainConceptEditor?ConceptID=";
        this.domainConcept = formVM;
        this.definitionWrapper = $(".editor-header-bubble-definition");
        this.AggregationsWrapper = $("#editor-aggregations-wrapper");
        this.Start();
    }
    public Start() {
        this.Build();
        $("#edit-definition-link").click((e => { this.ShowEditDefinitionForm(); return false }));        
        $("#add-aggregation-link").click((e => { this.ShowNewAggregationForm(); return false }));
        //$("#add-requirement-link").click((e => { this.ShowNewRequirementForm(); return false }));
        //$("#add-alternative-link").click((e => { this.ShowNewRequirementForm(); return false }));
    }
    public ReBuild(viewModel: any) {
        this.domainConcept = viewModel;
        this.Build();
    }
    public Build() {
        if (this.wrapper.length>0) {
            this.BuildDefinition();
            this.BuildAggregations();
            this.BuildRequirements();
            this.BuildAlternatives();
        }
    }
    public BuildDefinition() {
        $(".editor-header-bubble-definition").html((this.FieldIsBlank(this.domainConcept.Definition.Definition)) ? "No<br/>Definition<br/>yet" : this.domainConcept.Definition.Definition.replace(/\n/gim, "<br/>"));
        $(".editor-header-bubble-title").html(this.domainConcept.Definition.Name.toString() + ' - ' + this.domainConcept.Definition.ProjectContextName);
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

    public BuildAggregationLabelFor(aggregation: RessourceAssociationViewModel, mustUseParentLabel: boolean): String {
        if (mustUseParentLabel) {
            return '<a class="u" href="/Project/DomainConceptEditor?ConceptID=' + aggregation.ParentID + '">@' + aggregation.ParentName + '</a> ';
        } else {
            return '<a class="u" href="/Project/DomainConceptEditor?ConceptID=' + aggregation.RessourceID + '">@' + aggregation.RessourceName + '</a> ';
        }
    }
    public BuildAggregationActionLinkFor(aggregation: RessourceAssociationViewModel): String {
        var html = '<a class="edit-aggregation-link action-link" linkid="' + aggregation.AssociationId + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-aggregation-link action-link" linkid="' + aggregation.AssociationId + '" href="/">Remove</a>';
        return html;
    }
    public BuildAggregations() {
        if (this.AggregationsWrapper != null) {
            var Context = this;
            var AggregationCount = this.domainConcept.HasOne.length + this.domainConcept.HasMany.length + this.domainConcept.PartOf.length + this.domainConcept.PartsOf.length;
            var html = '<div class="aggregations-content"><table><tr><td class="aggregations-parents">';
            var parentHtml = "";
            jQuery.each(this.domainConcept.PartOf, function () {
                parentHtml += Context.BuildAggregationLabelFor(this, true) + ", ";
            });
            jQuery.each(this.domainConcept.PartsOf, function () {
                parentHtml += Context.BuildAggregationLabelFor(this, true) + ", ";
            });
            var childrenHtml = "";
            jQuery.each(this.domainConcept.HasOne, function () {
                childrenHtml += "1 " + Context.BuildAggregationLabelFor(this, false) + " " + Context.BuildAggregationActionLinkFor(this) + "<br/>";
            });
            jQuery.each(this.domainConcept.HasMany, function () {
                childrenHtml += "* " + Context.BuildAggregationLabelFor(this, false) + " " + Context.BuildAggregationActionLinkFor(this) +  "<br/>";
            });
            if (parentHtml.length > 0) parentHtml = parentHtml.substring(0, parentHtml.length - 2);
            html += parentHtml + '</td><td class="aggregations-concept">' + ((parentHtml.length > 0) ? " <span class='precede-icon'>≺</span> " : "");
            html += this.domainConcept.Definition.Name + ((childrenHtml.length > 0) ? " <span class='precede-icon fmax'>≺</span> " : "");
            html += '</td><td class="aggregations-children">' + childrenHtml;
            html += '</td></tr></table></div>';
            if (AggregationCount > 0) {
                this.AggregationsWrapper.html(html);
            } else {
                this.AggregationsWrapper.html('<div class="tac">No Aggregations yet</div>');
            }
        }
        $(".edit-aggregation-link").click((e => { this.ShowEditAggregationForm(parseInt($(e.target).attr('linkID'))); return false }));
        $(".remove-aggregation-link").click((e => { this.ShowRemoveAggregationForm(parseInt($(e.target).attr('linkID'))); return false }));
    }
    public ShowDefinitionForm(definition: RessourceDefinitionViewModel) {
        var title = ((definition.RessourceID > 0) ? "Edit Concept Definition" : "Define New Concept");
        var formHtml = "<div class='form-element-group'><div><label >Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + definition.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Definition : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='2000' style='width: 600px; Height:320px;' placeholder='Concept definition relevant for solving the domain problem in the real world..'>" + this.domainConcept.Definition.Definition + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label >Context : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='30' style='width: 200px;' placeholder='Bounded Context' value='" + definition.ContextName + "'></div></div>";
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
    public ShowNewAggregationForm() {
        var newVM = new RessourceAssociationViewModel(); newVM.AssociationId = 0;
        newVM.ParentID = this.domainConcept.Definition.RessourceID; newVM.RessourceID = 0;
        newVM.AssociationEnumType = AssociationEnumType.HasOne;
        this.ShowAggregationForm(newVM);
    } 
    public ShowEditAggregationForm(AssociationId: Number) {
        var VM: RessourceAssociationViewModel;
        jQuery.each(this.domainConcept.HasOne, function () { if (this.AssociationId == AssociationId) { VM = this; return false; } });
        jQuery.each(this.domainConcept.HasMany, function () { if (this.AssociationId == AssociationId) { VM = this; return false; } });
        jQuery.each(this.domainConcept.PartOf, function () { if (this.AssociationId == AssociationId) { VM = this; return false; } });
        jQuery.each(this.domainConcept.PartsOf, function () { if (this.AssociationId == AssociationId) { VM = this; return false; } });
        this.ShowAggregationForm(VM);
    } 
    public ShowRemoveAggregationForm(AssociationId: Number) {
        this.removePendingID = AssociationId;
        this.app.ShowCustomMessage("Are you sure you want to delete this aggregation ?", "Remove Aggregation", this.OnAggregationRemoveClick, null, this, null);
    }
    public OnAggregationRemoveClick(context: DomainConceptEditorUIControl) {
        context.AjaxCall(context.removeAggregationURL, JSON.stringify({ AssociationId: context.removePendingID, ProjectID: context.domainConcept.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowAggregationForm(aggregation: RessourceAssociationViewModel) {
        var title = ((aggregation.AssociationId > 0) ? "Edit Aggregation" : "Define New Aggregation");
        var formHtml = "";
        formHtml += "<div class='form-element-group'><div><label >Cardinality : </label></div><div>" + this.BuildDropDownHtmlWith("formCardinality", CardinalityOptions, "Select Cardinality", aggregation.AssociationEnumType.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Child Concept : </label></div><div>" + this.BuildDropDownHtmlWith("formChildConcept", this.domainConcept.ProjectConcepts, "Select Concept", aggregation.RessourceID.toString()) + "</div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnAggregationSaveClick, null, this, null);
    }
    public OnAggregationSaveClick(context: DomainConceptEditorUIControl) {
        var VM = new RessourceAssociationViewModel(); VM.RessourceID = parseInt($("#formChildConcept").val()); VM.AssociationEnumType = parseInt($("#formCardinality").val());

        var isOK = true;
        if ((context.FieldIsBlank(VM.RessourceID))) { isOK = false; context.app.ShowAlert("Child Concept is mandatory !"); }
        if ((context.FieldIsBlank(VM.AssociationEnumType))) { isOK = false; context.app.ShowAlert("Cardinality is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.associationSaveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    }
}