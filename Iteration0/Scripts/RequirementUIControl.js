/// <reference path="jquery.d.ts" />
//
//      Parent Class for UI Controls
//
var RequirementUIControl = /** @class */ (function () {
    function RequirementUIControl(ControlType, htmlWrapperID) {
        this.wrapperID = "#Unknown";
        this.tableHtmlTemplate = '<table class="ruleTable">';
        this.requirementSaveURL = "/Project/CreateEditRessourceRequirement";
        this.removeRequirementURL = "/Project/RemoveRessourceRequirement";
        this.ContextLabels = ["", "Domain Context", "Business Process", "Feature"];
        this.ContextPluralLabels = ["", "Domain Contexts", "Business Processes", "Features"];
        this.ContextItemLabels = ["", "Domain Concept", "Use Case", "UI Component"];
        this.type = ControlType;
        this.wrapperID = htmlWrapperID;
        this.wrapper = $(this.wrapperID);
        this.requirementsWrapper = $("#editor-requirements-wrapper");
        this.alternativesWrapper = $("#editor-alternatives-wrapper");
    }
    RequirementUIControl.prototype.Show = function () { };
    RequirementUIControl.prototype.Hide = function () { };
    RequirementUIControl.prototype.Start = function () {
    };
    RequirementUIControl.prototype.ReBuild = function (viewModel) {
    };
    RequirementUIControl.prototype.Save = function () {
    };
    RequirementUIControl.prototype.BuildContextTagsFor = function (requirement) {
        var html = '<div class="context-tag">' + requirement.ScopeSummary.replace(new RegExp('/', 'g'), '</div><div class="context-tag">') + '</div>';
        return html;
    };
    RequirementUIControl.prototype.BuildBehaviorSummaryFor = function (requirement) {
        var html = requirement.Behavior;
        if (!this.FieldIsBlank(requirement.Concept))
            html += ' by <a class="u" href="/Project/DomainConceptEditor?ConceptID=' + requirement.ConceptID + '">@' + requirement.Concept + '</a>';
        if (!this.FieldIsBlank(requirement.UI))
            html += ' using <a class="u" href="/Project/UIComponentEditor?ComponentID=' + requirement.UIID + '">@' + requirement.UI + '</a>';
        if (!this.FieldIsBlank(requirement.Infrastructure))
            html += ' with <a class="u" href="/Project/ProjectEditor?ProjectID=' + this.ProjectID + '#infrastructures">@' + requirement.Infrastructure + '</a>';
        return html;
    };
    RequirementUIControl.prototype.BuildRequirements = function () {
        var _this = this;
        var Context = this;
        if (this.requirementsWrapper != null) {
            if (this.Requirements.length > 0) {
                var html = '<div>';
                jQuery.each(this.Requirements, function () {
                    if (this.SelectedVersions.length > 0) {
                        html += '<div class="version-links-box r">';
                        if (!Context.FieldIsBlank(this.SelectedVersions[0]))
                            html += '<a class="action-link" href="/Project/VersionEditor?VersionID=' + this.SelectedVersionIDs[0] + '">' + this.SelectedVersions[0] + "</a>&nbsp;";
                        html += '</div>';
                    }
                    html += '<div id="r' + this.RequirementID + '"  class="requirement-box">';
                    if (this.UseCaseID == Context.RessourceID)
                        html += '<div class="r vb cb"><a class="edit-requirement-link u action-link" linkid="' + this.RequirementID + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-requirement-link u action-link" linkid="' + this.RequirementID + '" href="/">Remove</a>&nbsp;</div>';
                    html += Context.BuildContextTagsFor(this);
                    html += '<div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '"># ' + this.RequirementID + '</a></div>';
                    html += '<span class="requirement-content"><span class="requirement-behavior">' + Context.BuildBehaviorSummaryFor(this) + '</span>';
                    if (!Context.FieldIsBlank(this.Description))
                        html += ' : ' + this.Description;
                    html += '</span></div>';
                });
                html += '';
                html += '</div>';
                this.requirementsWrapper.html(html);
            }
            else {
                this.requirementsWrapper.html('<div class="tac">No Default Behaviors yet</div>');
            }
        }
        $(".edit-requirement-link").click((function (e) { _this.ShowEditRequirementForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-requirement-link").click((function (e) { _this.ShowRemoveRequirementForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    RequirementUIControl.prototype.BuildAlternatives = function () {
        var _this = this;
        var Context = this;
        if (this.alternativesWrapper != null) {
            if (this.Alternatives.length > 0) {
                var html = '<div>';
                jQuery.each(this.Alternatives, function () {
                    if (!Context.FieldIsBlank(this.SelectedVersionSummary))
                        html += '<span class="fmin2 r i">' + this.SelectedVersionSummary + "&nbsp;</span>";
                    html += '<div id="r' + this.RequirementID + '"  class="requirement-box">';
                    if (this.UseCaseID == Context.RessourceID)
                        html += '<div class="r vb cb"><a class="edit-alternative-link u action-link" linkid="' + this.RequirementID + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-alternative-link u action-link" linkid="' + this.RequirementID + '" href="/">Remove</a>&nbsp;</div>';
                    html += Context.BuildContextTagsFor(this);
                    html += '<div class="req-tag"><a href="/Project/UseCaseEditor?FunctionID=' + this.UseCaseID + '#r' + this.RequirementID + '"># ' + this.RequirementID + '</a></div>';
                    html += '<span class="requirement-content"><span class="requirement-behavior">' + Context.BuildBehaviorSummaryFor(this) + '</span>';
                    if (!Context.FieldIsBlank(this.Description))
                        html += ' : ' + this.Description;
                    html += '</span></div>';
                });
                html += '';
                html += '</div>';
                this.alternativesWrapper.html(html);
            }
            else {
                this.alternativesWrapper.html('<div class="tac">No Alternative Behaviors yet</div>');
            }
        }
        $(".edit-alternative-link").click((function (e) { _this.ShowEditAlternativeForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-alternative-link").click((function (e) { _this.ShowRemoveAlternativeForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    RequirementUIControl.prototype.ShowRemoveRequirementForm = function (requirementID) {
        this.removePendingID = requirementID;
        this.app.ShowCustomMessage("Are you sure you want to delete this behavior ?", "Remove Behavior", this.OnRequirementRemoveClick, null, this, null);
    };
    RequirementUIControl.prototype.OnRequirementRemoveClick = function (context) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    RequirementUIControl.prototype.UpdateRequirementContextSummary = function () {
        var result = [];
        jQuery.each(this.RequirementUseCase.VariationPoints, function () {
            var selector = $('.context-field-selector[TypeId="' + this.ContextTypeID + '"]');
            if (selector.length > 0) {
                var summary = "";
                jQuery.each(selector.find('.context-CB:checked'), function () {
                    summary += $(this).attr('CBCode') + ', ';
                    result.push(parseInt($(this).attr('CBId')));
                });
                summary = (summary.length > 0) ? summary.substring(0, summary.length - 2) : "Default";
                selector.find('.context-field').val(summary);
            }
        });
        return result;
    };
    RequirementUIControl.prototype.BuildHtmlButtonSelector = function (ShowAlternativeOtions, selectedScopeIDs) {
        var context = this;
        var html = "";
        jQuery.each(this.RequirementUseCase.VariationPoints, function () {
            if (this.UsedAsProductAlternative == ShowAlternativeOtions) {
                html += "<div class='context-field-selector' TypeId='" + this.ContextTypeID + "'><input type='text' TypeId='" + this.Name + "' class='texttype context-field' maxlength='50' style='width: 340px;' value='Default' disabled>";
                html += '<div class="variants-dropdown dropdown"><button class="">' + this.Name + ' Scope ▾</button><div class="dropdown-content">';
                jQuery.each(this.Contexts, function () {
                    html += "<div><input type='checkbox' class='context-CB i' CBCode='" + this.CodeName + "'  CBId='" + this.ContextID + "' " + (selectedScopeIDs.indexOf(this.ContextID) > -1 ? "checked" : "") + ">" + this.Name + "</div>";
                });
                html += '</div></div>';
            }
        });
        html += '</div></div>';
        return html;
    };
    RequirementUIControl.prototype.ShowNewRequirementForm = function () {
        var VM = new RequirementViewModel();
        VM.Behavior = '';
        VM.Description = '';
        VM.Priority = 2;
        VM.ConceptID = -1;
        VM.UIID = -1;
        VM.InfrastructureID = -1;
        VM.ScopeIDs = [];
        this.ShowRequirementForm(VM);
    };
    RequirementUIControl.prototype.ShowEditRequirementForm = function (requirementID) {
        var VM;
        jQuery.each(this.Requirements, function () { if (this.RequirementID == requirementID) {
            VM = this;
            return false;
        } });
        this.ShowRequirementForm(VM);
    };
    RequirementUIControl.prototype.ShowRequirementForm = function (requirement) {
        var _this = this;
        var title = ((requirement.RequirementID > 0) ? "Edit Default Behavior" : "New Default Behavior");
        var formHtml = "<div class='form-element-group'><div><label >Behavior : </label></div><div><input type='text' id='formBehaviorVerb' class='texttype' maxlength='50' style='width: 500px;' placeholder='Behavior as Verb Phrase..' value='" + requirement.Behavior + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label>Scope : </label></div>";
        formHtml += "<div>" + this.BuildHtmlButtonSelector(false, requirement.ScopeIDs) + "</div>";
        formHtml += "<div class='form-element-group'><div><label >Description : </label></div><div><textarea id='formBehaviorDescription' type='textarea' name='textarea-description' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Expected Behavior characteristics externally observable..'>" + requirement.Description + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label >By Concept : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorResponsability", this.RequirementUseCase.ProjectConcepts, "Select Concept", requirement.ConceptID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Using UI : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorUI", this.RequirementUseCase.ProjectUIs, "Select UI", requirement.UIID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >With Infrastructure : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorInfrastructure", this.RequirementUseCase.ProjectInfrastructures, "Select Infrastructure", requirement.InfrastructureID.toString()) + "</div></div>";
        //formHtml += "<div class='form-element-group'><div><label >Related Work Item : </label></div><div><input type='text' id='formWorkItemURL' class='texttype' maxlength='50' style='width: 300px;' placeholder='URL' value='" + requirement.ExternalURL + "'></div></div>";
        //TODO To avoid Cascading effects default behavior should not be authorised to have [mandatory /scope] requirements
        formHtml += "<div class='form-element-group'><div><label>Priority : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorPriority", PriorityLevels, "Select Priority", requirement.Priority.toString()) + "</div></div>";
        this.app.ShowCustomMessage("<div class='form-group' formid='" + requirement.RequirementID + "' >" + formHtml + "</div>", title, this.OnRequirementSaveClick, null, this, null);
        $('.context-CB').click((function (e) { return _this.UpdateRequirementContextSummary(); }));
        this.UpdateRequirementContextSummary();
    };
    RequirementUIControl.prototype.ShowRemoveAlternativeForm = function (AlternativeID) {
        this.removePendingID = AlternativeID;
        this.app.ShowCustomMessage("Are you sure you want to delete this Alternative ?", "Remove Alternative", this.OnAlternativeRemoveClick, null, this, null);
    };
    RequirementUIControl.prototype.OnAlternativeRemoveClick = function (context) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ AlternativeID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    RequirementUIControl.prototype.ShowNewAlternativeForm = function () {
        var VM = new RequirementViewModel();
        VM.DefaultBehaviorID = 0;
        VM.Behavior = '';
        VM.Description = '';
        VM.Priority = 5;
        VM.ScopeIDs = [];
        this.ShowAlternativeForm(VM);
    };
    RequirementUIControl.prototype.ShowEditAlternativeForm = function (RequirementID) {
        var VM;
        jQuery.each(this.Alternatives, function () { if (this.RequirementID == RequirementID) {
            VM = this;
            return false;
        } });
        this.ShowAlternativeForm(VM);
    };
    RequirementUIControl.prototype.ShowAlternativeForm = function (requirement) {
        var _this = this;
        var title = ((requirement.RequirementID > 0) ? "Edit Behavior Alternative" : "New Behavior Alternative");
        var formHtml = "<div class='form-element-group'><div><label >Default Behavior : </label></div><div>" + this.BuildDropDownHtmlWith("formDefaultBehavior", this.RequirementUseCase.RequirementOptions, "Select Behavior", requirement.DefaultBehaviorID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Alternative Behavior : </label></div><div><input type='text' id='formBehaviorVerb' class='texttype' maxlength='50' style='width: 500px;' placeholder='Behavior as Verb Phrase..' value='" + requirement.Behavior + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Scope : </label></div>";
        formHtml += "<div>" + this.BuildHtmlButtonSelector(true, requirement.ScopeIDs) + "</div>";
        formHtml += "<div class='form-element-group'><div><label >Description : </label></div><div><textarea id='formBehaviorDescription' type='textarea' name='textarea-description' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Expected Behavior characteristics externally observable..'>" + requirement.Description + "</textarea></div></div>";
        //Alternative Type : radio button RequirementEnumType.LogicAlternative
        //formHtml += "<div class='form-element-group'><div><label >Related Work Item : </label></div><div><input type='text' id='formWorkItemURL' class='texttype' maxlength='50' style='width: 300px;' placeholder='URL' value='" + requirement.ExternalURL + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Priority : </label></div><div>" + this.BuildDropDownHtmlWith("formBehaviorPriority", PriorityLevels, "Select Priority", requirement.Priority.toString()) + "</div></div>";
        this.app.ShowCustomMessage("<div class='form-group' formid='" + requirement.RequirementID + "' >" + formHtml + "</div>", title, this.OnRequirementSaveClick, null, this, null);
        $("#formDefaultBehavior").width(480);
        $('.context-CB').click((function (e) { return _this.UpdateRequirementContextSummary(); }));
        this.UpdateRequirementContextSummary();
    };
    RequirementUIControl.prototype.BuildDropDownHtmlWith = function (dropDownId, items, defaultValue, selectedValue) {
        var DropDownHtml = "<select id='" + dropDownId + "'><option value='' disabled='' " + ((selectedValue == "-1") ? "selected=''" : "") + ">" + defaultValue + "</option>";
        jQuery.each(items, function () {
            DropDownHtml += "<option value='" + this.KeyValue + "' " + ((selectedValue == this.KeyValue) ? "selected=''" : "") + ">" + this.Label + "</option>";
        });
        DropDownHtml += '</select>';
        return DropDownHtml;
        //if ((isNull) || (kpiValue == -1)) {
        //    kpiField.find('option:not([disabled]):selected').attr("selected", null);
        //    kpiField.find('option:first').attr("selected", "selected");
        //} else {
        //    kpiField.find('option:not([disabled]):selected').attr("selected", null);
        //    kpiField.find('option[value="' + kpiValue + '"]').attr("selected", "selected");
        //}
    };
    RequirementUIControl.prototype.OnRequirementSaveClick = function (context) {
        var isAlternative = $("#formDefaultBehavior").length > 0;
        var VM = new RequirementViewModel();
        VM.UseCaseID = context.RequirementUseCase.Definition.RessourceID;
        VM.RequirementID = parseInt($.trim($(".form-group").attr('formid')));
        if (isAlternative) {
            VM.RequirementEnumType = RequirementEnumType.LogicAlternative;
            VM.DefaultBehaviorID = parseInt($("#formDefaultBehavior").val());
        }
        else {
            VM.RequirementEnumType = RequirementEnumType.Default;
            VM.ConceptID = parseInt($("#formBehaviorResponsability").val());
            VM.UIID = parseInt($("#formBehaviorUI").val());
            VM.InfrastructureID = parseInt($("#formBehaviorInfrastructure").val());
        }
        VM.Behavior = $.trim($("#formBehaviorVerb").val());
        VM.Description = $.trim($("#formBehaviorDescription").val());
        VM.Priority = parseInt($("#formBehaviorPriority").val());
        VM.ScopeIDs = context.UpdateRequirementContextSummary();
        var isOK = true;
        if ((context.FieldIsBlank(VM.Behavior))) {
            isOK = false;
            context.app.ShowAlert("Behavior is mandatory !");
        }
        if ((context.FieldIsBlank(VM.Priority))) {
            isOK = false;
            context.app.ShowAlert("Priority is mandatory !");
        }
        if (isAlternative) {
            if ((context.FieldIsBlank(VM.DefaultBehaviorID))) {
                isOK = false;
                context.app.ShowAlert("Default Behavior is mandatory !");
            }
            if (VM.ScopeIDs.length == 0) {
                isOK = false;
                context.app.ShowAlert("Scope is mandatory !");
            }
        }
        else {
            if ((context.FieldIsBlank(VM.ConceptID))) {
                isOK = false;
                context.app.ShowAlert("Concept is mandatory !");
            }
        }
        if (isOK) {
            context.AjaxCall(context.requirementSaveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    RequirementUIControl.prototype.OnEditorSaved = function (response, context) {
        if (response.Definition != undefined) {
            if (context.RessourceID > 0) {
                context.ReBuild(response);
                //TODO feedback with ShowInsideMessage  "xxx has been saved !"
                context.app.HideUnfreezeControls();
            }
            else {
                var rootUrl = window.location.href.substring(0, window.location.href.indexOf("/Project/"));
                window.location.replace(rootUrl + context.editorURL + response.Definition.RessourceID);
            }
        }
        else {
            context.app.ShowAlert(response);
        }
    };
    RequirementUIControl.prototype.FilterRequirementWithinAlternativesScope = function (requirements, alternatives, alternativeScope) {
        var selectedAlternativeIDs = [];
        if (alternativeScope == '0') {
            jQuery.each(alternatives, function () {
                selectedAlternativeIDs.push(this.KeyValue);
            });
        }
        else {
            jQuery.each(alternatives, function () {
                if (alternativeScope == this.KeyValue) {
                    selectedAlternativeIDs.push(this.KeyValue);
                    return false;
                }
            });
        }
        var filterRequirements = [];
        jQuery.each(requirements, function () {
            var requirement = this;
            jQuery.each(selectedAlternativeIDs, function () {
                if (requirement.ScopeIDs.indexOf(parseInt(this)) > -1) {
                    filterRequirements.push(requirement);
                    return false;
                }
            });
        });
        if ((alternativeScope == '-1') || (alternativeScope == '0')) {
            jQuery.each(requirements, function () {
                if (this.DefaultBehaviorID == 0) {
                    filterRequirements.push(this);
                }
            });
        }
        return filterRequirements;
    };
    RequirementUIControl.prototype.AjaxCall = function (postURL, JSONData, callBackFunction, callBackParameter, httpMethod, loadingMessage) {
        if (httpMethod === void 0) { httpMethod = 'POST'; }
        if (loadingMessage === void 0) { loadingMessage = 'Loading'; }
        $.ajax({
            context: this,
            url: postURL,
            type: httpMethod,
            data: JSONData,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            beforeSend: function () {
                $('#loading-text').html(loadingMessage);
                $('.event-progress').toggleClass('open');
            },
            success: function (response) {
                $('.event-progress').toggleClass('open');
                if (response) {
                    if (callBackParameter == null) {
                        callBackFunction(response, this);
                    }
                    else {
                        callBackFunction(response, this, callBackParameter);
                    }
                }
                else {
                    this.app.ShowAlert("An unexpected error occurred while communicating with the server !");
                }
            },
            error: function (xhRequest, ErrorText, thrownError) {
                console.log(ErrorText);
                if (xhRequest.getAllResponseHeaders()) {
                    this.app.ShowAlert("An unexpected error occurred while communicating with the server !");
                }
            }
        });
    };
    RequirementUIControl.prototype.preventEnterSubmit = function (e) {
        if (e.which == 13) {
            var $targ = $(e.target);
            if (!$targ.is("textarea") && !$targ.is(":button,:submit")) {
                var focusNext = false;
                $(this).find(":input:visible:not([disabled],[readonly]), a").each(function () {
                    if (this === e.target) {
                        focusNext = true;
                    }
                    else if (focusNext) {
                        $(this).focus();
                        return false;
                    }
                });
                return false;
            }
        }
    };
    RequirementUIControl.prototype.DesactivateButton = function (buttons) {
        buttons.each(function (index) {
            $(this).off('click');
            //button.click(function (e) { e.preventDefault(); });
            $(this).addClass('btn_fake');
        });
    };
    RequirementUIControl.prototype.ReActivateButton = function (button, OnCLickDelegate) {
        var _this = this;
        button.unbind('click');
        button.click((function (e) { OnCLickDelegate(_this); return false; }));
        button.removeClass('btn_fake');
    };
    RequirementUIControl.prototype.SearchIndexOf = function (ValueKeyData, SearchKey, SearchIndex) {
        if (SearchIndex == null)
            SearchIndex = 1;
        var index = 0;
        var found = false;
        jQuery.each(ValueKeyData, function () {
            if (this[SearchIndex] == SearchKey) {
                found = true;
                return false; //break 
            }
            index += 1;
        });
        if (found) {
            return index;
        }
        else {
            return -1;
        }
    };
    RequirementUIControl.prototype.ConvertDateToArray = function (d) {
        if (d == null) {
            return null;
        }
        else {
            return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
        }
    };
    RequirementUIControl.prototype.FieldIsBlank = function (str) {
        return (!str || /^\s*$/.test(str));
    };
    RequirementUIControl.prototype.DisableFields = function (fields) {
        fields.each(function (index) {
            $(this).prop("disabled", true);
            //$(this).addClass('field_fake');
        });
    };
    RequirementUIControl.prototype.EnableFields = function (fields) {
        fields.each(function (index) {
            $(this).prop("disabled", false);
            //$(this).addClass('field_fake');
        });
    };
    RequirementUIControl.prototype.GroupBy = function (objectList, key) {
        return objectList.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };
    ;
    RequirementUIControl.prototype.UploadFileTo = function (controllerURL, modelId, callBackFunction, callBackParameter) {
        var form = $('#FormUpload')[0];
        var dataString = new FormData(form);
        dataString.append('id', modelId);
        $.ajax({
            context: this,
            url: controllerURL,
            type: 'POST',
            success: function (response) {
                if (response) {
                    if (callBackParameter == null) {
                        callBackFunction(response, this);
                    }
                    else {
                        callBackFunction(response, this, callBackParameter);
                    }
                }
                else {
                    this.app.ShowAlert("An unexpected error occurred while communicating with the server !");
                }
            },
            error: function (response) {
                this.app.ShowAlert("An unexpected error occurred while communicating with the server !");
            },
            complete: function (response) {
            },
            data: dataString,
            //Options to tell jQuery not to process data or worry about content-type.
            cache: false,
            contentType: false,
            processData: false
        });
        return false;
    };
    RequirementUIControl.prototype.GenerateNumericList = function (min, max, IsKeyValue) {
        var result = [];
        for (var i = min; i <= max; i++) {
            if (IsKeyValue) {
                result.push([i, i]);
            }
            else {
                result.push(i);
            }
        }
        return result;
    };
    return RequirementUIControl;
}());
//# sourceMappingURL=RequirementUIControl.js.map