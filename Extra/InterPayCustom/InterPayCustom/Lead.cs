using System;
using System.Collections.Generic;
//using System.Linq;
using System.Text;
using Sage.Entity.Interfaces;
using Sage.Platform;
using System.Data.OleDb;
using System.Text.RegularExpressions;
//using NHibernate;
using Sage.Platform.ChangeManagement;
using Sage.Platform.Security;
using Sage.Platform.Repository;
using NHibernate;
using System.Data.OleDb;

namespace InterPayCustom
{
    public class Lead
    {
        // Example of target method signature
        public static void MyConvertLeadToAccount(ILead lead, IAccount account)
        {
            //===============================================================
            // This code doesn't work.... added it directly to LeadsearchandConvert
            //==========================================================================

            //foreach (ILeadWebsite tmpWebsite in lead.LeadWebsites)
            //{
            //    // Create Account Additional Website Record
            //    Sage.Entity.Interfaces.IAccountWebsite Acctwebsite = Sage.Platform.EntityFactory.Create<Sage.Entity.Interfaces.IAccountWebsite >();
            //    Acctwebsite.Account = account;
            //    Acctwebsite.Notes  = tmpWebsite.Notes ;
            //    Acctwebsite.WebAddress  = tmpWebsite.WebAddress;

            //    try
            //    {
            //        Acctwebsite.Save();
            //    }
            //    catch (Exception)
            //    {

            //        //Exception But Continue
            //    }
            //}

        }
    }
}
