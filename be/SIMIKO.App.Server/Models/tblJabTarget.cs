﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SIMIKO.App.Server.Models;

public partial class tblJabTarget
{
    [Key]
    public int ID { get; set; }

    public int? Periode { get; set; }

    public int? KodeJabatan { get; set; }

    public int? SoftKompetensi { get; set; }

    public int? JenisSKompetensi { get; set; }

    public bool? Saved { get; set; }

    [ForeignKey("JenisSKompetensi")]
    [InverseProperty("tblJabTarget")]
    public virtual JenisSKompetensi JenisSKompetensiNavigation { get; set; }

    [ForeignKey("KodeJabatan")]
    [InverseProperty("tblJabTarget")]
    public virtual tblJabatan KodeJabatanNavigation { get; set; }

    [ForeignKey("Periode")]
    [InverseProperty("tblJabTarget")]
    public virtual tblPeriode PeriodeNavigation { get; set; }

    [ForeignKey("SoftKompetensi")]
    [InverseProperty("tblJabTarget")]
    public virtual tblSoftKompetensi SoftKompetensiNavigation { get; set; }
}