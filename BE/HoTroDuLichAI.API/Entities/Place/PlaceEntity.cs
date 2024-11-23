using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.ML.Data;

namespace HoTroDuLichAI.API
{
    [Table(name: "TBL_DiaDiem")]
    public class PlaceEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [Column("TenDiaDiem")]
        public string Name { get; set; } = string.Empty;
        [Column("DiemDanhGia")]
        public int Rating { get; set; }
        [Column("TongSoLuotXem")]
        public int TotalView { get; set; }
        [Column("MoTaDiaDiem")]
        public string Description { get; set; } = string.Empty;
        [Column("DiaChiDiaDiem")]
        public string Address { get; set; } = string.Empty;
        [Column("ViDo")]
        public float Latitude { get; set; }
        [Column("KinhDo")]
        public float Longitude { get; set; }
        [Column("AnhBia")]
        public string Thumbnail { get; set; } = string.Empty;
        [Column("LoaiDiaDiem")]
        public CPlaceType PlaceType { get; set; }
        [Column("LaDiaDiemMoi")]
        public bool IsNew { get; set; }
        [Column("LoaiPheDuyet")]
        public CApprovalType Appoved { get; set; }
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        [Column("NgayTao")]
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }

        [Column("TatCaHinhAnhJson")]
        public string ImageGallery { get; set; } = string.Empty;
        [NotMapped]
        public List<ImageProperty> ImageProperties
        {
            get => ImageGallery.FromJson<List<ImageProperty>>();
            set => ImageGallery = value.ToJson(); 
        }


        #region inverse property
        [Column("NguoiDungId")]
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty("Places")]
        public virtual UserEntity User { get; set; } = null!;

        [InverseProperty(property: "Place")]
        public virtual ICollection<ItineraryDetailEntity> ItineraryDetails { get; set; } = new List<ItineraryDetailEntity>();

        [InverseProperty(property: "Place")]
        public virtual ICollection<ReviewPlaceEntity> ReviewPlaces { get; set; } = new List<ReviewPlaceEntity>();
        #endregion
    }
}