﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SIMIKO.App.Server.Models;

public partial class tblRole
{
    [Key]
    public int ID { get; set; }

    [StringLength(255)]
    public string Nama_role { get; set; }

    [InverseProperty("Role")]
    public virtual ICollection<tblUser> tblUser { get; set; } = new List<tblUser>();
}