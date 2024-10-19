using System.ComponentModel.DataAnnotations.Schema;

namespace HoTroDuLichAI.API
{
    [Table(name: "AI_AITrainingData")]
    public class AITrainingDataEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string SearchData { get; set; } = string.Empty;
        public string PlaceData { get; set; } = string.Empty;
        public string RatingData { get; set; } = string.Empty;
        private DateTimeOffset _createdDate = DateTimeOffset.UtcNow;
        public DateTimeOffset CreatedDate
        {
            get => _createdDate.ToLocalTime();
            private set => _createdDate = value;
        }
        public Guid UserId { get; set; }
        [ForeignKey(name: "UserId")]
        [InverseProperty(property: "AITrainingDatas")]
        public virtual UserEntity User { get; set; } = null!;

    }
}