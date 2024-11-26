namespace HoTroDuLichAI.API
{
    public class BusinessDetailResponseDto
    {
        public Guid Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public float Longitude { get; set; }
        public float Latitude { get; set; }
        public Guid ProvinceId { get; set; }
        public CApprovalType Appoved { get; set; }
        // public bool IsNew { get; set; }
        public BusinessServiceProperty BusinessServiceProperty { get; set; } = new BusinessServiceProperty();
        public BusinessContactProperty BusinessContactProperty { get; set; } = null!;
        public OwnerProperty OwnerProperty { get; set; } = null!;
    }

    public class BusinessMoreInfoResponseDto : BusinessDetailResponseDto
    {
        public int TotalView { get; set; } = 0;
        public int TotalContact { get; set; } = 0;
        public DateTimeOffset? LastViewedDate { get; set; }


    }
}