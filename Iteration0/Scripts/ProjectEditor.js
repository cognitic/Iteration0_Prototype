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
//      ProjectEditorUIControl
//
var ProjectEditorUIControl = /** @class */ (function (_super) {
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
            this.BuildContexts(this.domainContextsWrapper, ContextEnumType.DomainContext);
            this.BuildVariations();
            this.BuildContexts(this.businessProcessesWrapper, ContextEnumType.BusinessProcess);
            this.BuildContexts(this.featuresWrapper, ContextEnumType.Feature);
            this.BuildProducts();
            $(".add-variation-link").click((function (e) { _this.ShowNewVariationForm(parseInt($(e.target).attr('linkid'))); return false; }));
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
    ProjectEditorUIControl.prototype.BuildVariations = function () {
        //if (this.contextsWrapper.length > 0) {
        //    if (this.project.ContextTypes.length>0) {
        //        var html = '<div class="center-div" >';
        //        jQuery.each(this.project.ContextTypes, function () {
        //            html += '<table class="editor-contexts-table"><thead><tr><th>' + this.Name + '</th><th class="tar"><a editID="' + this.Contexttypeid + '" href="/">Edit</a> / <a editID="' + this.Contexttypeid +'" href="/ ">Remove</a></th></tr></thead>';
        //            html += '<tbody>';
        //            jQuery.each(this.Contexts, function () {
        //                html += '<tr><td>'+ this.Name +'</td></tr>';
        //            });
        //            html += '</tbody></table>';
        //        });
        //            html += '</div>';
        //        this.contextsWrapper.html(html);
        //    } else {
        //        this.contextsWrapper.html('<div class="tac">No Contexts yet</div>');
        //    }
        //}
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
        //this.app.AddControl(new PopUpUIControl('', "#popUpMessage"));
        var title = ((this.project.Definition.ProjectID > 0) ? "Edit Project Definition" : "Define New Project");
        //var saveButtonLabel = ((this.project.Definition.ProjectID > 0) ? "Save Definition" : "Start Project Modelling");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Title : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + this.project.Definition.Title + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Brief : </label></div><div><textarea id='formDefBrief' type='textarea' name='textarea-brief' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Domain Problems and Business’s Needs that Software must solve..'>" + this.project.Definition.Brief + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Code Name # : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='20' style='width: 200px;' value='" + this.project.Definition.CodeName + "'></div></div>";
        //formHtml += "<div class='filter-group'><label class='filter'>Is Only Visible By Owner : </label><input type='checkbox' id='IsPrivateCB'></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
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
            //context.project.Definition.Version = $.trim($("#formDefVersion").val());
            //context.project.IsPrivate = $("#IsPrivateCB").is(':checked');
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: context.project.Definition, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
        }
    };
    ProjectEditorUIControl.prototype.ShowNewVariationPointForm = function () {
        this.app.ShowAlert("Coming Soon !");
    };
    ProjectEditorUIControl.prototype.ShowNewVariationForm = function (variationtypeid) {
        this.app.ShowAlert(variationtypeid.toString());
    };
    ProjectEditorUIControl.prototype.ShowEditVariationForm = function (contextType) {
        var title = ((contextType.ContextTypeID > 0) ? "Edit Context" : "Define New Context");
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Context Name : </label></div><div><input type='text' id='formContext' class='texttype' maxlength='50' style='width: 300px;' value='" + contextType.Name + "'></div></div>";
        //formHtml += "<div class='form-element-group'><div><label class='filter'>Sort Order : </label></div><div><input  type='number' min='1' max='5'  id='formSortOrder' class='texttype'  style='width: 60px;' value='" + contextType.ScaleOrder + "'></div></div>";
        //formHtml += "<div class='form-element-group'><div><label class='filter'>Options : </label></div>";
        //formHtml += "<div id='table' class='table-editable'><table class='table'>";
        //formHtml += "<tr><th>Name</th><th>Value</th><th>Order</th><th>Add</th></tr>";
        //formHtml += "<tr><td contenteditable='true'>Untitled</td><td contenteditable='true'>undefined</td><td>99</td><td>Remove</td></tr>";
        //formHtml += "</table></div>";
        //this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnContextSaveClick, null, this, null);
        ////load contextType.Contexts[0].Name each
        //$('.table-add-context').click((e => { this.AddNewContext(); return false }));
        //$('.table-remove-context').click((e => { this.RemoveContext(parseInt($(e.target).attr('linkid'))); return false }));
        return false;
    };
    ProjectEditorUIControl.prototype.AddNewContext = function () {
    };
    ProjectEditorUIControl.prototype.RemoveContext = function (contextID) {
    };
    ProjectEditorUIControl.prototype.ShowNewContextForm = function (parentId, ContextEnum) {
        var newVM = new ProjectContextViewModel();
        newVM.ContextTypeID = parentId, newVM.Name = "New " + this.ContextLabels[ContextEnum], newVM.CodeName = "", newVM.Comment = "";
        newVM.Order = 99;
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
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Context", this.OnContextRemoveClick, null, this, null);
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
        formHtml += "<div class='form-element-group'><div><label class='filter'>Sort Order : </label></div><div><input  type='number' min='1' max='99' id='formSortOrder'  style='width: 60px;' value='" + context.Order + "'></div></div>";
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
        VM.Order = parseInt($.trim($("#formSortOrder").val()));
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
                //xxx feedback ShowInsideMessage  "Definition has been saved !"
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
//# sourceMappingURL=ProjectEditor.js.map