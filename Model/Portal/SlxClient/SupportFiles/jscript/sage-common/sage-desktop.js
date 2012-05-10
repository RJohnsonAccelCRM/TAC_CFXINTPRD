﻿Sage.DragDropWatcher = {
    isIE : null,
    isFirefox : null,
    isSafari : null,
    isNpapi : null,
    desktop : null,
    handleDragLeave : function(event) {
        Sage.DragDropWatcher.finishDrag(event, false);
    },
    handleDragEnter : function(event) {
        Sage.DragDropWatcher.finishDrag(event, false);
    },
    handleDragOver : function(event) {
        if (Ext.isGecko)
            event.preventDefault();
        Sage.DragDropWatcher.finishDrag(event, false);
    },
    finishDrag : function(event, isDrop) {
        if (typeof(this.desktop) !== 'undefined')
            this.desktop.setDropEffect(event, 'copy');
        if (this.isFirefox) {
            if (isDrop) {
                event.stopPropagation();
                event.preventDefault();
            }
        } else if (this.isIE || this.isSafari || this.isNpapi) {
            if (!isDrop) {
                event.returnValue = false;
            }
        }
    },
    attachEvents : function(dropZone) {
        if (dropZone == null) { return; }
        
        if (this.isIE) {
            dropZone.attachEvent('ondragenter', this.handleDragEnter);
            dropZone.attachEvent('ondragover', this.handleDragOver);
            dropZone.attachEvent('ondragleave', this.handleDragLeave);
            dropZone.attachEvent('ondrop', this.handleBrowserDrop);
        } else {
        //if (this.isFirefox) {
            //if (typeof console !== 'undefined') console.log('attaching events to ' + dropZone.id);
            dropZone.addEventListener('dragenter', this.handleDragEnter, false);
            dropZone.addEventListener('dragover', this.handleDragOver, false);
            dropZone.addEventListener('dragleave', this.handleDragLeave, false);
            dropZone.addEventListener('drop', this.handleBrowserDrop, false);
            //the dragdrop and dragexit events are for firefox 3.1 and lower.
            //dropZone.addEventListener('dragexit', this.handleDragLeave, false);
            //dropZone.addEventListener('dragdrop', this.handleBrowserDrop, false);
        }    
    },
    init : function() {
        this.isIE = (window.Sage && Sage.gears) ? Sage.gears.factory.getBuildInfo().indexOf(';ie') > -1 : Ext.isIE;
        this.isFirefox = (window.Sage && Sage.gears) ? Sage.gears.factory.getBuildInfo().indexOf(';firefox') > -1 : Ext.isGecko;
        this.isSafari = (window.Sage && Sage.gears) ? Sage.gears.factory.getBuildInfo().indexOf(';safari') > -1 : Ext.isSafari;
        this.isNpapi = (window.Sage && Sage.gears) ? Sage.gears.factory.getBuildInfo().indexOf(';npapi') > -1 : Ext.isChrome;
        this.desktop = (window.Sage && Sage.gears) ? Sage.gears.factory.create('beta.desktop') : undefined;

        var dropZone = document.body;
        this.attachEvents(dropZone);
    },
    FILESDROPPED : 'OnFilesDropped',
    NOGEARS : 'OnGearsNotInstalled',
    FilesDroppedListeners : [],
    NoGearsListeners : [],
    addListener : function(event, listener, listenerId) {
        if (typeof(event) === 'function') {
            listener = event;
            event = Sage.DragDropWatcher.FILESDROPPED
        }
        if ((typeof(listenerId) !== 'undefined') && (listenerId != ''))
            this.removeListener(listenerId);
        else
            listenerId = 'l_' + this.FilesDroppedListeners.length;
        var obj = {id : listenerId, listener : listener};
        if (event == Sage.DragDropWatcher.FILESDROPPED) {
            this.FilesDroppedListeners.push(obj);
        } else if (event == Sage.DragDropWatcher.NOGEARS) {
            this.NoGearsListeners.push(obj);
        }
    },
    removeListener : function(listenerId) {
        var idx = -1;
        for (var i = 0; i < this.FilesDroppedListeners.length; i++) {
            if ((this.FilesDroppedListeners[i].id == listenerId) || (this.FilesDroppedListeners[i].listener == listenerId)) {
                idx = i;
                break;
            }
        }
        if (idx >= 0) {
            this.FilesDroppedListeners.splice(idx, 1);
            return;
        }
        for (var i = 0; i < this.NoGearsListeners.length; i++) {
            if ((this.NoGearsListeners[i].id == listenerId) || (this.NoGearsListeners[i].listener == listenerId)) {
                idx = i;
                break;
            }
        }
        if (idx >= 0) {
            this.NoGearsListeners.splice(idx, 1);
        }
    },
    onNoGears : function(event) {
        if (this.NoGearsListeners.length > 0) {
            for (var i = 0; i < this.NoGearsListeners.length; i++) {
                var listener = this.NoGearsListeners[i].listener;
                if (typeof listener === 'function') {
                    listener(event);
                }
            }
        } else {
            Sage.DragDropWatcher.defaultNoGearsHandler();
        }
    },
    defaultNoGearsHandler : function() {
        var findoutmorelink = Link.getHelpUrl('desktopintegration');
        var helpTarget = Link.getHelpUrlTarget();
        var linkMarkup = String.format('<a href="{0}" target="{1}">{2}</a>', findoutmorelink, helpTarget, MasterPageLinks.FindOutMore || "Find Out More...");

        var htm = ['<div class="x-dlg-icon">',
            '<div class="ext-mb-icon ext-mb-info"> </div>',
            '<div class="sage-mb-content">',
            '<span class="ext-mb-text">',
            '<p>',
            MasterPageLinks.SDI_FeatureRequiresSDI || 'The feature you are requesting requires the installation of the Sage SalesLogix Desktop Integration Module.',
            '&nbsp;&nbsp;',
            linkMarkup,
            '</p><br /><p>',
            MasterPageLinks.SDI_InstallFeatureNow || 'Would you like to install this feature now?',
            '</p><br />',
            '<p style="font-style:italic">',
            MasterPageLinks.SDI_FeatureCanBeInstalled || 'Note: This feature can be installed at any time from the login or options pages.',
            '</p>',
            '</span></div>',
            '</div>'];
        
        var gearsWin = new Ext.Window({
            id : 'installgears_win',
            title : MasterPageLinks.PageTitle || 'Sage SalesLogix',
            width : 600,
            height : 180,
            minWidth : 600,
            minHeight : 180,
            layout : 'fit',
            resizable : false,
            modal : false,
            stateful: false,
            cls : 'x-window-dlg',
            html : htm.join(''),
            buttons : [{
                id : 'installbtn',
                text : MasterPageLinks.AdHocDialog_YesButton || 'Yes',
                tooltip : MasterPageLinks.SDI_ClickToDownload || 'Click to download product enhancements.',
                handler: function() {
                    gearsWin.close();
                    Sage.installDesktopFeatures();
                }
            }, {
                id: 'no',
                text : MasterPageLinks.AdHocDialog_NoButton  || 'No',
                handler: function() { gearsWin.close(); }
            }]
        });
        gearsWin.show();
   },
    handleBrowserDrop : function(event) {
        if (!window.Sage || !Sage.gears) {
            Sage.DragDropWatcher.finishDrag(event, true);
            Sage.DragDropWatcher.onNoGears(event);
            return;  
        }
        var data = Sage.DragDropWatcher.desktop.getDragData(event, 'application/x-gears-files');
        var files = data && data.files;
        if (!files) {
            var html5files = event.dataTransfer && event.dataTransfer.files;
            files = [];
            for (var i = 0; i < html5files.length; i++) {
                var name = html5files[i].name;
                files.push( { 
                    name : name, 
                    blob : html5files[i].getAsBinary(),
                    extension : name.substring(name.lastIndexOf('.'))
                });
            }
        }
        Sage.DragDropWatcher.finishDrag(event, true);
        if ((files != null) && (files.length > 0)) {
            var l = 0;
            for (var i = 0; i < files.length; i++) {
                l += files[i].blob.length;
            }
            if (l > (4*1024*1024)) { 
                 if (!confirm(MasterPageLinks.SDI_LargeUploadWarning || 'Warning: This request may exceed the limit set by your administrator and fail to upload. Would you like to continue?')) {
                    return;
                 }
            }
            
            var args = {'event' : event, 'files' : files , 'otherData' : ' '}; //
            Sage.DragDropWatcher.onFilesDropped(args);
        }
    },
    onFilesDropped : function(args) {
        for (var i = 0; i < this.FilesDroppedListeners.length; i++) {
            var listener = this.FilesDroppedListeners[i].listener;
            if (typeof listener === 'function') {
                var retval = listener(args);
                if (typeof (retval) === 'boolean') {
                    if (retval == false)
                        return;
                }
            }
        }
    }
};


//-------------------------------------------------------------------------------------------------------------------------------------
Sage.FileUploader = {
    uploadFiles : function(files, url, progress, complete, error) {
        if (!window.Sage && !Sage.gears) {
            alert(MasterPageLinks.SDI_SDIMustBeInstalled || 'Sage SalesLogix Desktop Integration Module must be installed to use this feature.');
            return;
        }
        if (typeof(url) != 'string') {
            alert(MasterPageLinks.MissingPostUrl || 'Missing post url');
            return;
        }
        var request = Sage.gears.factory.create('beta.httprequest');
        request.open("POST", url);
        
        var boundary = '------multipartformboundary' + (new Date).getTime();
        var dashdash = '--';
        var crlf = '\r\n';
        
        var builder = Sage.gears.factory.create('beta.blobbuilder');
        builder.append(dashdash);
        builder.append(boundary);
        builder.append(crlf);
         
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
        
            /* Generate headers. */
            builder.append('Content-Disposition: form-data; name="file_' + i + '"');
            var filename = Sage.DefaultFileDropHandler.getFileName(file);
//            if (file.name) {
//                builder.append('; filename="' + file.name + '"');
//            }
            if (filename != '') {
                builder.append('; filename="' + filename + '"');
            }
            builder.append(crlf);

            builder.append('Content-Type: application/octet-stream');
            builder.append(crlf);
            builder.append(crlf); 

            /* Append binary data. */
            builder.append(file.blob);
            builder.append(crlf);

            /* Write boundary. */
            builder.append(dashdash);
            builder.append(boundary);
            builder.append(crlf); 
        }
        
        /* Mark end of the request. */
        builder.append(dashdash);
        builder.append(boundary);
        builder.append(dashdash);
        builder.append(crlf);        

        if (typeof(complete) === 'function') {
            request.onreadystatechange = function() {
                switch(request.readyState) {
                    case 4:
                        if (request.status != 200) {
                            if (typeof(error) === 'function') {
                                error(request);
                            }
                            break;
                        }
                        if (request.responseText != "") {
                            var objResponse = Sys.Serialization.JavaScriptSerializer.deserialize(request.responseText);
                            if (objResponse != null && typeof objResponse !== 'undefined') {
                                if (typeof objResponse.success !== 'undefined' && typeof objResponse.error !== 'undefined') {
                                    if (objResponse.success === false) {
                                        if (typeof (error) === 'function') {
                                            error(request);
                                        }
                                        else {
                                            Ext.MessageBox.hide();
                                            Ext.MessageBox.alert(MasterPageLinks.UploadAttachment || 'Upload Attachment', objResponse.error);
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                        if (typeof(complete) === 'function') {
                            complete({ status : request.status, statusText : request.statusText });
                            files = [];
                        }
                        break;
                }
            };
        }
        if (typeof(progress) === 'function') {
            request.upload.onprogress = function(prog) {
                // { total : 500, loaded : 250, lengthComputable : true };  <-- example progress object
                progress(prog);
            }
        }
        request.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
        request.send(builder.getAsBlob());
    }
};

//-------------------------------------------------------------------------------------------------------------------------------------

Sage.DefaultFileDropHandler = {
    options : [],
    historyQueue : [],
    init : function() {
        if (document.location.href.indexOf("UserOptions.aspx") > 0) {
            cookie.setCookieParm('',  'DoNotPromptHistory', 'slx-filedropoptions');
            return;
        }
        //if (typeof(console) !== 'undefined') { console.log("Initializing DefaultFileDropHandler"); }
        Sage.DragDropWatcher.addListener(Sage.DragDropWatcher.FILESDROPPED, this.handleFilesDropped, 'slxDefaultFileAction');
        var noPromptOption = cookie.getCookieParm("DoNotPromptHistory", "slx-filedropoptions");
        if (noPromptOption == "") {
            if (typeof (Sage.UserOptionsService) !== 'undefined') {
                Sage.UserOptionsService.getCommonOption("DoNotPromptHistory", "Email", 
                    function(opt) { 
                        Sage.DefaultFileDropHandler.options.push(opt);
                        cookie.setCookieParm(Sys.Serialization.JavaScriptSerializer.serialize(opt), 'DoNotPromptHistory', 'slx-filedropoptions');
                    }
                );
            } else {
                $.ajax({
                    url :"SLXInfoBroker.aspx?info=userpref&prefname=DoNotPromptHistory&prefcategory=Email",
                    type : "GET",
                    success : function(data) {
                        var opt = {optionValue : data, option : 'DoNotPromptHistory', category : 'Email'}
                        Sage.DefaultFileDropHandler.options.push(opt);
                        cookie.setCookieParm(Sys.Serialization.JavaScriptSerializer.serialize(opt), 'DoNotPromptHistory', 'slx-filedropoptions');
                    }
                });
            }
        } else {
            Sage.DefaultFileDropHandler.options.push(Sys.Serialization.JavaScriptSerializer.deserialize(cookie.getCookieParm('DoNotPromptHistory', 'slx-filedropoptions')));
        }
        //This is to get the system option whether or not to save the email as an attachment
        var saveMSGOption = cookie.getCookieParm('SAVEMSGFILES', 'slx-filedropoptions');
        if (saveMSGOption == "") {
            $.ajax({
                url :"SLXInfoBroker.aspx?info=GetSingleValue&item=SENDSLXSAVEMSGFILES&entity=SYSTEMINFO&idfield=SYSTEMINFOID&id=PRIMARY",
                type : "GET",
                success : function(data) {
                    var opt = {optionValue : data, option : 'SAVEMSGFILES', category : 'SENDSLX'}
                    Sage.DefaultFileDropHandler.options.push(opt);
                    cookie.setCookieParm(Sys.Serialization.JavaScriptSerializer.serialize(opt), 'SAVEMSGFILES', 'slx-filedropoptions');
                }
            });
        } else {
            Sage.DefaultFileDropHandler.options.push(Sys.Serialization.JavaScriptSerializer.deserialize(cookie.getCookieParm('SAVEMSGFILES', 'slx-filedropoptions')));
        }
    },
    handleFilesDropped : function(args) {
        var target = null;
        if (Sage.DragDropWatcher.isIE) {
            target = args.event.srcElement;
        } else if (Sage.DragDropWatcher.isFirefox) {
            target = args.event.target;
        }
        var forceAttachment = false;
        if (target != null) {
            forceAttachment = Sage.DefaultFileDropHandler.isTargetAttachmentTab(target);
        }
        var emails = [];
        var attachments = [];
        for (var i = 0; i < args.files.length; i++) {
            var file = args.files[i];
            //alert('file extension: ' + file.extension);
            if ((file.extension.toLowerCase() == '.msg') && (!forceAttachment)) {
                emails.push(file);
            } else {
                attachments.push(file);
            }
        }
        if (emails.length > 0) {
            Sage.DefaultFileDropHandler.handleEmailFiles(emails);
        }
        if (attachments.length > 0) {
            Sage.DefaultFileDropHandler.handleAttachmentFiles(attachments);
        }
    },
    handleEmailFiles : function(files) {
        var desktop = Sage.DragDropWatcher.desktop;
        var url = 'SLXAttachments.ashx?type=history';
        var entinfo = Sage.DefaultFileDropHandler.getEntityIdAndType();
        if (entinfo == null) {
            return;
        }
        url += String.format("&entityid={0}&entitytype={1}", entinfo.id, entinfo.type);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (file.extension.toLowerCase() == '.msg') {
                var md = desktop.extractMetaData(file.blob);
                //alert(md.headers);
                if (md.receivedTime) {
                    var d = md.receivedTime;
                    md.receivedTimeString  = d.getUTCFullYear() + '.' + (d.getUTCMonth() - 0 + 1) + '.' + d.getUTCDate() + '.' + d.getUTCHours() + '.' + d.getUTCMinutes();
                }
                if (md.sentOn) {
                    var d = md.sentOn;
                    md.sentOnString  = d.getUTCFullYear() + '.' + (d.getUTCMonth() - 0 + 1) + '.' + d.getUTCDate() + '.' + d.getUTCHours() + '.' + d.getUTCMinutes();
                }
                var postoptions = {
                    method: "POST",
                    url: url,
                    params: md,
                    attachments: md.attachments,
                    originalFile: file,
                    isLast: i == files.length - 1,
                    error: function (request, msg, errorThrown) {
                    },
                    success: function (response, opts) {
                        var resp = Sys.Serialization.JavaScriptSerializer.deserialize(response.responseText);
                        if (resp.success) {
                            var histid = (resp.data && resp.data.HistoryId) ? resp.data.HistoryId : '';
                            if (histid !== '') {
                                Sage.DefaultFileDropHandler.handleAttachmentFilesSilent([opts.originalFile], String.format("&entityid={0}&entitytype=IHistory&entityid2={1}&entitytype2={2}", histid, entinfo.id, entinfo.type), opts.refresh);
                                Sage.DefaultFileDropHandler.queueHistoryHandling(histid, opts);
                            }
                            if (opts.isLast) {
                                Sage.DefaultFileDropHandler.handleQueuedHistoryAttachments();
                            }
                        } else {
                            Ext.MessageBox.alert(resp.error || 'An unknown exception happened.  If this continues, please contact your administrator');
                        }
                    }
                };
                Ext.Ajax.request(postoptions);
            }
        }
    },
    queueHistoryHandling : function(histid, opts) {
        this.historyQueue.push({histid : histid, opts : opts });
    },
    handleQueuedHistoryAttachments : function() {
        var historyQueue = Sage.DefaultFileDropHandler.historyQueue
        if (historyQueue.length > 0) {
            var itemsWithAttachments = [];
            for (var i = 0; i < historyQueue.length; i++) {
                if (historyQueue[i].opts.attachments.length > 0) {
                    itemsWithAttachments.push(historyQueue[i]);
                }
            }
            if (itemsWithAttachments.length > 0) {
                Sage.DefaultFileDropHandler.askForSaveAttachment(itemsWithAttachments);
            } else {
                Sage.DefaultFileDropHandler.handleQueuedHistory(false);
            }
        }
    },
    handleQueuedHistory : function(individually) {
        if ((individually) || (Sage.DefaultFileDropHandler.historyQueue.length == 1)) {
            Sage.DefaultFileDropHandler.continueHandleQueuedHistory();
        } else {
            Sage.DefaultFileDropHandler.showCompleteAllDlg();
        }    
    },
    continueHandleQueuedHistory : function() {
        if (Sage.DefaultFileDropHandler.historyQueue.length < 1) {
            return;
        }
        if (Sage.DefaultFileDropHandler.historyQueue.length > 1) {
            for (var id in Sage.DialogWorkspace.__instances) {
                Sage.DialogWorkspace.__instances[id].on('close', Sage.DefaultFileDropHandler.showNextIndividualCompleteHistory)
            }
        }
        Sage.DefaultFileDropHandler.showNextIndividualCompleteHistory();
    },
    showNextIndividualCompleteHistory: function() {
        //if (typeof (console) !== 'undefined') { console.log("showNextIndividualCompleteHistory was called - history queue has " + Sage.DefaultFileDropHandler.historyQueue.length); }
        if (Sage.DefaultFileDropHandler.historyQueue.length > 0) {
            if (Sage.DefaultFileDropHandler.shouldShowEmailCompleteDialog()) {
                var itm = Sage.DefaultFileDropHandler.historyQueue.pop();
                itm.opts.originalFile = null;
                itm.opts.attachments = null;
                Link.editHistory(itm.histid, {AllowEditHistory : 'true'});
                itm = null;
            } else {
                Sage.DefaultFileDropHandler.historyQueue = [];
                Sage.DefaultFileDropHandler.CheckRefresh('history');
            }
        }
        if (Sage.DefaultFileDropHandler.historyQueue.length < 1) {
            for (var id in Sage.DialogWorkspace.__instances) {
                if (Sage.DialogWorkspace.__instances[id].hasListener('close')) {
                    Sage.DialogWorkspace.__instances[id].removeListener('close', Sage.DefaultFileDropHandler.showNextIndividualCompleteHistory);
                }
            }
        }
    },
    showCompleteAllDlg: function() {
        if (Sage.DefaultFileDropHandler.shouldShowEmailCompleteDialog()) {
            var qcwin = new Sage.QuickCompleteWindow({
                listeners: { 
                    individuallyClick : function() { 
                        Sage.DefaultFileDropHandler.handleQueuedHistory(true);
                        qcwin.close();
                    },
                    nowClick: function() {
                        Sage.DefaultFileDropHandler.handleCompleteAll(qcwin);
                    },
                    asScheduledClick: function() { 
                        Sage.DefaultFileDropHandler.handleCompleteAll(qcwin);
                    }
                }
            });
            if (typeof idPopupWindow != "undefined") {
                qcwin.on("show", function () { idPopupWindow(); });
            }
            qcwin.show();
        } else {
            Sage.DefaultFileDropHandler.historyQueue = [];
            Sage.DefaultFileDropHandler.CheckRefresh('history');
        }
    },
    handleCompleteAll: function(qcwin) {
        var vals = qcwin.getValues();
        vals.histids = [];
        for (var i = 0; i < Sage.DefaultFileDropHandler.historyQueue.length; i++) {
            var histitem = Sage.DefaultFileDropHandler.historyQueue[i]
            //alert(histitem.histid);
            vals.histids.push(histitem.histid);
            histitem.opts.originalFile = null;
            histitem.opts.attachments = null;
            histitem = null;
        }
        Sage.DefaultFileDropHandler.historyQueue = [];
        //alert(vals.length + "\n\n" + vals[0]);
        if (vals.note != '' || vals.result != '') {
            $.ajax({
                url : 'SLXAttachments.ashx?type=quickupdatehistory',
                type : 'POST',
                dataType: "json",
                data : vals,
                success: function(data) {
                    Sage.DefaultFileDropHandler.CheckRefresh('both');
                },
                error: function(request, status, error) {
                    Sage.DefaultFileDropHandler.CheckRefresh('both');
                }
            });
        } else {
            Sage.DefaultFileDropHandler.CheckRefresh('both');
        }
        qcwin.close();
    },
    askForSaveAttachment : function(items) {
        var list = items;
        Ext.Msg.show({
            title: MasterPageLinks.SaveAttachments || "Save Attachments",
            msg: MasterPageLinks.SDI_KeepAttachmentsConfirmation || "Would you like to keep a copy of these attachment(s) in SalesLogix?<br />The attachments will be stored under the Attachments tab for the relevant entities.",
            buttons: { yes: MasterPageLinks.AdHocDialog_YesButton || 'Yes', no : MasterPageLinks.AdHocDialog_NoButton || 'No' },
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn) {
                if ((!Sage.DefaultFileDropHandler.shouldSaveMsgFile()) && (btn == 'yes')) {
                    for (var i = 0; i < list.length; i++) {
                        Sage.DefaultFileDropHandler.handleAttachmentFilesSilent(list[i].opts.attachments, String.format("&entityid={0}&entitytype=IHistory", list[i].histid));
                    }
                }
                Sage.DefaultFileDropHandler.handleQueuedHistory();
            }
        });
    },
    shouldShowEmailCompleteDialog : function() {
        for (var i = 0; i < Sage.DefaultFileDropHandler.options.length; i++) {
            if (Sage.DefaultFileDropHandler.options[i].option == 'DoNotPromptHistory') {
                var p = Sage.DefaultFileDropHandler.options[i].optionValue;
                return ((p == 'F') || (p == '0') || (p == 'N'));
            }
        }
        return false;
    },
    shouldSaveMsgFile : function() {
        for (var i = 0; i < this.options.length; i++) {
            if (this.options[i].option == 'SAVEMSGFILES') {
                var p = this.options[i].optionValue;
                return ((p == 'T') || (p == 'Y'));
            }
        }
        return false;
    },
    getEntityIdAndType : function() {
        if (Sage.Services.hasService('ClientEntityContext')) {
            var entitycontext = Sage.Services.getService('ClientEntityContext');
            var context = entitycontext.getContext();
            if (context.EntityId != "") {
                return { id : context.EntityId,
                    type : context.EntityType,
                    name : context.Description };
            } else {
                return null;
            }
        }
    },
    handleAttachmentFilesSilent : function(files, entityQSParams) {
        var url = this.getUploadUrl(entityQSParams);
        //if (typeof(console) !== 'undefined') console.log('posting attachment to: ' + url);
        Sage.FileUploader.uploadFiles(files, url, function() { }, function() { Sage.DefaultFileDropHandler.CheckRefresh('attachment'); } );
    },
    handleAttachmentFiles : function(files, entityQSParams, entityDesc) {
        var url = this.getUploadUrl(entityQSParams);
        var entityname = '';
        if ((typeof entityDesc !== 'undefined') && (entityDesc != '')) {
            entityname = entityDesc;
        } else {
            var entinfo = Sage.DefaultFileDropHandler.getEntityIdAndType();
            if (entinfo == null) {
                return;
            }
            entityname = entinfo.name;
        }
        this.addDescriptions(files, entityname, url);
    },
    getUploadUrl : function(entityQSParams) {
        var url = 'SLXAttachments.ashx?type=attachment';
        if (entityQSParams) {
            return url + entityQSParams;
        } else {
            var entinfo = Sage.DefaultFileDropHandler.getEntityIdAndType();
            if (entinfo != null) {
                return url + String.format("&entityid={0}&entitytype={1}", entinfo.id, entinfo.type);
            } else {
                return '';
            }
        }    
    },
    onUploadProgress : function(args) {
        if ((args.lengthComputable == true)&&(args.total > 0)) {
            var pct = (args.loaded / args.total) * 100;
            Ext.MessageBox.updateProgress(pct, String.format(MasterPageLinks.PercentCompleteFmt || '{0}% complete', Math.round(pct)));
        }
    },
    uploadFailed : function(request) {
        if (request.status != 200) {
            var msg = ''; //'The attachment was not able to be uploaded. ';
            if (request.responseText != '') {
                msg += request.responseText;


            } else if (request.statusText != '') {
                msg += request.statusText;
            }
            Ext.MessageBox.alert(MasterPageLinks.UploadAttachment || 'Upload Attachment', msg);
        }
    },
    uploadComplete : function(args) {
        Ext.MessageBox.hide();
        Ext.MessageBox.alert(MasterPageLinks.Complete || 'Complete', MasterPageLinks.SDI_UploadComplete || 'File upload complete');
        Sage.DefaultFileDropHandler.CheckRefresh('attachment');
        //if (typeof(Sage.AttachmentsTab) === 'object')
        //    Sage.AttachmentsTab.refresh();
    },
    getDefaultDescription : function(filename) {
        return filename.replace(/\.[\w]*/, '')  
    },
    getFileName : function(file) {
        //could be name, could be filename ..............................<---<<< <---<<< for now!
        if (typeof(file.name) !== 'undefined') {
            return file.name;
        } else if (typeof(file.filename) !== 'undefined') {
            return file.filename;
        }
        return '';
    },
    createAttachForm : function(files)  {
        var filenames = [];
        var descriptions = [];
        var fnLabel = MasterPageLinks.SDI_FileNameAndSize || "No....File name and size:";
        var descLabel = MasterPageLinks.Description || "Description:";
        for (var i = 0; i < files.length; i++) {
            var filelength = 'unknown';
            try {
                var filelength = files[i].blob.length;
            } catch(e) {
                Ext.MessageBox.alert(MasterPageLinks.SDI_FilesDropped || 'Files dropped', MasterPageLinks.SDI_ErrorExaminingFile || 'An error occurred examining the file.');
                return null;
            }
            if (filelength != 'unknown') {
                if (filelength > 1024) {
                    if (filelength > 1048576) {
                        filelength = Math.round(filelength/1048576) + " MB";
                    } else {
                        filelength = Math.round(filelength/1024) + " KB";
                    }
                } else {
                    filelength += " Bytes";
                }
            }
            var fnFld = new Ext.form.TextField({
                id : 'filename_' + i,
                stateful : false,
                anchor : '100%',
                value : this.getFileName(files[i]) + "  (" + filelength + ")",  //files[i].name
                fieldLabel : fnLabel,
                hideLabel : (i > 0),
                readOnly : true,
                style : {
                    color : '#999999'
                }
            });
            var descFld = new Ext.form.TextField({
                id : 'desc_' + i,
                stateful : false,
                anchor : '100%',
                value : this.getDefaultDescription(this.getFileName(files[i])), //files[i].name),
                fieldLabel : descLabel,
                maxLength : 128,
                hideLabel : (i > 0)
            });
            filenames.push(fnFld);
            descriptions.push(descFld);
            fnLabel = '';
            descLabel = '';
        }
        return {
            layout : 'column',
            border : false,
            items : [{
                layoutConfig: {
                    labelSeparator: ''
                },
                bodyStyle: 'padding:5px',
                columnWidth: .5,
                layout: 'form',
                border: false,
                labelAlign: 'top',
                items : filenames
            },{
                layoutConfig: {
                    labelSeparator: ''
                },
                bodyStyle: 'padding:5px',
                columnWidth: .5,
                layout: 'form',
                border: false,
                labelAlign: 'top',
                items: descriptions
            }]
        };
    },
    getDescriptionFormValues : function(files) {
        var vals = [];
        for (var i = 0; i < files.length; i++) {
            var elem = Ext.ComponentMgr.get("desc_" + i);
            var desc = '';
            if ((typeof elem !== 'undefined') && (elem.el.dom)) {
                desc = (elem.el.dom.value == this.getDefaultDescription(this.getFileName(files[i]))) ? '' : elem.el.dom.value;   //files[i].name
            };
            vals.push("file_" + i + "=" + desc);
        }
        return vals;
    },
    addDescriptions : function(files, entityname, uploadurl) {
        var attachForm =  this.createAttachForm(files);
        if (attachForm == null) {
            return;
        }
        var panel = new Ext.Panel({
            id: "attachmentDesc_panel", 
            autoScroll: true,  
            border: false,             
            items: attachForm
        });
        var win = new Ext.Window({
            id : 'attachmentDesc_win',
            title : String.format(MasterPageLinks.SDI_AddAttachmentsFor || 'Add Attachment(s) for {0}', entityname),
            width : 450,
            height : 250,
            minWidth : 450,
            minHeight : 250,
            layout : 'fit',
            closeAction : 'close',
            resizable : true,
            plain : true,
            modal : true,
            cls: 'address-dialog',
            items : [panel],
            buttonAlign: 'right',
            buttons: [{
                id: 'attachmentDesc_ok',
                text: MasterPageLinks.AdHocDialog_OkButton || 'OK',
                handler: function() {
                    var descriptions = Sage.DefaultFileDropHandler.getDescriptionFormValues(files);
                    uploadurl += "&" + descriptions.join("&");
                    win.close();
                    Ext.MessageBox.show({
                        title : MasterPageLinks.PleaseWait || 'Please wait',
                        msg: MasterPageLinks.SDI_UploadingFiles || 'Uploading Files',
                        progressText: MasterPageLinks.SDI_Uploading || 'uploading...',
                        width: 300,
                        progress: true,
                        closable: true
                    });                    
                    Sage.FileUploader.uploadFiles(files, uploadurl, Sage.DefaultFileDropHandler.onUploadProgress, Sage.DefaultFileDropHandler.uploadComplete, Sage.DefaultFileDropHandler.uploadFailed);
                }
            },{
                id: 'attachmentDesc_cancel',
                text: MasterPageLinks.AdHocDialog_CancelButton || 'Cancel',
                handler: function() {
                    win.close();
                }
            }]//,
//            tools: [{
//                id: 'help',
//                handler: function(evt, toolEl, panel) {
//                    alert('add help link');
//                }
//            }]
        });
        win.show();
    },
    CheckRefresh : function(opt) {
        if (!(opt))
            opt = 'both';
        if (opt == "attachment") {
            return Sage.DefaultFileDropHandler.RefreshAttachmentTab();
        } 
        if (opt == "history") {
            return Sage.DefaultFileDropHandler.RefreshHistoryTab();
        }
        return Sage.DefaultFileDropHandler.RefreshAttachmentTab() || Sage.DefaultFileDropHandler.RefreshHistoryTab();
    },
    RefreshAttachmentTab : function() {
        if (typeof (slxattachmentstrings) !== 'undefined') {
            if ($('#' + slxattachmentstrings.gridViewCtlId).length > 0) {
                __doPostBack(slxattachmentstrings.gridViewCtlId, '');
                return true;
            }
        }
        return false;
    },
    RefreshHistoryTab : function() {
        var elems = $(".datagrid").get();
        for (var i = 0; i < elems.length; i++) {
            if ((elems[i].id.indexOf("HistoryList_HistoryGrid") > 0) || (elems[i].id.indexOf('TicketActivities_grdActivities') > 0)) {
                __doPostBack(elems[i].id, '');
                return true;
            }    
        }
        return false;
    },
    isTargetAttachmentTab : function(target) {
        if (!target) {
            return false;
        }
        if (typeof (slxattachmentstrings) !== 'undefined') {
            var parents = $(target).parents();
            for (var i = 0; i < parents.length; i++) {
                if (parents[i].id && parents[i].id == slxattachmentstrings.gridViewCtlId) {
                    return true;
                }
            }
        }
        return false;
    }
}

Sage.QuickCompleteWindow = function(config) {
    var individuallyHandler = function(){};
    var nowHandler = function() {};
    var asScheduledHandler = function() {};
    if (typeof (config.listeners) !== 'undefined') {
        if (typeof(config.listeners.individuallyClick) === 'function') {
            individuallyHandler = config.listeners.individuallyClick;
        }
        if (typeof(config.listeners.nowClick) === 'function') {
            nowHandler = config.listeners.nowClick;
        }
        if (typeof(config.listeners.asScheduledClick) === 'function') {
            asScheduledHandler = config.listeners.asScheduledClick;
        }
    }
    Sage.QuickCompleteWindow.superclass.constructor.call(this, Ext.apply({
        width : 400,
        height: 215,
        border : false,
        layout : 'fit',
        cls: 'address-dialog',
        title: MasterPageLinks.QuickComplete || 'Quick Complete',
        items : [{
            xtype: 'form',
            border: true,
            bodyStyle: 'padding:10px',
            labelAlign: 'left',
            items: [{
                xtype: 'picklistcombo',
                id: 'quickComplete_result',
                fieldLabel: MasterPageLinks.Result || 'Result',
                pickListName: 'To Do Result Codes'
            }, {
                xtype: 'fieldset',
                labelAlign: 'top',
                style: 'border:none;margin:0;padding:0',
                anchor: '100% -25',
                items: [{
                    xtype: 'textarea',
                    id: 'quickComplete_note',
                    fieldLabel: MasterPageLinks.NoteAppendToAll || 'Note (append to all items)',
                    anchor: '100% -20'
                }]
            }]
        }],
        buttons : [{
            id: 'quickComplete_individually',
            text: MasterPageLinks.Individually || 'Individually',
            handler: individuallyHandler
        }, new Ext.Toolbar.Fill(),
        {
            id: 'quickComplete_asScheduled',
            text: MasterPageLinks.AsScheduled || 'As Scheduled',
            handler: asScheduledHandler
        }, {
            id: 'quickComplete_now',
            text: MasterPageLinks.Now || 'Now',
            handler: nowHandler
        }]
    }, config));
};
Ext.extend(Sage.QuickCompleteWindow, Ext.Window);

Sage.QuickCompleteWindow.prototype.getValue = function(valName) {
    if (valName == 'result') {
        var res = Ext.getCmp('quickComplete_result');
        if ((typeof(res) !== 'undefined') && (res.el.dom))
            return res.el.dom.value;
    }
    if (valName == 'note') {
        var res = Ext.getCmp('quickComplete_note');
        if ((typeof(res) !== 'undefined') && (res.el.dom))
            return res.el.dom.value;
    }
    return '';
}

Sage.QuickCompleteWindow.prototype.getValues = function() {
    return {
        result : this.getValue('result'),
        note : this.getValue('note')
    }
}
