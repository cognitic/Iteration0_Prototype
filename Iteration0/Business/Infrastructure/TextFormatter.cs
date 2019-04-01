using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace Iteration0.Business.Infrastructure
{
    public class TextFormatter
    {

        static public String CapitalizeFirstLetterOn(String Source)
        {
            return Source.First().ToString().ToUpper() + Source.Substring(1).ToLower();
        }

        static public String SetCamelCaseOn(String Source)
        {
            String[] words = Regex.Split(Source, @"\s+");
            for (int i = 0; i < words.Length - 1; i += 1)
            {
                words[i] = words[i].First().ToString().ToUpper() + words[i].Substring(1).ToLower();
            }
            return String.Join("", words);
        }
    }
}