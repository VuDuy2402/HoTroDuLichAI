using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table(name: "TBL_ChiTietHanhTrinh")]
    public class ItineraryDetailEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Column("SoThuTu")]
        public int Index { get; set; }
        [Column("ThoiGian")]
        public TimeOnly Time { get; set; }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        [Column("NgayTao")]
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        [Column("DanhSachDichVuDoanhNghiepIdJson")]
        public string BusinessServiceIds { get; set; } = string.Empty;
        [NotMapped]
        public List<Guid> BusinessServiceListIds { get; set; } = new();
        [Column("DoanhNghiepId")]
        public Guid BusinessId { get; set; }
        [ForeignKey("BusinessId")]
        [InverseProperty("ItineraryDetails")]
        public virtual BusinessEntity Business { get; set; } = null!;

        [Column("HanhTrinhId")]
        public Guid ItineraryId { get; set; }
        [ForeignKey(name: "ItineraryId")]
        [InverseProperty(property: "ItineraryDetails")]
        public virtual ItineraryEntity Itinerary { get; set; } = null!;

        [Column("DiaChiId")]
        public Guid PlaceId { get; set; }
        [ForeignKey(name: "PlaceId")]
        [InverseProperty(property: "ItineraryDetails")]
        public virtual PlaceEntity Place { get; set; } = null!;
    }
}