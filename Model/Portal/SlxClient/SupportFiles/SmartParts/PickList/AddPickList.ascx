<%@ Control Language="C#" AutoEventWireup="true" CodeFile="AddPickList.ascx.cs" inherits="AddPickList"  %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Timeline" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>
<%//------------------------------------------------------------------------
//This file was generated by a tool.  Changes to this file may cause incorrect behavior and will be lost if the code is regenerated.
//------------------------------------------------------------------------ %>

<table border="0" cellpadding="1" cellspacing="0" class="formtable">
  <col width="100%" />
  <tr>
    <td  >
      <div class=" lbl alignleft" >
        <asp:Label ID="txtPicklistName_lbl" AssociatedControlID="txtPicklistName" runat="server" Text="<%$ resources: txtPicklistName.Caption %>" ></asp:Label>
      </div>
      <div  class="textcontrol"   >
        <asp:TextBox runat="server" ID="txtPicklistName" Rows="1" />
      </div>
     </td>
  </tr>
</table>
<table id="tblButtons" border="0" cellpadding="1" cellspacing="2" class="formtable">
  <col width="99%" />
  <col width="1" />
  
  <tr>
   <td  colspan="2" >
    
   </td>
  </tr>
  <tr>
    <td>
    </td>
    <td align="right">
       <div class="slxButton" style="margin-right:10px">
         <asp:Button ID="btnOK" Text="<%$ resources: btnOK.Caption %>" width="100px" runat="server"  CssClass="slxbutton" />
       </div>
    </td>
    <td align="right"> 
        <div class="slxButton" style="margin-right:40px">
           <asp:Button ID="btnCancel" Text="<%$ resources: btnCancel.Caption %>" runat="server" width="100px"  CssClass="slxbutton" />
        </div>
    </td>
  </tr>
</table>