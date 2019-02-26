var RequirementUIControl = (function () {
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
        this.requirementWrapper = $("#editor-requirement-wrapper");
    }
    RequirementUIControl.prototype.Show = function () { };
    RequirementUIControl.prototype.Hide = function () { };
    RequirementUIControl.prototype.Start = function () {
    };
    RequirementUIControl.prototype.ReBuild = function (viewModel) {
    };
    RequirementUIControl.prototype.Save = function () {
    };
    RequirementUIControl.prototype.OnRequirementSaveClick = function (response, context) {
        var VM = new RequirementViewModel();
        var isOK = true;
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSavedDelegate, context);
        }
    };
    RequirementUIControl.prototype.BuildRequirements = function () {
        var _this = this;
        if (this.requirementWrapper != null) {
        }
        $(".edit-requirement-link").click((function (e) { _this.ShowEditRequirementForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-requirement-link").click((function (e) { _this.ShowRemoveRequirementForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    RequirementUIControl.prototype.ShowNewRequirementForm = function () {
        var VM = new RequirementViewModel();
        VM.Priority = 1;
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
    RequirementUIControl.prototype.ShowRemoveRequirementForm = function (requirementID) {
        this.removePendingID = requirementID;
        this.app.ShowCustomMessage("Are you sure you want to delete this requirement ?", "Remove Requirement", this.OnRequirementRemoveClick, null, this, null);
    };
    RequirementUIControl.prototype.OnRequirementRemoveClick = function (context) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    RequirementUIControl.prototype.OnEditorSaved = function (response, context) {
        if (response.Definition != undefined) {
            if (context.RessourceID > 0) {
                context.ReBuild(response);
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
    RequirementUIControl.prototype.UpdateRequirementContext = function (requirement) {
        requirement.Variants = new Array();
        jQuery.each($('.context-CB : checked'), function () {
            requirement.Variants.push({ KeyValue: $(this).attr('CBId') });
        });
        this.BuildHtmlButtonSelector();
    };
    RequirementUIControl.prototype.BuildHtmlButtonSelector = function () {
        var context = this;
        var html = "";
        jQuery.each(this.VariationPoints, function () {
            html += "<div><input type='text' TypeId='" + this.Name + "' class='texttype context-field' maxlength='50' style='width: 300px;' value=''>";
            html = '<div class="app-profile-options-dropdown dropdown"><button class="square smallbtn">Select ' + this.Name + '</button><div class="dropdown-content">';
            jQuery.each(this.Contexts, function () {
                html += "<a href='/' class='context-CB' TypeId='" + this.ContextTypeID + "' CBId='" + this.ContextID + "'>" + this.Name + "</a>";
            });
            html += '</div></div>';
        });
        html += '</div></div>';
        return html;
    };
    RequirementUIControl.prototype.ShowRequirementForm = function (requirement) {
        var _this = this;
        var title = ((requirement.RequirementID > 0) ? "Edit Requirement" : "Define New Requirement");
        var formHtml = this.BuildHtmlButtonSelector();
        formHtml += "<div><input type='text' id='formDefNamex' class='texttype;' maxlength='50' style='width: 300px;' value='ALL'><button class='square'>Select Group..</button></div></div>";
        formHtml += "<div>&nbsp;</div><div class='form-element-group'><div><label class='filter'>Description : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Specific System Behavior..'>" + requirement.Description + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Priority : </label></div><div>" + this.BuildDropDownHtmlWith("formPriority", PriorityLevels, "Select Priority", requirement.Priority.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Related Work Item : </label></div><div><input type='text' id='formWorkItemURL' class='texttype' maxlength='50' style='width: 300px;' placeholder='URL' value='" + requirement.WorkItemURL + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnRequirementSaveClick, null, this, null);
        $('.context-CB').prop("checked", (function (e) { return _this.UpdateRequirementContext(requirement); }));
    };
    RequirementUIControl.prototype.BuildDropDownHtmlWith = function (dropDownId, items, defaultValue, selectedValue) {
        var DropDownHtml = "<select id='" + dropDownId + "' style='width:300px;'><option value='' disabled='' " + ((selectedValue == "-1") ? "selected=''" : "") + ">" + defaultValue + "</option>";
        jQuery.each(items, function () {
            DropDownHtml += "<option value='" + this.KeyValue + "' " + ((selectedValue == this.KeyValue) ? "selected=''" : "") + ">" + this.Label + "</option>";
        });
        DropDownHtml += '</select>';
        return DropDownHtml;
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
                    this.app.ShowAlert("Sorry, your session has timed out. Please log in again.");
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
                return false;
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
        });
    };
    RequirementUIControl.prototype.EnableFields = function (fields) {
        fields.each(function (index) {
            $(this).prop("disabled", false);
        });
    };
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
var BoardEditorUIControl = (function (_super) {
    __extends(BoardEditorUIControl, _super);
    function BoardEditorUIControl(formVM, formAPI) {
        var _this = _super.call(this, "ProjectBoardUIControl", "#board") || this;
        _this.board = formVM;
        _this.api = formAPI;
        _this.Start();
        return _this;
    }
    BoardEditorUIControl.prototype.Start = function () {
        var _this = this;
        this.Build();
        $('#app-page-main-action-button').click((function (e) { _this.ShowNewItemForm(); return false; }));
    };
    BoardEditorUIControl.prototype.Build = function () {
        var _this = this;
        if (this.wrapper.length > 0) {
            this.BuildPools();
            $(".board-edit-link").click((function (e) { _this.ShowEditItemForm(parseInt($(e.target).attr('linkid')), parseInt($(e.target).attr('typeid'))); return false; }));
            $(".remove-board-link").click((function (e) { _this.ShowRemoveItemForm(parseInt($(e.target).attr('linkid'))); return false; }));
        }
    };
    BoardEditorUIControl.prototype.BuildPools = function () {
        var context = this;
        if (this.board.Pools.length > 0) {
            var html = '';
            jQuery.each(this.board.Pools, function () {
                html += '<div class="board-pool"><div class="board-pool-header">' + this.PoolName + '</div>';
                if (this.Steps.length > 0) {
                    jQuery.each(this.Steps, function () {
                        var scale1Html = "";
                        var scale2Html = "";
                        jQuery.each(this.Scale1Items, function () {
                            scale1Html += '<div class="scale1-item"><a class="editor-edit-link" href="' + context.api.ItemEditorURL + this.ItemID + '">' + this.Name + '</a> <a  linkid="' + this.ItemID + '" typeid="' + context.board.ItemType + '" class="board-edit-link" href="/">°</a></div>';
                        });
                        jQuery.each(this.Scale2Items, function () {
                            scale2Html += '<div class="scale2-item"><a class="editor-edit-link" href="' + context.api.ItemEditorURL + this.ItemID + '">' + this.Name + '</a> <a  linkid="' + this.ItemID + '" typeid="' + context.board.ItemType + '" class="board-edit-link" href="/">°</a></div>';
                        });
                        html += '<div class="board-pool-step"><div class="scale1-item-wrapper">' + scale1Html + '</div><div class="scale2-item-wrapper">' + scale2Html + '</div></div>';
                    });
                }
                else {
                    html += '<div class="tac">Empty</div>';
                }
                html += '</div>';
            });
            this.wrapper.html(html);
        }
        else {
            this.wrapper.html('<div class="board-pool"><br/><div class="tac">No ' + this.ContextPluralLabels[this.board.ItemType] + ' yet</div></div>');
        }
    };
    BoardEditorUIControl.prototype.ShowNewItemForm = function () {
        if (this.board.ProjectPools.length == 0) {
            this.app.ShowAlert('Please set project ' + this.ContextPluralLabels[this.board.ItemType] + ' first');
        }
        else {
            var newVM = new BoardItemViewModel();
            newVM.Name = "New " + this.ContextItemLabels[this.board.ItemType], newVM.PoolID = -1;
            newVM.ScaleOrder = 2;
            newVM.StepOrder = 1;
            newVM.SortOrder = 99;
            this.ShowItemForm(newVM, this.board.ItemType);
        }
    };
    BoardEditorUIControl.prototype.ShowEditItemForm = function (ItemID, ItemEnum) {
        this.ShowItemForm(this.GetItem(ItemID), ItemEnum);
    };
    BoardEditorUIControl.prototype.ShowRemoveItemForm = function (ItemID) {
        this.removePendingID = ItemID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Item", this.api.ItemRemoveURL, null, this, null);
    };
    BoardEditorUIControl.prototype.ShowItemForm = function (Item, ItemEnum) {
        var Label = this.ContextItemLabels[ItemEnum];
        var title = ((Item.ItemID > 0) ? "Edit " + Label : "Define New " + Label);
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input ='text' id='formName' class='text' maxlength='50' style='width: 300px;' value='" + Item.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>" + this.ContextLabels[this.board.ItemType] + " : </label></div><div>" + this.BuildDropDownHtmlWith("formPool", this.board.ProjectPools, "Select " + this.ContextLabels[this.board.ItemType], Item.PoolID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Scale Order : </label></div><div>" + this.BuildDropDownHtmlWith("formScaleOrder", ScaleOptions, "Select Scale", Item.ScaleOrder.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Step Order : </label></div><div>" + this.BuildDropDownHtmlWith("formStepOrder", StepOptions, "Select Step", Item.StepOrder.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Sort Order : </label></div><div><input type='number' min='1' max='99' id='formSortOrder'  style='width:60px;' value='" + Item.SortOrder + "'></div></div>";
        this.app.ShowCustomMessage("<div class='Item-form form-group' formid='" + Item.ItemID + "' typeid='" + this.board.ItemType + "'>" + formHtml + "</div>", title, this.OnItemSaveClick, null, this, null);
        return false;
    };
    BoardEditorUIControl.prototype.OnItemSaveClick = function (Context) {
        var VM = new BoardItemViewModel();
        VM.ItemID = parseInt($.trim($(".Item-form").attr('formid')));
        VM.ItemType = Context.board.ItemType;
        VM.Name = $.trim($("#formName").val());
        VM.PoolID = parseInt($.trim($("#formPool").val()));
        VM.ScaleOrder = parseInt($.trim($("#formScaleOrder").val()));
        VM.StepOrder = parseInt($.trim($("#formStepOrder").val()));
        VM.SortOrder = parseInt($.trim($("#formSortOrder").val()));
        var isOK = true;
        if ((Context.FieldIsBlank(VM.Name))) {
            isOK = false;
            Context.app.ShowAlert("Name is mandatory !");
        }
        if ((Context.FieldIsBlank(VM.PoolID))) {
            isOK = false;
            Context.app.ShowAlert(Context.ContextLabels[Context.board.ItemType] + " is mandatory !");
        }
        if (isOK) {
            Context.AjaxCall(Context.api.ItemSaveURL, JSON.stringify({ formVM: VM, ProjectID: Context.board.ProjectID }), Context.OnEditorSaved, Context);
        }
    };
    BoardEditorUIControl.prototype.OnEditorSaved = function (response, context) {
        if (response.Pools != undefined) {
            context.board = response;
            context.Build();
            context.app.HideUnfreezeControls();
        }
        else {
            context.app.ShowAlert(response);
        }
    };
    BoardEditorUIControl.prototype.GetItem = function (ItemID) {
        var VM;
        jQuery.each(this.board.Pools, function () {
            jQuery.each(this.Steps, function () {
                jQuery.each(this.Scale1Items, function () { if (this.ItemID == ItemID) {
                    VM = this;
                    return false;
                } });
                jQuery.each(this.Scale2Items, function () { if (this.ItemID == ItemID) {
                    VM = this;
                    return false;
                } });
            });
        });
        return VM;
    };
    return BoardEditorUIControl;
}(RequirementUIControl));
var VersionEditorUIControl = (function (_super) {
    __extends(VersionEditorUIControl, _super);
    function VersionEditorUIControl(formVM) {
        var _this = _super.call(this, "VersionEditorUIControl", "#editor") || this;
        _this.versionSaveURL = "/Project/CreateEditProjectVersionWith";
        _this.removeVersionURL = "/Project/RemoveProjectVersion";
        _this.versionRequirementSaveURL = "/Project/CreateEditVersionRequirementWith";
        _this.removeVersionRequirementURL = "/Project/RemoveVersionRequirement";
        _this.ProjectID = formVM.ProjectID;
        _this.version = formVM;
        _this.versionsWrapper = $("#editor-versions-wrapper");
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
            this.BuildRequirements();
        }
        $("#edit-definition-link").click((function (e) { _this.ShowEditDefinitionForm(); return false; }));
        $("#add-requirement-link").click((function (e) { _this.ShowNewVersionRequirementForm(); return false; }));
    };
    VersionEditorUIControl.prototype.BuildDefinition = function () {
        $("#editor-definition-zone").html((this.FieldIsBlank(this.version.Definition.Summary)) ? "No<br/>Definition<br/>yet" : this.version.Definition.Summary.replace(/\n/gim, "<br/>"));
        $("#editor-definition-category").html(this.version.Definition.ProductName);
        $("#editor-definition-code").html(this.version.Definition.NumberName);
    };
    VersionEditorUIControl.prototype.ShowNewDefinitionForm = function (ProjectID, ProjectProducts) {
        var newVM = new VersionViewModel();
        newVM.VersionID = -1;
        newVM.ProductID = -1;
        newVM.NumberName = "Vx.x.x";
        newVM.NickName = "";
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
    VersionEditorUIControl.prototype.BuildRequirements = function () {
        if (this.versionsWrapper.length > 0) {
        }
    };
    VersionEditorUIControl.prototype.ShowNewVersionRequirementForm = function () {
        this.app.ShowAlert("Coming soon !");
    };
    VersionEditorUIControl.prototype.ShowRemoveRequirementForm = function (versionID) {
        this.removePendingID = versionID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Version", this.OnRequirementRemoveClick, null, this, null);
    };
    VersionEditorUIControl.prototype.OnVersionRequirementClick = function (context) {
        context.AjaxCall(context.removeVersionURL, JSON.stringify({ versionID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    VersionEditorUIControl.prototype.ShowDefinitionForm = function (version) {
        var title = ((version.VersionID > 0) ? "Edit Version Definition" : "Define New Version");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Product : </label></div><div>" + this.BuildDropDownHtmlWith("formProduct", this.version.ProjectProducts, "Select Product", version.ProductID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Number : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + version.NumberName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Nickname : </label></div><div><input type='text' id='formNickName' class='texttype' maxlength='50' style='width: 300px;' value='" + version.NickName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Goal : </label></div><div><textarea id='formDefGoal' type='textarea' name='textarea-goal' maxlength='1000' style='width: 300px; Height:100px;' placeholder='Benefits and reasons for creating this version'>" + this.version.Definition.Summary + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Status : </label></div><div>" + this.BuildDropDownHtmlWith("formStatus", VersionStatusOptions, "Select Status", version.VersionEnumType.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Month : </label></div><div>" + this.BuildDropDownHtmlWith("formMonth", MonthOptions, "Select Month", version.ReleasedMonth.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Year : </label></div><div>" + this.BuildDropDownHtmlWith("formYear", YearOptions, "Select Year", version.ReleasedYear.toString()) + "</div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        return false;
    };
    VersionEditorUIControl.prototype.OnDefinitionSaveClick = function (context) {
        var VM = new VersionViewModel();
        VM.ProductID = parseInt($.trim($("#formProduct").val()));
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
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: context.version.Definition, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    VersionEditorUIControl.prototype.ShowVersionRequirementForm = function () {
        this.app.ShowAlert("Coming Soon !");
    };
    VersionEditorUIControl.prototype.ShowVersionRequirementXXForm = function () {
        var _this = this;
        var title = "Define Version Requirements";
        var formHtml = "";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnVersionSaveClick, null, this, null);
        $('.table-select-requirement').click((function (e) { _this.AddVersionRequirement(); return false; }));
        $('.table-remove-requirement').click((function (e) { _this.RemoveVersionRequirement(parseInt($(e.target).attr('linkID'))); return false; }));
        return false;
    };
    VersionEditorUIControl.prototype.AddVersionRequirement = function () {
    };
    VersionEditorUIControl.prototype.RemoveVersionRequirement = function (requirementID) {
    };
    VersionEditorUIControl.prototype.OnVersionSaveClick = function (context) {
        var VM = new VersionViewModel();
        var isOK = true;
        if (isOK) {
            context.AjaxCall(context.versionSaveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    VersionEditorUIControl.prototype.OnEditorSaved = function (response, context) {
        if (response.Definition != undefined) {
            if (context.version.Definition.VersionID > 0) {
                context.version = response;
                context.Build();
                context.app.HideUnfreezeControls();
            }
            else {
                var rootUrl = window.location.href.substring(0, window.location.href.indexOf("/Project/"));
                window.location.replace(rootUrl + context.editorURL + response.Definition.ProjectID);
            }
        }
        else {
            context.app.ShowAlert(response);
        }
    };
    return VersionEditorUIControl;
}(RequirementUIControl));
var ProjectEditorUIControl = (function (_super) {
    __extends(ProjectEditorUIControl, _super);
    function ProjectEditorUIControl(formVM) {
        var _this = _super.call(this, "ProjectEditorUIControl", "#editor") || this;
        _this.editorURL = "/Project/ProjectEditor?ProjectId=";
        _this.saveURL = "/Project/CreateEditProject";
        _this.contextTypeSaveURL = "/Project/CreateEditProjectContextTypes";
        _this.removeContextTypeURL = "/Project/RemoveProjectContextType";
        _this.contextSaveURL = "/Project/CreateEditProjectContexts";
        _this.removeContextURL = "/Project/RemoveProjectContexts";
        _this.ProductSaveURL = "/Project/CreateEditProjectProduct";
        _this.removeProductURL = "/Project/RemoveProjectProduct";
        _this.Contexts = [];
        _this.ContextIds = [];
        _this.project = formVM;
        _this.variationWrapper = $("#editor-variations-wrapper");
        _this.domainContextsWrapper = $("#editor-domaincontexts-wrapper");
        _this.businessProcessesWrapper = $("#editor-processes-wrapper");
        _this.featuresWrapper = $("#editor-features-wrapper");
        _this.productsWrapper = $("#editor-products-wrapper");
        _this.Start();
        return _this;
    }
    ProjectEditorUIControl.prototype.Start = function () {
        var _this = this;
        this.Build();
        $("#edit-definition-link").click((function (e) { _this.ShowEditDefinitionForm(); return false; }));
        $("#add-domaincontext-link").click((function (e) { _this.ShowNewContextForm(_this.project.DomainContextId, ContextEnumType.DomainContext); return false; }));
        $("#add-process-link").click((function (e) { _this.ShowNewContextForm(_this.project.BusinessProcessesId, ContextEnumType.BusinessProcess); return false; }));
        $("#add-feature-link").click((function (e) { _this.ShowNewContextForm(_this.project.FeaturesId, ContextEnumType.Feature); return false; }));
        $("#add-product-link").click((function (e) { _this.ShowNewProductForm(); return false; }));
        $('#app-page-main-action-button').click((function (e) { _this.ShowNewVariationPointForm(); return false; }));
    };
    ProjectEditorUIControl.prototype.Build = function () {
        var _this = this;
        this.Contexts = [null, this.project.DomainContexts, this.project.BusinessProcesses, this.project.Features];
        this.ContextIds = [null, this.project.DomainContextId, this.project.BusinessProcessesId, this.project.FeaturesId];
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            if (this.project.VariationPoints.length > 0) {
                var editor = this;
                var html = '';
                jQuery.each(this.project.VariationPoints, function (index) {
                    html += ('<div class="editor-section"><div><span class="r"><a id="add-variationXXX-link" linkID="XXX" href="/">Add +</a></span><h2>&#9888; ' + this.Name + ' Variability <a class="edit-variation-link action-link" linkID="XXX" href="/">Edit</a><span class="action-text"> / </span><a class="remove-variation-link action-link" linkID="XXX" href="/">Remove</a></h2></div><div class="underlined-row"></div><div id="editor-variantsXXX-wrapper"><div class="tac">No Variants yet</div></div></div>').replace(/XXX/g, this.ContextTypeID);
                });
                editor.variationWrapper.html(html);
                jQuery.each(this.project.VariationPoints, function (index) {
                    var _this = this;
                    editor.Contexts.push(this.Contexts);
                    editor.ContextLabels.push(this.Name);
                    editor.ContextIds.push(this.ContextTypeID);
                    editor.BuildContexts($("#editor-variants" + this.ContextTypeID.toString() + "-wrapper"), ContextEnumType.RequirementVariation + index);
                    $("#add-variation" + this.ContextTypeID.toString() + "-link").click((function (e) { editor.ShowNewContextForm(_this.ContextTypeID, ContextEnumType.RequirementVariation + index); return false; }));
                });
            }
            this.BuildContexts(this.domainContextsWrapper, ContextEnumType.DomainContext);
            this.BuildContexts(this.businessProcessesWrapper, ContextEnumType.BusinessProcess);
            this.BuildContexts(this.featuresWrapper, ContextEnumType.Feature);
            this.BuildProducts();
            $(".edit-variation-link").click((function (e) { _this.ShowEditVariationForm(parseInt($(e.target).attr('linkid'))); return false; }));
            $(".remove-variation-link").click((function (e) { _this.ShowRemoveVariationForm(parseInt($(e.target).attr('linkid'))); return false; }));
            $(".edit-product-link").click((function (e) { _this.ShowEditProductForm(parseInt($(e.target).attr('linkid'))); return false; }));
            $(".remove-product-link").click((function (e) { _this.ShowRemoveProductForm(parseInt($(e.target).attr('linkid'))); return false; }));
            $(".edit-context-link").click((function (e) { _this.ShowEditContextForm(parseInt($(e.target).attr('linkid')), parseInt($(e.target).attr('typeid'))); return false; }));
            $(".remove-context-link").click((function (e) { _this.ShowRemoveContextForm(parseInt($(e.target).attr('linkid'))); return false; }));
        }
    };
    ProjectEditorUIControl.prototype.BuildDefinition = function () {
        $("#editor-definition-zone").html((this.FieldIsBlank(this.project.Definition.Brief)) ? "No<br/>Definition<br/>yet" : this.project.Definition.Brief.replace(/\n/gim, "<br/>"));
        $("#editor-definition-category").html("Projects");
        $("#editor-definition-code").html(this.project.Definition.CodeName);
    };
    ProjectEditorUIControl.prototype.ShowNewDefinitionForm = function () {
        var newVM = new ProjectDefinitionFormViewModel();
        newVM.ProjectID = 0;
        newVM.Title = "My New Project";
        newVM.Brief = "";
        newVM.CodeName = "PRJ-2019";
        this.project.Definition = newVM;
        this.ShowDefinitionForm(this.project.Definition);
    };
    ProjectEditorUIControl.prototype.ShowEditDefinitionForm = function () {
        this.ShowDefinitionForm(this.project.Definition);
    };
    ProjectEditorUIControl.prototype.BuildProducts = function () {
        var Context = this;
        if (this.project.Products.length > 0) {
            var html = '<div class="editor-list"><ol>';
            jQuery.each(this.project.Products, function () {
                html += '<li><h3>' + this.Label + '</h3> <div class="comment">' + ((Context.FieldIsBlank(this.Tooltip)) ? "" : this.Tooltip) + ' <a class="edit-product-link action-link" linkid="' + this.KeyValue + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-product-link action-link" linkid="' + this.KeyValue + '" href="/">Remove</a></div></li>';
            });
            html += '';
            html += '</ol></div>';
            this.productsWrapper.html(html);
        }
        else {
            this.productsWrapper.html('<div class="tac">No Products yet</div>');
        }
    };
    ProjectEditorUIControl.prototype.BuildContexts = function (contextsWrapper, ContextEnum) {
        var Context = this;
        var Contexts = this.Contexts[ContextEnum];
        var Label = this.ContextPluralLabels[ContextEnum];
        if (Contexts.length > 0) {
            var html = '<div class="editor-list"><ol>';
            jQuery.each(Contexts, function () {
                html += '<li><h3>' + this.Name + ((Context.FieldIsBlank(this.CodeName)) ? "" : ' (' + this.CodeName + ')') + '</h3> <div class="comment">' + ((Context.FieldIsBlank(this.Comment)) ? "" : this.Comment) + ' <a class="edit-context-link action-link" linkid="' + this.ContextID + '" typeid="' + ContextEnum + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-context-link action-link" linkid="' + this.ContextID + '" href="/">Remove</a></div></li>';
            });
            html += '';
            html += '</ol></div>';
            contextsWrapper.html(html);
        }
        else {
            contextsWrapper.html('<div class="tac">No ' + Label + ' yet</div>');
        }
    };
    ProjectEditorUIControl.prototype.ShowDefinitionForm = function (definition) {
        var title = ((this.project.Definition.ProjectID > 0) ? "Edit Project Definition" : "Define New Project");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Title : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + this.project.Definition.Title + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Brief : </label></div><div><textarea id='formDefBrief' type='textarea' name='textarea-brief' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Domain Problems and Business’s Needs that Software must solve..'>" + this.project.Definition.Brief + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Code Name # : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='20' style='width: 200px;' value='" + this.project.Definition.CodeName + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        return false;
    };
    ProjectEditorUIControl.prototype.OnDefinitionSaveClick = function (context) {
        var isOK = true;
        if (($("#formDefName").val() == null) || ($("#formDefName").val() === "")) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if (($("#formDefCodeName").val() == null) || ($("#formDefCodeName").val() === "")) {
            isOK = false;
            context.app.ShowAlert("Code Name is mandatory !");
        }
        if (isOK) {
            context.project.Definition.Title = $.trim($("#formDefName").val());
            context.project.Definition.Brief = $.trim($("#formDefBrief").val());
            context.project.Definition.CodeName = $.trim($("#formDefCodeName").val());
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: context.project.Definition, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
        }
    };
    ProjectEditorUIControl.prototype.ShowNewVariationPointForm = function () {
        var newVM = new ProjectContextTypeViewModel();
        newVM.ContextTypeID = -1, newVM.Name = "New Variation Point", newVM.ScaleOrder = 3;
        this.ShowVariationForm(newVM);
    };
    ProjectEditorUIControl.prototype.ShowEditVariationForm = function (contextTypeID) {
        var VM;
        jQuery.each(this.project.VariationPoints, function () { if (this.ContextTypeID == contextTypeID) {
            VM = this;
            return false;
        } });
        this.ShowVariationForm(VM);
    };
    ProjectEditorUIControl.prototype.ShowVariationForm = function (contextType) {
        var title = ((contextType.ContextTypeID > 0) ? "Edit Variation Point" : "Define New Variation Point");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Variation Name : </label></div><div><input type='text' id='formName' class='texttype' maxlength='50' style='width: 300px;' value='" + contextType.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Precision Scale : </label></div><div>" + this.BuildDropDownHtmlWith("formScaleOrder", PrecisionScale, "Select Scale", contextType.ScaleOrder.toString()) + "</div></div>";
        this.app.ShowCustomMessage("<div class='Item-form form-group'  typeid='" + contextType.ContextTypeID + "'>" + formHtml + "</div>", title, this.OnContextTypeSaveClick, null, this, null);
        return false;
    };
    ProjectEditorUIControl.prototype.OnContextTypeSaveClick = function (context) {
        var VM = new ProjectContextTypeViewModel();
        VM.ContextEnumType = ContextEnumType.RequirementVariation;
        VM.ContextTypeID = parseInt($.trim($(".context-form").attr('typeid')));
        VM.Name = $.trim($("#formName").val());
        VM.ScaleOrder = parseInt($.trim($("#formScaleOrder").val()));
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ScaleOrder))) {
            isOK = false;
            context.app.ShowAlert("Precision Scale is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.contextTypeSaveURL, JSON.stringify({ formVM: VM, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
        }
    };
    ProjectEditorUIControl.prototype.ShowRemoveVariationForm = function (contextTypeID) {
        this.removePendingID = contextTypeID;
        this.app.ShowCustomMessage("Are you sure you want to delete this variation point ?", "Remove Variation Point", this.OnContextTypeRemoveClick, null, this, null);
    };
    ProjectEditorUIControl.prototype.OnContextTypeRemoveClick = function (context) {
        context.AjaxCall(context.removeContextTypeURL, JSON.stringify({ contextTypeID: context.removePendingID, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
    };
    ProjectEditorUIControl.prototype.ShowNewContextForm = function (parentId, ContextEnum) {
        var newVM = new ProjectContextViewModel();
        newVM.ContextTypeID = parentId, newVM.Name = "New " + this.ContextLabels[ContextEnum], newVM.CodeName = "", newVM.Comment = "";
        newVM.SortOrder = 99;
        this.ShowContextForm(newVM, ContextEnum);
    };
    ProjectEditorUIControl.prototype.ShowEditContextForm = function (contextID, ContextEnum) {
        var VM;
        jQuery.each(this.Contexts[ContextEnum], function () { if (this.ContextID == contextID) {
            VM = this;
            return false;
        } });
        this.ShowContextForm(VM, ContextEnum);
    };
    ProjectEditorUIControl.prototype.ShowRemoveContextForm = function (contextID) {
        this.removePendingID = contextID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Item", this.OnContextRemoveClick, null, this, null);
    };
    ProjectEditorUIControl.prototype.OnContextRemoveClick = function (context) {
        context.AjaxCall(context.removeContextURL, JSON.stringify({ contextID: context.removePendingID, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
    };
    ProjectEditorUIControl.prototype.ShowContextForm = function (context, ContextEnum) {
        var Label = this.ContextLabels[ContextEnum];
        var title = ((context.ContextID > 0) ? "Edit " + Label : "Define New " + Label);
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input ='text' id='formName' class='text' maxlength='50' style='width: 300px;' value='" + context.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Comment : </label></div><div><input ='text' id='formComment' class='text' maxlength='50' style='width: 300px;' value='" + context.Comment + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Code Name : </label></div><div><input ='text' id='formCodeName' class='text' maxlength='4' style='width: 100px;' value='" + context.CodeName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Sort Order : </label></div><div><input  type='number' min='1' max='99' id='formSortOrder'  style='width: 60px;' value='" + context.SortOrder + "'></div></div>";
        this.app.ShowCustomMessage("<div class='context-form form-group' formid='" + context.ContextID + "' typeid='" + this.ContextIds[ContextEnum] + "'>" + formHtml + "</div>", title, this.OnContextSaveClick, null, this, null);
        return false;
    };
    ProjectEditorUIControl.prototype.OnContextSaveClick = function (context) {
        var VM = new ProjectContextViewModel();
        VM.ContextID = parseInt($.trim($(".context-form").attr('formid')));
        VM.ContextTypeID = parseInt($.trim($(".context-form").attr('typeid')));
        VM.Name = $.trim($("#formName").val());
        VM.CodeName = $.trim($("#formCodeName").val());
        VM.Comment = $.trim($("#formComment").val());
        VM.SortOrder = parseInt($.trim($("#formSortOrder").val()));
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.CodeName))) {
            isOK = false;
            context.app.ShowAlert("CodeName is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.contextSaveURL, JSON.stringify({ formVM: VM, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
        }
    };
    ProjectEditorUIControl.prototype.ShowNewProductForm = function () {
        var newVM = new ItemViewModel("My New Product", "");
        newVM.Tooltip = "";
        this.ShowProductForm(newVM);
    };
    ProjectEditorUIControl.prototype.ShowEditProductForm = function (ProductID) {
        var VM;
        jQuery.each(this.project.Products, function () { if (this.KeyValue == ProductID.toString()) {
            VM = this;
            return false;
        } });
        this.ShowProductForm(VM);
    };
    ProjectEditorUIControl.prototype.ShowRemoveProductForm = function (ProductID) {
        this.removePendingID = ProductID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Product", this.OnProductRemoveClick, null, this, null);
    };
    ProjectEditorUIControl.prototype.OnProductRemoveClick = function (context) {
        context.AjaxCall(context.removeProductURL, JSON.stringify({ contextID: context.removePendingID, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
    };
    ProjectEditorUIControl.prototype.ShowProductForm = function (Product) {
        var title = ((Product.KeyValue.length > 0) ? "Edit Product" : "Define New Product");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input ='text' id='formName' class='text' maxlength='50' style='width: 300px;' value='" + Product.Label + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Comment : </label></div><div><input ='text' id='formComment' class='text' maxlength='50' style='width: 300px;' value='" + Product.Tooltip + "'></div></div>";
        this.app.ShowCustomMessage("<div class='Product-form form-group' formid='" + Product.KeyValue + "'>" + formHtml + "</div>", title, this.OnProductSaveClick, null, this, null);
        return false;
    };
    ProjectEditorUIControl.prototype.OnProductSaveClick = function (Product) {
        var VM = new ItemViewModel($.trim($("#formName").val()), $(".Product-form").attr('formid'));
        VM.Tooltip = $.trim($("#formComment").val());
        var isOK = true;
        if ((Product.FieldIsBlank(VM.Label))) {
            isOK = false;
            Product.app.ShowAlert("Name is mandatory !");
        }
        if (isOK) {
            Product.AjaxCall(Product.ProductSaveURL, JSON.stringify({ formVM: VM, ProjectID: Product.project.Definition.ProjectID }), Product.OnEditorSaved, Product);
        }
    };
    ProjectEditorUIControl.prototype.OnEditorSaved = function (response, context) {
        if (response.Definition != undefined) {
            if (context.project.Definition.ProjectID > 0) {
                context.project = response;
                context.Build();
                context.app.HideUnfreezeControls();
            }
            else {
                var rootUrl = window.location.href.substring(0, window.location.href.indexOf("/Project/"));
                window.location.replace(rootUrl + context.editorURL + response.Definition.ProjectID);
            }
        }
        else {
            context.app.ShowAlert(response);
        }
    };
    return ProjectEditorUIControl;
}(RequirementUIControl));
var UIComponentEditorUIControl = (function (_super) {
    __extends(UIComponentEditorUIControl, _super);
    function UIComponentEditorUIControl(formVM) {
        var _this = _super.call(this, "UIComponentEditorUIControl", "#editor") || this;
        _this.saveURL = "/Project/CreateEditRessouceDefinition";
        _this.removeVersionURL = "/Project/RemoveProjectVersions";
        _this.ProjectID = formVM.ProjectID;
        _this.RessourceID = formVM.Definition.RessourceID;
        _this.Requirements = formVM.Requirements;
        _this.VariationPoints = formVM.VariationPoints;
        _this.editorURL = "/Project/UIComponentEditor?ComponentID=";
        _this.uIComponent = formVM;
        _this.definitionWrapper = $("#editor-definition-zone");
        _this.screenWrapper = $("#editor-screen-wrapper");
        _this.fieldWrapper = $("#editor-field-wrapper");
        _this.Start();
        return _this;
    }
    UIComponentEditorUIControl.prototype.Start = function () {
        var _this = this;
        this.Build();
        $("#edit-definition-link").click((function (e) { _this.ShowEditDefinitionForm(); return false; }));
        $("#add-screen-link").click((function (e) { _this.ShowNewScreenForm(); return false; }));
        $("#add-field-link").click((function (e) { _this.ShowNewFieldForm(); return false; }));
        $("#add-requirement-link").click((function (e) { _this.ShowNewRequirementForm(); return false; }));
    };
    UIComponentEditorUIControl.prototype.ReBuild = function (viewModel) {
        this.uIComponent = viewModel;
        this.Build();
    };
    UIComponentEditorUIControl.prototype.Build = function () {
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            this.BuildScreens();
            this.BuildFields();
            this.BuildRequirements();
        }
    };
    UIComponentEditorUIControl.prototype.BuildDefinition = function () {
        $("#editor-definition-zone").html((this.FieldIsBlank(this.uIComponent.Definition.Definition)) ? "No<br/>Definition<br/>yet" : this.uIComponent.Definition.Definition.replace(/\n/gim, "<br/>"));
        $("#editor-definition-category").html("<a href='/Project/RessourceCategory?Name=" + this.uIComponent.Definition.ContextName + "'>" + this.uIComponent.Definition.ContextName + '</a>');
        $("#editor-definition-code").html("<a href='/Project/RessourceEditor?RessourceID=" + this.uIComponent.Definition.RessourceID + "'>@" + this.uIComponent.Definition.RessourceID.toString() + '</a>');
    };
    UIComponentEditorUIControl.prototype.ShowEditDefinitionForm = function () {
        this.ShowDefinitionForm(this.uIComponent.Definition);
    };
    UIComponentEditorUIControl.prototype.BuildScreens = function () {
        var _this = this;
        if (this.definitionWrapper != null) {
        }
        $(".edit-screen-link").click((function (e) { _this.ShowEditScreenForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-screen-link").click((function (e) { _this.ShowRemoveScreenForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    UIComponentEditorUIControl.prototype.ShowNewScreenForm = function () {
        this.app.ShowAlert("Coming Soon !");
    };
    UIComponentEditorUIControl.prototype.ShowEditScreenForm = function (screenID) {
        var VM;
        jQuery.each(this.uIComponent.Screens, function () { if (this.RequirementID == screenID) {
            VM = this;
            return false;
        } });
        this.ShowFieldForm(VM);
    };
    UIComponentEditorUIControl.prototype.ShowRemoveScreenForm = function (screenID) {
        this.removePendingID = screenID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Screen", this.OnScreenRemoveClick, null, this, null);
    };
    UIComponentEditorUIControl.prototype.OnScreenRemoveClick = function (context) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    UIComponentEditorUIControl.prototype.BuildFields = function () {
        var _this = this;
        if (this.definitionWrapper != null) {
        }
        $(".edit-field-link").click((function (e) { _this.ShowEditFieldForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-field-link").click((function (e) { _this.ShowRemoveFieldForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    UIComponentEditorUIControl.prototype.ShowNewFieldForm = function () {
        this.app.ShowAlert("Coming Soon !");
    };
    UIComponentEditorUIControl.prototype.ShowEditFieldForm = function (fieldID) {
        var VM;
        jQuery.each(this.uIComponent.Screens, function () { if (this.RequirementID == fieldID) {
            VM = this;
            return false;
        } });
        this.ShowFieldForm(VM);
    };
    UIComponentEditorUIControl.prototype.ShowRemoveFieldForm = function (fieldID) {
        this.removePendingID = fieldID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Field", this.OnFieldRemoveClick, null, this, null);
    };
    UIComponentEditorUIControl.prototype.OnFieldRemoveClick = function (context) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    UIComponentEditorUIControl.prototype.ShowDefinitionForm = function (definition) {
        var title = ((definition.RessourceID > 0) ? "Edit UI Definition" : "Define New UI Component");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + definition.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>UI Overview : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 600px; Height:320px;' placeholder='UI Data, Features and Context Overview..'>" + definition.Definition + "</textarea></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
    };
    UIComponentEditorUIControl.prototype.OnDefinitionSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel();
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefVision").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ContextName))) {
            isOK = false;
            context.app.ShowAlert("Context is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    UIComponentEditorUIControl.prototype.ShowScreenForm = function (screen) {
        this.app.ShowAlert('Coming soon !');
    };
    UIComponentEditorUIControl.prototype.OnScreenSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel();
        VM.RessourceID = parseInt($("#formHiddenID").val());
        VM.RessourceEnumType = RessourceEnumType.Component;
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefVision").val());
        VM.ContextName = $.trim($("#formDefCodeName").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ContextName))) {
            isOK = false;
            context.app.ShowAlert("Context is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    UIComponentEditorUIControl.prototype.ShowFieldForm = function (field) {
        var title = ((field.RequirementID > 0) ? "Edit Requirement" : "Define New Requirement");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + this.uIComponent.Definition.Name + "'></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
    };
    UIComponentEditorUIControl.prototype.OnFieldSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel();
        VM.RessourceID = parseInt($("#formHiddenID").val());
        VM.RessourceEnumType = RessourceEnumType.Component;
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefVision").val());
        VM.ContextName = $.trim($("#formDefCodeName").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ContextName))) {
            isOK = false;
            context.app.ShowAlert("Context is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    return UIComponentEditorUIControl;
}(RequirementUIControl));
var PopUpUIControl = (function (_super) {
    __extends(PopUpUIControl, _super);
    function PopUpUIControl(controlTitle, html, zIndex, appRef) {
        var _this = _super.call(this, "PopUpUIControl", "#frozen_screen_layer") || this;
        _this.buttonIDOK = ".app_pop_up_okbtn";
        _this.buttonIDCancel = ".app_pop_up_cancelbtn";
        _this.buttonHtmlOK = '<input class="app_pop_up_okbtn" type="button" value="OK"  />';
        _this.buttonHtmlCancel = ' &nbsp; <input class="app_pop_up_cancelbtn" type="button" value="Cancel"  />';
        _this.popUpTemplate = '<div id="app_pop_up###" style="z-index:###;" class="popup-message"><div><div class="pop_up_title"></div><div style="background:#fcc;"><div class="pop_up_message_title"></div><div class="pop_up_message"></div></div><div class="pop_up_content_holder"></div><div class="pop_up_buttons"></div></div></div>';
        _this.title = controlTitle;
        _this.wrapperID = '#app_pop_up' + zIndex.toString();
        _this.app = appRef;
        _this.buttonIDOK = _this.wrapperID + ' ' + _this.buttonIDOK;
        _this.buttonIDCancel = _this.wrapperID + ' ' + _this.buttonIDCancel;
        _this.popUpTemplate = _this.popUpTemplate.replace(new RegExp('###', 'g'), zIndex.toString());
        if ($(_this.wrapperID).length == 0)
            $('#frozen_screen_layer').append(_this.popUpTemplate);
        $(_this.wrapperID + ' .pop_up_content_holder').html(html);
        _this.wrapper = $(_this.wrapperID);
        _this.wrapper.click(function (e) { e.stopPropagation(); });
        _this.titleZone = $(_this.wrapperID + ' .pop_up_title');
        _this.contentWrapper = $(_this.wrapperID + ' .pop_up_content_holder');
        _this.buttonZone = $(_this.wrapperID + ' .pop_up_buttons');
        _this.titleZone.html(_this.title);
        return _this;
    }
    PopUpUIControl.prototype.Show = function () {
        this.buttonZone.hide();
        this.Appear();
    };
    PopUpUIControl.prototype.ShowOk = function () {
        var _this = this;
        this.buttonZone.html(this.buttonHtmlOK);
        $(this.buttonIDOK).click((function (e) { _this.Hide(); return false; }));
        this.Appear();
    };
    PopUpUIControl.prototype.ShowOkCancel = function (okDelegate, cancelDelegate, okContext, cancelContext) {
        var _this = this;
        if (okContext == null)
            okContext = this;
        if (cancelContext == null)
            cancelContext = this;
        this.buttonZone.html(this.buttonHtmlOK + this.buttonHtmlCancel);
        $(this.buttonIDOK).click((function (e) { okDelegate(okContext); return false; }));
        if (cancelDelegate == null) {
            $(this.buttonIDCancel).click((function (e) { _this.Hide(); return false; }));
        }
        else {
            $(this.buttonIDCancel).click((function (e) { cancelDelegate(cancelContext); return false; }));
        }
        this.Appear();
    };
    ;
    PopUpUIControl.prototype.Hide = function () {
        this.wrapper.hide();
        if ($('.popup-message').length == 1)
            this.app.HideFrozenScreen();
        this.wrapper.remove();
    };
    PopUpUIControl.prototype.Appear = function () {
        this.app.ShowFrozenScreen();
        this.wrapper.show();
    };
    return PopUpUIControl;
}(RequirementUIControl));
var DomainConceptEditorUIControl = (function (_super) {
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
    };
    DomainConceptEditorUIControl.prototype.ShowNewResponsabilityForm = function () {
        this.app.ShowAlert("Coming Soon !");
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
        formHtml += "<div class='form-element-group'><div><label class='filter'>Definition : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='2000' style='width: 600px; Height:320px;' placeholder='Concept definition relevant for solving the domain problem in the real world..'>" + this.domainConcept.Definition.Definition + "</textarea></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
    };
    DomainConceptEditorUIControl.prototype.OnDefinitionSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel();
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefVision").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
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
        $('#associationTypeDP').change((function (e) { return _this.OnAssociationChange(parseInt($(e.target).val())); }));
    };
    DomainConceptEditorUIControl.prototype.OnAssociationChange = function (AssociationEnumTypeId) {
    };
    return DomainConceptEditorUIControl;
}(RequirementUIControl));
var UseCaseEditorUIControl = (function (_super) {
    __extends(UseCaseEditorUIControl, _super);
    function UseCaseEditorUIControl(formVM) {
        var _this = _super.call(this, "UseCaseEditorUIControl", "#editor") || this;
        _this.saveURL = "/Project/CreateEditRessouceDefinition";
        _this.ProjectID = formVM.ProjectID;
        _this.RessourceID = formVM.Definition.RessourceID;
        _this.Requirements = formVM.Requirements;
        _this.VariationPoints = formVM.VariationPoints;
        _this.editorURL = "/Project/UseCaseEditor?FunctionID=";
        _this.useCase = formVM;
        _this.definitionWrapper = $("#editor-definition-zone");
        _this.scenarioWrapper = $("#editor-scenario-wrapper");
        _this.requirementWrapper = $("#editor-requirement-wrapper");
        _this.Start();
        return _this;
    }
    UseCaseEditorUIControl.prototype.Start = function () {
        this.Build();
    };
    UseCaseEditorUIControl.prototype.ReBuild = function (viewModel) {
        this.useCase = viewModel;
        this.Build();
    };
    UseCaseEditorUIControl.prototype.Build = function () {
        var _this = this;
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            this.BuildScenarios();
            this.BuildRequirements();
        }
        $("#edit-definition-link").click((function (e) { _this.ShowEditDefinitionForm(); return false; }));
        $("#add-scenario-link").click((function (e) { _this.ShowNewScenarioForm(); return false; }));
        $("#add-uistep-link").click((function (e) { _this.ShowNewUIStepForm(); return false; }));
        $("#add-requirement-link").click((function (e) { _this.ShowNewRequirementForm(); return false; }));
    };
    UseCaseEditorUIControl.prototype.BuildDefinition = function () {
        $("#editor-definition-zone").html((this.FieldIsBlank(this.useCase.Definition.Definition)) ? "No<br/>Definition<br/>yet" : this.useCase.Definition.Definition.replace(/\n/gim, "<br/>"));
        $("#editor-definition-category").html("<a href='/Project/RessourceCategory?Name=" + this.useCase.Definition.ContextName + "'>" + this.useCase.Definition.ContextName + '</a>');
        $("#editor-definition-code").html("<a href='/Project/RessourceEditor?RessourceID=" + this.useCase.Definition.RessourceID + "'>@" + this.useCase.Definition.RessourceID.toString() + '</a>');
    };
    UseCaseEditorUIControl.prototype.ShowEditDefinitionForm = function () {
        this.ShowDefinitionForm(this.useCase.Definition);
    };
    UseCaseEditorUIControl.prototype.BuildScenarios = function () {
        var _this = this;
        if (this.definitionWrapper != null) {
        }
        $(".edit-scenario-link").click((function (e) { _this.ShowEditScenarioForm(parseInt($(e.target).attr('linkID'))); return false; }));
        $(".remove-scenario-link").click((function (e) { _this.ShowRemoveScenarioForm(parseInt($(e.target).attr('linkID'))); return false; }));
    };
    UseCaseEditorUIControl.prototype.ShowNewScenarioForm = function () {
        this.app.ShowAlert("Coming Soon !");
    };
    UseCaseEditorUIControl.prototype.ShowEditScenarioForm = function (scenarioID) {
        var VM;
        jQuery.each(this.useCase.Scenarios, function () { if (this.RequirementID == scenarioID) {
            VM = this;
            return false;
        } });
        this.ShowScenarioForm(VM);
    };
    UseCaseEditorUIControl.prototype.ShowRemoveScenarioForm = function (scenarioID) {
        this.removePendingID = scenarioID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Scenario", this.OnScenarioRemoveClick, null, this, null);
    };
    UseCaseEditorUIControl.prototype.OnScenarioRemoveClick = function (context) {
        context.AjaxCall(context.removeRequirementURL, JSON.stringify({ requirementID: context.removePendingID, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
    };
    UseCaseEditorUIControl.prototype.ShowDefinitionForm = function (definition) {
        var title = ((this.useCase.Definition.RessourceID > 0) ? "Edit Use Case Definition" : "Define New Use Case");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Function : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' placeholder='Verb + Noun Phrase' value='" + this.useCase.Definition.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Description : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 600px; Height:320px;' placeholder='Actors, Goals and Expected System Behavior..'>" + this.useCase.Definition.Definition + "</textarea></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
    };
    UseCaseEditorUIControl.prototype.OnDefinitionSaveClick = function (context) {
        var VM = new RessourceDefinitionViewModel();
        VM.Name = $.trim($("#formDefName").val());
        VM.Definition = $.trim($("#formDefVision").val());
        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) {
            isOK = false;
            context.app.ShowAlert("Name is mandatory !");
        }
        if ((context.FieldIsBlank(VM.ContextName))) {
            isOK = false;
            context.app.ShowAlert("Context is mandatory !");
        }
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    UseCaseEditorUIControl.prototype.ShowScenarioForm = function (scenario) {
        var title = ((scenario.RequirementID > 0) ? "Edit Scenario" : "Define New Scenario");
        formHtml += "<div class='form-element-group'><div><label class='filter'>Priority : </label></div><div><input type='number'name='quantity' min='1' max='5' id='formPriority'placeholder='1 - 5' value='" + scenario.Priority + "'></div></div>";
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + scenario.Title + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Given : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Actors, Goals and Expected System Behavior..'>" + scenario.Attribute1Value + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>When : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Actors, Goals and Expected System Behavior..'>" + scenario.Attribute2Value + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Then : </label></div><div><textarea id='formDefVision' type='textarea' name='textarea-Vision' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Actors, Goals and Expected System Behavior..'>" + scenario.Attribute3Value + "</textarea></div></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
    };
    UseCaseEditorUIControl.prototype.OnScenarioSaveClick = function (context) {
        var VM = new RequirementViewModel();
        var isOK = true;
        if (isOK) {
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: VM, ProjectID: context.ProjectID }), context.OnEditorSaved, context);
        }
    };
    UseCaseEditorUIControl.prototype.ShowNewUIStepForm = function () {
        this.app.ShowAlert("Coming Soon !");
    };
    return UseCaseEditorUIControl;
}(RequirementUIControl));
var Iteration0 = (function () {
    function Iteration0() {
    }
    Iteration0.prototype.Start = function () {
        var doc = document.documentElement;
        doc.setAttribute('data-useragent', navigator.userAgent);
        var w = $(window).width();
    };
    Iteration0.prototype.AddControl = function (control) {
        control.app = this;
        control.Start();
    };
    Iteration0.prototype.ShowFrozenScreen = function () {
        if (this.backScreen == null) {
            this.backScreen = $('#frozen_screen_layer');
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
    return Iteration0;
}());
var ProjectEditorViewModel = (function () {
    function ProjectEditorViewModel() {
        this.Definition = new ProjectDefinitionFormViewModel();
    }
    return ProjectEditorViewModel;
}());
var ProjectDefinitionFormViewModel = (function () {
    function ProjectDefinitionFormViewModel() {
    }
    return ProjectDefinitionFormViewModel;
}());
var ProjectContextTypeViewModel = (function () {
    function ProjectContextTypeViewModel() {
    }
    return ProjectContextTypeViewModel;
}());
var ProjectContextViewModel = (function () {
    function ProjectContextViewModel() {
    }
    return ProjectContextViewModel;
}());
var VersionEditorViewModel = (function () {
    function VersionEditorViewModel() {
        this.Definition = new VersionViewModel();
        this.ProjectProducts = [];
    }
    return VersionEditorViewModel;
}());
var VersionViewModel = (function () {
    function VersionViewModel() {
    }
    return VersionViewModel;
}());
var RequirementViewModel = (function () {
    function RequirementViewModel() {
    }
    return RequirementViewModel;
}());
var RessourceDefinitionViewModel = (function () {
    function RessourceDefinitionViewModel() {
    }
    return RessourceDefinitionViewModel;
}());
var RessourceAssociationViewModel = (function () {
    function RessourceAssociationViewModel() {
    }
    return RessourceAssociationViewModel;
}());
var DomainConceptEditorViewModel = (function () {
    function DomainConceptEditorViewModel() {
        this.Definition = new RessourceDefinitionViewModel();
    }
    return DomainConceptEditorViewModel;
}());
var UseCaseEditorViewModel = (function () {
    function UseCaseEditorViewModel() {
        this.Definition = new RessourceDefinitionViewModel();
    }
    return UseCaseEditorViewModel;
}());
var UIComponentEditorViewModel = (function () {
    function UIComponentEditorViewModel() {
        this.Definition = new RessourceDefinitionViewModel();
    }
    return UIComponentEditorViewModel;
}());
var ItemViewModel = (function () {
    function ItemViewModel(Name, Id) {
        this.Label = Name;
        this.KeyValue = Id;
    }
    return ItemViewModel;
}());
var ViewModelAPI = (function () {
    function ViewModelAPI() {
    }
    return ViewModelAPI;
}());
var BoardEditorViewModel = (function () {
    function BoardEditorViewModel() {
    }
    return BoardEditorViewModel;
}());
var BoardPoolViewModel = (function () {
    function BoardPoolViewModel() {
    }
    return BoardPoolViewModel;
}());
var BoardPoolStepViewModel = (function () {
    function BoardPoolStepViewModel() {
    }
    return BoardPoolStepViewModel;
}());
var BoardItemViewModel = (function () {
    function BoardItemViewModel() {
    }
    return BoardItemViewModel;
}());
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
    AssociationEnumType[AssociationEnumType["HasAttribute"] = 1] = "HasAttribute";
    AssociationEnumType[AssociationEnumType["HasOne"] = 2] = "HasOne";
    AssociationEnumType[AssociationEnumType["HasMany"] = 3] = "HasMany";
    AssociationEnumType[AssociationEnumType["AggregatesWith"] = 4] = "AggregatesWith";
    AssociationEnumType[AssociationEnumType["OperatesOn"] = 5] = "OperatesOn";
    AssociationEnumType[AssociationEnumType["HasActor"] = 6] = "HasActor";
    AssociationEnumType[AssociationEnumType["UseInfrastructure"] = 7] = "UseInfrastructure";
    AssociationEnumType[AssociationEnumType["HasFeatureFor"] = 8] = "HasFeatureFor";
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
    RequirementEnumType[RequirementEnumType["Rule"] = 1] = "Rule";
    RequirementEnumType[RequirementEnumType["Scenario"] = 2] = "Scenario";
    RequirementEnumType[RequirementEnumType["Field"] = 3] = "Field";
    RequirementEnumType[RequirementEnumType["Screen"] = 3] = "Screen";
})(RequirementEnumType || (RequirementEnumType = {}));
;
var ContextEnumType;
(function (ContextEnumType) {
    ContextEnumType[ContextEnumType["unknown"] = 0] = "unknown";
    ContextEnumType[ContextEnumType["DomainContext"] = 1] = "DomainContext";
    ContextEnumType[ContextEnumType["BusinessProcess"] = 2] = "BusinessProcess";
    ContextEnumType[ContextEnumType["Feature"] = 3] = "Feature";
    ContextEnumType[ContextEnumType["RequirementVariation"] = 4] = "RequirementVariation";
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
//# sourceMappingURL=C:/Users/labas/Desktop/DEV/Iteration0/Iteration0/Scripts/Iteration0.js.map