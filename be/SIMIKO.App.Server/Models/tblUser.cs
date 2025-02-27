﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SIMIKO.App.Server.Models;

public partial class tblUser
{
    [Key]
    public int ID { get; set; }

    [StringLength(18)]
    public string NIPnew { get; set; }

    public int? RoleID { get; set; }

    public bool Aktif { get; set; }

    [ForeignKey("RoleID")]
    [InverseProperty("tblUser")]
    public virtual tblRole Role { get; set; }

    [InverseProperty("IDuserNavigation")]
    public virtual ICollection<tblAssesmentUser> tblAssesmentUser { get; set; } = new List<tblAssesmentUser>();

    [InverseProperty("IDuserNavigation")]
    public virtual ICollection<tblUserBusiness> tblUserBusiness { get; set; } = new List<tblUserBusiness>();
}