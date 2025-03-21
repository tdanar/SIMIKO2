﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SIMIKO.App.Server.Models;

public partial class tblSoftKompetensi
{
    [Key]
    public int ID { get; set; }

    public string NamaKompetensi { get; set; }

    public string Penjelasan { get; set; }

    public int Jenis { get; set; }

    [InverseProperty("IDKompetensiNavigation")]
    public virtual ICollection<tblHasilAssesment> tblHasilAssesment { get; set; } = new List<tblHasilAssesment>();

    [InverseProperty("SoftKompetensiNavigation")]
    public virtual ICollection<tblJabTarget> tblJabTarget { get; set; } = new List<tblJabTarget>();
}