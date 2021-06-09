using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient.Server;

namespace CovidDataLoad.DataAccess
{
    public class TvpBuilder
    {
        readonly string _typeName;
        readonly SqlMetaData[] _columns;
        readonly List<SqlDataRecord> _rows;

        public TvpBuilder(string typeName, params SqlMetaData[] columns)
        {
            _typeName = typeName;
            _columns = columns;
            _rows = new List<SqlDataRecord>();
        }

        public void AddRow(params object[] fieldValues)
        {
            var row = new SqlDataRecord(_columns);
            row.SetValues(fieldValues);
            _rows.Add(row);
        }

        public SqlParameter CreateParameter(string name)
        {
            return new SqlParameter
            {
                ParameterName = name,
                Value = _rows,
                TypeName = _typeName,
                SqlDbType = SqlDbType.Structured
            };
        }
    }
}