/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      ProjectEditorUIControl
//
class ProjectEditorUIControl extends RequirementUIControl {
    project: ProjectEditorViewModel;
    variationWrapper: JQuery
    domainContextsWrapper: JQuery;
    businessProcessesWrapper: JQuery;
    featuresWrapper: JQuery;
    productsWrapper: JQuery;
    infrastructuresWrapper: JQuery;
    editorURL: string = "/Project/ProjectEditor?ProjectId=";
    saveURL: string = "/Project/CreateEditProject";
    contextTypeSaveURL: string = "/Project/CreateEditProjectContextTypes";
    removeContextTypeURL: string = "/Project/RemoveProjectContextType";
    contextSaveURL: string = "/Project/CreateEditProjectContexts";
    removeContextURL: string = "/Project/RemoveProjectContexts";
    ProductSaveURL: string = "/Project/CreateEditProjectProduct";
    removeProductURL: string = "/Project/RemoveProjectProduct";
    InfrastructureSaveURL: string = "/Project/CreateEditProjectInfrastructure";
    removeInfrastructureURL: string = "/Project/RemoveRessourceDefinition";
    Contexts = []; ContextIds = [];

    constructor(formVM: ProjectEditorViewModel) {
        super("ProjectEditorUIControl", "#editor");
        this.project = formVM;
        this.variationWrapper = $("#editor-variations-wrapper");
        this.domainContextsWrapper = $("#editor-domaincontexts-wrapper");
        this.businessProcessesWrapper = $("#editor-processes-wrapper");
        this.featuresWrapper = $("#editor-features-wrapper");
        this.productsWrapper = $("#editor-products-wrapper");
        this.infrastructuresWrapper = $("#editor-infrastructures-wrapper");
        this.Start();
    }
    public Start() {
        this.Build();
        $("#edit-definition-link").click((e => { this.ShowEditDefinitionForm(); return false }) );
        $("#add-domaincontext-link").click((e => { this.ShowNewContextForm(this.project.DomainContextId, ContextEnumType.DomainContext); return false }));
        $("#add-process-link").click((e => { this.ShowNewContextForm(this.project.BusinessProcessesId, ContextEnumType.BusinessProcess); return false }));
        $("#add-feature-link").click((e => { this.ShowNewContextForm(this.project.FeaturesId, ContextEnumType.Feature); return false }));
        $("#add-product-link").click((e => { this.ShowNewProductForm(); return false }));
        $("#add-infrastructure-link").click((e => { this.ShowNewInfrastructureForm(); return false }));
        $('#app-page-main-action-button').click((e => { this.ShowNewVariationPointForm(); return false }));
    }
    public Build() {
        this.Contexts = [null, this.project.DomainContexts, this.project.BusinessProcesses, this.project.Features];
        this.ContextIds = [null, this.project.DomainContextId, this.project.BusinessProcessesId, this.project.FeaturesId];
        if (this.wrapper.length > 0) {
            this.BuildDefinition();
            if (this.project.VariationPoints.length > 0) {
                var editor = this; var html = '';
                jQuery.each(this.project.VariationPoints, function (index) {
                    html += ('<div class="editor-section"><div><span class="r"><a id="add-variationXXX-link" linkID="XXX" href="/">Add +</a></span><h2>&#9888; ' + this.Name + ' Variability <a class="edit-variation-link action-link" linkID="XXX" href="/">Edit</a><span class="action-text"> / </span><a class="remove-variation-link action-link" linkID="XXX" href="/">Remove</a></h2></div><div class="underlined-row"></div><div id="editor-variantsXXX-wrapper"><div class="tac">No Variants yet</div></div></div>').replace(/XXX/g, this.ContextTypeID);
                });
                editor.variationWrapper.html(html);
                jQuery.each(this.project.VariationPoints, function (index) {
                    editor.Contexts.push(this.Contexts); editor.ContextLabels.push(this.Name); editor.ContextIds.push(this.ContextTypeID);
                    editor.BuildContexts($("#editor-variants" + this.ContextTypeID.toString() + "-wrapper"), ContextEnumType.VariationPoint + index);
                    $("#add-variation" + this.ContextTypeID.toString() + "-link").click((e => { editor.ShowNewContextForm(this.ContextTypeID, ContextEnumType.VariationPoint + index); return false }));
                });
            } 
            this.BuildProducts();
            this.BuildContexts(this.domainContextsWrapper, ContextEnumType.DomainContext);
            this.BuildContexts(this.businessProcessesWrapper, ContextEnumType.BusinessProcess);
            this.BuildContexts(this.featuresWrapper, ContextEnumType.Feature);
            this.BuildInfrastructures();
            $(".edit-variation-link").click((e => { this.ShowEditVariationForm(parseInt($(e.target).attr('linkid'))); return false }));
            $(".remove-variation-link").click((e => { this.ShowRemoveVariationForm(parseInt($(e.target).attr('linkid'))); return false }));
            $(".edit-product-link").click((e => { this.ShowEditProductForm(parseInt($(e.target).attr('linkid'))); return false }));
            $(".remove-product-link").click((e => { this.ShowRemoveProductForm(parseInt($(e.target).attr('linkid'))); return false }));
            $(".edit-context-link").click((e => { this.ShowEditContextForm(parseInt($(e.target).attr('linkid')), parseInt($(e.target).attr('typeid'))); return false }));
            $(".remove-context-link").click((e => { this.ShowRemoveContextForm(parseInt($(e.target).attr('linkid'))); return false }));
            $(".edit-infrastructure-link").click((e => { this.ShowEditInfrastructureForm(parseInt($(e.target).attr('linkid'))); return false }));
            $(".remove-infrastructure-link").click((e => { this.ShowRemoveInfrastructureForm(parseInt($(e.target).attr('linkid'))); return false }));
        }
    }
    public BuildDefinition() {
        $(".editor-header-bubble-title").html(this.project.Definition.Title + (this.FieldIsBlank(this.project.Definition.CodeName) ? "": " - " + this.project.Definition.CodeName));
        $(".editor-header-bubble-definition").html((this.FieldIsBlank(this.project.Definition.Brief)) ? "No Definition yet" : this.project.Definition.Brief.replace(/\n/gim, "<br/>"));
    }
    public ShowNewDefinitionForm() {
        var newVM = new ProjectDefinitionFormViewModel();
        newVM.ProjectID = 0; newVM.Title = "My New Project"; newVM.Brief = ""; newVM.CodeName = "PRJ-2019";
        this.project.Definition = newVM;
        this.ShowDefinitionForm(this.project.Definition);
    }
    public ShowEditDefinitionForm() {
        this.ShowDefinitionForm(this.project.Definition);
    }
    public BuildInfrastructures() {
        var Context = this;
        if (this.project.Infrastructures.length > 0) {
            var html = '<div class="editor-list"><ol>';
            jQuery.each(this.project.Infrastructures, function () {
                html += '<li><h3>' + this.Label + '</h3> <div class="comment">' + ((Context.FieldIsBlank(this.Tooltip)) ? "" : this.Tooltip) + ' <a class="edit-infrastructure-link action-link" linkid="' + this.KeyValue + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-infrastructure-link action-link" linkid="' + this.KeyValue + '" href="/">Remove</a></div></li>';
            });
            html += '';
            html += '</ol></div>';
            this.infrastructuresWrapper.html(html);
        } else {
            this.infrastructuresWrapper.html('<div class="tac">No Infrastructures yet</div>');
        }
    }
    public BuildProducts() {
        var Context = this;
        if (this.project.Products.length > 0) {
            var html = '<div class="editor-list"><ol>';
            jQuery.each(this.project.Products, function () {
                html += '<li><h3>' + this.Label + '</h3> <div class="comment">' + ((Context.FieldIsBlank(this.Tooltip)) ? "" : this.Tooltip)  + ' <a class="edit-product-link action-link" linkid="' + this.KeyValue + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-product-link action-link" linkid="' + this.KeyValue + '" href="/">Remove</a></div></li>';
            });
            html += '';
            html += '</ol></div>';
            this.productsWrapper.html(html);
        } else {
            this.productsWrapper.html('<div class="tac">No Products yet</div>');
        }
    }
    public BuildContexts(contextsWrapper: JQuery, ContextEnum: ContextEnumType) {
        var Context=  this;
        var Contexts: Array<ProjectContextViewModel> = this.Contexts[ContextEnum];
        var Label = this.ContextPluralLabels[ContextEnum];
        if (Contexts.length > 0) {
            var html = '<div class="editor-list"><ol>';
            jQuery.each(Contexts, function () {
                html += '<li><h3>' + this.Name + ((Context.FieldIsBlank(this.CodeName)) ? "" : ' (' + this.CodeName + ')') + '</h3> <div class="comment">' + ((Context.FieldIsBlank(this.Comment)) ? "" : this.Comment) + ' <a class="edit-context-link action-link" linkid="' + this.ContextID + '" typeid="' + ContextEnum + '" href="/">Edit</a><span class="action-text"> / </span><a class="remove-context-link action-link" linkid="' + this.ContextID +'" href="/">Remove</a></div></li>';
            });
            html += '';
            html += '</ol></div>';
            contextsWrapper.html(html);
        } else {
            contextsWrapper.html('<div class="tac">No ' + Label + ' yet</div>');
        }
    }
    public ShowDefinitionForm(definition: ProjectDefinitionFormViewModel) {
        //this.app.AddControl(new PopUpUIControl('', "#popUpMessage"));
        var title = ((this.project.Definition.ProjectID > 0) ? "Edit Project Definition" : "Define New Project");
        //var saveButtonLabel = ((this.project.Definition.ProjectID > 0) ? "Save Definition" : "Start Project Modelling");
        var formHtml = "<div class='form-element-group'><div><label >Title : </label></div><div><input type='text' id='formDefName' class='texttype' maxlength='50' style='width: 300px;' value='" + this.project.Definition.Title + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Brief : </label></div><div><textarea id='formDefBrief' type='textarea' name='textarea-brief' maxlength='1000' style='width: 500px; Height:160px;' placeholder='Domain Problems and Business’s Needs that Software must solve..'>" + this.project.Definition.Brief + "</textarea></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Code Name # : </label></div><div><input type='text' id='formDefCodeName' class='texttype' maxlength='20' style='width: 200px;' value='" + this.project.Definition.CodeName + "'></div></div>";
            //formHtml += "<div class='filter-group'><label >Is Only Visible By Owner : </label><input type='checkbox' id='IsPrivateCB'></div>";
        this.app.ShowCustomMessage("<div class='form-group'>" + formHtml + "</div>", title, this.OnDefinitionSaveClick, null, this, null);
        //$('#ProductEnabledCB').prop('checked', IsActive);
        return false;
    }
    public OnDefinitionSaveClick(context: ProjectEditorUIControl) {
        var isOK = true;
        if (($("#formDefName").val() == null) || ($("#formDefName").val() === "")) {
            isOK = false; context.app.ShowAlert("Name is mandatory !");
        }
        if (($("#formDefCodeName").val() == null) || ($("#formDefCodeName").val() === "")) {
            isOK = false; context.app.ShowAlert("Code Name is mandatory !");
        }
        if (isOK) {
            context.project.Definition.Title = $.trim($("#formDefName").val());
            context.project.Definition.Brief = $.trim($("#formDefBrief").val());
            context.project.Definition.CodeName = $.trim($("#formDefCodeName").val());
            //context.project.Definition.Version = $.trim($("#formDefVersion").val());
            //context.project.IsPrivate = $("#IsPrivateCB").is(':checked');
            context.AjaxCall(context.saveURL, JSON.stringify({ formVM: context.project.Definition, ProjectID: context.project.Definition.ProjectID  }), context.OnEditorSaved, context);
        }
    }    
    public ShowNewVariationPointForm() {
        var newVM = new ProjectContextTypeViewModel(); newVM.ContextTypeID = -1, newVM.Name = "New Variation Point", newVM.ScaleOrder = 3, newVM.UsedAsProductAlternative = false;
        this.ShowVariationForm(newVM);
    }
    public ShowEditVariationForm(contextTypeID: Number) {
        var VM: ProjectContextTypeViewModel;
        jQuery.each(this.project.VariationPoints, function () { if (this.ContextTypeID == contextTypeID) { VM = this; return false; } });
        this.ShowVariationForm(VM);
    }
    public ShowVariationForm(contextType: ProjectContextTypeViewModel) {
        var title = ((contextType.ContextTypeID > 0) ? "Edit Variation Point" : "Define New Variation Point");
        var formHtml = "<div class='form-element-group'><div><label >Variation Name : </label></div><div><input type='text' id='formName' class='texttype' maxlength='50' style='width: 300px;' value='" + contextType.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Precision Scale : </label></div><div>" + this.BuildDropDownHtmlWith("formScaleOrder", PrecisionScale, "Select Scale", contextType.ScaleOrder.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><label >Used as Product Alternative : </label><input type='checkbox' id='IsProductAlternativeCB'></div>";

        this.app.ShowCustomMessage("<div class='Item-form form-group'  typeid='" + contextType.ContextTypeID + "'>" + formHtml + "</div>", title, this.OnContextTypeSaveClick, null, this, null);
        $('#IsProductAlternativeCB').prop('checked', contextType.UsedAsProductAlternative);
        return false;
    }
    public OnContextTypeSaveClick(context: ProjectEditorUIControl) {
        var VM = new ProjectContextTypeViewModel(); VM.ContextEnumType = ContextEnumType.VariationPoint;
        VM.ContextTypeID = parseInt($.trim($(".context-form").attr('typeid')));
        VM.Name = $.trim($("#formName").val()); 
        VM.ScaleOrder = parseInt($.trim($("#formScaleOrder").val()));
        VM.UsedAsProductAlternative = $("#IsProductAlternativeCB").is(':checked');

        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
        if ((context.FieldIsBlank(VM.ScaleOrder))) { isOK = false; context.app.ShowAlert("Precision Scale is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.contextTypeSaveURL, JSON.stringify({ formVM: VM, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
        }
    }
    public ShowRemoveVariationForm(contextTypeID: Number) {
        this.removePendingID = contextTypeID;
        this.app.ShowCustomMessage("Are you sure you want to delete this variation point ?", "Remove Variation Point", this.OnContextTypeRemoveClick, null, this, null);
    }
    public OnContextTypeRemoveClick(context: ProjectEditorUIControl) {
        context.AjaxCall(context.removeContextTypeURL, JSON.stringify({ contextTypeID: context.removePendingID, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowNewContextForm(parentId: number, ContextEnum: ContextEnumType) {
        var newVM = new ProjectContextViewModel(); newVM.ContextTypeID = parentId, newVM.Name = "New " + this.ContextLabels[ContextEnum], newVM.CodeName = "", newVM.Comment = ""; newVM.SortOrder = 99;
        this.ShowContextForm(newVM, ContextEnum);
    }
    public ShowEditContextForm(contextID: Number, ContextEnum: ContextEnumType) {
        var VM: ProjectContextViewModel;
        jQuery.each(this.Contexts[ContextEnum], function () { if (this.ContextID == contextID) { VM = this; return false; } });
        this.ShowContextForm(VM, ContextEnum);
    }
    public ShowRemoveContextForm(contextID: Number) {
        this.removePendingID = contextID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Item", this.OnContextRemoveClick, null, this, null);
    }
    public OnContextRemoveClick(context: ProjectEditorUIControl) {
        context.AjaxCall(context.removeContextURL, JSON.stringify({ contextID: context.removePendingID, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowContextForm(context: ProjectContextViewModel, ContextEnum: ContextEnumType) {
        var Label = this.ContextLabels[ContextEnum];
        var title = ((context.ContextID > 0) ? "Edit " + Label : "Define New " + Label);
        var formHtml = "<div class='form-element-group'><div><label >Name : </label></div><div><input ='text' id='formName' class='text' maxlength='50' style='width: 300px;' value='" + context.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Comment : </label></div><div><input ='text' id='formComment' class='text' maxlength='50' style='width: 300px;' value='" + context.Comment + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Code Name : </label></div><div><input ='text' id='formCodeName' class='text' maxlength='4' style='width: 100px;' value='" + context.CodeName + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Sort Order : </label></div><div><input  type='number' min='1' max='99' id='formSortOrder'  style='width: 60px;' value='" + context.SortOrder + "'></div></div>";

        this.app.ShowCustomMessage("<div class='context-form form-group' formid='" + context.ContextID + "' typeid='" + this.ContextIds[ContextEnum] + "'>" + formHtml + "</div>", title, this.OnContextSaveClick, null, this, null);
        return false;
    }
    public OnContextSaveClick(context: ProjectEditorUIControl) {
        var VM = new ProjectContextViewModel();
        VM.ContextID = parseInt($.trim($(".context-form").attr('formid')));
        VM.ContextTypeID = parseInt($.trim($(".context-form").attr('typeid')));
        VM.Name = $.trim($("#formName").val()); VM.CodeName = $.trim($("#formCodeName").val()); VM.Comment = $.trim($("#formComment").val()); VM.SortOrder = parseInt($.trim($("#formSortOrder").val()));

        var isOK = true;
        if ((context.FieldIsBlank(VM.Name))) { isOK = false; context.app.ShowAlert("Name is mandatory !"); }
        if ((context.FieldIsBlank(VM.CodeName))) { isOK = false; context.app.ShowAlert("CodeName is mandatory !"); }
        if (isOK) {
            context.AjaxCall(context.contextSaveURL, JSON.stringify({ formVM: VM, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
        }
    }
    public ShowNewProductForm() {
        var newVM = new ItemViewModel("My New Product", ""); newVM.Tooltip = "";
        this.ShowProductForm(newVM);
    }
    public ShowEditProductForm(ProductID: Number) {
        var VM: ItemViewModel;
        jQuery.each(this.project.Products, function () { if (this.KeyValue == ProductID.toString()) { VM = this; return false; } });
        this.ShowProductForm(VM);
    }
    public ShowRemoveProductForm(ProductID: Number) {
        this.removePendingID = ProductID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Product", this.OnProductRemoveClick, null, this, null);
    }
    public OnProductRemoveClick(context: ProjectEditorUIControl) {
        context.AjaxCall(context.removeProductURL, JSON.stringify({ contextID: context.removePendingID, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowProductForm(Product: ItemViewModel) {
        var title = ((Product.KeyValue.length > 0) ? "Edit Product" : "Define New Product");
        var formHtml = "<div class='form-element-group'><div><label >Name : </label></div><div><input ='text' id='formName' class='text' maxlength='50' style='width: 300px;' value='" + Product.Label + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Comment : </label></div><div><input ='text' id='formComment' class='text' maxlength='50' style='width: 300px;' value='" + Product.Tooltip + "'></div></div>";

        this.app.ShowCustomMessage("<div class='Product-form form-group' formid='" + Product.KeyValue + "'>" + formHtml + "</div>", title, this.OnProductSaveClick, null, this, null);
        return false;
    }
    public OnProductSaveClick(Product: ProjectEditorUIControl) {
        var VM = new ItemViewModel($.trim($("#formName").val()), $(".Product-form").attr('formid'));
        VM.Tooltip = $.trim($("#formComment").val()); 

        var isOK = true;
        if ((Product.FieldIsBlank(VM.Label))) { isOK = false; Product.app.ShowAlert("Name is mandatory !"); }
        if (isOK) {
            Product.AjaxCall(Product.ProductSaveURL, JSON.stringify({ formVM: VM, ProjectID: Product.project.Definition.ProjectID }), Product.OnEditorSaved, Product);
        }
    }
    public ShowNewInfrastructureForm() {
        var newVM = new ItemViewModel("My New Infrastructure", ""); newVM.Tooltip = "";
        this.ShowInfrastructureForm(newVM);
    }
    public ShowEditInfrastructureForm(InfrastructureID: Number) {
        var VM: ItemViewModel;
        jQuery.each(this.project.Infrastructures, function () { if (this.KeyValue == InfrastructureID.toString()) { VM = this; return false; } });
        this.ShowInfrastructureForm(VM);
    }
    public ShowRemoveInfrastructureForm(InfrastructureID: Number) {
        this.removePendingID = InfrastructureID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Infrastructure", this.OnInfrastructureRemoveClick, null, this, null);
    }
    public OnInfrastructureRemoveClick(context: ProjectEditorUIControl) {
        context.AjaxCall(context.removeInfrastructureURL, JSON.stringify({ contextID: context.removePendingID, ProjectID: context.project.Definition.ProjectID }), context.OnEditorSaved, context);
    }
    public ShowInfrastructureForm(Infrastructure: ItemViewModel) {
        var title = ((Infrastructure.KeyValue.length > 0) ? "Edit Infrastructure" : "Define New Infrastructure");
        var formHtml = "<div class='form-element-group'><div><label >Name : </label></div><div><input ='text' id='formName' class='text' maxlength='50' style='width: 300px;' value='" + Infrastructure.Label + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >Comment : </label></div><div><input ='text' id='formComment' class='text' maxlength='50' style='width: 300px;' value='" + Infrastructure.Tooltip + "'></div></div>";

        this.app.ShowCustomMessage("<div class='infrastructure-form form-group' formid='" + Infrastructure.KeyValue + "'>" + formHtml + "</div>", title, this.OnInfrastructureSaveClick, null, this, null);
        return false;
    }
    public OnInfrastructureSaveClick(Infrastructure: ProjectEditorUIControl) {
        var VM = new ItemViewModel($.trim($("#formName").val()), $(".infrastructure-form").attr('formid'));
        VM.Tooltip = $.trim($("#formComment").val());

        var isOK = true;
        if ((Infrastructure.FieldIsBlank(VM.Label))) { isOK = false; Infrastructure.app.ShowAlert("Name is mandatory !"); }
        if (isOK) {
            Infrastructure.AjaxCall(Infrastructure.InfrastructureSaveURL, JSON.stringify({ formVM: VM, ProjectID: Infrastructure.project.Definition.ProjectID }), Infrastructure.OnEditorSaved, Infrastructure);
        }
    }
    public OnEditorSaved(response, context: ProjectEditorUIControl) {
        if (response.Definition != undefined) {
            if (context.project.Definition.ProjectID > 0) {
                context.project = response;
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
