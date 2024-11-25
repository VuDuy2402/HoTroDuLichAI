using System.ComponentModel;

namespace HoTroDuLichAI.API
{
    public enum CRoleType
    {
        [Description(description: "No specific role assigned.")]
        None = 0,

        [Description(description: "Has full access to all system features and settings.")]
        Admin = 1,

        [Description(description: "Standard user with access to basic features.")]
        NormalUser = 2,

        [Description(description: "Represents a company with access to business-specific features.")]
        Business = 3,

        // [Description(description: "Represents a company with access to business-specific features.")]
        // Company = 4
    }

}