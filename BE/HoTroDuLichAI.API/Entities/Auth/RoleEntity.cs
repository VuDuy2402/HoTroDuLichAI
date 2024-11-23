using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace HoTroDuLichAI.API
{
    public class RoleEntity : IdentityRole<Guid>
    {
        [Column("TenVaiTro")]
        public override string? Name { get; set; }

        [Column("TenVaiTroChuanHoa")]
        public override string? NormalizedName { get; set; }

        [Column("DauXacThucDongBo")]
        public override string? ConcurrencyStamp { get; set; }
    }
}