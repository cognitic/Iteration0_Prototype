/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>
/// <reference path='PopUpUIControl.ts'/>
/// <reference path='ProjectEditor.ts'/>
/// <reference path='DomainConceptEditor.ts'/>
/// <reference path='UseCaseEditor.ts'/>
/// <reference path='UIComponentEditor.ts'/>
/// <reference path='BoardEditor.ts'/>

class Iteration0{     
    backScreen: JQuery;      
    constructor() {
    }
    Start() {
        var doc = document.documentElement;
        doc.setAttribute('data-useragent', navigator.userAgent);
        var w = $(window).width();
    }    
    public AddControl(control: RequirementUIControl) {
        control.app = this;
        control.Start();
    }
    public ShowFrozenScreen() {
        if (this.backScreen == null) {
            this.backScreen = $('#frozen_screen_layer');
            //this.backScreen.click((e => {this.HideUnfreezeControls()));
        }
        this.backScreen.css("width", "100%"); this.backScreen.css("height", '100%');
        this.backScreen.show();
        $('html, body').css({ overflow: 'hidden', height: '100%' });
    }
    public HideFrozenScreen() {
        if (this.backScreen != null)
            $('html, body').css({
                overflow: 'auto',
                height: 'auto'
            });
            this.backScreen.hide();
    }
    public HideUnfreezeControls() {
        $('#app_pop_up1,#app_pop_up98,#app_pop_up99').hide();
        this.HideFrozenScreen();
    }
    public ShowAlert(message: string) {
        new PopUpUIControl("Alert", message, 99, this).ShowOk();
    }
    public ShowCustomMessage(html: string, title: string, okDelegate, cancelDelegate, okContext: any, cancelContext: any) {
        new PopUpUIControl(title, html, 98, this).ShowOkCancel(okDelegate, cancelDelegate, okContext, cancelContext);
    }
    public ShowConfirmationMessage(message: string, title: string, okDelegate, cancelDelegate) {
        this.ShowCustomMessage(message, title, okDelegate, cancelDelegate, null, null)
    }
}
//
//      Project View Model Classes
class ProjectEditorViewModel {
    DomainContextId: number;
    BusinessProcessesId: number;
    FeaturesId: number;
    Definition: ProjectDefinitionFormViewModel;
    VariationPoints: Array<ProjectContextTypeViewModel>;
    DomainContexts: Array<ProjectContextViewModel>;
    BusinessProcesses: Array<ProjectContextViewModel>;
    Features: Array<ProjectContextViewModel>;
    Products: Array<ItemViewModel>;
    constructor() {
        this.Definition = new ProjectDefinitionFormViewModel();
    }     
}
class ProjectDefinitionFormViewModel {
    ProjectID: number;
    Title: string;
    CodeName: string;
    Brief: string;
    IsPrivateOnly: boolean;
}
class ProjectContextTypeViewModel {
    ContextTypeID: number;
    ContextEnumType: number;
    Name: string;
    ScaleOrder: number;
    Contexts: Array<ProjectContextViewModel>;
}
class ProjectContextViewModel {
    ContextID: number;
    ContextTypeID: number;
    Name: string;
    CodeName: string;
    Comment: string;
    SortOrder: number;
}
class VersionEditorViewModel {
    ProjectID: number;
    Definition: VersionViewModel;
    ProductRequirements: Array<RequirementViewModel>;
    ProjectProducts: Array<ItemViewModel>;
    constructor() {
        this.Definition = new VersionViewModel();
        this.ProjectProducts = [];
    }
}
class VersionViewModel {
    VersionID: number;
    ProductID: number;
    ProductName: string;
    NumberName: string;
    NickName: string;
    Summary: string;
    VersionEnumType: number;
    ReleasedMonth: number;
    ReleasedYear: number;
    Requirements: Array<ItemViewModel>;
}
class RequirementViewModel {
    RequirementID: number;
    RessourceID: number;
    RequirementEnumType: number;
    Priority: number;
    Title: string;
    Description: string;
    Attribute1Value: string;
    Attribute2Value: string;
    Attribute3Value: string;
    Attribute4Value: string;
    Attribute5Value: string;
    Variants: Array<ItemViewModel>;
    WorkItemURL: string;
}
class RessourceDefinitionViewModel {
    RessourceID: number;
    RessourceEnumType: number;
    Name: string;
    Definition: string;
    ScaleOrder: number;
    StepOrder: number;
    SortOrder: number;    
    ContextID: number;
    ContextName: string;
}
class RessourceAssociationViewModel {
    AssociationId: number;
    AssociationEnumType: number;
    ParentID: number;
    RessourceID: number;
    CustomName: string;
}
class DomainConceptEditorViewModel {
    ProjectID: number;
    Definition: RessourceDefinitionViewModel;
    Attributes: Array<RessourceAssociationViewModel>;
    HasOneAssociations: Array<RessourceAssociationViewModel>
    HasManyAssociations: Array<RessourceAssociationViewModel>
    Operations: Array<RessourceAssociationViewModel>;
    ProjectConcepts: Array<ItemViewModel>;
    ProjectDomainContexts: Array<ItemViewModel>;
    constructor() {
        this.Definition = new RessourceDefinitionViewModel();
    }     
}
class UseCaseEditorViewModel {
    ProjectID: number;
    Definition: RessourceDefinitionViewModel;
    Scenarios: Array<RequirementViewModel>;
    UISteps: Array<RessourceAssociationViewModel>
    Requirements: Array<RequirementViewModel>;
    VariationPoints: Array<ProjectContextTypeViewModel>;
    ProjectBusinessProcesses: Array<ItemViewModel>;
    constructor() {
        this.Definition = new RessourceDefinitionViewModel();
    }     
}
class UIComponentEditorViewModel {
    ProjectID: number;
    Definition: RessourceDefinitionViewModel;
    Screens: Array<RequirementViewModel>;
    Fields: Array<RequirementViewModel>;
    Requirements: Array<RequirementViewModel>;
    VariationPoints: Array<ProjectContextTypeViewModel>;
    ProjectFeatures: Array<ItemViewModel>;
    constructor() {
        this.Definition = new RessourceDefinitionViewModel();
    }     
}
class ItemViewModel {
    ParentKeyValue: string;
    KeyValue: string;
    Label: string;
    Tooltip: string;
    Code: string;
    SortOrder: number;
    constructor(Name: string, Id: string) {
        this.Label = Name;
        this.KeyValue = Id;
    }     
}
class ViewModelAPI {
    ItemEditorURL: string;
    ItemSaveURL: string;
    ItemRemoveURL: string;
}
class BoardEditorViewModel {
    ProjectID: number;
    ItemType: RessourceEnumType;
    Pools: Array<BoardPoolViewModel>;
    ProjectPools: Array<ItemViewModel>;
}
class BoardPoolViewModel {
    //PoolID: number;
    PoolName: String;
    Steps: Array<BoardPoolStepViewModel>;
}
class BoardPoolStepViewModel {
    Scale1Items: Array<BoardItemViewModel>;
    Scale2Items: Array<BoardItemViewModel>;
}
class BoardItemViewModel {
    ItemID: number;
    PoolID: number;
    Name: string;
    ItemType: number;
    ScaleOrder: number;
    StepOrder: number;
    SortOrder: number;   
} 

///////////////////////////////////////////////////


enum RessourceEnumType { unknown = 0, Domain = 1, UseCase = 2, Component = 3, Infrastructure = 4 };
enum AssociationEnumType { unknown = 0, HasAttribute = 1, HasOne = 2, HasMany = 3, AggregatesWith = 4, OperatesOn = 5, HasActor = 6, UseInfrastructure = 7, HasFeatureFor = 8 };
enum EventEnumType { unknown = 0, Create = 1, Update = 2, Delete = 3 };
enum RequirementEnumType { unknown = 0, Rule = 1, Scenario = 2, Field = 3, Screen = 3 };
enum ContextEnumType { unknown = 0, DomainContext = 1, BusinessProcess = 2, Feature = 3, RequirementVariation = 4 };
enum VersionEnumType { unknown = 0, Planned = 1, InProgress = 2, Completed = 3, Released = 4 };
const MonthOptions = new Array<ItemViewModel>();
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
const YearOptions = new Array<ItemViewModel>();
YearOptions.push(new ItemViewModel("2018", "2018"));
YearOptions.push(new ItemViewModel("2019", "2019"));
YearOptions.push(new ItemViewModel("2020", "2020"));
YearOptions.push(new ItemViewModel("2021", "2021"));
YearOptions.push(new ItemViewModel("2022", "2022"));
YearOptions.push(new ItemViewModel("2023", "2023"));
YearOptions.push(new ItemViewModel("2024", "2024"));
YearOptions.push(new ItemViewModel("2025", "2025"));
var PriorityLevels = new Array<ItemViewModel>();
PriorityLevels.push(new ItemViewModel("Low", "1"));
PriorityLevels.push(new ItemViewModel("Medium", "2"));
PriorityLevels.push(new ItemViewModel("High", "3"));
PriorityLevels.push(new ItemViewModel("Urgent", "4"));
var PrecisionScale = new Array<ItemViewModel>();
PrecisionScale.push(new ItemViewModel("Slightly Precise", "1"));
PrecisionScale.push(new ItemViewModel("Moderately Precise", "2"));
PrecisionScale.push(new ItemViewModel("Precise", "3"));
PrecisionScale.push(new ItemViewModel("Very Precise", "4"));
PrecisionScale.push(new ItemViewModel("Extremely Precise", "5"));
var ScaleOptions = new Array<ItemViewModel>();
ScaleOptions.push(new ItemViewModel("Aggregate", "1"));
ScaleOptions.push(new ItemViewModel("Default", "2"));
var StepOptions = new Array<ItemViewModel>();
StepOptions.push(new ItemViewModel("Step 1", "1"));
StepOptions.push(new ItemViewModel("Step 2", "2"));
StepOptions.push(new ItemViewModel("Step 3", "3"));
StepOptions.push(new ItemViewModel("Step 4", "4"));
StepOptions.push(new ItemViewModel("Step 5", "5"));
var VersionStatusOptions = new Array<ItemViewModel>();
VersionStatusOptions.push(new ItemViewModel("Planned", "1"));
VersionStatusOptions.push(new ItemViewModel("In Progress", "2"));
VersionStatusOptions.push(new ItemViewModel("Completed", "3"));
VersionStatusOptions.push(new ItemViewModel("Released", "4"));
