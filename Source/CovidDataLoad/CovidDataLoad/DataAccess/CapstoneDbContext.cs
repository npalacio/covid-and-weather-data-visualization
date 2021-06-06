using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CovidDataLoad.Models;
using Microsoft.EntityFrameworkCore;

namespace CovidDataLoad.DataAccess
{
    public class CapstoneDbContext : DbContext
    {
        public CapstoneDbContext(DbContextOptions<CapstoneDbContext> options)
            : base(options)
        {
        }
        private DbSet<Address> Addresses { get; set; }

        public List<Address> GetAddresses()
        {
            return Addresses.FromSqlRaw("SELECT [AddressID],[AddressLine1],[PostalCode],[ModifiedDate] FROM [SalesLT].[Address]").ToList();
        }
    }
}