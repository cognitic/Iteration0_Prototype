/// <reference path="Iteration0/Scripts/jquery.d.ts" />
declare enum EditorType {
    DEF = 1,
    REQ = 2,
}
declare class UIControl {
    app: Iteration0;
    type: string;
    title: string;
    wrapperID: string;
    startURL: string;
    saveURL: string;
    wrapper: JQuery;
    contentWrapper: JQuery;
    tableHtmlTemplate: string;
    constructor(ControlType: string, htmlWrapperID: string);
    Show(): void;
    Hide(): void;
    Start(): void;
    Save(): void;
    AjaxCall(postURL: string, JSONData: string, callBackFunction: any, callBackParameter?: any, httpMethod?: string, loadingMessage?: string): void;
    BuildHtmlTable(firstRow: number, firstCol: number, lastRow: number, lastCol: number, data: any[], filterCol?: number, filterValue?: any, colFlasher?: any[], extradata?: any[], extraHeader?: string): string;
    BuildHtmlDataTable(data: any[]): string;
    BuildLinksFromContent(contentHolder: JQuery, linkLabel: String, templateStart: String, linkClass: String, IsURL: Boolean): void;
    preventEnterSubmit(e: any): boolean;
    DesactivateButton(buttons: JQuery): void;
    ReActivateButton(button: JQuery, OnCLickDelegate: any): void;
    CentralizeOnWindow(WindowElement: JQuery): void;
    UpdateDropDownsWith(kpiDropdowns: JQuery, dropdownData: any, kpiValue: any): void;
    UpdateDropDownWith(kpiDropdown: JQuery, dropdownData: any, kpiValue: any): void;
    FilterArrayWith(ValueKeyData: any, FilterKey: Number, FilterIndex?: number): any[];
    SearchIndexOf(ValueKeyData: any, SearchKey: Number, SearchIndex?: number): number;
    ConvertDateToArray(d: Date): number[];
    DisableFields(fields: JQuery): void;
    EnableFields(fields: JQuery): void;
    UpdateFielsdWith(fields: string[], dataSource: any): void;
    UpdateFieldWith(kpiField: JQuery, kpiValue: any): void;
    SumFields(fields: JQuery): number;
    UploadFileTo(controllerURL: any, modelId: any, callBackFunction: any, callBackParameter?: any): boolean;
    GenerateNumericList(min: number, max: number, IsKeyValue: Boolean): any[];
}
declare class DomainConceptEditorUIControl extends UIControl {
    domainConcept: DomainConceptEditorViewModel;
    references: any[];
    constructor(domainConceptDef: DomainConceptEditorViewModel, editorReferences: any[]);
    Start(): void;
}
declare class DomainConceptEditorViewModel {
    ItemCounter: number;
    CurrencyID: string;
    Date1Date: number[];
    HasFormulaOff: boolean;
}
declare class PopUpUIControl extends UIControl {
    titleZone: JQuery;
    buttonZone: JQuery;
    title: string;
    contentId: string;
    popupId: string;
    contentHtmlCache: string;
    buttonIDOK: string;
    buttonIDCancel: string;
    buttonHtmlOK: string;
    buttonHtmlCancel: string;
    PopUpTemplate: string;
    constructor(controlTitle: string, controlContentId: string, zIndex: number);
    Show(): void;
    ShowOk(): void;
    ShowOkCancel(okDelegate: any, cancelDelegate: any, okContext: any, cancelContext: any): void;
    Hide(): void;
    Appear(): void;
    ClearContent(): void;
}
declare class ProjectEditorUIControl extends UIControl {
    project: ProjectEditorViewModel;
    editorURL: string;
    saveURL: string;
    constructor(formProject: ProjectEditorViewModel);
    Start(): void;
    UpdateFields(): void;
    ShowProjectDefinitionForm(): void;
    OnProjectDefinitionSaveClick(context: any): void;
    OnProjectDefinitionSaved(response: any, context: any): void;
}
declare class ProjectEditorViewModel {
    ProjectID: number;
    Name: string;
    CodeName: string;
}
declare class UseCaseEditorUIControl extends UIControl {
    useCase: UseCaseEditorViewModel;
    references: any[];
    SubmediaYearReferences: any[];
    yearDataURL: string;
    saveInsertionURL: string;
    referencesFields: string[];
    detailsFields: string[];
    costFields: string[];
    constructor(useCaseDef: UseCaseEditorViewModel, editorReferences: any[]);
    Start(): void;
    ShowEditor(): boolean;
    OnMediaChange(mediaID: any): void;
    SetDefaultValues(): void;
    ResetInsertion(insertion: UseCaseEditorViewModel): void;
    UpdateFields(fields: string[], dataSource: UseCaseEditorViewModel, suffix?: string): void;
    OnSaveClick(): void;
    OnAjaxSaved(response: any, context: UseCaseEditorUIControl): void;
    GoTOInsertionList(): void;
}
declare class UseCaseEditorViewModel {
    ItemCounter: number;
    CurrencyID: string;
    Date1Date: number[];
    HasFormulaOff: boolean;
}
declare class UIComponentEditorUIControl extends UIControl {
    uIComponent: UIComponentEditorViewModel;
    references: any[];
    constructor(uIComponentDef: UIComponentEditorViewModel, editorReferences: any[]);
    Start(): void;
}
declare class UIComponentEditorViewModel {
    ItemCounter: number;
    CurrencyID: string;
    Date1Date: number[];
    HasFormulaOff: boolean;
}
declare class Iteration0 {
    backScreen: JQuery;
    constructor();
    Start(): void;
    AddControl(control: any): void;
    ShowFrozenScreen(): void;
    HideFrozenScreen(): void;
    HideUnfreezeControls(): void;
    ShowAlert(message: string): void;
    ShowCustomMessage(html: string, title: string, okDelegate: any, cancelDelegate: any, okContext: any, cancelContext: any): void;
    ShowConfirmationMessage(message: string, title: string, okDelegate: any, cancelDelegate: any): void;
}
