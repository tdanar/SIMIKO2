﻿namespace SIMIKO.App.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string FullName { get; set; }
        public string NIP { get; set; }
        public string[] Role { get; set; }
    }
}
