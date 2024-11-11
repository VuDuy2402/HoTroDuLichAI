using System.ComponentModel;

namespace HoTroDuLichAI.API
{
    public enum CPlaceType
    {
        [Description(description: "Không xác định")]
        None = 0,
        [Description(description: "Cắm trại")]
        Camping = 1,
        [Description(description: "Tự nhiên")]
        Nature = 2,
        [Description(description: "Biển")]
        Beach = 3,
    }
}