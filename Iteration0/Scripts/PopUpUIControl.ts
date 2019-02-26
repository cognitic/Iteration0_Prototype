/// <reference path="jquery.d.ts" />
/// <reference path='RequirementUIControl.ts'/>

//
//      PopUpControl
// 
class PopUpUIControl extends RequirementUIControl {
    titleZone: JQuery; buttonZone: JQuery; title: string;
    buttonIDOK: string = ".app_pop_up_okbtn"; buttonIDCancel: string = ".app_pop_up_cancelbtn";
    buttonHtmlOK: string = '<input class="app_pop_up_okbtn" type="button" value="OK"  />'; buttonHtmlCancel: string = ' &nbsp; <input class="app_pop_up_cancelbtn" type="button" value="Cancel"  />';
    popUpTemplate: string = '<div id="app_pop_up###" style="z-index:###;" class="popup-message"><div><div class="pop_up_title"></div><div style="background:#fcc;"><div class="pop_up_message_title"></div><div class="pop_up_message"></div></div><div class="pop_up_content_holder"></div><div class="pop_up_buttons"></div></div></div>';

    constructor(controlTitle: string, html: string, zIndex: number, appRef : Iteration0) {
        super("PopUpUIControl", "#frozen_screen_layer");
        this.title = controlTitle; 
        this.wrapperID = '#app_pop_up' + zIndex.toString(); this.app = appRef;
        this.buttonIDOK = this.wrapperID + ' ' + this.buttonIDOK; this.buttonIDCancel = this.wrapperID + ' ' + this.buttonIDCancel;
        this.popUpTemplate = this.popUpTemplate.replace(new RegExp('###', 'g'), zIndex.toString());
        if ($(this.wrapperID).length == 0)
            $('#frozen_screen_layer').append(this.popUpTemplate);
        $(this.wrapperID + ' .pop_up_content_holder').html(html);
        this.wrapper = $(this.wrapperID);
        this.wrapper.click(function (e) { e.stopPropagation(); });

        this.titleZone = $(this.wrapperID + ' .pop_up_title'); this.contentWrapper = $(this.wrapperID + ' .pop_up_content_holder'); this.buttonZone = $(this.wrapperID + ' .pop_up_buttons');
        this.titleZone.html(this.title);
    }
    Show() {
        this.buttonZone.hide(); this.Appear();
    }
    ShowOk() {
        this.buttonZone.html(this.buttonHtmlOK);
        $(this.buttonIDOK).click((e => { this.Hide(); return false }));
        this.Appear();
    }
    ShowOkCancel(okDelegate, cancelDelegate, okContext: any, cancelContext: any) {
        if (okContext == null) okContext = this;
        if (cancelContext == null) cancelContext = this;
        this.buttonZone.html(this.buttonHtmlOK + this.buttonHtmlCancel);
        $(this.buttonIDOK).click((e => { okDelegate(okContext); return false }));
        if (cancelDelegate == null) {
            $(this.buttonIDCancel).click((e => { this.Hide(); return false }));
        } else {
            $(this.buttonIDCancel).click((e => { cancelDelegate(cancelContext); return false }));
        } 
        this.Appear();
    };
    Hide() {
        this.wrapper.hide();
        if ($('.popup-message').length == 1) this.app.HideFrozenScreen();
        this.wrapper.remove();
    }
    Appear() {
        this.app.ShowFrozenScreen();
        this.wrapper.show();
    }
} 