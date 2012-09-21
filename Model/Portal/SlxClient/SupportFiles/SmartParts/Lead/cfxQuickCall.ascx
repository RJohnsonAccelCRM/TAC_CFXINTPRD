<%@ Control Language="C#" AutoEventWireup="true" CodeFile="cfxQuickCall.ascx.cs" Inherits="SmartParts_Lead_cfxQuickCall" %>
<%@ Register Assembly="Sage.SalesLogix.Client.GroupBuilder" Namespace="Sage.SalesLogix.Client.GroupBuilder" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.PickList" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.DependencyLookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Lookup" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.Web.Controls" Namespace="Sage.SalesLogix.Web.Controls.Timeline" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.SalesLogix.HighLevelTypes" Namespace="Sage.SalesLogix.HighLevelTypes" TagPrefix="SalesLogix" %>
<%@ Register Assembly="Sage.Platform.WebPortal" Namespace="Sage.Platform.WebPortal.SmartParts" TagPrefix="SalesLogix" %>

<SalesLogix:SmartPartToolsContainer runat="server" ID="QuickCall_RTools"
    ToolbarLocation="right">
    <asp:ImageButton runat="server" ID="btnSaveHistory" AlternateText="Save Call" ImageUrl="~/ImageResource.axd?scope=global&type=Global_Images&key=Save_16x16" />
</SalesLogix:SmartPartToolsContainer>

<table border="0" cellpadding="1" cellspacing="0" class="formtable" style="width: 98%;">
    <col width="33.33333%" />
    <col width="33.33333%" />
    <col width="33.33333%" />
    <tr>
        <td>
            <span class="twocollbl">
                <asp:Label ID="Description_lz" AssociatedControlID="Description" runat="server" Text="Regarding  "></asp:Label></span>
            <span class="twocoltextcontrol">
                <SalesLogix:PickListControl runat="server" ID="Description" PickListName="cfxQuickCallRegarding"
                     MustExistInList="false" AlphaSort="true" MaxLength="64" />
            </span>
        </td>
        <td>
         <span class="twocollbl"><asp:Label ID="Result_lz" AssociatedControlID="Result" runat="server" Text="Result"></asp:Label></span> 
            <span  class="twocoltextcontrol" >
                <SalesLogix:PickListControl runat="server" ID="Result" PickListName="intLastCallResult" MustExistInList="false" />
            </span> 
        </td>
        <td>
            <span ><asp:CheckBox runat="server" ID="Followup" Text=""  /></span> 
            <span class="lblright"><asp:Label ID="Followup_lz" AssociatedControlID="Followup" runat="server" Text="Follow-up"></asp:Label></span> 
        </td>
    </tr>

    <tr>
        <td colspan="3" style="padding: 1px 0px;">
            <span>
                <hr />
            </span>
        </td>
    </tr>
    <tr>
        <td colspan="3">
            <span class="twocollbl">
                <asp:Label ID="Notes_lz" AssociatedControlID="Notes" runat="server" Text="Call Notes"></asp:Label></span>
            <span class="twocoltextcontrol">
                <asp:TextBox runat="server" ID="Notes" TextMode="MultiLine" Rows="6" />
            </span>
        </td>
    </tr>
</table>
