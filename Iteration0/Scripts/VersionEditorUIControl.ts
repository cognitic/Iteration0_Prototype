﻿/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      VersionEditorUIControl
//
class VersionEditorUIControl extends RequirementUIControl {
    version: VersionEditorViewModel;
    versionsWrapper: JQuery;
    versionSaveURL: string = "/Project/CreateEditProjectVersionWith";
    removeVersionURL: string = "/Project/RemoveProjectVersion";
    versionRequirementSaveURL: string = "/Project/CreateEditVersionRequirementWith";
    removeVersionRequirementURL: string = "/Project/RemoveVersionRequirement";

    constructor(formVM: VersionEditorViewModel) {
        super("VersionEditorUIControl", "#editor");
        this.ProjectID = formVM.ProjectID;  
        this.version = formVM;
        this.versionsWrapper = $("#editor-version-requirement-wrapper");
        this.Start();
    }
    public Start() {
        this.Build();
    }
    public Build() {
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            this.BuildScopeFilter();
            this.UpdateRequirementTable();
        }
        $("#edit-definition-link").click((e => { this.ShowEditDefinitionForm(); return false }));
        $('#app-page-main-action-button').click((e => { this.ShowVersionRequirementSelectForm(); return false }));
        $(".requirement-view-tab").click((e => { this.ShowRequirementsView(parseInt($(e.target).attr('viewIndex'))); return false }));
    }
    public BuildDefinition() {
        $(".editor-header-bubble-definition").html((this.FieldIsBlank(this.version.Definition.Summary)) ? "No<br/>Definition<br/>yet" : this.version.Definition.Summary.replace(/\n/gim, "<br/>"));
        $(".editor-header-bubble-title").html(this.version.Definition.NumberName + ' - ' + this.version.Definition.NickName);
    }
    public ShowRequirementsView(viewIndex: number) {
        $(".requirement-view-tab").removeClass("active");
        $(".requirement-view-tab[viewIndex='" + viewIndex + "']" ).addClass("active");
        this.UpdateRequirementTable();
    }
    //public BuildScopeFilterHtmlFor(requirements: Array<RequirementViewModel>): string {
    //    var html = '<select class="form-control contextSelector" name= "project-selector" id= "version-context-selector" > ';
    //    html += '<option value="1" selected= ""> Version Scope &nbsp; </option>';
    //    var requirementsGroup = this.GroupBy(requirements, "ScopeSummary");
    //    jQuery.each(Object.keys(requirementsGroup), function () {
    //        html += ((this == '') ? '<option value="0"> [Default]' : '<option value="' + this + '">' + this) + ' &nbsp; </option>';
    //    });
    //    html += '</select>';
    //    return html;
    //}
    public BuildScopeFilter() {
        this.version.ProductAlternatives.push(new ItemViewModel("[ Default ]", "-1"));
        this.version.ProductAlternatives.push(new ItemViewModel("[ ALL SCOPES ]", "0"));
        $("#editor-view-filter").html("<div class='filter-selector'>"+this.BuildDropDownHtmlWith("version-context-selector", this.version.ProductAlternatives, "Select Scope", "0") +"</div>" );
        $('#version-context-selector').change((e => { this.UpdateRequirementTable(); }));
    }
    public ShowNewDefinitionForm(ProjectID: number, ProjectProducts: Array<ItemViewModel>) {
        var newVM = new VersionViewModel(); newVM.VersionID = -1; newVM.ProductID = -1; newVM.NumberName = "V#.#"; newVM.NickName = "No Name"; newVM.Summary = "";
        newVM.VersionEnumType = VersionEnumType.Planned; newVM.ReleasedYear = 2019; newVM.ReleasedMonth = 12;
        this.ProjectID = ProjectID;
        this.version.Definition = newVM;
        this.version.ProjectProducts = ProjectProducts;
        if (this.version.ProjectProducts.length == 0) {
            this.app.ShowAlert("Please set project products first");
        } else {
            this.ShowDefinitionForm(this.version.Definition);
        }
    }
    public ShowEditDefinitionForm() {
        this.ShowDefinitionForm(this.version.Definition);
    }
    public BuildRequirementTableWith(requirements: Array<RequirementViewModel>): string {
        var html = '';
        var tabIndex: number = parseInt($(".requirement-view-tab.active").attr('viewIndex'));
        var requirementsGroup = (tabIndex == 1) ? this.GroupBy(requirements, "UseCaseID") : this.GroupBy(requirements, "UIID");
        if (Object.keys(requirementsGroup).length > 0) {
            html = '<div>'; var Context = this;
            jQuery.each(Object.keys(requirementsGroup), function () {
                var first = requirementsGroup[this][0];
                var rowSpan = 'rowSpan="' + requirementsGroup[this].length.toString() +'"';
                if (tabIndex == 1) {
                    html += '<tr><td ' + rowSpan + '><a href="/Project/UseCaseEditor?FunctionID=' + first.UseCaseID + '" class="b u">@UC ' + first.UseCaseID + '</a></td>';
                } else {
                    var UI = Context.FieldIsBlank(first.UI) ? "No UI" : '<a href="/Project/UIComponentEditor?ComponentID=' + first.UIID + '" class="b u">@' + first.UI + '</a>';
                    html += '<td ' + rowSpan + '>' + UI + '</td>';
                }
                var rowIndex = 0;
                jQuery.each(requirementsGroup[this], function () {
                    html += (rowIndex > 0)? '<tr>' : '';
                    html += '<td><div><div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '"># ' + this.RequirementID + '</a></div></div></td>';
                    html += '<td><div><span class="b">' + this.Behavior + '</span> <br> ' + this.Description + '</div></td>';
                    html += '<td><div><a class="remove-version-requirement-link u action-link" linkID="' + this.RequirementID + '">Remove</a></div></td>';
                    html += '</tr>';
                    rowIndex += 1;
                });
            });
            html += '</div>';
        } else {
            html = '<tr><td colspan="4">No Selected Behaviors yet</td></tr>';
        }
        return html;
    }
    public UpdateRequirementTable() {
        var alternativeId = $("#version-context-selector").val();
        if (alternativeId == 'undefined') { alternativeId = '0'; $("#version-context-selector").val(alternativeId); }
        var filterRequirements = this.FilterRequirementWithinAlternativesScope(this.version.SelectedRequirements, this.version.ProductAlternatives, alternativeId);        
        $('table.requirements tbody').html(this.BuildRequirementTableWith(filterRequirements));
        $(".remove-version-requirement-link").click((e => { this.ShowRemoveVersionRequirementForm(parseInt($(e.target).attr('linkID'))); return false }));
    }
    public ShowRemoveVersionForm(versionID: Number) {
        this.removePendingID = versionID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Version", this.OnRequirementRemoveClick, null, this, null);
    }
    public OnVersionRequirementClick(context: VersionEditorUIControl) {
        context.AjaxCall(context.removeVersionURL, JSON.stringify({ versionID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowDefinitionForm(version: VersionViewModel) {
        var title = ((version.VersionID > 0) ? "Edit Version Definition" : "Define New Version"); 
        var formHtml = "<div class='form-element-group'><div><label >Product : </label></div><div>" + this.BuildDropDownHtmlWith("formProduct", this.version.ProjectProducts, "Select Product", version.ProductID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Number : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + version.NumberName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Nickname : </label></div><div><input type='text' id='formNickName' class='texttype' maxlength='50' style='width: 300px;' value='" + version.NickName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Goal : </label></div><div><textarea id='formDefGoal' type='textarea' name='textarea-goal' maxlength='1000' style='width: 300px; Height:100px;' placeholder='Benefits and reasons for creating this version'>" + this.version.Definition.Summary + "</textarea></div></div>";
        //formHtml += "<div class='form-element-group'><div><label >Code Name # : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='20' style='width: 200px;' value='" + this.version.Definition.CodeName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Status : </label></div><div>" + this.BuildDropDownHtmlWith("formStatus", VersionStatusOptions, "Select Status", version.VersionEnumType.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Released Month : </label></div><div>" + this.BuildDropDownHtmlWith("formMonth", MonthOptions, "Select Month", version.ReleasedMonth.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Released Year : </label></div><div>" + this.BuildDropDownHtmlWith("formYear", YearOptions, "Select Year", version.ReleasedYear.toString()) + "</div></div>";
            //formHtml += "<div class='filter-group'><label >Is Only Visible By Owner : </label><input type='checkbox' id='IsPrivateCB'></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        return false;
    }
    public OnDefinitionSaveClick(context: VersionEditorUIControl) {
        var VM = new VersionViewModel();
        VM.ProductID = parseInt($.trim($("#formProduct").val()));
        VM.NumberName = $.trim($("#formDefName").val()); VM.NickName = $.trim($("#formNickName").val()); VM.Summary = $.trim($("#formDefGoal").val());
        VM.VersionEnumType = parseInt($.trim($("#formStatus").val()));
        VM.ReleasedMonth = parseInt($.trim($("#formMonth").val()));
        VM.ReleasedYear = parseInt($.trim($("#formYear").val()));

        var isOK = true;
        if ((context.FieldIsBlank(VM.NumberName))) { isOK = false; context.app.ShowAlert("Number is mandatory !"); }
        if ((context.FieldIsBlank(VM.ProductID))) { isOK = false; context.app.ShowAlert("Product is mandatory !"); }
        if ((context.FieldIsBlank(VM.VersionEnumType))) { isOK = false; context.app.ShowAlert("Status is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: context.version.Definition, ProjectID: context.ProjectID  }), context.OnEditorSaved, context);
        }
    }
    public ShowVersionRequirementSelectForm() {
        var Context = this;
        var title = "Select Behaviors";
        if (this.version.PendingProductRequirements.length > 0) {
            var html = '';
            html += '<span class="filter-selector popup-filter " >' + this.BuildDropDownHtmlWith("version-context-selector", this.version.ProductAlternatives, "Select Scope", "0") + '</span>';
            html += '<div><div style="height: 460px; overflow-y: scroll;"><div class="column-list">';
            html += '</div></div></div>';
            html += '<div style="padding-left:10px;"><input class="allcb" type="checkbox"> ALL </div>';
        } else {
            html = '<div class="tac">No Requirements available</div>';
        }
        this.app.ShowCustomMessage("" + html + "", title, this.OnVersionRequirementSelectClick, null, this, null);
        $('.popup-filter select').change((e => { this.UpdatePopUpListWithFilter(); return false }));
        this.UpdatePopUpListWithFilter();
    }
    public BuildRequirementColumListWith(requirements: Array<RequirementViewModel>): string {
        var html = '';
        jQuery.each(requirements, function () {
            html += '<div class="column-list-row clickable">';
            html += '<div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '">#' + this.RequirementID + '</a><input class="column-list-row-checkbox" type="checkbox"  CBId="' + this.RequirementID + '" ></div>';
            html += '<span class="requirement-content"><span class="requirement-behavior">' + this.Behavior + '</span>';
            html += '</span></div>';
        });
        return html;
    }
    public UpdatePopUpListWithFilter() {
        var alternativeId = $(".popup-filter select").val();
        if (alternativeId == 'undefined') { alternativeId = '0'; $(".popup-filter select'").val(alternativeId); }
        var filterRequirements = this.FilterRequirementWithinAlternativesScope(this.version.PendingProductRequirements, this.version.ProductAlternatives, alternativeId);  
        $('.column-list').html(this.BuildRequirementColumListWith(filterRequirements));
        $(".column-list-row.clickable").click((e => { $(e.target).find('.column-list-row-checkbox').each(function () { this.checked = !this.checked; });}));
        $(".allcb").click((e => { var checked = $(e.target).is(':checked'); $('.column-list-row-checkbox').each(function () { this.checked = checked; }); }));        
    }
    public OnVersionRequirementSelectClick(context: VersionEditorUIControl) {
        var newRequirementIDs = [];
        jQuery.each($('.column-list-row-checkbox:checked'), function () {
            newRequirementIDs.push(parseInt($(this).attr('CBId')));
        });
        var isOK = true;
        if (newRequirementIDs.length > 0) { isOK = false; context.app.ShowAlert("No Behaviors Selected !"); }
        if (isOK) {
            context.AjaxCall(context.versionRequirementSaveURL, JSON.stringify({ requirementIDs: newRequirementIDs, VersionID: context.version.Definition.VersionID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    }
    public ShowRemoveVersionRequirementForm(requirementID: Number) {
        this.removePendingID = requirementID;
        this.app.ShowCustomMessage("Are you sure you want to remove this behavior ?", "Remove Behavior", this.OnRequirementRemoveClick, null, this, null);
    }
    public OnRequirementRemoveClick(context: VersionEditorUIControl) {
        context.AjaxCall(context.removeVersionRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    }
    public OnEditorSaved(response, context: VersionEditorUIControl) {
        if (response.Definition != undefined) {
            if (context.version.Definition.VersionID > 0) {
                context.version = response;
                context.Build();
                //xxx feedback ShowInsideMessage  "Definition has been saved !"
                context.app.HideUnfreezeControls();
            } else {
                var rootUrl = window.location.href.substring(0, window.location.href.indexOf("/Project/"));
                window.location.replace(rootUrl + context.editorURL + response.Definition.ProjectID);
            }
        }
        else {
            context.app.ShowAlert(response);
        }
    }
}
