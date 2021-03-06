﻿
Sage.Copy = function(config) {
    this.originalConfig = config;
}

Sage.Copy.prototype.copyClip = function() {
    this.copyTo = "Clipboard"
    this.requestContent();
}

Sage.Copy.prototype.requestContent = function() {
    var self = this;
    var id = "";
    if (Sage.Services.hasService("ClientEntityContext"))
    {
        contextSvc = Sage.Services.getService("ClientEntityContext");
        context = contextSvc.getContext();
        id = context.EntityId;
        var url = String.format("slxdata.ashx/slx/crm/-/SummaryData/{0}?format=json&where=mainentity.id eq '{1}'", self.originalConfig.name, id);
        $.ajax({
	        url: url,
	        dataType: "json",
            cache: false,
	        data: {},
	        success: function(data) {
		        var tpl = new Ext.XTemplate(self.originalConfig.template);
		        tpl.overwrite(self.originalConfig.clientId, data);
		        if (self.copyTo == "Clipboard")
		            self.OnCopyContentReady();
		        else 
		            self.OnEmailContentReady();
	        },
	        error: function(request, status, error) {
		        alert(status);
	        }
        });
    }
}

Sage.Copy.prototype.OnCopyContentReady = function() {

	var elem = $get(this.originalConfig.clientId);
	var clipString = '';
	if (elem) {
		if (elem.innerText) {
			clipString = elem.innerText;
		} else if (elem.textContent) {
			clipString = elem.textContent;
		}
		
		if (window.clipboardData) {
			window.clipboardData.setData("text", clipString);
//		} else {
//			try {
//			    return;
//				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
//                var clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
//                if (clipboardHelper) {			
//                    clipboardHelper.copyString(clipString);
//                }
//			} catch (e) {
//                alert(String.format("{0}. {1}", this.originalConfig.cannotAccessClipboard, e.message));
//			}
		}
	}
}
//  check these out:
//  http://stackoverflow.com/questions/400212/how-to-copy-to-clipboard-in-javascript
//  http://stackoverflow.com/questions/316508/greasemonkey-javascript-copy-to-clipboard-button
//  http://www.jeffothy.com/weblog/clipboard-copy/   (has a Flash object that it uses to access the clipboard...)  :(

Sage.Copy.prototype.copyToEmail = function() {
	this.copyTo = "Email"
    this.requestContent();
}

Sage.Copy.prototype.OnEmailContentReady = function () {
    var baseControlId = this.originalConfig.clientId;
    var elem = document.getElementById(baseControlId + "_to");
    var vTo = (elem) ? elem.value : "";
    elem = document.getElementById(baseControlId + "_cc");
    var vCC = (elem) ? elem.value : "";
    elem = document.getElementById(baseControlId + "_bcc");
    var vBCC = (elem) ? elem.value : "";
    elem = document.getElementById(baseControlId + "_subject");
    var vSubject = (elem) ? elem.value : "";
    elem = document.getElementById(baseControlId);
    var vBody = (elem) ? elem.innerHTML : '';
    var recip = {};
    if (vTo !== '') {
        recip['to'] = vTo;
    }
    if (vCC !== '') {
        recip['cc'] = vCC;
    }
    if (vBCC !== '') {
        recip['bcc'] = vBCC;
    }
    Sage.Utility.writeEmail(recip, vSubject, vBody, true);
}