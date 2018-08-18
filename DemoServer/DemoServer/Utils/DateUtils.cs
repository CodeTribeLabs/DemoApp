using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DemoServer.Utils
{
    public class DateUtils
    {
        /// <summary>
        /// Convert a date time object to Unix time representation.
        /// </summary>
        /// <param name="datetime">The datetime object to convert to Unix time stamp.</param>
        /// <returns>Returns a numerical representation (Unix time) of the DateTime object.</returns>
        public static long ConvertToUnixTime(DateTime dateTime)
        {
            DateTime baseTime = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            return (long)(dateTime - baseTime).TotalSeconds;
        }
    }
}
