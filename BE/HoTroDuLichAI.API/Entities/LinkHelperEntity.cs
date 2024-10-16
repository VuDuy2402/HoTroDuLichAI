using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "CET_LinkHelper")]
    public class LinkHelperEntity
    {
        [Key]
        public Guid Id { get; private set; } = Guid.NewGuid();
        public string AppEndpoint { get; set; } = string.Empty;
        public string ConfirmResetPasswordRoute { get; set; } = string.Empty;

    }
}