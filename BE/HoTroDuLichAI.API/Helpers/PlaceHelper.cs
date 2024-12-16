using Newtonsoft.Json.Linq;

namespace HoTroDuLichAI.API
{
    public class PlaceHelper
    {
        public static async Task<bool> IsPlaceOfVietNam(float longitude, float latitude)
        {
            using var httpClient = new HttpClient();
            {
                string url = $"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}&zoom=10&addressdetails=1";
                httpClient.DefaultRequestHeaders.Add("User-Agent", "MyGeocodingApp/1.0 (contact@example.com)");
                var response = await httpClient.GetStringAsync(url);
                var json = JObject.Parse(response);

                var country = json["address"]?["country"]?.ToString();
                var result = country?.Equals("Việt Nam", StringComparison.OrdinalIgnoreCase) ?? false;
                return result;
            }
        }
    }
}