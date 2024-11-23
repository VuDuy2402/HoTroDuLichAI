using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table(name: "TBL_PhanTichDoanhNghiep")]
    public class BusinessAnalyticEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Column("TongSoLuotXem")]
        public int TotalView { get; set; } = 0;
        [Column("TongSoLuotLienHe")]
        public int TotalContact { get; set; } = 0;
        [Column("NgayXemCuoi")]
        public DateTimeOffset? LastViewedDate { get; set; }
        [Column("DoanhNghiepId")]
        public Guid BusinessId { get; set; }
        [ForeignKey(name: "BusinessId")]
        [InverseProperty(property: "BusinessAnalytics")]
        public virtual BusinessEntity Business { get; set; } = null!;
    }
}