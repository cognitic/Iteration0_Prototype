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
//      ProjectBoardUIControl
//
var BoardEditorUIControl = /** @class */ (function (_super) {
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
        var formHtml = "<div class='form-element-group'><div><label >Name : </label></div><div><input ='text' id='formName' class='text' maxlength='50' style='width: 300px;' value='" + Item.Name + "'></div></div>";
        formHtml += "<div class='form-element-group'><div><label >" + this.ContextLabels[this.board.ItemType] + " : </label></div><div>" + this.BuildDropDownHtmlWith("formPool", this.board.ProjectPools, "Select " + this.ContextLabels[this.board.ItemType], Item.PoolID.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Scale Order : </label></div><div>" + this.BuildDropDownHtmlWith("formScaleOrder", ScaleOptions, "Select Scale", Item.ScaleOrder.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Step Order : </label></div><div>" + this.BuildDropDownHtmlWith("formStepOrder", StepOptions, "Select Step", Item.StepOrder.toString()) + "</div></div>";
        formHtml += "<div class='form-element-group'><div><label >Sort Order : </label></div><div><input type='number' min='1' max='99' id='formSortOrder'  style='width:60px;' value='" + Item.SortOrder + "'></div></div>";
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
    //public GetPool(PoolID: Number): BoardPoolViewModel {
    //    var VM: BoardPoolViewModel;
    //    jQuery.each(this.board.Pools, function () { if (this.PoolID == PoolID) { VM = this; return false; } });
    //    return VM;
    //}
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
//# sourceMappingURL=BoardEditor.js.map