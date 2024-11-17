using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table("Admin_Province")]
    public class ProvinceEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [StringLength(maximumLength: 150)]
        public string Name { get; set; } = string.Empty;
        public int Code { get; set; }
        [StringLength(maximumLength: 150)]
        public string CodeName { get; set; } = string.Empty;
        [StringLength(maximumLength: 150)]
        public string DivisionType { get; set; } = string.Empty;
        [StringLength(maximumLength: 150)]
        public string PhoneCode { get; set; } = string.Empty;
        [InverseProperty("Province")]
        public ICollection<ItineraryEntity> Itineraries { get; set; } = new List<ItineraryEntity>();
    }
}