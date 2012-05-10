using System;
using System.Collections;
using System.Data;
using System.Web.UI;
using System.Web.UI.WebControls;
using Sage.Platform;
using Sage.Entity.Interfaces;
using Sage.Platform.Application.UI;
using Sage.Platform.Security;
using Sage.Platform.WebPortal.SmartParts;
using Sage.Platform.WebPortal.Services;
using Sage.Platform.Data;
using Sage.Platform.Repository;
using log4net;
using Sage.Platform.Application;
//using NHibernate;
using Sage.Platform.Framework;
using System.Text;
using System.Data.OleDb;
using System.Collections.Generic;
using Sage.SalesLogix.Web.Controls;
using Sage.Platform.WebPortal;
using System.Drawing;
using Sage.Platform.Application.UI.Web;

public partial class SmartParts_Lead_cfxQuickCall : EntityBoundSmartPartInfoProvider
{
    private ILead  _Lead;

    private LinkHandler _LinkHandler;
    private LinkHandler Link
    {
        get { return _LinkHandler ?? (_LinkHandler = new LinkHandler(Page)); }
    }

    protected override void OnFormBound()
    {
        //LoadView();
        base.OnFormBound();
    }

    /// <summary>
    /// Called when [wire event handlers].
    /// </summary>
    protected override void OnWireEventHandlers()
    {
        btnSaveHistory.Click += new ImageClickEventHandler(btnSaveHistory_ClickAction);
        base.OnWireEventHandlers();
    }
    protected void btnSaveHistory_ClickAction(object sender, EventArgs e)
    {

        ILead  CurrentLead = this.BindingSource.Current as ILead;
        //TAC Code Here to Create the Linked Activity.
        // Create Activity Record
        Sage.Entity.Interfaces.IHistory  History = Sage.Platform.EntityFactory.Create<Sage.Entity.Interfaces.IHistory>();
        //History.AccountId = oppfulfiltask.Opportunity.Account.Id.ToString();
        //History.AccountName = oppfulfiltask.Opportunity.Account.AccountName;
        //History.OpportunityId = oppfulfiltask.Opportunity.Id.ToString();
        //History.OpportunityName = oppfulfiltask.Opportunity.Description;
        //todo.ContactId = histContactID;
        //todo.ContactName = histContactName;
        History.LeadId = CurrentLead.Id.ToString();
        History.LeadName = CurrentLead.LeadNameFirstLast;
        History.Type = HistoryType.atPhoneCall ;
        //todo.Category = histCategory;
        // get the current user as a User 

        Sage.SalesLogix.Security.SLXUserService usersvc = (Sage.SalesLogix.Security.SLXUserService)Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Security.IUserService>();
        Sage.Entity.Interfaces.IUser user = usersvc.GetUser();

        History.UserId = user.Id.ToString() ;

        History.Duration = 5;
        History.StartDate = System.DateTime.UtcNow.AddMinutes(-5);
        History.OriginalDate = System.DateTime.UtcNow.AddMinutes(-5);
        History.CompletedDate = System.DateTime.UtcNow;
        History.CompletedUser = user.Id.ToString() ;
        History.Description = Left(Description.PickListValue,64);

        History.LongNotes = Notes.Text;
        History.Notes = Left(Notes.Text, 255);
        History.Timeless = false ;
        History.Result = Left(Result.PickListValue,64);
        History.ResultCode = "COMP";

        

        try
        {
            History.Save();

            //ListBox lbFollowUp = FindCompActControl("FollowUp") as ListBox;
            //if (lbFollowUp == null) return false;
            //CheckBox cxCarryOverNotes = FindCompActControl("CarryOverNotes") as CheckBox;
            //if (cxCarryOverNotes == null) return false;
            //CheckBox cxCarryOverAttachments = FindCompActControl("CarryOverAttachments") as CheckBox;
            //if (cxCarryOverAttachments == null) return false;
            if (CurrentLead.FirstName == null && CurrentLead.LastName == null)
            {
                CurrentLead.FirstName = "No";
                CurrentLead.LastName = "Name";
            }
            CurrentLead.CfxLastCallResult = Left(Result.PickListValue, 64);
            CurrentLead.ModifyUser = user.Id.ToString();  // Force Modify User and Modify Date to be set
            CurrentLead.ModifyDate = DateTime.UtcNow;
            CurrentLead.ValidateLead();
            CurrentLead.Save();
            //Refresh
            if (this.PageWorkItem != null)
            {
                Sage.Platform.WebPortal.Services.IPanelRefreshService refresher = PageWorkItem.Services.Get<Sage.Platform.WebPortal.Services.IPanelRefreshService>();
                if (refresher != null)
                {
                    refresher.RefreshAll();
                }
                else
                {
                    Response.Redirect(Request.Url.ToString());
                }
            }

            if (Followup.Checked)
            {

                Dictionary<string, string> args = new Dictionary<string, string>();
                args.Add("type", "atPhoneCall");

                //if (cxCarryOverNotes.Checked || cxCarryOverAttachments.Checked)
                //{
                    args.Add("historyid", History.Id.ToString());
                //}
                //if (cxCarryOverNotes.Checkeod)
                //{
                    args.Add("carryovernotes", "true");
                //}
                //if (cxCarryOverAttachments.Checked)
                //{
                //    args.Add("carryoverattachments", "true");
                //}
                args.Add("aid", History.AccountId);
                args.Add("cid", History.ContactId);
                args.Add("oid", History.OpportunityId);
                args.Add("tid", History.TicketId);
                args.Add("lid", History.LeadId);
                args.Add("leadname", History.LeadName);
                args.Add("description", History.Description);

                // if we're in batch mode (multiple complete from ActivityReminders)
                // pass that fact on to ScheduleActivity, so it can link to next activity in batch
                

                Link.ScheduleActivity(args);

                
                
            }
            //===================================================
            // Initialize
            //===================================================
            Result.PickListValue = String.Empty;
            Description.PickListValue = String.Empty;
            Notes.Text = String.Empty;
            Followup.Checked = false;




        }
        catch (Exception)
        {

            //Exception But Continue
        }


       
    }

    #region Utility
    public static T GetField<T>(string Field, string Table, string Where)
    {
        string sql = string.Format("select {0} from {1} where {2}", Field, Table, (Where.Equals(string.Empty) ? "1=1" : Where));

        //get the DataService to get a connection string to the database
        Sage.Platform.Data.IDataService datasvc = Sage.Platform.Application.ApplicationContext.Current.Services.Get<Sage.Platform.Data.IDataService>();
        using (System.Data.OleDb.OleDbConnection conn = new System.Data.OleDb.OleDbConnection(datasvc.GetConnectionString()))
        {
            conn.Open();
            using (OleDbCommand cmd = new OleDbCommand(sql, conn))
            {
                object fieldval = cmd.ExecuteScalar();
                return fieldval == DBNull.Value ? default(T) : (T)fieldval;
            }
        }
    }
    private static DateTime Timelessize(DateTime dt)
    {
        DateTime timelessized = new DateTime(dt.Year, dt.Month, dt.Day, 00, 00, 05);
        return timelessized;
    }
    public static string Left(string text, int length)
    {
        if (text != null)
        {

            if (length < 0)
                throw new ArgumentOutOfRangeException("length", length, "length must be > 0");
            else if (length == 0 || text.Length == 0)
                return "";
            else if (text.Length <= length)
                return text;
            else
                return text.Substring(0, length);
        }
        else
        {
            //Null String entered
            return string.Empty;
        }
    }
    #endregion


    protected void Page_Load(object sender, EventArgs e)
    {

    }

    #region ISmartPartInfoProvider Members

    /// <summary>
    /// Tries to retrieve smart part information compatible with type
    /// smartPartInfoType.
    /// </summary>
    /// <param name="smartPartInfoType">Type of information to retrieve.</param>
    /// <returns>
    /// The <see cref="T:Sage.Platform.Application.UI.ISmartPartInfo"/> instance or null if none exists in the smart part.
    /// </returns>
    public override ISmartPartInfo GetSmartPartInfo(Type smartPartInfoType)
    {
        ToolsSmartPartInfo tinfo = new ToolsSmartPartInfo();
        if (BindingSource != null)
        {
            if (BindingSource.Current != null)
            {
                tinfo.Description = BindingSource.Current.ToString();
                tinfo.Title = BindingSource.Current.ToString();
            }
        }

        foreach (Control c in Controls)
        {
            SmartPartToolsContainer cont = c as SmartPartToolsContainer;
            if (cont != null)
            {
                switch (cont.ToolbarLocation)
                {
                    case SmartPartToolsLocation.Right:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.RightTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Center:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.CenterTools.Add(tool);
                        }
                        break;
                    case SmartPartToolsLocation.Left:
                        foreach (Control tool in cont.Controls)
                        {
                            tinfo.LeftTools.Add(tool);
                        }
                        break;
                }
            }
        }

        return tinfo;
    }

    public override Type EntityType
    {
        get { return typeof(ILead); }
    }

    protected override void OnAddEntityBindings()
    {
                //throw new NotImplementedException();
    }
    /// <summary>
    /// Derived components should override this method to wire up event handlers.
    /// </summary>

    #endregion

}
