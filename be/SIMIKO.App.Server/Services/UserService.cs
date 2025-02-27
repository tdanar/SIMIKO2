using SIMIKO.App.Server.Data;
using SIMIKO.App.Server.Models;
using System;
using System.Linq;
public class UserService
{
    private readonly CaringDBContext _context;

    public UserService(CaringDBContext context)
    {
        _context = context;
    }

    public User? GetUserByUsername(string username)
    {
        var pegawai = _context.v_PegawaiAll.FirstOrDefault(u => u.email == username);
        if (pegawai == null)
        {
            return null;
        }

        var listrole = _context.tblUser.Where(x => x.NIPnew == pegawai.nip).Select(x => x.Role.Nama_role).ToList();

        return new User
        {
            Id = pegawai.id ?? 0,
            Username = pegawai.email,
            FullName = pegawai.nama,
            NIP = pegawai.nip,
            Role = listrole.Count() > 0 ? listrole.ToArray() : new string[] { "No Role" }
            // Map other properties as needed
        };
    }
}
