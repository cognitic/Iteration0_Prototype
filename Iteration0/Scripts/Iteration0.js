/// <reference path="jquery.d.ts" />
/// <reference path="global.d.ts" />
/// <reference path='RequirementUIControl.ts'/>
/// <reference path='PopUpUIControl.ts'/>
/// <reference path='ProjectEditor.ts'/>
/// <reference path='DomainConceptEditor.ts'/>
/// <reference path='UseCaseEditor.ts'/>
/// <reference path='UIComponentEditor.ts'/>
/// <reference path='BoardEditor.ts'/>
/// <reference path='PDFGenerator.ts'/>
var Iteration0 = /** @class */ (function () {
    function Iteration0() {
        this.LoadDocumentURL = "/Project/GetDocumentViewModel";
    }
    Iteration0.prototype.Start = function () {
        var doc = document.documentElement;
        doc.setAttribute('data-useragent', navigator.userAgent);
        var w = $(window).width();
    };
    Iteration0.prototype.AddControl = function (control) {
        control.app = this;
        //control.Start();
    };
    Iteration0.prototype.ShowFrozenScreen = function () {
        if (this.backScreen == null) {
            this.backScreen = $('#frozen_screen_layer');
            //this.backScreen.click((e => {this.HideUnfreezeControls()));
        }
        this.backScreen.css("width", "100%");
        this.backScreen.css("height", '100%');
        this.backScreen.show();
        $('html, body').css({ overflow: 'hidden', height: '100%' });
    };
    Iteration0.prototype.HideFrozenScreen = function () {
        if (this.backScreen != null)
            $('html, body').css({
                overflow: 'auto',
                height: 'auto'
            });
        this.backScreen.hide();
    };
    Iteration0.prototype.HideUnfreezeControls = function () {
        $('#app_pop_up1,#app_pop_up98,#app_pop_up99').hide();
        this.HideFrozenScreen();
    };
    Iteration0.prototype.ShowAlert = function (message) {
        new PopUpUIControl("Alert", message, 99, this).ShowOk();
    };
    Iteration0.prototype.ShowCustomMessage = function (html, title, okDelegate, cancelDelegate, okContext, cancelContext) {
        new PopUpUIControl(title, html, 98, this).ShowOkCancel(okDelegate, cancelDelegate, okContext, cancelContext);
    };
    Iteration0.prototype.ShowConfirmationMessage = function (message, title, okDelegate, cancelDelegate) {
        this.ShowCustomMessage(message, title, okDelegate, cancelDelegate, null, null);
    };
    Iteration0.prototype.GeneratePDFForUseCasesSpecificationsWith = function (jsPDF, projectID) {
        this.pendingjsPDF = jsPDF;
        var proxyControl = new PopUpUIControl("Proxy", "", 99, this);
        var context = this;
        proxyControl.AjaxCall(this.LoadDocumentURL, JSON.stringify({ ProjectID: projectID, PDFType: PDFEnumType.UseCases }), this.OnViewModelLoaded, context);
    };
    Iteration0.prototype.GeneratePDFForUISpecificationsWith = function (jsPDF, projectID) {
        this.pendingjsPDF = jsPDF;
        var proxyControl = new PopUpUIControl("Proxy", "", 99, this);
        var context = this;
        proxyControl.AjaxCall(this.LoadDocumentURL, JSON.stringify({ ProjectID: projectID, PDFType: PDFEnumType.UIs }), this.OnViewModelLoaded, context);
    };
    Iteration0.prototype.GeneratePDFForConceptGlossaryWith = function (jsPDF, projectID) {
        this.pendingjsPDF = jsPDF;
        var proxyControl = new PopUpUIControl("Proxy", "", 99, this);
        var context = this;
        proxyControl.AjaxCall(this.LoadDocumentURL, JSON.stringify({ ProjectID: projectID, PDFType: PDFEnumType.Glossary }), this.OnViewModelLoaded, context);
    };
    Iteration0.prototype.OnViewModelLoaded = function (response, scope, context) {
        if (response.Content != undefined) {
            new PDFGenerator(response, context.pendingjsPDF).Download();
        }
        else {
            context.ShowAlert(response);
        }
    };
    return Iteration0;
}());
//      Project View Model Classes
var documentViewModel = /** @class */ (function () {
    function documentViewModel() {
    }
    return documentViewModel;
}());
var DocSectionViewModel = /** @class */ (function () {
    function DocSectionViewModel() {
    }
    return DocSectionViewModel;
}());
var ProjectEditorViewModel = /** @class */ (function () {
    function ProjectEditorViewModel() {
        this.Definition = new ProjectDefinitionFormViewModel();
    }
    return ProjectEditorViewModel;
}());
var ProjectDefinitionFormViewModel = /** @class */ (function () {
    function ProjectDefinitionFormViewModel() {
    }
    return ProjectDefinitionFormViewModel;
}());
var ProjectContextTypeViewModel = /** @class */ (function () {
    function ProjectContextTypeViewModel() {
    }
    return ProjectContextTypeViewModel;
}());
var ProjectContextViewModel = /** @class */ (function () {
    function ProjectContextViewModel() {
    }
    return ProjectContextViewModel;
}());
var AnalysisMatrixViewModel = /** @class */ (function () {
    //VariationPoints: Array<ProjectContextTypeViewModel>;
    function AnalysisMatrixViewModel() {
        this.ProjectProducts = [];
    }
    return AnalysisMatrixViewModel;
}());
var ProductAlternativeViewModel = /** @class */ (function () {
    function ProductAlternativeViewModel() {
    }
    return ProductAlternativeViewModel;
}());
var VersionEditorViewModel = /** @class */ (function () {
    function VersionEditorViewModel() {
        this.Definition = new VersionViewModel();
        this.ProjectProducts = [];
    }
    return VersionEditorViewModel;
}());
var VersionViewModel = /** @class */ (function () {
    function VersionViewModel() {
    }
    return VersionViewModel;
}());
var RequirementViewModel = /** @class */ (function () {
    function RequirementViewModel() {
    }
    return RequirementViewModel;
}());
var RessourceDefinitionViewModel = /** @class */ (function () {
    function RessourceDefinitionViewModel() {
    }
    return RessourceDefinitionViewModel;
}());
var RessourceAssociationViewModel = /** @class */ (function () {
    function RessourceAssociationViewModel() {
    }
    return RessourceAssociationViewModel;
}());
var DomainConceptEditorViewModel = /** @class */ (function () {
    function DomainConceptEditorViewModel() {
        this.Definition = new RessourceDefinitionViewModel();
    }
    return DomainConceptEditorViewModel;
}());
var UseCaseEditorViewModel = /** @class */ (function () {
    function UseCaseEditorViewModel() {
        this.Definition = new RessourceDefinitionViewModel();
    }
    return UseCaseEditorViewModel;
}());
var UIComponentEditorViewModel = /** @class */ (function () {
    function UIComponentEditorViewModel() {
        this.Definition = new RessourceDefinitionViewModel();
    }
    return UIComponentEditorViewModel;
}());
var ItemViewModel = /** @class */ (function () {
    function ItemViewModel(Name, Id) {
        this.Label = Name;
        this.KeyValue = Id;
    }
    return ItemViewModel;
}());
var ViewModelAPI = /** @class */ (function () {
    function ViewModelAPI() {
    }
    return ViewModelAPI;
}());
var BoardEditorViewModel = /** @class */ (function () {
    function BoardEditorViewModel() {
    }
    return BoardEditorViewModel;
}());
var BoardPoolViewModel = /** @class */ (function () {
    function BoardPoolViewModel() {
    }
    return BoardPoolViewModel;
}());
var BoardPoolStepViewModel = /** @class */ (function () {
    function BoardPoolStepViewModel() {
    }
    return BoardPoolStepViewModel;
}());
var BoardItemViewModel = /** @class */ (function () {
    function BoardItemViewModel() {
    }
    return BoardItemViewModel;
}());
///////////////////////////////////////////////////
var PDFEnumType;
(function (PDFEnumType) {
    PDFEnumType[PDFEnumType["unknown"] = 0] = "unknown";
    PDFEnumType[PDFEnumType["UseCases"] = 1] = "UseCases";
    PDFEnumType[PDFEnumType["UIs"] = 2] = "UIs";
    PDFEnumType[PDFEnumType["Glossary"] = 3] = "Glossary";
})(PDFEnumType || (PDFEnumType = {}));
;
var RessourceEnumType;
(function (RessourceEnumType) {
    RessourceEnumType[RessourceEnumType["unknown"] = 0] = "unknown";
    RessourceEnumType[RessourceEnumType["Domain"] = 1] = "Domain";
    RessourceEnumType[RessourceEnumType["UseCase"] = 2] = "UseCase";
    RessourceEnumType[RessourceEnumType["Component"] = 3] = "Component";
    RessourceEnumType[RessourceEnumType["Infrastructure"] = 4] = "Infrastructure";
})(RessourceEnumType || (RessourceEnumType = {}));
;
var AssociationEnumType;
(function (AssociationEnumType) {
    AssociationEnumType[AssociationEnumType["unknown"] = 0] = "unknown";
    AssociationEnumType[AssociationEnumType["HasOne"] = 1] = "HasOne";
    AssociationEnumType[AssociationEnumType["HasMany"] = 2] = "HasMany";
})(AssociationEnumType || (AssociationEnumType = {}));
;
var EventEnumType;
(function (EventEnumType) {
    EventEnumType[EventEnumType["unknown"] = 0] = "unknown";
    EventEnumType[EventEnumType["Create"] = 1] = "Create";
    EventEnumType[EventEnumType["Update"] = 2] = "Update";
    EventEnumType[EventEnumType["Delete"] = 3] = "Delete";
})(EventEnumType || (EventEnumType = {}));
;
var RequirementEnumType;
(function (RequirementEnumType) {
    RequirementEnumType[RequirementEnumType["unknown"] = 0] = "unknown";
    RequirementEnumType[RequirementEnumType["Default"] = 1] = "Default";
    RequirementEnumType[RequirementEnumType["LogicAlternative"] = 2] = "LogicAlternative";
    RequirementEnumType[RequirementEnumType["UIAlternative"] = 3] = "UIAlternative";
    RequirementEnumType[RequirementEnumType["Scenario"] = 4] = "Scenario";
    RequirementEnumType[RequirementEnumType["Screen"] = 5] = "Screen";
    RequirementEnumType[RequirementEnumType["Field"] = 6] = "Field";
})(RequirementEnumType || (RequirementEnumType = {}));
;
var ContextEnumType;
(function (ContextEnumType) {
    ContextEnumType[ContextEnumType["unknown"] = 0] = "unknown";
    ContextEnumType[ContextEnumType["DomainContext"] = 1] = "DomainContext";
    ContextEnumType[ContextEnumType["BusinessProcess"] = 2] = "BusinessProcess";
    ContextEnumType[ContextEnumType["Feature"] = 3] = "Feature";
    ContextEnumType[ContextEnumType["VariationPoint"] = 4] = "VariationPoint";
})(ContextEnumType || (ContextEnumType = {}));
;
var VersionEnumType;
(function (VersionEnumType) {
    VersionEnumType[VersionEnumType["unknown"] = 0] = "unknown";
    VersionEnumType[VersionEnumType["Planned"] = 1] = "Planned";
    VersionEnumType[VersionEnumType["InProgress"] = 2] = "InProgress";
    VersionEnumType[VersionEnumType["Completed"] = 3] = "Completed";
    VersionEnumType[VersionEnumType["Released"] = 4] = "Released";
})(VersionEnumType || (VersionEnumType = {}));
;
var MonthOptions = new Array();
MonthOptions.push(new ItemViewModel("January", "1"));
MonthOptions.push(new ItemViewModel("February", "2"));
MonthOptions.push(new ItemViewModel("March", "3"));
MonthOptions.push(new ItemViewModel("April", "4"));
MonthOptions.push(new ItemViewModel("May", "5"));
MonthOptions.push(new ItemViewModel("June", "6"));
MonthOptions.push(new ItemViewModel("July", "7"));
MonthOptions.push(new ItemViewModel("August", "8"));
MonthOptions.push(new ItemViewModel("September", "9"));
MonthOptions.push(new ItemViewModel("October", "10"));
MonthOptions.push(new ItemViewModel("November", "11"));
MonthOptions.push(new ItemViewModel("December", "12"));
var YearOptions = new Array();
YearOptions.push(new ItemViewModel("2018", "2018"));
YearOptions.push(new ItemViewModel("2019", "2019"));
YearOptions.push(new ItemViewModel("2020", "2020"));
YearOptions.push(new ItemViewModel("2021", "2021"));
YearOptions.push(new ItemViewModel("2022", "2022"));
YearOptions.push(new ItemViewModel("2023", "2023"));
YearOptions.push(new ItemViewModel("2024", "2024"));
YearOptions.push(new ItemViewModel("2025", "2025"));
var PriorityLevels = new Array();
PriorityLevels.push(new ItemViewModel("Low", "1"));
PriorityLevels.push(new ItemViewModel("Medium", "2"));
PriorityLevels.push(new ItemViewModel("High", "3"));
PriorityLevels.push(new ItemViewModel("Urgent", "4"));
PriorityLevels.push(new ItemViewModel("Mandatory/Scope", "5"));
var PrecisionScale = new Array();
PrecisionScale.push(new ItemViewModel("Slightly Precise", "1"));
PrecisionScale.push(new ItemViewModel("Moderately Precise", "2"));
PrecisionScale.push(new ItemViewModel("Precise", "3"));
PrecisionScale.push(new ItemViewModel("Very Precise", "4"));
PrecisionScale.push(new ItemViewModel("Extremely Precise", "5"));
var ScaleOptions = new Array();
ScaleOptions.push(new ItemViewModel("Aggregate", "1"));
ScaleOptions.push(new ItemViewModel("Default", "2"));
var StepOptions = new Array();
StepOptions.push(new ItemViewModel("Step 1", "1"));
StepOptions.push(new ItemViewModel("Step 2", "2"));
StepOptions.push(new ItemViewModel("Step 3", "3"));
StepOptions.push(new ItemViewModel("Step 4", "4"));
StepOptions.push(new ItemViewModel("Step 5", "5"));
var VersionStatusOptions = new Array();
VersionStatusOptions.push(new ItemViewModel("Planned", "1"));
VersionStatusOptions.push(new ItemViewModel("In Progress", "2"));
VersionStatusOptions.push(new ItemViewModel("Completed", "3"));
VersionStatusOptions.push(new ItemViewModel("Released", "4"));
var CardinalityOptions = new Array();
CardinalityOptions.push(new ItemViewModel("Has One", "1"));
CardinalityOptions.push(new ItemViewModel("Has Many", "2"));
//# sourceMappingURL=Iteration0.js.map