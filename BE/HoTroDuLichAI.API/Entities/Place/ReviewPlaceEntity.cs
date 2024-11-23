using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table(name: "TBL_DanhGiaDiaDiem")]
    public class ReviewPlaceEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Column("DiemDanhGia")]
        public long Rating { get; set; }
        [Column("BinhLuan")]
        public string Comment { get; set; } = string.Empty;
        private DateTimeOffset _createdDate { get; set; } = DateTimeOffset.UtcNow;
        [Column("NgayTao")]
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            set => _createdDate = value;
        }
        [Column("NguoiDungId")]
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "ReviewPlaces")]
        public virtual UserEntity User { get; set; } = null!;
        [Column("DiaDiemId")]
        public Guid PlaceId { get; set; }
        [ForeignKey(name: "PlaceId")]
        [InverseProperty(property: "ReviewPlaces")]
        public virtual PlaceEntity Place { get; set; } = null!;
    }
}