using System;

using System.Data.OleDb;


namespace InterPayCustom
{
    class Utility
    {

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
    }
}
