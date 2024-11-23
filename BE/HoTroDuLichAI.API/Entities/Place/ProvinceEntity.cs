using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table("TBL_Tinh")]
    public class ProvinceEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [StringLength(maximumLength: 150)]
        [Column("TenTinh")]
        public string Name { get; set; } = string.Empty;
        [Column("MaTinh")]
        public int Code { get; set; }
        [StringLength(maximumLength: 150)]
        [Column("TenMaTinh")]
        public string CodeName { get; set; } = string.Empty;
        [StringLength(maximumLength: 150)]
        [Column("LoaiBoPhan")]
        public string DivisionType { get; set; } = string.Empty;
        [StringLength(maximumLength: 150)]
        [Column("MaDienThoai")]
        public string PhoneCode { get; set; } = string.Empty;
        [InverseProperty("Province")]
        public ICollection<ItineraryEntity> Itineraries { get; set; } = new List<ItineraryEntity>();
    }
}