
using System.Text.Json.Serialization;

namespace HoTroDuLichAI.API
{
    public class BusinessDetailResponseDto
    {
        public Guid Id { get; set; }
        public string BusinessName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
        public CBusinessServiceType BusinessServiceType { get; set; }
        public CApprovalType Appoved { get; set; }
        public bool IsNew { get; set; }
        public string BusinessContactPerson { get; set; } = string.Empty;
        public BusinessContactPropertyDto BusinessContactProperty { get; set; } = null!;
        public OwnerProperty OwnerProperty { get; set; } = null!;
    }

    public class BusinessMoreInfoResponseDto : BusinessDetailResponseDto
    {
        public int TotalView { get; set; } = 0;
        public int TotalContact { get; set; } = 0;
        public DateTimeOffset? LastViewedDate { get; set; }


    }

    public class BusinessContactPropertyDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public ImagePropertyDto ImageProperty { get; set; } = null!;
        
    }

    public class ImagePropertyDto 
    {
        public bool IsDefault { get; set; } = false;
        public string FileId { get; set; } = string.Empty;
    }
}