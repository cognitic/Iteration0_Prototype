/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      UseCaseEditorUIControl
//
class UseCaseEditorUIControl extends RequirementUIControl {
    useCase: UseCaseEditorViewModel;
    definitionWrapper: JQuery;
    scenarioWrapper: JQuery;
    requirementsWrapper: JQuery;
    saveURL: string = "/Project/CreateEditRessouceDefinition";

    constructor(formVM: UseCaseEditorViewModel) {
        super("UseCaseEditorUIControl", "#editor");
        this.ProjectID = formVM.ProjectID; this.RessourceID = formVM.Definition.RessourceID;
        this.Requirements = formVM.Requirements; this.Alternatives = formVM.Alternatives;
        this.RequirementUseCase = formVM;
        this.editorURL = "/Project/UseCaseEditor?FunctionID=";
        this.useCase = formVM;
        this.definitionWrapper = $(".editor-header-bubble-definition");
        this.scenarioWrapper = $("#editor-scenario-wrapper");
        this.Start();
    }
    public Start() {
        this.Build();
    }
    public ReBuild(formVM: any) {
        this.useCase = formVM;
        this.Requirements = formVM.Requirements; this.Alternatives = formVM.Alternatives;
        this.RequirementUseCase = formVM;
        this.Build();
    }
    public Build() {
        if (this.wrapper.length>0) {
            this.BuildDefinition();
            this.BuildScenarios();
            this.BuildRequirements();
            this.BuildAlternatives();
        }
        $("#edit-definition-link").click((e => { this.ShowEditDefinitionForm(); return false }));
        $("#add-scenario-link").click((e => { this.ShowNewScenarioForm(); return false }));
        //$("#add-uistep-link").click((e => { this.ShowNewUIStepForm(); return false }));
        $("#add-requirement-link").click((e => { this.ShowNewRequirementForm(); return false }));
        $("#add-alternative-link").click((e => { this.ShowNewAlternativeForm(); return false }));
    } 
    public BuildDefinition() {
        $(".editor-header-bubble-definition").html((this.FieldIsBlank(this.useCase.Definition.Definition)) ? "No<br/>Definition<br/>yet" : this.useCase.Definition.Definition.replace(/\n/gim, "<br/>"));
        $(".editor-header-bubble-title").html(this.useCase.Definition.Name.toString() + ' - ' + this.useCase.Definition.ProjectContextName);
    }
    //public ShowNewDefinitionForm() {
    //    if (this.useCase.ProjectBusinessProcesses.length == 0) {
    //        this.app.ShowAlert("Please set project business processes first");
    //    } else {
    //        var newVM = new RessourceDefinitionViewModel();
    //        newVM.RessourceID = 0; newVM.Name = ""; newVM.Definition = ""; newVM.ContextName = "";
    //        this.useCase.Definition = newVM;
    //        this.ShowDefinitionForm(this.useCase.Definition);
    //    }
    //}
    public ShowEditDefinitionForm() {
        this.ShowDefinitionForm(this.useCase.Definition);
    }
    public BuildScenarios() {
        if (this.definitionWrapper != null) {

        }
        $(".edit-scenario-link").click((e => { this.ShowEditScenarioForm(parseInt($(e.target).attr('linkID'))); return false }));
        $(".remove-scenario-link").click((e => { this.ShowRemoveScenarioForm(parseInt($(e.target).attr('linkID'))); return false }));
    }
    public ShowNewScenarioForm() {
        this.app.ShowAlert("Coming Soon !");
        //var newVM = new RequirementViewModel(); newVM.RequirementID = 0; newVM.RequirementEnumType = RequirementEnumType.Scenario; newVM.Title = "My New Scenario";
        //this.ShowScenarioForm(newVM);
    }
    public ShowEditScenarioForm(scenarioID: Number) {
        var VM: RequirementViewModel;
        jQuery.each(this.useCase.Scenarios, function () { if (this.RequirementID == scenarioID) { VM = this; return false; } });
        this.ShowScenarioForm(VM);
    }
    public ShowRemoveScenarioForm(scenarioID: Number) {
        this.removePendingID = scenarioID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Scenario", this.OnScenarioRemoveClick, null, this, null);
    }
    public OnScenarioRemoveClick(context: UseCaseEditorUIControl) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowDefinitionForm(definition: RessourceDefinitionViewModel) {
        var title = ((this.useCase.Definition.RessourceID > 0) ? "Edit Use Case Definition" : "Define New Use Case");
        var formHtml = "<div class='form-element-group'><div><label >Function : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' placeholder='Verb + Noun Phrase' value='" + this.useCase.Definition.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Description : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 600px; Height:320px;' placeholder='Actors, Goals and Expected System Behavior..'>" + this.useCase.Definition.Definition + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label >Activity : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='30' style='width: 344px;' placeholder='Decision, Control or Coordination' value='" + this.useCase.Definition.ContextName + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
    }
    public OnDefinitionSaveClick(context: UseCaseEditorUIControl) {
        var VM = new RessourceDefinitionViewModel(); //VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType =  RessourceEnumType.UseCase;
        VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val());// VM.ContextName = $.trim($("#formDefCodeName").val());

        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !");}
        if ((context.FieldIsBlank(VM.ProjectContextName))) { isOK = false; context.app.ShowAlert("Context is mandatory !");}
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    }
    public ShowScenarioForm(scenario: RequirementViewModel) {
        var title = ((scenario.RequirementID > 0) ? "Edit Scenario" : "Define New Scenario");
        //formHtml += "<div class='form-element-group'><div><label >Priority : </label></div><div><input type='number'name='quantity' min='1' max='5' id='formPriority'placeholder='1 - 5' value='" + scenario.Priority + "'></div></div>";
        //var formHtml = "<div class='form-element-group'><div><label >Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + scenario.Title + "'></div></div>";
        //formHtml += "<div class='form-element-group'><div><label >Given : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Actors, Goals and Expected System Behavior..'>" + scenario.Attribute1Value + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label >When : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Actors, Goals and Expected System Behavior..'>" + scenario.Attribute2Value + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label >Then : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Actors, Goals and Expected System Behavior..'>" + scenario.Attribute3Value + "</textarea></div></div>";

        //this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
    }
    public OnScenarioSaveClick(context: UseCaseEditorUIControl) {
        var VM = new RequirementViewModel();
        //VM.RessourceID = parseInt($("#formHiddenID").val()); VM.RessourceEnumType = RessourceEnumType.UseCase;
        //VM.Name = $.trim($("#formDefName").val()); VM.Definition = $.trim($("#formDefVision").val()); VM.Category = $.trim($("#formDefCodeName").val());

        var isOK = true;
        //if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
        //if ((context.FieldIsBlank(VM.Category))) { isOK = false; context.app.ShowAlert("Context is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    }
    public ShowNewUIStepForm() {
        this.app.ShowAlert("Coming Soon !");
        //var newVM = new RequirementViewModel(); newVM.RequirementID = 0; newVM.RequirementEnumType = RequirementEnumType.Scenario; newVM.Title = "My New Scenario";
        //this.ShowScenarioForm(newVM);
    }
}