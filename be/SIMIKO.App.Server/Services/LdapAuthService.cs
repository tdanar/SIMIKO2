using System;
using System.DirectoryServices.Protocols;
using System.Net;
using Microsoft.Extensions.Configuration;

public class LdapAuthService
{
    private readonly IConfiguration _config;

    public LdapAuthService(IConfiguration config)
    {
        _config = config ?? throw new ArgumentNullException(nameof(config));
    }

    public bool Authenticate(string username, string password)
    {
        string? ldapServer = _config["LDAP:Server"];
        string? ldapPortString = _config["LDAP:Port"];

        if (string.IsNullOrEmpty(ldapServer) || string.IsNullOrEmpty(ldapPortString) || !int.TryParse(ldapPortString, out int ldapPort))
        {
            return false;
        }

        try
        {
            using (var connection = new LdapConnection(new LdapDirectoryIdentifier(ldapServer, ldapPort)))
            {
                connection.AuthType = AuthType.Basic;
                var credential = new NetworkCredential(username, password);
                connection.Bind(credential);
                return true;
            }
        }
        catch
        {
            return false;
        }
    }
}
