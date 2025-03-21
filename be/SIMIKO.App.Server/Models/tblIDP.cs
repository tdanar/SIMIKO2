﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SIMIKO.App.Server.Models;

[Index("ID", Name = "idx_tblIDP", IsUnique = true)]
public partial class tblIDP
{
    [Key]
    public int ID { get; set; }

    public int? IDperiode { get; set; }

    public int? IDmentee { get; set; }

    [StringLength(18)]
    public string NIPmentee { get; set; }

    public int? IDmentor { get; set; }

    [StringLength(18)]
    public string NIPmentor { get; set; }

    public int? KodeJabatan { get; set; }

    public string AlasanPilihJab { get; set; }

    public string JelasTrampil { get; set; }

    public bool? MenteeSetuju { get; set; }

    public bool? MentorSetuju { get; set; }

    public int JenisIDP { get; set; }

    [ForeignKey("IDperiode")]
    [InverseProperty("tblIDP")]
    public virtual tblPeriode IDperiodeNavigation { get; set; }

    [InverseProperty("IDidpNavigation")]
    public virtual ICollection<tblKompetensiCoaching> tblKompetensiCoaching { get; set; } = new List<tblKompetensiCoaching>();

    [InverseProperty("IDidpNavigation")]
    public virtual ICollection<tblRenbang> tblRenbang { get; set; } = new List<tblRenbang>();
}