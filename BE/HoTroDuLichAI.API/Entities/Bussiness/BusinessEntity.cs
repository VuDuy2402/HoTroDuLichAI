using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table(name: "TBL_DoanhNghiep")]
    public class BusinessEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Column("TenDoanhNghiep")]
        public string BusinessName { get; set; } = string.Empty;
        [Column("DiaChiDoanhNghiep")]
        public string Address { get; set; } = string.Empty;
        [Column("TongHopDichVuDoanhNghiep")]
        public string Service { get; set; } = string.Empty;
        [NotMapped]
        public List<BusinessServiceProperty> ServiceProperties
        {
            get => Service.FromJson<List<BusinessServiceProperty>>();
            set => Service = ServiceProperties.ToJson();
        }
        [Column("LoaiDichVuDoanhNghiep")]
        public CBusinessServiceType BusinessServiceType { get; set; }
        [Column("LoaiPheDuyet")]
        public CApprovalType Appoved { get; set; }
        // [Column("CoPhaiDiaDiemMoi")]
        // public bool IsNew { get; set; }
        [Column("KinhDo")]
        public float Longitude { get; set; }
        [Column("ViDo")]
        public float Latitude { get; set; }
        [Column("TinhId")]
        public Guid ProvinceId { get; set; }
        [Column("ThongTinNguoiLienHeDoanhNghiep")]
        public string BusinessContactPerson { get; set; } = string.Empty;
        [NotMapped]
        public BusinessContactProperty BusinessContactProperty
        {
            get => BusinessContactPerson.FromJson<BusinessContactProperty>();
            set => BusinessContactPerson = BusinessContactProperty.ToJson();
        }
        [Column("NgayTao")]
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }

        #region inverse property
        [Column("NguoiDungId")]
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "Businesses")]
        public virtual UserEntity User { get; set; } = null!;

        [InverseProperty(property: "Business")]
        public virtual ICollection<BusinessAnalyticEntity> BusinessAnalytics { get; set; } = new List<BusinessAnalyticEntity>();
        [InverseProperty(property: "Business")]
        public virtual ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; } = new List<ItineraryDetailEntity>();
        #endregion inverse property
    }
}