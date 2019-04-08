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
//      VersionEditorUIControl
//
var VersionEditorUIControl = /** @class */ (function (_super) {
    __extends(VersionEditorUIControl, _super);
    function VersionEditorUIControl(formVM) {
        var _this = _super.call(this, "VersionEditorUIControl", "#editor") || this;
        _this.versionSaveURL = "/Project/CreateEditProjectVersion";
        _this.removeVersionURL = "/Project/RemoveProjectVersion";
        _this.versionRequirementSaveURL = "/Project/CreateEditVersionRequirement";
        _this.removeVersionRequirementURL = "/Project/RemoveVersionRequirement";
        _this.editorURL = "/Project/VersionEditor?VersionID=";
        _this.ProjectID = formVM.ProjectID;
        _this.version = formVM;
        _this.versionsWrapper = $("#editor-version-requirement-wrapper");
        _this.Start();
        return _this;
    }
    VersionEditorUIControl.prototype.Start = function () {
        this.Build();
    };
    VersionEditorUIControl.prototype.Build = function () {
        var _this = this;
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            this.BuildScopeFilter();
            this.UpdateRequirementTable();
        }
        $("#edit-definition-link").click((function (e) { _this.ShowEditDefinitionForm(); return false; }));
        $('#app-page-main-action-button').click((function (e) { _this.ShowVersionRequirementSelectForm(); return false; }));
        $(".requirement-view-tab").click((function (e) { _this.ShowRequirementsView(parseInt($(e.target).attr('viewIndex'))); return false; }));
    };
    VersionEditorUIControl.prototype.BuildDefinition = function () {
        $(".editor-header-bubble-definition").html((this.FieldIsBlank(this.version.Definition.Summary)) ? "No<br/>Definition<br/>yet" : this.version.Definition.Summary.replace(/\n/gim, "<br/>"));
        $(".editor-header-bubble-title").html(this.version.Definition.NumberName + ' - ' + this.version.Definition.NickName);
    };
    VersionEditorUIControl.prototype.ShowRequirementsView = function (viewIndex) {
        $(".requirement-view-tab").removeClass("active");
        $(".requirement-view-tab[viewIndex='" + viewIndex + "']").addClass("active");
        this.UpdateRequirementTable();
    };
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
    VersionEditorUIControl.prototype.BuildScopeFilter = function () {
        var _this = this;
        this.version.ProductAlternatives.push(new ItemViewModel("[ Default ]", "-1"));
        this.version.ProductAlternatives.push(new ItemViewModel("[ ALL SCOPES ]", "0"));
        $("#editor-view-filter").html("<div class='filter-selector'>" + this.BuildDropDownHtmlWith("version-context-selector", this.version.ProductAlternatives, "Select Scope", "0") + "</div>");
        $('#version-context-selector').change((function (e) { _this.UpdateRequirementTable(); }));
    };
    VersionEditorUIControl.prototype.ShowNewDefinitionForm = function (ProjectID, ProjectProducts) {
        var newVM = new VersionViewModel();
        newVM.VersionID = -1;
        newVM.ProductID = -1;
        newVM.NumberName = "V#.#";
        newVM.NickName = "No Name";
        newVM.Summary = "";
        newVM.VersionEnumType = VersionEnumType.Planned;
        newVM.ReleasedYear = 2019;
        newVM.ReleasedMonth = 12;
        this.ProjectID = ProjectID;
        this.version.Definition = newVM;
        this.version.ProjectProducts = ProjectProducts;
        if (this.version.ProjectProducts.length == 0) {
            this.app.ShowAlert("Please set project products first");
        }
        else {
            this.ShowDefinitionForm(this.version.Definition);
        }
    };
    VersionEditorUIControl.prototype.ShowEditDefinitionForm = function () {
        this.ShowDefinitionForm(this.version.Definition);
    };
    VersionEditorUIControl.prototype.BuildRequirementTableWith = function (requirements) {
        var html = '';
        var tabIndex = parseInt($(".requirement-view-tab.active").attr('viewIndex'));
        var requirementsGroup = (tabIndex == 1) ? this.GroupBy(requirements, "UseCaseID") : this.GroupBy(requirements, "UIID");
        if (Object.keys(requirementsGroup).length > 0) {
            html = '<div>';
            var Context = this;
            jQuery.each(Object.keys(requirementsGroup), function () {
                var first = requirementsGroup[this][0];
                var rowSpan = 'rowSpan="' + requirementsGroup[this].length.toString() + '"';
                if (tabIndex == 1) {
                    html += '<tr><td ' + rowSpan + '><a href="/Project/UseCaseEditor?FunctionID=' + first.UseCaseID + '" class="b u">@UC ' + first.UseCaseID + '</a></td>';
                }
                else {
                    var UI = Context.FieldIsBlank(first.UI) ? "No UI" : '<a href="/Project/UIComponentEditor?ComponentID=' + first.UIID + '" class="b u">@' + first.UI + '</a>';
                    html += '<td ' + rowSpan + '>' + UI + '</td>';
                }
                var rowIndex = 0;
                jQuery.each(requirementsGroup[this], function () {
                    html += (rowIndex > 0) ? '<tr>' : '';
                    html += '<td><div><div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '"># ' + this.RequirementID + '</a></div></div></td>';
                    html += '<td><div><span class="b">' + this.Behavior + '</span> <br> ' + this.Description + '</div></td>';
                    html += '<td><div><a href="/" class="remove-version-requirement-link u action-link" linkID="' + this.RequirementID + '">Remove</a></div></td>';
                    html += '</tr>';
                    rowIndex += 1;
                });
            });
            html += '</div>';
        }
        else {
            html = '<tr><td colspan="4">No Selected Behaviors yet</td></tr>';
        }
        return html;
    };
    VersionEditorUIControl.prototype.UpdateRequirementTable = function () {
        var _this = this;
        var alternativeId = $("#version-context-selector").val();
        if (alternativeId == 'undefined') {
            alternativeId = '0';
            $("#version-context-selector").val(alternativeId);
        }
        var filterRequirements = this.FilterRequirementWithinAlternativesScope(this.version.SelectedRequirements, this.version.ProductAlternatives, alternativeId);
        $('table.requirements tbody').html(this.BuildRequirementTableWith(filterRequirements));
        $(".remove-version-requirement-link").click((function (e) { _this.ShowRemoveVersionRequirementForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    VersionEditorUIControl.prototype.ShowRemoveVersionForm = function (versionID) {
        this.removePendingID = versionID;
        this.app.ShowCustomMessage("Are you sure you want to delete this version ?", "Remove Version", this.OnVersionRemoveClick, null, this, null);
    };
    VersionEditorUIControl.prototype.OnVersionRemoveClick = function (context) {
        context.AjaxCall(context.removeVersionURL, JSON.stringify({ versionID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    VersionEditorUIControl.prototype.ShowDefinitionForm = function (version) {
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
        this.app.ShowCustomMessage("<div class='form-group' formid='" + version.VersionID + "' >" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        return false;
    };
    VersionEditorUIControl.prototype.OnDefinitionSaveClick = function (context) {
        var VM = new VersionViewModel();
        VM.ProductID = parseInt($.trim($("#formProduct").val()));
        VM.VersionID = parseInt($.trim($(".form-group").attr('formid')));
        VM.NumberName = $.trim($("#formDefName").val());
        VM.NickName = $.trim($("#formNickName").val());
        VM.Summary = $.trim($("#formDefGoal").val());
        VM.VersionEnumType = parseInt($.trim($("#formStatus").val()));
        VM.ReleasedMonth = parseInt($.trim($("#formMonth").val()));
        VM.ReleasedYear = parseInt($.trim($("#formYear").val()));
        var isOK = true;
        if ((context.FieldIsBlank(VM.NumberName))) {
            isOK = false;
            context.app.ShowAlert("Number is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ProductID))) {
            isOK = false;
            context.app.ShowAlert("Product is mandatory !");
        }
        if ((context.FieldIsBlank(VM.VersionEnumType))) {
            isOK = false;
            context.app.ShowAlert("Status is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.versionSaveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    VersionEditorUIControl.prototype.ShowVersionRequirementSelectForm = function () {
        var _this = this;
        var Context = this;
        var title = "Select Behaviors";
        if (this.version.PendingProductRequirements.length > 0) {
            var html = '';
            html += '<span class="filter-selector popup-filter " >' + this.BuildDropDownHtmlWith("version-context-selector", this.version.ProductAlternatives, "Select Scope", "0") + '</span>';
            html += '<div><div style="height: 460px; overflow-y: scroll;"><div class="column-list">';
            html += '</div></div></div>';
            html += '<div style="padding-left:10px;"><input class="allcb" type="checkbox"> ALL </div>';
        }
        else {
            html = '<div class="tac">No Requirements available</div>';
        }
        this.app.ShowCustomMessage("" + html + "", title, this.OnVersionRequirementSelectClick, null, this, null);
        $('.popup-filter select').change((function (e) { _this.UpdatePopUpListWithFilter(); return false; }));
        this.UpdatePopUpListWithFilter();
    };
    VersionEditorUIControl.prototype.BuildRequirementColumListWith = function (requirements) {
        var html = '';
        jQuery.each(requirements, function () {
            html += '<div class="column-list-row clickable">';
            html += '<div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '">#' + this.RequirementID + '</a><input class="column-list-row-checkbox" type="checkbox"  CBId="' + this.RequirementID + '" ></div>';
            html += '<span class="requirement-content"><span class="requirement-behavior">' + this.Behavior + '</span>';
            html += '</span></div>';
        });
        return html;
    };
    VersionEditorUIControl.prototype.UpdatePopUpListWithFilter = function () {
        var alternativeId = $(".popup-filter select").val();
        if (alternativeId == 'undefined') {
            alternativeId = '0';
            $(".popup-filter select'").val(alternativeId);
        }
        var filterRequirements = this.FilterRequirementWithinAlternativesScope(this.version.PendingProductRequirements, this.version.ProductAlternatives, alternativeId);
        $('.column-list').html(this.BuildRequirementColumListWith(filterRequirements));
        $(".column-list-row.clickable").click((function (e) { $(e.target).find('.column-list-row-checkbox').each(function () { this.checked = !this.checked; }); }));
        $(".allcb").click((function (e) { var checked = $(e.target).is(':checked'); $('.column-list-row-checkbox').each(function () { this.checked = checked; }); }));
    };
    VersionEditorUIControl.prototype.OnVersionRequirementSelectClick = function (context) {
        var newRequirementIDs = [];
        jQuery.each($('.column-list-row-checkbox:checked'), function () {
            newRequirementIDs.push($(this).attr('CBId'));
        });
        var isOK = true;
        if (newRequirementIDs.length == 0) {
            isOK = false;
            context.app.ShowAlert("No Behaviors Selected !");
        }
        if (isOK) {
            var requirementList = new ItemViewModelList();
            jQuery.each(newRequirementIDs, function () {
                var item = new ItemViewModel("", this);
                item.ParentKeyValue = context.version.Definition.VersionID.toString();
                requirementList.Items.push(item);
            });
            context.AjaxCall(context.versionRequirementSaveURL, JSON.stringify({ formVM: requirementList, VersionID: context.version.Definition.VersionID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    VersionEditorUIControl.prototype.ShowRemoveVersionRequirementForm = function (requirementID) {
        this.removePendingID = requirementID;
        this.app.ShowCustomMessage("Are you sure you want to remove this behavior ?", "Remove Behavior", this.OnRequirementRemoveClick, null, this, null);
    };
    VersionEditorUIControl.prototype.OnRequirementRemoveClick = function (context) {
        context.AjaxCall(context.removeVersionRequirementURL, JSON.stringify({ requirementID: context.removePendingID, versionID: context.version.Definition.VersionID }), context.OnEditorSaved, context);
    };
    VersionEditorUIControl.prototype.OnEditorSaved = function (response, context) {
        if (response.Definition != undefined) {
            if (context.version.Definition.VersionID > 0) {
                context.version = response;
                context.Build();
                //xxx feedback ShowInsideMessage  "Definition has been saved !"
                context.app.HideUnfreezeControls();
            }
            else {
                var rootUrl = window.location.href.substring(0, window.location.href.indexOf("/Project/"));
                window.location.replace(rootUrl + context.editorURL + response.Definition.VersionID);
            }
        }
        else {
            context.app.ShowAlert(response);
        }
    };
    return VersionEditorUIControl;
}(RequirementUIControl));
//# sourceMappingURL=VersionEditorUIControl.js.map