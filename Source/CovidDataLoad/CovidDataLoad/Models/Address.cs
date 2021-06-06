using System;

namespace CovidDataLoad.Models
{
    public class Address
    {
        public int AddressID { get; set; }
        public string AddressLine1 { get; set; }
        public string PostalCode { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}