using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace HoTroDuLichAI.API
{
    public class UserEntity : IdentityUser<Guid>
    {
        public string FullName { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public string PIN { get; set; } = string.Empty;
        // public CPINType PINType { get; set; }

        #region Json property
        public string ImageProperty { get; set; } = string.Empty;
        [NotMapped]
        public List<ImageProperty> ImageProperties
        {
            get => ImageProperty.FromJson<List<ImageProperty>>() ?? new();
            set => ImageProperty = value.ToJson();
        }

        [Column(name: "Address")]
        public string Address { get; set; } = string.Empty;
        #endregion Json property
        public string ModifiedBy { get; set; } = string.Empty;
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }

        private DateTimeOffset? _modifiedDate;
        public DateTimeOffset? ModifiedDate
        {
            get => _modifiedDate?.ToLocalTime();
            set => _modifiedDate = value;
        }

        #region Inverse property
        [InverseProperty(property: "User")]
        public virtual ICollection<UserTokenEntity> UserTokens { get; set; } = new List<UserTokenEntity>();
        [InverseProperty(property: "User")]
        public virtual ICollection<UserRefreshTokenEntity> UserRefreshTokens { get; set; } = new List<UserRefreshTokenEntity>();

        [InverseProperty(property: "User")]
        public virtual ICollection<PlaceEntity> Places { get; set; } = new List<PlaceEntity>();
        [InverseProperty(property: "User")]
        public virtual ICollection<ReviewPlaceEntity> ReviewPlaces { get; set; } = new List<ReviewPlaceEntity>();
        [InverseProperty(property: "User")]
        public virtual ICollection<ItineraryEntity> Itineraries { get; set; } = new List<ItineraryEntity>();
        [InverseProperty(property: "User")]
        public virtual ICollection<BusinessEntity> Businesses { get; set; } = new List<BusinessEntity>();


        [InverseProperty(property: "Sender")]
        public virtual ICollection<MessageEntity> SentMessages { get; set; } = new List<MessageEntity>();
        [InverseProperty(property: "Receiver")]
        public virtual ICollection<MessageEntity> ReceivedMessages { get; set; } = new List<MessageEntity>();
        [InverseProperty(property: "User")]
        public virtual ICollection<ArticleEntity> Articles { get; set; } = new List<ArticleEntity>();
        [InverseProperty(property: "User")]
        public virtual ICollection<AITrainingDataEntity> AITrainingDatas { get; set; } = new List<AITrainingDataEntity>();
        #endregion Inverse property
    }
}