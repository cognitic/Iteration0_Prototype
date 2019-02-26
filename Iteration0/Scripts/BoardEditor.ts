/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      ProjectBoardUIControl
//
class BoardEditorUIControl extends RequirementUIControl {
    board: BoardEditorViewModel;
    api: ViewModelAPI;

    constructor(formVM: BoardEditorViewModel, formAPI: ViewModelAPI) {
        super("ProjectBoardUIControl", "#board");
        this.board = formVM;
        this.api = formAPI;
        this.Start();
    }
    public Start() {
        this.Build();
        $('#app-page-main-action-button').click((e => { this.ShowNewItemForm(); return false }));
    }
    public Build() {
        if (this.wrapper.length > 0) {
            this.BuildPools();
            $(".board-edit-link").click((e => { this.ShowEditItemForm(parseInt($(e.target).attr('linkid')), parseInt($(e.target).attr('typeid'))); return false }));
            $(".remove-board-link").click((e => { this.ShowRemoveItemForm(parseInt($(e.target).attr('linkid'))); return false }));
        }
    }
    public BuildPools() {
        var context = this;
        if (this.board.Pools.length > 0) {
            var html = '';
            jQuery.each(this.board.Pools, function () {
                html += '<div class="board-pool"><div class="board-pool-header">' + this.PoolName + '</div>';
                if (this.Steps.length > 0) {
                    jQuery.each(this.Steps, function () {
                        var scale1Html = ""; var scale2Html = "";
                        jQuery.each(this.Scale1Items, function () {
                            scale1Html += '<div class="scale1-item"><a class="editor-edit-link" href="' + context.api.ItemEditorURL + this.ItemID + '">' + this.Name + '</a> <a  linkid="' + this.ItemID + '" typeid="' + context.board.ItemType + '" class="board-edit-link" href="/">°</a></div>';
                        });
                        jQuery.each(this.Scale2Items, function () {
                            scale2Html += '<div class="scale2-item"><a class="editor-edit-link" href="' + context.api.ItemEditorURL + this.ItemID + '">' + this.Name + '</a> <a  linkid="' + this.ItemID + '" typeid="' + context.board.ItemType + '" class="board-edit-link" href="/">°</a></div>';
                        });
                        html += '<div class="board-pool-step"><div class="scale1-item-wrapper">' + scale1Html + '</div><div class="scale2-item-wrapper">' + scale2Html + '</div></div>';
                    });
                } else {
                    html += '<div class="tac">Empty</div>';
                }
                html += '</div>';
            });
            this.wrapper.html(html);
        } else {
            this.wrapper.html('<div class="board-pool"><br/><div class="tac">No ' + this.ContextPluralLabels[this.board.ItemType] + ' yet</div></div>');
        }
    }
    public ShowNewItemForm() {
        if (this.board.ProjectPools.length == 0) {
            this.app.ShowAlert('Please set project ' + this.ContextPluralLabels[this.board.ItemType] + ' first');
        } else {
            var newVM = new BoardItemViewModel(); newVM.Name = "New " + this.ContextItemLabels[this.board.ItemType], newVM.PoolID = -1; newVM.ScaleOrder = 2; newVM.StepOrder = 1; newVM.SortOrder = 99;
            this.ShowItemForm(newVM, this.board.ItemType as number);
        } 
    }
    public ShowEditItemForm(ItemID: Number, ItemEnum: ContextEnumType) {
        this.ShowItemForm(this.GetItem(ItemID), ItemEnum);
    }
    public ShowRemoveItemForm(ItemID: Number) {
        this.removePendingID = ItemID;
        this.app.ShowCustomMessage("Are you sure you want to delete this item ?", "Remove Item", this.api.ItemRemoveURL, null, this, null);
    }
    public ShowItemForm(Item: BoardItemViewModel, ItemEnum: ContextEnumType) {
        var Label = this.ContextItemLabels[ItemEnum];
        var title = ((Item.ItemID > 0) ? "Edit " + Label : "Define New " + Label);
        var formHtml = "<div class='form-element-group'><div><label class='filter'>Name : </label></div><div><input ='text' id='formName' class='text' maxlength='50' style='width: 300px;' value='" + Item.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>" + this.ContextLabels[this.board.ItemType] + " : </label></div><div>" + this.BuildDropDownHtmlWith("formPool", this.board.ProjectPools, "Select " + this.ContextLabels[this.board.ItemType], Item.PoolID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Scale Order : </label></div><div>" + this.BuildDropDownHtmlWith("formScaleOrder", ScaleOptions, "Select Scale", Item.ScaleOrder.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Step Order : </label></div><div>" + this.BuildDropDownHtmlWith("formStepOrder", StepOptions, "Select Step", Item.StepOrder.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label class='filter'>Sort Order : </label></div><div><input type='number' min='1' max='99' id='formSortOrder'  style='width:60px;' value='" + Item.SortOrder + "'></div></div>";

        this.app.ShowCustomMessage("<div class='Item-form form-group' formid='" + Item.ItemID + "' typeid='" + this.board.ItemType + "'>" + formHtml + "</div>", title, this.OnItemSaveClick, null, this, null);
        return false;
    }
    public OnItemSaveClick(Context: BoardEditorUIControl) {
        var VM = new BoardItemViewModel();
        VM.ItemID = parseInt($.trim($(".Item-form").attr('formid')));
        VM.ItemType = Context.board.ItemType;
        VM.Name = $.trim($("#formName").val()); VM.PoolID = parseInt($.trim($("#formPool").val()));
        VM.ScaleOrder = parseInt($.trim($("#formScaleOrder").val()));
        VM.StepOrder = parseInt($.trim($("#formStepOrder").val()));
        VM.SortOrder = parseInt($.trim($("#formSortOrder").val()));

        var isOK = true;
        if ((Context.FieldIsBlank(VM.Name))) { isOK = false; Context.app.ShowAlert("Name is mandatory !"); }
        if ((Context.FieldIsBlank(VM.PoolID))) { isOK = false; Context.app.ShowAlert(Context.ContextLabels[Context.board.ItemType] + " is mandatory !"); }
        if (isOK) {
            Context.AjaxCall(Context.api.ItemSaveURL, JSON.stringify({ formVM: VM, ProjectID: Context.board.ProjectID }), Context.OnEditorSaved, Context);
        }
    }
    public OnEditorSaved(response, context: BoardEditorUIControl) {
        if (response.Pools != undefined) {
            context.board = response;
            context.Build();
            context.app.HideUnfreezeControls();
        }
        else {
            context.app.ShowAlert(response);
        }
    }
    //public GetPool(PoolID: Number): BoardPoolViewModel {
    //    var VM: BoardPoolViewModel;
    //    jQuery.each(this.board.Pools, function () { if (this.PoolID == PoolID) { VM = this; return false; } });
    //    return VM;
    //}
    public GetItem(ItemID: Number): BoardItemViewModel {
        var VM: BoardItemViewModel;
        jQuery.each(this.board.Pools, function () {
            jQuery.each(this.Steps, function () {
                jQuery.each(this.Scale1Items, function () { if (this.ItemID == ItemID) { VM = this; return false; } });
                jQuery.each(this.Scale2Items, function () { if (this.ItemID == ItemID) { VM = this; return false; } });
            });
        });
        return VM;
    }
}
