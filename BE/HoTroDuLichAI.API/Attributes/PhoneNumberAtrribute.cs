using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace HoTroDuLichAI.API
{
    public class PhoneNumberAttribute : ValidationAttribute
    {
        public CPINType Country { get; }

        public PhoneNumberAttribute(CPINType country)
        {
            Country = country;
            ErrorMessage = $"Số điện thoại không đúng định dạng cho quốc gia {country.ToDescription()}";
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null || string.IsNullOrEmpty(value.ToString()))
                return ValidationResult.Success;

            string phoneNumber = value.ToString() ?? string.Empty;
            bool isValid = false;

            switch (Country)
            {
                case CPINType.Afghanistan_Tazkira:
                    isValid = IsValidAfghanistanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Albania_Leternjoftimi:
                    isValid = IsValidAlbaniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Algeria_CNIBE:
                    isValid = IsValidAlgeriaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Andorra_NationalIDCard:
                    isValid = IsValidAndorraPhoneNumber(phoneNumber);
                    break;
                case CPINType.Angola_BilheteDeIdentidade:
                    isValid = IsValidAngolaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Argentina_DNI:
                    isValid = IsValidArgentinaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Armenia_NationalIDCard:
                    isValid = IsValidArmeniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Australia_NationalIDCard:
                    isValid = IsValidAustraliaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Austria_Personalausweis:
                    isValid = IsValidAustriaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Azerbaijan_ShexsiyyetVesiqesi:
                    isValid = IsValidAzerbaijanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Bahamas_CertificateOfIdentity:
                    isValid = IsValidBahamasPhoneNumber(phoneNumber);
                    break;
                case CPINType.Bahrain_NationalIDSmartcard:
                    isValid = IsValidBahrainPhoneNumber(phoneNumber);
                    break;
                case CPINType.Bangladesh_NationalIDCard:
                    isValid = IsValidBangladeshPhoneNumber(phoneNumber);
                    break;
                case CPINType.Barbados_NationalIDCard:
                    isValid = IsValidBarbadosPhoneNumber(phoneNumber);
                    break;
                case CPINType.Belarus_PasportGrazhdanina:
                    isValid = IsValidBelarusPhoneNumber(phoneNumber);
                    break;
                case CPINType.Belgium_eID:
                    isValid = IsValidBelgiumPhoneNumber(phoneNumber);
                    break;
                case CPINType.Belize_SocialSecurityCard:
                    isValid = IsValidBelizePhoneNumber(phoneNumber);
                    break;
                case CPINType.Benin_CarteDIdentite:
                    isValid = IsValidBeninPhoneNumber(phoneNumber);
                    break;
                case CPINType.Bhutan_CitizenshipCard:
                    isValid = IsValidBhutanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Bolivia_CedulaDeIdentidad:
                    isValid = IsValidBoliviaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Bosnia_LicnaKarta:
                    isValid = IsValidBosniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Botswana_Omang:
                    isValid = IsValidBotswanaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Brazil_CPF:
                    isValid = IsValidBrazilPhoneNumber(phoneNumber);
                    break;
                case CPINType.Brunei_IdentityCard:
                    isValid = IsValidBruneiPhoneNumber(phoneNumber);
                    break;
                case CPINType.Bulgaria_LichnaKarta:
                    isValid = IsValidBulgariaPhoneNumber(phoneNumber);
                    break;
                case CPINType.BurkinaFaso_CarteDIdentite:
                    isValid = IsValidBurkinaFasoPhoneNumber(phoneNumber);
                    break;
                case CPINType.Burundi_CarteDIdentite:
                    isValid = IsValidBurundiPhoneNumber(phoneNumber);
                    break;
                case CPINType.Cambodia_NationalIDCard:
                    isValid = IsValidCambodiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Cameroon_CarteNationaleDIdentite:
                    isValid = IsValidCameroonPhoneNumber(phoneNumber);
                    break;
                case CPINType.Canada_SIN:
                    isValid = IsValidCanadaPhoneNumber(phoneNumber);
                    break;
                case CPINType.CapeVerde_BilheteDeIdentidade:
                    isValid = IsValidCapeVerdePhoneNumber(phoneNumber);
                    break;
                case CPINType.CentralAfricanRepublic_CarteNationaleDIdentite:
                    isValid = IsValidCentralAfricanRepublicPhoneNumber(phoneNumber);
                    break;
                case CPINType.Chad_CarteDIdentite:
                    isValid = IsValidChadPhoneNumber(phoneNumber);
                    break;
                case CPINType.Chile_CedulaDeIdentidad:
                    isValid = IsValidChilePhoneNumber(phoneNumber);
                    break;
                case CPINType.China_Shenfenzheng:
                    isValid = IsValidChinaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Colombia_CedulaDeCiudadania:
                    isValid = IsValidColombiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Comoros_CarteNationaleDIdentite:
                    isValid = IsValidComorosPhoneNumber(phoneNumber);
                    break;
                case CPINType.Congo_CarteNationaleDIdentite:
                    isValid = IsValidCongoPhoneNumber(phoneNumber);
                    break;
                case CPINType.CostaRica_CedulaDeIdentidad:
                    isValid = IsValidCostaRicaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Croatia_OsobnaIskaznica:
                    isValid = IsValidCroatiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Cuba_CarneDeIdentidad:
                    isValid = IsValidCubaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Cyprus_DeltioTautotitas:
                    isValid = IsValidCyprusPhoneNumber(phoneNumber);
                    break;
                case CPINType.CzechRepublic_ObcanskyPrukaz:
                    isValid = IsValidCzechRepublicPhoneNumber(phoneNumber);
                    break;
                case CPINType.Denmark_CPR:
                    isValid = IsValidDenmarkPhoneNumber(phoneNumber);
                    break;
                case CPINType.Djibouti_CarteNationaleDIdentite:
                    isValid = IsValidDjiboutiPhoneNumber(phoneNumber);
                    break;
                case CPINType.Dominica_NationalIDCard:
                    isValid = IsValidDominicaPhoneNumber(phoneNumber);
                    break;
                case CPINType.DominicanRepublic_CedulaDeIdentidad:
                    isValid = IsValidDominicanRepublicPhoneNumber(phoneNumber);
                    break;
                case CPINType.Ecuador_CedulaDeIdentidad:
                    isValid = IsValidEcuadorPhoneNumber(phoneNumber);
                    break;
                case CPINType.Egypt_BataqatAlRaqmAlQawmi:
                    isValid = IsValidEgyptPhoneNumber(phoneNumber);
                    break;
                case CPINType.ElSalvador_DocumentoUnicoDeIdentidad:
                    isValid = IsValidElSalvadorPhoneNumber(phoneNumber);
                    break;
                case CPINType.EquatorialGuinea_CedulaDeIdentidad:
                    isValid = IsValidEquatorialGuineaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Eritrea_NationalIDCard:
                    isValid = IsValidEritreaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Estonia_IDKaart:
                    isValid = IsValidEstoniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Eswatini_NationalIDCard:
                    isValid = IsValidEswatiniPhoneNumber(phoneNumber);
                    break;
                case CPINType.Ethiopia_NationalIDCard:
                    isValid = IsValidEthiopiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Fiji_FNPF:
                    isValid = IsValidFijiPhoneNumber(phoneNumber);
                    break;
                case CPINType.Finland_Henkilokortti:
                    isValid = IsValidFinlandPhoneNumber(phoneNumber);
                    break;
                case CPINType.France_CNI:
                    isValid = IsValidFrancePhoneNumber(phoneNumber);
                    break;
                case CPINType.Gabon_CarteNationaleDIdentite:
                    isValid = IsValidGabonPhoneNumber(phoneNumber);
                    break;
                case CPINType.Gambia_NationalIDCard:
                    isValid = IsValidGambiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Georgia_PiradobisMotsmoba:
                    isValid = IsValidGeorgiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Germany_Personalausweis:
                    isValid = IsValidGermanyPhoneNumber(phoneNumber);
                    break;
                case CPINType.Ghana_GhanaCard:
                    isValid = IsValidGhanaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Greece_DeltioTautotitas:
                    isValid = IsValidGreecePhoneNumber(phoneNumber);
                    break;
                case CPINType.Grenada_NationalIDCard:
                    isValid = IsValidGrenadaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Guatemala_DPI:
                    isValid = IsValidGuatemalaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Guinea_CarteNationaleDIdentite:
                    isValid = IsValidGuineaPhoneNumber(phoneNumber);
                    break;
                case CPINType.GuineaBissau_BilheteDeIdentidade:
                    isValid = IsValidGuineaBissauPhoneNumber(phoneNumber);
                    break;
                case CPINType.Guyana_NationalIDCard:
                    isValid = IsValidGuyanaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Haiti_CarteDIdentite:
                    isValid = IsValidHaitiPhoneNumber(phoneNumber);
                    break;
                case CPINType.Honduras_TarjetaDeIdentidad:
                    isValid = IsValidHondurasPhoneNumber(phoneNumber);
                    break;
                case CPINType.Hungary_SzemelyiIgazolvany:
                    isValid = IsValidHungaryPhoneNumber(phoneNumber);
                    break;
                case CPINType.Iceland_Kennitala:
                    isValid = IsValidIcelandPhoneNumber(phoneNumber);
                    break;
                case CPINType.India_Aadhaar:
                    isValid = IsValidIndiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Indonesia_KTP:
                    isValid = IsValidIndonesiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Iran_KartEMelli:
                    isValid = IsValidIranPhoneNumber(phoneNumber);
                    break;
                case CPINType.Iraq_AlBataqatAlWataniyah:
                    isValid = IsValidIraqPhoneNumber(phoneNumber);
                    break;
                case CPINType.Ireland_PPSN:
                    isValid = IsValidIrelandPhoneNumber(phoneNumber);
                    break;
                case CPINType.Israel_TeudatZehut:
                    isValid = IsValidIsraelPhoneNumber(phoneNumber);
                    break;
                case CPINType.Italy_CartaDIdentita:
                    isValid = IsValidItalyPhoneNumber(phoneNumber);
                    break;
                case CPINType.IvoryCoast_CarteNationaleDIdentite:
                    isValid = IsValidIvoryCoastPhoneNumber(phoneNumber);
                    break;
                case CPINType.Jamaica_TRN:
                    isValid = IsValidJamaicaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Japan_MyNumber:
                    isValid = IsValidJapanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Jordan_AlBataqatAlShakhsiyah:
                    isValid = IsValidJordanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Kazakhstan_ZhekeKualik:
                    isValid = IsValidKazakhstanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Kenya_NationalIDCard:
                    isValid = IsValidKenyaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Kiribati_NationalIDCard:
                    isValid = IsValidKiribatiPhoneNumber(phoneNumber);
                    break;
                case CPINType.KoreaNorth_JuminDeungnokjeung:
                    isValid = IsValidKoreaNorthPhoneNumber(phoneNumber);
                    break;
                case CPINType.KoreaSouth_JuminDeungnokBeonho:
                    isValid = IsValidKoreaSouthPhoneNumber(phoneNumber);
                    break;
                case CPINType.Kuwait_AlBataqatAlMadaniyah:
                    isValid = IsValidKuwaitPhoneNumber(phoneNumber);
                    break;
                case CPINType.Kyrgyzstan_UluttukPasport:
                    isValid = IsValidKyrgyzstanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Laos_BatPachamTua:
                    isValid = IsValidLaosPhoneNumber(phoneNumber);
                    break;
                case CPINType.Latvia_PersonasAplieciba:
                    isValid = IsValidLatviaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Lebanon_BataqatAlHawiya:
                    isValid = IsValidLebanonPhoneNumber(phoneNumber);
                    break;
                case CPINType.Lesotho_NationalIDCard:
                    isValid = IsValidLesothoPhoneNumber(phoneNumber);
                    break;
                case CPINType.Liberia_NationalIDCard:
                    isValid = IsValidLiberiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Libya_AlBataqatAlShakhsiyah:
                    isValid = IsValidLibyaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Liechtenstein_Identitatskarte:
                    isValid = IsValidLiechtensteinPhoneNumber(phoneNumber);
                    break;
                case CPINType.Lithuania_AsmensTapatybesKortele:
                    isValid = IsValidLithuaniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Luxembourg_CarteDIdentite:
                    isValid = IsValidLuxembourgPhoneNumber(phoneNumber);
                    break;
                case CPINType.Madagascar_CarteNationaleDIdentite:
                    isValid = IsValidMadagascarPhoneNumber(phoneNumber);
                    break;
                case CPINType.Malawi_NationalIDCard:
                    isValid = IsValidMalawiPhoneNumber(phoneNumber);
                    break;
                case CPINType.Malaysia_MyKad:
                    isValid = IsValidMalaysiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Maldives_NationalIDCard:
                    isValid = IsValidMaldivesPhoneNumber(phoneNumber);
                    break;
                case CPINType.Mali_CarteNationaleDIdentite:
                    isValid = IsValidMaliPhoneNumber(phoneNumber);
                    break;
                case CPINType.Malta_IdentityCard:
                    isValid = IsValidMaltaPhoneNumber(phoneNumber);
                    break;
                case CPINType.MarshallIslands_NationalIDCard:
                    isValid = IsValidMarshallIslandsPhoneNumber(phoneNumber);
                    break;
                case CPINType.Mauritania_BataqatAlTaarifAlWataniyah:
                    isValid = IsValidMauritaniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Mauritius_NationalIDCard:
                    isValid = IsValidMauritiusPhoneNumber(phoneNumber);
                    break;
                case CPINType.Mexico_CURP:
                    isValid = IsValidMexicoPhoneNumber(phoneNumber);
                    break;
                case CPINType.Micronesia_NationalIDCard:
                    isValid = IsValidMicronesiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Moldova_BuletinDeIdentitate:
                    isValid = IsValidMoldovaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Monaco_CarteDIdentite:
                    isValid = IsValidMonacoPhoneNumber(phoneNumber);
                    break;
                case CPINType.Mongolia_IrgeniiUnemleh:
                    isValid = IsValidMongoliaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Montenegro_LicnaKarta:
                    isValid = IsValidMontenegroPhoneNumber(phoneNumber);
                    break;
                case CPINType.Morocco_BataqatAlTaarifAlWataniyah:
                    isValid = IsValidMoroccoPhoneNumber(phoneNumber);
                    break;
                case CPINType.Mozambique_BilheteDeIdentidade:
                    isValid = IsValidMozambiquePhoneNumber(phoneNumber);
                    break;
                case CPINType.Myanmar_NRC:
                    isValid = IsValidMyanmarPhoneNumber(phoneNumber);
                    break;
                case CPINType.Namibia_NationalIDCard:
                    isValid = IsValidNamibiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Nauru_NationalIDCard:
                    isValid = IsValidNauruPhoneNumber(phoneNumber);
                    break;
                case CPINType.Nepal_CitizenshipCertificate:
                    isValid = IsValidNepalPhoneNumber(phoneNumber);
                    break;
                case CPINType.Netherlands_Identiteitskaart:
                    isValid = IsValidNetherlandsPhoneNumber(phoneNumber);
                    break;
                case CPINType.NewZealand_NationalIDCard:
                    isValid = IsValidNewZealandPhoneNumber(phoneNumber);
                    break;
                case CPINType.Nicaragua_CedulaDeIdentidad:
                    isValid = IsValidNicaraguaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Niger_CarteNationaleDIdentite:
                    isValid = IsValidNigerPhoneNumber(phoneNumber);
                    break;
                case CPINType.Nigeria_NIN:
                    isValid = IsValidNigeriaPhoneNumber(phoneNumber);
                    break;
                case CPINType.NorthMacedonia_LicnaKarta:
                    isValid = IsValidNorthMacedoniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Norway_Fodselsnummer:
                    isValid = IsValidNorwayPhoneNumber(phoneNumber);
                    break;
                case CPINType.Oman_AlBataqatAlShakhsiyah:
                    isValid = IsValidOmanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Pakistan_CNIC:
                    isValid = IsValidPakistanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Palau_NationalIDCard:
                    isValid = IsValidPalauPhoneNumber(phoneNumber);
                    break;
                case CPINType.Panama_CedulaDeIdentidad:
                    isValid = IsValidPanamaPhoneNumber(phoneNumber);
                    break;
                case CPINType.PapuaNewGuinea_NationalIDCard:
                    isValid = IsValidPapuaNewGuineaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Paraguay_CedulaDeIdentidad:
                    isValid = IsValidParaguayPhoneNumber(phoneNumber);
                    break;
                case CPINType.Peru_DNI:
                    isValid = IsValidPeruPhoneNumber(phoneNumber);
                    break;
                case CPINType.Philippines_PhilID:
                    isValid = IsValidPhilippinesPhoneNumber(phoneNumber);
                    break;
                case CPINType.Poland_PESEL:
                    isValid = IsValidPolandPhoneNumber(phoneNumber);
                    break;
                case CPINType.Portugal_CartaoDeCidadao:
                    isValid = IsValidPortugalPhoneNumber(phoneNumber);
                    break;
                case CPINType.Qatar_AlBataqatAlShakhsiyah:
                    isValid = IsValidQatarPhoneNumber(phoneNumber);
                    break;
                case CPINType.Romania_CNP:
                    isValid = IsValidRomaniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Russia_SNILS:
                    isValid = IsValidRussiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Rwanda_NationalIDCard:
                    isValid = IsValidRwandaPhoneNumber(phoneNumber);
                    break;
                case CPINType.SaintKittsAndNevis_NationalIDCard:
                    isValid = IsValidSaintKittsAndNevisPhoneNumber(phoneNumber);
                    break;
                case CPINType.SaintLucia_NationalIDCard:
                    isValid = IsValidSaintLuciaPhoneNumber(phoneNumber);
                    break;
                case CPINType.SaintVincentAndTheGrenadines_NationalIDCard:
                    isValid = IsValidSaintVincentAndGrenadinesPhoneNumber(phoneNumber);
                    break;
                case CPINType.Samoa_NationalIDCard:
                    isValid = IsValidSamoaPhoneNumber(phoneNumber);
                    break;
                case CPINType.SanMarino_CartaDIdentita:
                    isValid = IsValidSanMarinoPhoneNumber(phoneNumber);
                    break;
                case CPINType.SaoTomeAndPrincipe_BilheteDeIdentidade:
                    isValid = IsValidSaoTomeAndPrincipePhoneNumber(phoneNumber);
                    break;
                case CPINType.SaudiArabia_BataqatAlHawiya:
                    isValid = IsValidSaudiArabiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Senegal_CarteNationaleDIdentite:
                    isValid = IsValidSenegalPhoneNumber(phoneNumber);
                    break;
                case CPINType.Serbia_LicnaKarta:
                    isValid = IsValidSerbiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Seychelles_NationalIDCard:
                    isValid = IsValidSeychellesPhoneNumber(phoneNumber);
                    break;
                case CPINType.SierraLeone_NationalIDCard:
                    isValid = IsValidSierraLeonePhoneNumber(phoneNumber);
                    break;
                case CPINType.Singapore_NRIC_FIN:
                    isValid = IsValidSingaporePhoneNumber(phoneNumber);
                    break;
                case CPINType.Slovakia_ObcianskyPreukaz:
                    isValid = IsValidSlovakiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Slovenia_OsebnaIzkaznica:
                    isValid = IsValidSloveniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.SolomonIslands_NationalIDCard:
                    isValid = IsValidSolomonIslandsPhoneNumber(phoneNumber);
                    break;
                case CPINType.Somalia_NationalIDCard:
                    isValid = IsValidSomaliaPhoneNumber(phoneNumber);
                    break;
                case CPINType.SouthAfrica_IDNumber:
                    isValid = IsValidSouthAfricaPhoneNumber(phoneNumber);
                    break;
                case CPINType.SouthSudan_NationalIDCard:
                    isValid = IsValidSouthSudanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Spain_DNI:
                    isValid = IsValidSpainPhoneNumber(phoneNumber);
                    break;
                case CPINType.SriLanka_NIC:
                    isValid = IsValidSriLankaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Sudan_AlBataqatAlShakhsiyah:
                    isValid = IsValidSudanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Suriname_NationalIDCard:
                    isValid = IsValidSurinamePhoneNumber(phoneNumber);
                    break;
                case CPINType.Sweden_Personnummer:
                    isValid = IsValidSwedenPhoneNumber(phoneNumber);
                    break;
                case CPINType.Switzerland_AHVNummer:
                    isValid = IsValidSwitzerlandPhoneNumber(phoneNumber);
                    break;
                case CPINType.Syria_AlBataqatAlShakhsiyah:
                    isValid = IsValidSyriaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Taiwan_Shenfenzheng:
                    isValid = IsValidTaiwanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Tajikistan_Shakhsyati:
                    isValid = IsValidTajikistanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Tanzania_NationalIDCard:
                    isValid = IsValidTanzaniaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Thailand_BatPrajamTuaPrachaachon:
                    isValid = IsValidThailandPhoneNumber(phoneNumber);
                    break;
                case CPINType.TimorLeste_BilheteDeIdentidade:
                    isValid = IsValidTimorLestePhoneNumber(phoneNumber);
                    break;
                case CPINType.Togo_CarteNationaleDIdentite:
                    isValid = IsValidTogoPhoneNumber(phoneNumber);
                    break;
                case CPINType.Tonga_NationalIDCard:
                    isValid = IsValidTongaPhoneNumber(phoneNumber);
                    break;
                case CPINType.TrinidadAndTobago_NationalIDCard:
                    isValid = IsValidTrinidadAndTobagoPhoneNumber(phoneNumber);
                    break;
                case CPINType.Tunisia_BataqatAlTaarifAlWataniyah:
                    isValid = IsValidTunisiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Turkey_TCKimlikNo:
                    isValid = IsValidTurkeyPhoneNumber(phoneNumber);
                    break;
                case CPINType.Turkmenistan_Pasport:
                    isValid = IsValidTurkmenistanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Tuvalu_NationalIDCard:
                    isValid = IsValidTuvaluPhoneNumber(phoneNumber);
                    break;
                case CPINType.Uganda_NationalIDCard:
                    isValid = IsValidUgandaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Ukraine_IdentifikatsiynyyNomer:
                    isValid = IsValidUkrainePhoneNumber(phoneNumber);
                    break;
                case CPINType.UnitedArabEmirates_EmiratesID:
                    isValid = IsValidUnitedArabEmiratesPhoneNumber(phoneNumber);
                    break;
                case CPINType.UnitedKingdom_NIN:
                    isValid = IsValidUnitedKingdomPhoneNumber(phoneNumber);
                    break;
                case CPINType.UnitedStates_SSN:
                    isValid = IsValidUnitedStatesPhoneNumber(phoneNumber);
                    break;
                case CPINType.Uruguay_CedulaDeIdentidad:
                    isValid = IsValidUruguayPhoneNumber(phoneNumber);
                    break;
                case CPINType.Uzbekistan_Pasport:
                    isValid = IsValidUzbekistanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Vanuatu_NationalIDCard:
                    isValid = IsValidVanuatuPhoneNumber(phoneNumber);
                    break;
                case CPINType.VaticanCity_CartaDIdentita:
                    isValid = IsValidVaticanPhoneNumber(phoneNumber);
                    break;
                case CPINType.Venezuela_CedulaDeIdentidad:
                    isValid = IsValidVenezuelaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Vietnam_CCCD:
                    isValid = IsValidVietnamPhoneNumber(phoneNumber);
                    break;
                case CPINType.Yemen_AlBataqatAlShakhsiyah:
                    isValid = IsValidYemenPhoneNumber(phoneNumber);
                    break;
                case CPINType.Zambia_NationalRegistrationCard:
                    isValid = IsValidZambiaPhoneNumber(phoneNumber);
                    break;
                case CPINType.Zimbabwe_NationalIDCard:
                    isValid = IsValidZimbabwePhoneNumber(phoneNumber);
                    break;
                default:
                    isValid = false;
                    break;
            }

            return isValid ? ValidationResult.Success : new ValidationResult(ErrorMessage);
        }

        // Example phone number validation for each country
        private bool IsValidAfghanistanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(0\d{2}-\d{3}-\d{4})$|^(7\d{2}-\d{3}-\d{4})$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidAlbaniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(0\d{2}-\d{3}-\d{3})$|^(67\d-\d{3}-\d{3})$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidAlgeriaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+213|0)(5\d{8})$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidAndorraPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+376|8)\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidAngolaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+244|9)\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidArgentinaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(011-\d{4}-\d{4})$|^(9-\d{3}-\d{7})$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidArmeniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+374|0)(\d{8})$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidAustraliaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+61|0)4\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidAustriaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+43|0)\d{1,4}-\d{1,4}-\d{1,4}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidAzerbaijanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+994|0)(50|51|55|70|77|99)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBahamasPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1|1)(242)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBahrainPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+973|0)(3|6)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBangladeshPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+880|0)1[3-9]\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBarbadosPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1|1)(246)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBelarusPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+375|8)\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBelgiumPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+32|0)4[0-9]{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBelizePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+501|0)6\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBeninPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+229|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBhutanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+975|0)\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBoliviaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+591|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBosniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+387|0)6\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBotswanaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+267|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBrazilPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+55|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBruneiPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+673|0)[2-8]\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBulgariaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+359|0)8[89]\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBurkinaFasoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+226|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidBurundiPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+257|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCambodiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+855|0)1[2-9]\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCameroonPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+237|0)6\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCanadaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1|1)\d{3}-\d{3}-\d{4}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCapeVerdePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+238|0)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCentralAfricanRepublicPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+236|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidChadPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+235|0)6\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidChilePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+56|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidChinaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+86|0)1[3-9]\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidColombiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+57|0)3\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidComorosPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+269|0)3\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCongoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+242|0)8\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCostaRicaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+506|0)\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCroatiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+385|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCubaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+53|5)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCyprusPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+357|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidCzechRepublicPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+420|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidDemocraticRepublicOfTheCongoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+243|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidDenmarkPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+45|0)2[0-9]{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidDjiboutiPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+253|0)3\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidDominicaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1|1)(767)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidDominicanRepublicPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1|1)(809|829|849)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidEcuadorPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+593|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidEgyptPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+20|0)1[0-9]\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidElSalvadorPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+503|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidEquatorialGuineaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+240|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidEritreaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+291|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidEstoniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+372|0)5\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidEswatiniPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+268|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidEthiopiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+251|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidFijiPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+679|0)\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidFinlandPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+358|0)4[0-9]{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidFrancePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+33|0)[1-9]\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGabonPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+241|0)6\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGambiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+220|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGeorgiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+995|0)5\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGermanyPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+49|0)[1-9]\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGhanaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+233|0)2\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGreecePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+30|0)69\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGrenadaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1|1)(473)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGuatemalaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+502|0)5\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGuineaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+224|0)6\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGuineaBissauPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+245|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidGuyanaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+592|0)6\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidHaitiPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+509|0)3\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidHondurasPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+504|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidHungaryPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+36|0)20\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidIcelandPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+354|0)8\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidIndiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+91|0)9\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidIndonesiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+62|0)8\d{9,10}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidIranPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+98|0)9\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidIraqPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+964|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidIrelandPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+353|0)8[1-9]\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidIsraelPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+972|0)5\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidItalyPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+39|0)3\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidIvoryCoastPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+225|0)0[1-9]\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidJamaicaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1|1)(876)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidJapanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+81|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidJordanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+962|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidKazakhstanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+7|8)7\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidKenyaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+254|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidKiribatiPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+686|0)\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidKoreaNorthPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+850|0)1\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidKoreaSouthPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+82|0)1[0-9]\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidKuwaitPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+965|0)6\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidKyrgyzstanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+996|0)7\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidLaosPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+856|0)2[0-9]\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidLatviaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+371|0)2\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidLebanonPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+961|0)3\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidLesothoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+266|0)5\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidLiberiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+231|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidLibyaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+218|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidLiechtensteinPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+423|0)6\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidLithuaniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+370|0)6\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidLuxembourgPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+352|0)6\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMadagascarPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+261|0)3\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMalawiPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+265|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMalaysiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+60|0)1[0-9]\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMaldivesPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+960|0)7\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMaliPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+223|0)6\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMaltaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+356|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMarshallIslandsPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+692|0)2\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMauritaniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+222|0)3\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMauritiusPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+230|0)5\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMexicoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+52|0)1[0-9]\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMicronesiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+691|0)2\d{5}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMoldovaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+373|0)6\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMonacoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+377|0)6\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMongoliaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+976|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMontenegroPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+382|0)6\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMoroccoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+212|0)6\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMozambiquePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+258|0)8\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidMyanmarPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+95|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNamibiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+264|0)8\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNauruPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+674|0)2\d{5}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNepalPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+977|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNetherlandsPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+31|0)6\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNewZealandPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+64|0)2\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNicaraguaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+505|0)8\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNigerPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+227|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNigeriaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+234|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNorthMacedoniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+389|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidNorwayPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+47|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidOmanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+968|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidPakistanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+92|0)3\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidPalauPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+680|0)7\d{4}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidPanamaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+507|0)6\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidPapuaNewGuineaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+675|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidParaguayPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+595|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidPeruPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+51|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidPhilippinesPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+63|0)9\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidPolandPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+48|0)5\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidPortugalPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+351|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidQatarPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+974|0)3\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidRomaniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+40|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidRussiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+7|8)9\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidRwandaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+250|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSaintKittsAndNevisPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1869|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSaintLuciaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1758|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSaintVincentAndGrenadinesPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1784|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSamoaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+685|0)7\d{5}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSanMarinoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+378|0)6\d{5}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSaoTomeAndPrincipePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+239|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSaudiArabiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+966|0)5\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSenegalPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+221|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSerbiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+381|0)6\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSeychellesPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+248|0)2\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSierraLeonePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+232|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSingaporePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+65|0)8\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSlovakiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+421|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSloveniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+386|0)4\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSolomonIslandsPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+677|0)7\d{5}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSomaliaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+252|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSouthAfricaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+27|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSouthSudanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+211|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSpainPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+34|0)6\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSriLankaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+94|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSudanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+249|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSurinamePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+597|0)7\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSwedenPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+46|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSwitzerlandPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+41|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidSyriaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+963|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTaiwanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+886|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTajikistanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+992|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTanzaniaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+255|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidThailandPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+66|0)8\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTimorLestePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+670|0)\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTogoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+228|0)9\d{7}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTokelauPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+690|0)2\d{4}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTongaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+676|0)2\d{4}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTrinidadAndTobagoPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1|0)(868)7\d{6}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTunisiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+216|0)2\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTurkeyPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+90|0)5\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTurkmenistanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+993|0)6\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidTuvaluPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+688|0)7\d{4}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidUgandaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+256|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidUkrainePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+380|0)9\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidUnitedArabEmiratesPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+971|0)5\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidUnitedKingdomPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+44|0)7\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidUnitedStatesPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+1|0)\d{10}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidUruguayPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+598|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidUzbekistanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+998|0)9\d{9}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidVanuatuPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+678|0)5\d{4}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidVaticanPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+379|0)6\d{4}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidVenezuelaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+58|0)4\d{10}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidVietnamPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(?:\+84|0)(3|5|7|8|9|1[2|6|8|9])\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidYemenPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+967|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidZambiaPhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+260|0)9\d{8}$");
            return regex.IsMatch(phoneNumber);
        }

        private bool IsValidZimbabwePhoneNumber(string phoneNumber)
        {
            Regex regex = new Regex(@"^(\+263|0)7\d{8}$");
            return regex.IsMatch(phoneNumber);
        }
    }
}
