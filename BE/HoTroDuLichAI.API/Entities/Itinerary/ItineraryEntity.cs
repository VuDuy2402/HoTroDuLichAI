using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table(name: "TBL_HanhTrinh")]
    public class ItineraryEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Column("TenHanhTrinh")]
        public string Name { get; set; } = string.Empty;
        [Column("TongSoLuotDung")]
        public int TotalUse { get; set; }
        [Column("TongTien", TypeName = "decimal(19,2)")]
        public decimal TotalAmount { get; set; }
        [Column("TongSoNgay")]
        public int TotalDay { get; set; }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        [Column("NgayTao")]
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        [Column("NgayCapNhat")]
        public DateTimeOffset? UpdatedDate { get; set; }
        [Column("NguoiDungId")]
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "Itineraries")]
        public virtual UserEntity User { get; set; } = null!;

        public Guid? ProvinceId { get; set; }
        [ForeignKey(name: "ProvinceId")]
        [InverseProperty(property: "Itineraries")]
        public virtual ProvinceEntity? Province { get; set; }

        [InverseProperty("Itinerary")]
        public virtual ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; } = new List<ItineraryDetailEntity>();

    }
}