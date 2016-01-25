/*------------------------------------------------------------
 * Name: TripPin OData Reference Service
 * Version: 1.0.0
 * Description: TripPin is a fictional reference service demonstrating the capabilities of OData v4.
 * Conformance-Level: minimal
 * Support-Filter-Functions: contains, endswith, startswith, length, indexof, substring, tolower, toupper, trim, concat, year, month, day, hour, minute, second, round, floor, ceiling, cast, isof
------------------------------------------------------------*/
namespace OData.Service.V4.Client
{
[global::Microsoft.OData.Client.OriginalNameAttribute("PersonGender")]
public enum PersonGender: global::System.Int32
{
[global::Microsoft.OData.Client.OriginalNameAttribute("Unknown")]
Unknown = 0,
[global::Microsoft.OData.Client.OriginalNameAttribute("Female")]
Female = 1,
[global::Microsoft.OData.Client.OriginalNameAttribute("Male")]
Male = 2
}

}
