﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SIMIKO.App.Server.Models;

public partial class tblKompetensiCoaching
{
    [Key]
    public long ID { get; set; }

    public int? IDidp { get; set; }

    public int? SoftKompetensi { get; set; }

    public int? JenisKompetensi { get; set; }

    public bool Saved { get; set; }

    [ForeignKey("IDidp")]
    [InverseProperty("tblKompetensiCoaching")]
    public virtual tblIDP IDidpNavigation { get; set; }
}