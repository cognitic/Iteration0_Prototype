/// <reference path="jquery.d.ts" />
/// <reference path='uicontrol.ts'/>
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
//      PopUpControl
// 
var PopUpUIControl = /** @class */ (function (_super) {
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
        $(this.buttonIDOK).click((function (e) { return _this.Hide(); }));
        this.Appear();
    };
    PopUpUIControl.prototype.ShowOkCancel = function (okDelegate, cancelDelegate, okContext, cancelContext) {
        var _this = this;
        if (okContext == null)
            okContext = this;
        if (cancelContext == null)
            cancelContext = this;
        this.buttonZone.html(this.buttonHtmlOK + this.buttonHtmlCancel);
        $(this.buttonIDOK).click((function (e) { return okDelegate(okContext); }));
        if (cancelDelegate == null) {
            $(this.buttonIDCancel).click((function (e) { return _this.Hide(); }));
        }
        else {
            $(this.buttonIDCancel).click((function (e) { return cancelDelegate(cancelContext); }));
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
}(UIControl));
//# sourceMappingURL=popup.js.map