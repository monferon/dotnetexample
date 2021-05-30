using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Xml;
using System.Xml.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace DotNetCoreWithReactAndRedux.Models
{
    public class Goods
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int Count { get; set; }
        public int IdCategories { get; set; }

        [Column(TypeName = "xml")] public string productInfo { get; set; }

        [NotMapped]
        public Info[] info
        {
            get
            {
                var elements = XElement.Parse(productInfo).Descendants("info");
                List<Info> infoList = new List<Info>();
                    
                foreach (var element in elements)
                {
                    infoList.Add(new Info()
                    {
                        Price = Convert.ToInt32(element.Element("price").Value),
                        Dt = Convert.ToDateTime(element.Element("dt").Value),
                        Id = Convert.ToInt32(element.Attribute("atr").Value)
                    });
                }

                return infoList.ToArray();

            }
            set
            {
                productInfo = value.ToString();
            }
        }
        // public XElement info
        // {
        //     get
        //     {
        //         var teset = XElement.Parse(productInfo);
        //         Console.WriteLine(teset.Name);
        //         Console.WriteLine(teset.Value);
        //         Console.WriteLine();
        //         Console.WriteLine(teset);
        //         return teset;
        //     }
        //     set { productInfo = value.ToString(); }
        // }

        [ForeignKey("IdCategories")] public Categories Categories { get; set; }

        protected void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }


    public class Info
    {
        public int Id { get; set; }
        public int Price { get; set; }
        public DateTime Dt { get; set; }
    }
}